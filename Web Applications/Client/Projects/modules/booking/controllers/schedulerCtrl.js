var app = angular.module('app.authentication.booking.scheduler.controller', [
    'app.authentication.booking.scheduler.create.controller',
    'app.authentication.booking.scheduler.edit.controller',
    'app.authentication.booking.scheduler.delete.controller',
]);
app.controller('schedulerCtrl', function($scope, $timeout, $uibModal, $cookies, RosterService, BookingService, toastr) {

    $('#datepicker-inline').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });
    $('#datepicker-inline').datepicker().on('changeDate', function(ev) {
        var date = ev.target.value;
        if (date) {
            var dateMoment = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
            $('#calendar').fullCalendar('gotoDate', dateMoment);
        }
    });


    function getListSite() {
        RosterService.GetListSite()
            .then(function(response) {
                $scope.listSites = response.data;
            }, function(error) {

            })
    }

    $scope.eventResize = function(event, delta, revertFunc, jsEvent, ui, view) {
        var zone = moment().format('Z');
        var data = {
            UID: event.id,
            fromTime: moment(event.start).format('YYYY-MM-DD HH:mm:ss') + ' ' + zone,
            toTime: moment(event.end).format('YYYY-MM-DD HH:mm:ss') + ' ' + zone,
            serviceUID: event.Service.UID,
            siteUID: event.SiteID,
            doctorUID: event.resourceId,
            patientUID: event.Patient.UID
        }
        ServerUpdateBooking(data, revertFunc);
    }

    function ServerUpdateBooking(data, revertFunc) {
        var postData = {
            Appointment: {
                UID: data.UID,
                FromTime: data.fromTime,
                ToTime: data.toTime
            },
            Service: {
                UID: data.serviceUID
            },
            Site: {
                UID: data.siteUID
            },
            Doctor: {
                UID: data.doctorUID
            },
            Patient: {
                UID: data.patientUID
            }
        }
        swal({
            title: 'Are you sure?',
            text: 'It will change your appointment!!!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            allowOutsideClick: false,
            closeOnConfirm: false,
            closeOnCancel: true
        }, function(isConfirm) {
            if (isConfirm) {
                BookingService.UpdateBooking(postData)
                    .then(function(response) {
                        var today = getDateCalendar();
                        ServerListBooking(today);
                        swal.close();
                        toastr.success('Update Booking Successfully');
                    }, function(error) {
                        if (typeof error.data !== 'undefined') {
                            var type = error.data.status;
                            switch (type) {
                                case 'withoutRoster':
                                    toastr.error('Booking Appointment Time Wrong !!!');
                                    revertFunc();
                                    swal.close();
                                    break;
                            }
                        }
                    })
            } else {
                revertFunc();
            }
        })
    }

    $scope.search = {
        site: ''
    }

    $scope.searchSite = function(site) {
        var today = getDateCalendar();
        ServerListBooking(today);
    }

    var statuses = {
        Received: '#4AC3DA',
        Pending: '#2D67B2',
        Approved: '#5457A6',
        Attended: '#BB69AA',
        Waitlist: '#E14845',
        Finished: '#D48147',
        Cancelled: 'black'
    };

    var userRole = 0;
    var isAdmin = false;
    var isDoctor = false;

    if (typeof $cookies.getObject('userInfo')) {
        userRole = $cookies.getObject('userInfo').roles;
        _.forEach(userRole, function(role_v, role_i){
            if(role_v.RoleCode =='ADMIN' || 
                role_v.RoleCode == 'ASSISTANT')
                 {
                    isAdmin = true;
                 } 
                else if(role_v.RoleCode=='INTERNAL_PRACTITIONER') {
                    isDoctor = true;
            }
        });
    }

    var currentEvent = {
        id: ''
    };
    var oldEvent = {
        id: ''
    };

    
    function ServerListBooking(startDate) {
        function getDateCalendar() {
            var date = $('#calendar').fullCalendar('getDate');
            var today = moment(date).format('YYYY-MM-DD');
            return today;            
        }
        var DateToday = getDateCalendar();
        $('#calendar').fullCalendar( 'removeEvents', function(event) {
            if(moment(event._start._i).format('YYYY-MM-DD') === DateToday)
                return true;
        });
        var events = [];
        var postData = {
            Filter: [{
                Roster: {
                    Enable: 'Y',
                    FromTime: startDate
                }
            }, {
                Site: {
                    UID: $scope.search.site
                }
            }],
            Order: [{
                UserAccount: {
                    Username: 'ASC'
                }
            }]
        }
        if (isDoctor) {
            postData.Filter.push({
                Doctor:{
                    UserAccountID:$cookies.getObject("userInfo").ID
                }
            })
        }
            
        RosterService.PostListRoster(postData)
            .then(function(responseRoster) {                            
                var doctorApptBooking = {
                    Filter: [{
                        Appointment: {
                            FromTime: startDate,
                            Enable: 'Y'
                        }
                    }]
                }
                if (isDoctor) {
                    doctorApptBooking.Filter.push({
                        Doctor:{
                            UserAccountID:$cookies.getObject("userInfo").ID
                        }
                    })
                }
                BookingService.GetDoctorApptBooking(doctorApptBooking)
                .then(function(responseDoctorList){
                    _.forEach(responseRoster.data.rows, function(roster, index) {
                        var doctor = roster.UserAccounts[0].Doctor;
                        var FromTime = moment(roster.FromTime).format('YYYY-MM-DDTHH:mm:ss');
                        var EndTime = moment(roster.ToTime).format('YYYY-MM-DDTHH:mm:ss');
                        var event = {
                            id: roster.UID,
                            resourceId: doctor.UID,
                            start: FromTime,
                            end: EndTime,
                            enddate: EndTime,
                            color: roster.Services[0].Colour,
                            rendering: 'background',
                            Services: roster.Services,
                            Sites: roster.Sites,
                            UserAccounts: roster.UserAccounts
                        };
                        $('#calendar').fullCalendar('addResource', {
                            id: doctor.UID,
                            title: doctor.FirstName + ' ' + doctor.LastName,
                            Services: roster.Services,
                            type1: doctor.UID
                        });
                        events.push(event);
                    });

                    if (isAdmin) {
                        _.forEach(responseDoctorList.data, function(doctor, index){
                            $('#calendar').fullCalendar('addResource', {
                                id: doctor.UID,
                                title: doctor.FirstName + ' '+ doctor.LastName,
                                Services:null,
                                type1:doctor.UID
                            })
                        });
                    }
                    

                    var bookingData = {
                        Filter: [{
                            Appointment: {
                                Enable: 'Y',
                                FromTime: startDate,
                                Status: { $ne: 'Cancelled' }
                            }
                        }, {
                            Site: {
                                UID: $scope.search.site
                            }
                        }]
                    }
                    if (isDoctor) {
                        bookingData.Filter.push({
                            Doctor: {
                                UserAccountID: $cookies.getObject('userInfo').ID
                            }
                        })
                    }
                    BookingService.LoadBooking(bookingData)
                        .then(function(response) {
                            _.forEach(response.data.rows, function(appointment, index) {
                                var doctor = appointment.Doctors[0];
                                var patient = appointment.Patients[0];
                                var service = appointment.Services[0];
                                var FromTime = moment(appointment.FromTime).format('YYYY-MM-DDTHH:mm:ss');
                                var EndTime = moment(appointment.ToTime).format('YYYY-MM-DDTHH:mm:ss');
                                var SiteID = appointment.Site.UID;
                                var event = {
                                    id: appointment.UID,
                                    resourceId: doctor.UID,
                                    start: FromTime,
                                    end: EndTime,
                                    enddate: EndTime,
                                    color: statuses[appointment.Status],
                                    Patient: patient,
                                    Service: service,
                                    SiteID: SiteID
                                };
                                events.push(event);
                            });                         
                            $('#calendar').fullCalendar('addEventSource', events);

                        }) 
                }, function(error){
                    toastr.error("Load Booking Failed", "Error");
                })
                
            }, function(error) {
                toastr.error("Load Booking Failed", "Error");
            })

    }

    function formatDate(data) {
        return moment(data).subtract(0, 'days').format("DD/MM/YYYY");
    };

    function formatTime(data) {
        return moment(data).subtract(0, 'time').format("hh:mm:ss a");
    };    

    $scope.eventRender = function(event, element, view) {
        angular.element('.fc-other-month').css('background', '#eee');
        if (!startedViewRender)
            return;
        else
            startedViewRender = false;

        var events = $('#calendar').fullCalendar('clientEvents');

        if (events.length === 0) {
            //Set to default times?
            return;
        }
        var visibleAndNotAllDayEvents = events.filter(function(event) {
            //end not necessarily defined
            var endIsWithin = event.end ? event.end.isWithin(view.start, view.end) : false;
            return !event.allDay && (event.start.isWithin(view.start, view.end) || endIsWithin);
        });

        if (visibleAndNotAllDayEvents.length === 0) {
            //Set to default times?
            return;
        }

        var earliest = visibleAndNotAllDayEvents.reduce(function(previousValue, event) {
            return greaterTime(previousValue, event.start).isSame(previousValue) ? event.start : previousValue;
        }, moment('23:59:59', 'HH:mm:ss'));

        var latest = visibleAndNotAllDayEvents.reduce(function(previousValue, event) {
            var end = event.end ? event.end.clone() : event.start.clone().add(moment(calendarConfig.defaultTimedEventDuration, 'HH:mm:ss'));

            return greaterTime(previousValue, end);
        }, moment('00:00:00', 'HH:mm:ss'));
        if (calendarConfig.minTime !== earliest.format('HH:mm:ss') || 
            calendarConfig.maxTime !== latest.format('HH:mm:ss')) {
            //Reinitialize the whole thing
            var currentDate = $('#calendar').fullCalendar('getDate');            
            //Chi view thoi gian lam trong roster
            $('#calendar').fullCalendar('destroy');
            setTimeout(function() {
                $('#calendar').fullCalendar($.extend(calendarConfig, {
                    defaultDate: currentDate,
                    minTime: earliest.format('HH:mm:ss'),
                    maxTime: latest.format('HH:mm:ss'),
                    height: "auto"
                }));
            }, 500)

        }     
    };

    function getDateCalendar() {
        var date = $('#calendar').fullCalendar('getDate');
        var zone = moment().format('Z');
        var today = moment(date).format('YYYY-MM-DD') + ' 00:00:00 ' + zone;
        return today;
    }

    $scope.viewRender = function(view, element) {
        // startedViewRender = true;
        var today = getDateCalendar();
        ServerListBooking(today);
    };


    $scope.eventAfterRender = function(event, element, view) {
        if (typeof event.Patient !== 'undefined') {
            element.find('.fc-content').html(moment(event.start).format('HH:mm').toLowerCase() + '-' + moment(event.enddate).format('HH:mm').toLowerCase());
            element.find('.fc-content').append(' <b>' + event.Patient.FirstName + ' ' + event.Patient.LastName + '</b>');
        }

        if (isAdmin || isDoctor) {
            if (event.rendering !== 'background') {
                $(element).attr('id', 'event_id_' + event.id);
                $.contextMenu({
                    selector: '#event_id_' + event.id,
                    items: {
                        cancelBooking: {
                            name: 'Cancel Booking',
                            callback: function(key, opt) {
                                var UID = opt.selector.split('_')[2];
                                BookingService.GetDetailBooking({ UID: UID })
                                    .then(function(response) {
                                        var object = response.data;
                                        swal({
                                            title: 'Are you sure?',
                                            text: 'It will make booking status to cancel!!!',
                                            type: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#DD6B55',
                                            confirmButtonText: 'Yes',
                                            cancelButtonText: 'No',
                                            allowOutsideClick: true,
                                            closeOnConfirm: false,
                                            closeOnCancel: true
                                        }, function(isConfirm) {
                                            if (isConfirm) {
                                                var postData = {
                                                    Appointment: {
                                                        UID: UID,
                                                        Status: 'Cancelled'
                                                    }
                                                }
                                                BookingService.ChangeStatusBooking(postData)
                                                    .then(function(response) {
                                                        var today = getDateCalendar();
                                                        ServerListBooking(today);
                                                        swal.close();
                                                    }, function(error) {})
                                            }
                                        })
                                    }, function(error) {})
                            },
                            icon: function(opt, $itemElement, itemKey, item) {
                                $itemElement.html('<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> Cancel Booking');
                                return 'context-menu-icon-updated';
                            }
                        },
                        /*thao*/
                        add: {
                            name: 'Add',
                            callback: function(key, opt, start, end) {
                                var UID = opt.selector.split('_')[2];                                
                                BookingService.GetDetailBooking({ UID: UID })
                                    .then(function(response) {
                                        var modalInstance = $uibModal.open({
                                            animation: true,
                                            size: 'lg',
                                            templateUrl: 'modules/booking/views/schedulerCreate.html',
                                            controller: function($scope, BookingService, RosterService, event, start, end, PatientService, $modal, $uibModal, $timeout, $modalInstance, toastr) {                                                
                                                function getDateCalendar() {
                                                    var date = $('#calendar').fullCalendar('getDate');
                                                    var today = moment(date).format('YYYY-MM-DD');
                                                    return today;            
                                                }
                                                var DateToday = getDateCalendar();
                                                $('#calendar').fullCalendar( 'removeEvents', function(event) {
                                                    if(moment(event._start._i).format('YYYY-MM-DD') === DateToday)
                                                        return true;
                                                });
                                                $scope.items = [
                                                    { field: "FirstName", name: "First Name" },
                                                    { field: "LastName", name: "Last Name" },
                                                    { field: "UserAccount", name: "Mobile" },
                                                ];
                                                $scope.patient = {
                                                    runIfSuccess: function(data) {
                                                        $timeout(function() {
                                                            $scope.formData.Patient = data;
                                                        }, 0);
                                                    },
                                                    runIfClose: function() {
                                                        $modalInstance.close();
                                                    }
                                                };

                                                function getListSite() {
                                                    RosterService.GetListSite()
                                                        .then(function(response) {
                                                            $scope.listSites = response.data;
                                                        }, function(error) {

                                                        })
                                                }
                                                $scope.listTypes = [{
                                                    code: 'Onsite',
                                                    name: 'Onsite'
                                                }, {
                                                    code: 'Telehealth',
                                                    name: 'Telehealth'
                                                }];                                                
                                                $scope.formData = {
                                                    service: event.Services[0],
                                                    site: event.Site,
                                                    fromTime: moment(event.FromTime).format('HH:mm'),
                                                    toTime: moment(event.ToTime).format('HH:mm'),
                                                    date: moment(event.FromTime).format('DD/MM/YYYY'),
                                                    Doctor: event.Doctors[0],
                                                    type: event.Type
                                                };                                            
                                                $scope.cancel = function() {
                                                    $modalInstance.dismiss('cancel');
                                                };

                                                function appendTime(time) {
                                                    return (time < 10 && time.toString()[0] != '0') ? '0' + time : time;
                                                }

                                                function appendFullCalendarDateTime(date, time) {
                                                    var split_time = time.split(':');                                                    
                                                    var hour = appendTime(split_time[0]);                                                    
                                                    var minute = split_time[1];
                                                    var zone = moment().format('Z');
                                                    return moment(date).format('YYYY-MM-DD') + ' ' + hour + ':' + minute + ':00 ' + zone;
                                                }

                                                function convertToTimeZone(time) {
                                                    var split_time = time.split('/');
                                                    return moment(split_time[2] + '-' + split_time[1] + '-' + split_time[0]).format('YYYY-MM-DD HH:mm:ss Z');
                                                }

                                                function convertToTime24(timeString) {
                                                    var split = timeString.split(':');
                                                    return parseInt(split[0] + split[1]);
                                                };
                                                $scope.submit = function() {
                                                    var accept = true;
                                                    var fromTimeParse = convertToTime24($scope.formData.fromTime);                                                    
                                                    var toTimeParse = convertToTime24($scope.formData.toTime);
                                                    if (fromTimeParse >= toTimeParse) {
                                                        toastr.error('From Time must be smaller than To Time !!!');
                                                        accept = false;
                                                    } else if (PatientUID === '') {
                                                        toastr.error('You must choose Patient');
                                                        accept = false;
                                                    } else {
                                                        var fromTime = appendFullCalendarDateTime(start, $scope.formData.fromTime);                                                        
                                                        var toTime = appendFullCalendarDateTime(start, $scope.formData.toTime);
                                                        var type = $scope.formData.type;
                                                        var zone = moment().format('Z');
                                                        var requestDate = moment(start).format('YYYY-MM-DD HH:mm:ss') + " " + zone;
                                                        var serviceUID = $scope.formData.service.UID;
                                                        var siteUID = $scope.formData.site.UID;
                                                        var DoctorUID = $scope.formData.Doctor.UID;
                                                        var PatientUID = $scope.formData.Patient.UID;
                                                        if (PatientUID === '')
                                                            toastr.error('You must choose Patient');
                                                        else {
                                                            var postData = {
                                                                Appointment: {
                                                                    FromTime: fromTime,
                                                                    ToTime: toTime,
                                                                    Type: type,
                                                                    RequestDate: requestDate
                                                                },
                                                                Service: {
                                                                    UID: serviceUID
                                                                },
                                                                Site: {
                                                                    UID: siteUID
                                                                },
                                                                Doctor: {
                                                                    UID: DoctorUID
                                                                },
                                                                Patient: {
                                                                    UID: PatientUID
                                                                }
                                                            }
                                                            BookingService.CreateBooking(postData)
                                                                .then(function(response) {
                                                                    toastr.success('Create Booking Successfully');
                                                                    //$modalInstance.close();
                                                                    window.location.reload();
                                                                }, function(error) {
                                                                    if (typeof error.data !== 'undefined') {
                                                                        var type = error.data.status;
                                                                        switch (type) {
                                                                            case 'withoutRoster':
                                                                                toastr.error('Booking Appointment Time Wrong !!!');
                                                                                break;
                                                                        }
                                                                    }
                                                                })
                                                        }
                                                    }
                                                };
                                                getListSite();
                                            },
                                            resolve: {
                                                event: function() {
                                                    return response.data;
                                                },
                                                start: function() {
                                                    return start;
                                                },
                                                end: function() {
                                                    return end;
                                                },
                                            }
                                        });
                                    }, function(error) {})
                            },
                            icon: function(opt, $itemElement, itemKey, item) {
                                $itemElement.html('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add New Patient');
                                return 'context-menu-icon-updated';
                            }
                        },
                        /*end thao*/
                        edit: {
                            name: 'Edit',
                            callback: function(key, opt) {
                                var UID = opt.selector.split('_')[2];
                                BookingService.GetDetailBooking({ UID: UID })
                                    .then(function(response) {
                                        var modalInstance = $uibModal.open({
                                            animation: true,
                                            size: 'md',
                                            templateUrl: 'modules/booking/views/schedulerEdit.html',
                                            controller: 'schedulerEditCtrl',
                                            resolve: {
                                                data: function() {
                                                    return response.data;
                                                }
                                            }
                                        });
                                        modalInstance.result
                                            .then(function(result) {                                              
                                                var today = getDateCalendar();
                                                ServerListBooking(today);
                                            }, function() {});
                                    }, function(error) {})
                            },
                            icon: function(opt, $itemElement, itemKey, item) {
                                $itemElement.html('<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit');
                                return 'context-menu-icon-updated';
                            }
                        },
                        delete: {
                            name: 'Delete',
                            callback: function(key, opt) {
                                var UID = opt.selector.split('_')[2];
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    size: 'md',
                                    templateUrl: 'modules/booking/views/schedulerDelete.html',
                                    controller: 'schedulerDeleteCtrl',
                                    resolve: {
                                        UID: function() {
                                            return UID;
                                        }
                                    },
                                });
                                modalInstance.result
                                    .then(function(result) {
                                        var today = getDateCalendar();
                                        ServerListBooking(today);
                                    }, function() {});
                            },
                            icon: function(opt, $itemElement, itemKey, item) {
                                // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                                $itemElement.html('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete');
                                // Add the context-menu-icon-updated class to the item
                                return 'context-menu-icon-updated';
                            }
                        }
                    },

                })
            }
        }
    };

    // create new event
    $scope.select = function(start, end, jsEvent, view, resource, event, allDay) {
        if (isAdmin || isDoctor) {
            if (oldEvent.id !== currentEvent.id) {
                var service = currentEvent.Services[0];
                if (service.Bookable === 'Y') {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: 'modules/booking/views/schedulerCreate.html',
                        controller: 'schedulerCreateCtrl',
                        resolve: {
                            event: function() {
                                return currentEvent;
                            },
                            start: function() {
                                return start;
                            },
                            end: function() {
                                return end;
                            },
                        }
                    });
                    modalInstance.result
                        .then(function(result) {
                            var today = getDateCalendar();
                            ServerListBooking(today);
                        }, function() {});
                    currentEvent = {
                        id: ''
                    };
                } else {
                    toastr.warning('This Slot Time is not Bookable');
                }
            }
        }
    };
        
    $scope.selectOverlap = function(event) {
        currentEvent = event;
        return true;
    },
    $scope.eventClick = function(event, jsEvent, view, start, end, element) {};

    var todayNotTZ = moment().format('YYYY-MM-DD');
    var startedViewRender = true;

    function greaterTime(first, second) {
        //Assuming dates are the same year
        if (first.clone().dayOfYear(0).isBefore(second.clone().dayOfYear(0)))
            return second;
        else
            return first;
    }

    var tempCalendarConfig = {};

    var calendarConfig = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        timezone: 'UTC',
        eventStartEditable: false,
        defaultView: 'agendaDay', // the hien trong ngay // 'agendaWeek' the hien trong tuan
        ignoreTimezone: false,
        defaultDate: todayNotTZ,
        allDaySlot: false,
        editable: true,
        slotDuration: '00:05:00', //'00:5:00', // khoang cach thoi gian
        selectable: true, //true, // ko cho select
        eventLimit: true, // allow "more" link when too many events
        scrollTime: moment(),
        minTime: "00:00:00",
        maxTime: "24:00:00",
        header: {
            left: 'today prev,next ',
            center: 'title',
            right: '', // right: 'agendaDay,agendaTwoDay,agendaWeek,month'
        },
        views: {
            agendaTwoDay: {
                type: 'agenda',
                // views that are more than a day will NOT do this behavior by default
                // so, we need to explicitly enable it
                groupByResource: true

                //// uncomment this line to group by day FIRST with resources underneath
                //groupByDateAndResource: true
            },
            month: {
                titleFormat: 'YYYY, MM, DD'
            },
        },
        resourceOrder: 'type1',
        resources: [],
        eventClick: $scope.eventClick,
        dayClick: $scope.dayClick,
        eventRender: $scope.eventRender,
        eventAfterRender: $scope.eventAfterRender,
        eventAfterAllRender: $scope.eventAfterAllRender,
        select: $scope.select,
        viewRender: $scope.viewRender,
        selectOverlap: $scope.selectOverlap,
        eventDrop: $scope.eventDrop,
        eventResize: $scope.eventResize,
        eventResizeStop: $scope.eventResizeStop,
        eventMouseover: function(data, event, view) {},
        eventMouseout: function(calEvent, jsEvent) {},
    }

    $scope.scheduler = angular.element('#calendar').fullCalendar(calendarConfig);
     
    //INIT
    getListSite();
});
////
