module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, EFormTemplate);
    EFormTemplate.findAndCountAll({
            attributes: Services.AttributesEForm.EFormTemplate(),
            include: [{
                attributes: ['ID', 'Status', 'Enable'],
                model: EForm,
                include: [{
                    attributes: ['ID', 'UID'],
                    model: Appointment,
                    where: pagination.Appointment,
                    required: false
                }],
                required: false
            }, {
                attributes: ['UID'],
                model: Role,
                required: false
            }],
            where: pagination.EFormTemplate,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset
        })
        .then(function(eformTemplateList) {
            defer.resolve({ data: eformTemplateList });
        }, function(err) {
            defer.reject({
                error: err
            });
        });
    return defer.promise;
};
