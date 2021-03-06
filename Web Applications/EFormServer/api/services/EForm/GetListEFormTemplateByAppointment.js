var _ = require('lodash');
var moment = require('moment');
module.exports = function(data) {
    var pagination = {};
    pagination.whereClause = {Appointment: {} };
    if(!data.ApptUID) {
        var err = new Error('GetListEFormTemplateByAppointment.error');
        err.pushError('appointmentUID.invalid');
        throw err;
    }
    if(!_.isEmpty(data.search)){
        // pagination.whereClause.Appointment = {};
        pagination.whereClause.EForm = {};
        for(var key in data.search) {
            // if (key == 'FromTime') {
            //     var dateActual = moment(data.search.FromTime, 'YYYY-MM-DD HH:mm:ss Z').toDate();
            //     var dateAdded = moment(dateActual).add(1, 'day').toDate();
            //     pagination.whereClause.Appointment.FromTime = {
            //         // like: '%' + data.search.CreatedDate + '%'
            //         '$gte': dateActual,
            //         '$lt': dateAdded
            //     }
            // }
            // if (key == 'Code') {
            //     pagination.whereClause.Appointment.Code = {
            //         like: '%' + data.search.Code + '%'
            //     }
            // }
            if (key == 'Name') {
                pagination.whereClause.EForm.Name = {
                    like: '%' + data.search.Name + '%'
                }
            }
            if (key == 'CreatedDate') {
                var dateActual = moment(data.search.CreatedDate, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                var dateAdded = moment(dateActual).add(1, 'day').toDate();
                pagination.whereClause.EForm.CreatedDate = {
                    // like: '%' + data.search.CreatedDate + '%'
                    '$gte': dateActual,
                    '$lt': dateAdded
                }
            }
        }
    }
    console.log(data);
    if(!_.isEmpty(data.limit)) {
        console.log("vao ???");
        pagination.limit = data.limit;
    }
    if(!_.isEmpty(data.offset)) {
        pagination.offset = data.offset;
    }
    if(!_.isEmpty(data.order)) {
        pagination.order = [];
        for(var key in data.order) {
            var tempOrder = [];
            // if(key == 'FromTime') {
            //     tempOrder = [sequelize.models['Appointment'], key, data.order[key]];
            //     pagination.order.push(tempOrder);
            // }
            // if(key == 'Code') {
            //     tempOrder = [sequelize.models['Appointment'], key, data.order[key]];
            //     pagination.order.push(tempOrder);
            // }
            if(key == 'Name') {
                tempOrder = [key, data.order[key]];
                pagination.order.push(tempOrder);
            }
            if(key == 'CreatedDate') {
                tempOrder = [key, data.order[key]];
                pagination.order.push(tempOrder);
            }
        }
    }
    return Appointment.findOne({
        where:{
            UID: data.ApptUID
        }
    })
    .then(function(got_appt) {
        if(!got_appt) {
            var err = new Error('GetListEFormTemplateByAppointment.error');
            err.pushError('Appointment.notFound');
            throw err;
        }
        else {
            pagination.whereClause.Appointment.UID = data.ApptUID;
            return EForm.findAndCountAll({
                include:[
                    {
                        model:Appointment,
                        attributes:['ID','UID','Code','FromTime','ToTime','RequestDate'],
                        where:pagination.whereClause.Appointment,
                        required:true,
                        include:[
                            {
                                model:Patient,
                                attributes:['ID','UID','FirstName','LastName'],
                                required:false,
                                // where:{
                                //     UID : data.patientUID
                                // }
                            },
                        ],
                    },
                    {
                        model:EFormTemplate,
                        attributes:['ID','UID'],
                        required:true,
                    }
                ],
                where:{$and:[pagination.whereClause.EForm, {Status:'saved'}]},
                limit:data.limit,
                offset:data.offset,
                subQuery:false,
                order:pagination.order,
            });
        }
    },function(err) {
        throw err;
    })
    .then(function(got_list) {
        if(got_list == null || got_list == '') {
            var err = new Error('GetListEFormTemplateByAppointment.error');
            err.pushError('Eform.queryError');
            throw err;
        }
        else {
            return got_list;
        }
    }, function(err) {
        throw err;
    });
}
