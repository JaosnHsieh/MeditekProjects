var app = angular.module('app.authentication.roster.calendar.controller', [
    'app.authentication.roster.calendar.create.controller',
    'app.authentication.roster.calendar.edit.controller',
    'app.authentication.roster.calendar.delete.controller',
]);

app.controller('calendarCtrl', function($state, $stateParams, RosterService, $scope, $compile, $filter, $timeout, uiCalendarConfig, $uibModal){
    //Config
    var selectedColor = 'yellow';

    $scope.events = [];
    $scope.eventSources = [{ events: $scope.events }];
    $scope.data = {};
    $scope.selectedEvent = null;
    $scope.calendarTemp = {
        startDate: null,
        endDate: null
    }

    function formatDate(data){
        return moment(data).subtract(0,'days').format("DD/MM/YYYY");
    };
    function formatTime(data){
        return moment(data).subtract(0,'time').format("hh:mm:ss");
    };

    $scope.eventRender = function(event, element, view){
            event.allDay = true;
            element.find('.fc-time').html(moment(event.start).format('hA').toLowerCase()+'-'+moment(event.end).format('hA').toLowerCase()+'<br/>');
            element.find('.fc-title').append('<br/><small><i>'+event.textOccurance+'</i></small>');
    };
    $scope.eventResize = function(event){
    };
    $scope.eventClick = function(event){
        $scope.selectedEvent = event;
    };
    $scope.eventAfterRender = function(event, element, view){
        $(element).attr('id', 'event_id_'+event.UID);
        $.contextMenu({
            selector: '#event_id_'+event.UID,
            items: {
                edit: {
                    name: 'Edit', 
                    callback: function(key,opt){
                        var UID = opt.selector.split('_')[2];
                        RosterService.GetDetailRoster({UID: UID})
                        .then(function(response){
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    size: 'md',
                                    templateUrl: 'modules/roster/views/calendarEdit.html',
                                    controller: 'calendarEditCtrl',
                                    resolve: {
                                        data: function(){
                                            return response.data;
                                        }
                                    },
                                });
                                modalInstance.result
                                .then(function(result) {
                                        $scope.events.splice(0, $scope.events.length);
                                        ServerListCalendar($scope.calendarTemp.startDate,$scope.calendarTemp.endDate);
                                }, function() {});         
                        }, function(error){})
                    },
                    icon: function(opt, $itemElement, itemKey, item){
                        $itemElement.html('<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit');
                        return 'context-menu-icon-updated';
                    }
                },
                delete: {
                    name: 'Delete',
                    callback: function(key, opt){
                        var UID = opt.selector.split('_')[2];
                        console.log(UID);
                        RosterService.GetDetailRoster({UID: UID})
                        .then(function(response){
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    size: 'md',
                                    templateUrl: 'modules/roster/views/calendarDelete.html',
                                    controller: 'calendarDeleteCtrl',
                                    resolve: {
                                        data: function(){
                                            return response.data;
                                        }
                                    },
                                });
                                modalInstance.result
                                .then(function(result) {
                                        $scope.events.splice(0, $scope.events.length);
                                        ServerListCalendar($scope.calendarTemp.startDate,$scope.calendarTemp.endDate);
                                }, function() {}); 
                        }, function(error){})
                    },
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete');
                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-icon-updated';
                    }
                }
            },

        })

    };
    $scope.select = function(event){

        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/roster/views/calendarCreate.html',
            controller: 'calendarCreateCtrl',
            resolve: {
                event: function(){
                    return event;
                }
            },
        });
        modalInstance.result
            .then(function(result) {
                    $scope.events.splice(0, $scope.events.length);
                    ServerListCalendar($scope.calendarTemp.startDate,$scope.calendarTemp.endDate);
            }, function(result) {
                // dismiss
            });
    };
    $scope.dayClick = function(event){  
    };
    $scope.changeEvent = function(event){
        $scope.submitted = true;
        if($scope.form.$valid){
            // start Datetime
            if ($scope.data.endDate != '' && $scope.data.endTIme != ''){
                var part1 = $scope.data.startDate.split('/');
                var part2 = $scope.data.startTime.split(':');
                var start = new Date(
                    part1[2],   //yyyy
                    part1[1]-1, //mm
                    part1[0],   //dd
                    part2[0],   //hh
                    part2[1],   //mm
                    '00'//part2[2]    //ss
                ); 
                event.start = start;
            }
            // end Datetime
            if ($scope.data.endDate != '' && $scope.data.endTIme != ''){
                var part3 = $scope.data.endDate.split('/');
                var part4 = $scope.data.endTime.split(':');
                var end = new Date(
                    part3[2],   //yyyy
                    part3[1]-1, //mm
                    part3[0],   //dd
                    part4[0],   //hh
                    part4[1],   //mm
                    '00'//part4[2]    //ss
                );
                event.end = end;
            }
            $('#calendar').fullCalendar('updateEvent', event);
        }
    };
    $scope.removeEvent = function(event){
        var r = confirm("Do you want to delete this event ?");
        if(r == true){
            for (var i = 0; i < $scope.events.length; i++){
                if ($scope.events[i]._id === event._id) {
                    $scope.events.splice(i,1);
                    alert('Success!');
                    break;
                }
            }
        }
    };
    $scope.viewRender = function(view, element){
        $scope.calendarTemp.startDate = moment(view.start).format('YYYY-MM-DD Z');
        $scope.calendarTemp.endDate = moment(view.end).format('YYYY-MM-DD Z');
        ServerListCalendar($scope.calendarTemp.startDate, $scope.calendarTemp.endDate);
    };
    $scope.calendarConfig = {
        calendar: {
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            editable: false,
            eventDurationEditable: false,
            selectable: true,
            // selectHelper: true,
            // weekMode: 'liquid',
            header: {
                left: 'today prev,next',
                center: 'title',
                right: '',//'month,agendaWeek,agendaDay'
            },
            height: 900,
            // timeFormat: 'H(:mm)', // uppercase H for 24-hour clock
            eventRender: $scope.eventRender,
            eventAfterRender: $scope.eventAfterRender,
            dayRender: $scope.dayRender,
            eventResize: $scope.eventResize,
            eventClick: $scope.eventClick,
            eventRightclick: $scope.eventRightclick,
            viewRender: $scope.viewRender,
            dayClick: $scope.dayClick,
            select: $scope.select,
        }
    }; 
    function ServerListCalendar(startDate, endDate){
            var postData = {
                    Filter: [
                            {
                                UserAccount: {
                                    UID: $stateParams.doctorId
                                }
                            },
                            {
                                Roster: {
                                    Enable: 'Y'
                                }
                            }
                    ],
                    Range: [
                            {
                                Roster: {
                                        FromTime: [startDate, endDate]
                                }
                            }
                    ]
            }
            RosterService.PostListRoster(postData)
            .then(function(response){
                    _.forEach(response.data.rows, function(item, index){
                            var color = (item.isRecurrence === 'Y')?'green':'green';
                            var textColor = 'white';
                            var textOccurance =  (item.isRecurrence === 'Y')?'Occur':'';
                            $scope.events.push({
                                    UID: item.UID,
                                    title: item.Services[0].ServiceName,
                                    start: new Date(item.FromTime),
                                    end: new Date(item.ToTime),
                                    textColor: textColor,
                                    color: color,
                                    textOccurance: textOccurance
                            });
                    })
            }, function(error){
                    
            })
            
    }
});