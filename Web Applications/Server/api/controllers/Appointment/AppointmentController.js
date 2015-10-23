module.exports = {
    /*
    RequestAppointment: save information patient, 
    create new appointment, create telehealth appointment,
    link telehealth appointment with appointment created, 
    send email and notification for admin system
    input: information patient
    outout: -success: request apppointment success
            -failed: request appointment error
    */
    RequestAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.CreateTelehealthAppointment(data, req.user)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error));
                });
        }
    },
    /*
    GetListTelehealthAppointment: get list appointment with condition receive
    inpput: information pagination, search, .....
    output: list appointment via condition
    */
    GetListTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.GetListTelehealthAppointment(data, req.user)
                .then(function(success) {
                    res.ok(success.data);
                })
                .catch(function(err) {
                    if (HelperService.CheckPostRequest(err) &&
                        HelperService.CheckPostRequest(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err));
                });
        }
    },
    /*
    GetDetailTelehealthAppointment: get information detail telehealth appointment
    input: UID appointment
    output: detail information telehealth appointment
    */
    GetDetailTelehealthAppointment: function(req, res) {
        var UID = req.params.UID;
        Services.GetDetailTelehealthAppointment(UID)
            .then(function(success) {
                res.ok(success);
            })
            .catch(function(err) {
                if (HelperService.CheckPostRequest(err) &&
                    HelperService.CheckPostRequest(err.transaction)) {
                    err.transaction.rollback();
                }
                res.serverError(ErrorWrap(err));
            });
    },
    /*
    UpdateTelehealthAppointment: Update information telehealth appointment
    input: new information telehealth appointment
    output: - success: update telehealth appointment success
            - error: updated telehealth appointment failed
    */
    UpdateTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            var role = HelperService.GetRole(req.user.roles);
            if (role.isInternalPractitioner ||
                role.isAdmin ||
                role.isAssistant) {
                Services.UpdateTelehealthAppointment(data, req.user)
                    .then(function(success) {
                        success.transaction.commit();
                        res.ok('success');
                    })
                    .catch(function(err) {
                        if (HelperService.CheckPostRequest(err) &&
                            HelperService.CheckPostRequest(err.transaction)) {
                            err.transaction.rollback();
                        }
                        res.serverError(ErrorWrap(err.error));
                    });
            } else {
                res.serverError('failed');
            }

        }
    },
    /*
    DeleteTelehealthAppointment: delete Telehealth Appointment
    input: UID Appointment
    output: - success: response status success
            - error: response status failed
    */
    DeleteTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.DeleteTelehealthAppointment(data)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    if (HelperService.CheckPostRequest(err) &&
                        HelperService.CheckPostRequest(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err));
                });
        }
    }
};
