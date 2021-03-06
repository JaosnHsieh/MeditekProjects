module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    require('moment-range');
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Roster) &&
        !_.isEmpty(data.UserAccount) &&
        !_.isEmpty(data.Service) &&
        !_.isEmpty(data.Site) &&
        HelperService.CheckExistData(data.Roster.FromTime) &&
        HelperService.CheckExistData(data.Roster.ToTime)) {
        sequelize.transaction()
            .then(function(t) {
                    var whereClauseUserAccount = {};
                    _.forEach(data.UserAccount, function(valueKey, indexKey) {
                        if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                            moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                            whereClauseUserAccount[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                        } else if (!_.isArray(valueKey) &&
                            !_.isObject(valueKey)) {
                            whereClauseUserAccount[indexKey] = valueKey;
                        }
                    });
                    var arrayRosterUpdate = [];
                    var arrayRosterCreate = [];
                    //find current Roster update
                    return Roster.findOne({
                            attributes: Services.AttributesRoster.Roster(),
                            where: {
                                UID: data.Roster.UID
                            },
                            raw: true,
                            transaction: t
                        })
                        .then(function(rosterUpdate) {
                            if (!_.isEmpty(rosterUpdate) &&
                                HelperService.CheckExistData(rosterUpdate.FromTime)) {
                                var zoneClient = data.Roster.FromTime.split(' ')[2];
                                var fromTime = moment(rosterUpdate.FromTime).utcOffset(zoneClient).format('YYYY-MM-DD HH:mm:ss Z');
                                var toTime = moment(rosterUpdate.ToTime).utcOffset(zoneClient).format('YYYY-MM-DD HH:mm:ss Z');
                                var timeFrom = fromTime.split(' ')[1];
                                var timeTo = toTime.split(' ')[1];
                                var zoneFrom = fromTime.split(' ')[2];
                                var zoneTo = toTime.split(' ')[2];
                                var startTime = fromTime.split(' ')[0];
                                var endTime = null;
                                if (!_.isEmpty(data.Roster.EndRecurrence)) {
                                    endTime = data.Roster.EndRecurrence.split(' ')[0];
                                } else {
                                    endTime = data.Roster.FromTime.split(' ')[0];
                                }
                                var rangTime = moment.range(startTime, endTime);
                                var arrayWhereClauseRoster = [];
                                rangTime.by('days', function(day) {
                                    var objWhereClauseRoster = {
                                        FromTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeFrom + ' ' + zoneFrom, 'YYYY-MM-DD HH:mm:ss Z').toDate(),
                                        ToTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeTo + ' ' + zoneTo, 'YYYY-MM-DD HH:mm:ss Z').toDate()
                                    };
                                    arrayWhereClauseRoster.push(objWhereClauseRoster);
                                });
                                //find all Roster in Recurrentce
                                return Roster.findAll({
                                    attributes: Services.AttributesRoster.Roster(),
                                    include: [{
                                        model: UserAccount,
                                        required: true,
                                        where: whereClauseUserAccount
                                    }],
                                    where: {
                                        $or: arrayWhereClauseRoster
                                    },
                                    transaction: t,
                                    raw: true
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(arrRosterUser) {
                            if (!_.isEmpty(arrRosterUser)) {
                                var rosterRepeater = Services.GetDataRoster.GetRosterRepeat(data.Roster, userInfo);
                                if (!_.isEmpty(rosterRepeater)) {
                                    //filter all Roster update
                                    _.forEach(rosterRepeater, function(valueRosterRequest, indexRosterRequest) {
                                        var dateRosterRequest = valueRosterRequest.FromTime.split(' ')[0];
                                        var clientZone = valueRosterRequest.FromTime.split(' ')[2];
                                        _.forEach(arrRosterUser, function(valueRosterUser, indexRosterUser) {
                                            var dateRosterUser = moment(valueRosterUser.FromTime).utcOffset(clientZone).format('YYYY-MM-DD');
                                            if (dateRosterRequest === dateRosterUser) {
                                                var objRosterUpdate = {
                                                    UID: valueRosterUser.UID,
                                                    FromTime: valueRosterRequest.FromTime,
                                                    ToTime: valueRosterRequest.ToTime,
                                                    IsRecurrence: valueRosterRequest.IsRecurrence,
                                                    RecurrenceType: valueRosterRequest.RecurrenceType,
                                                    Enable: 'Y',
                                                    ModifiedBy: userInfo.ID,
                                                    action: 'update'
                                                };
                                                if (valueRosterRequest.IsRecurrence === 'Y') {
                                                    objRosterUpdate.EndRecurrence = valueRosterRequest.EndRecurrence;
                                                }
                                                arrayRosterUpdate.push(objRosterUpdate);
                                            }
                                        });
                                    });
                                    //filter all Roster create
                                    _.forEach(rosterRepeater, function(valueRosterRequest, indexRosterRequest) {
                                        var isFound = false;
                                        var dateRosterRequest = valueRosterRequest.FromTime.split(' ')[0];
                                        _.forEach(arrayRosterUpdate, function(valueRosterUpdate, indexRosterUpdate) {
                                            var dateRosterUpdate = valueRosterUpdate.FromTime.split(' ')[0];
                                            if (dateRosterRequest === dateRosterUpdate) {
                                                isFound = true;
                                            }
                                        });
                                        if (!isFound) {
                                            valueRosterRequest.action = 'create';
                                            arrayRosterCreate.push(valueRosterRequest);
                                        }
                                    });
                                    //update all Roster in Recurrentce
                                    if (!_.isEmpty(arrayRosterUpdate)) {
                                        arrayRosterUpdate = _.uniq(arrayRosterUpdate, 'UID');
                                        var objectCheckExistAppt = {
                                            where: arrayRosterUpdate,
                                            userAccount: data.UserAccount,
                                            transaction: t
                                        };
                                        return Services.CheckRosterExistAppointment(objectCheckExistAppt)
                                            .then(function(checkExistApptOk) {
                                                var arrayAllRoster = _.extend([], arrayRosterUpdate);
                                                _.forEach(arrayRosterCreate, function(valueRosterCreate, indexRosterCreate) {
                                                    arrayAllRoster.push(valueRosterCreate);
                                                });
                                                var objectCheckOverlap = {
                                                    data: arrayAllRoster,
                                                    transaction: t,
                                                    userAccount: data.UserAccount,
                                                    Bookable: data.Service.Bookable
                                                };
                                                return Services.CheckOverlap(objectCheckOverlap)
                                                    .then(function(checkOverlapOk) {
                                                        //update array Roster
                                                        var objectUpdateRoster = {
                                                            data: arrayRosterUpdate,
                                                            transaction: t
                                                        };
                                                        return Services.BulkUpdateRoster(objectUpdateRoster)
                                                            .then(function(rosterUpdated) {
                                                                arrObjectRosterUpdated = rosterUpdated;
                                                                if (!_.isEmpty(data.Service)) {
                                                                    var whereClause = {};
                                                                    _.forEach(data.Service, function(valueKey, indexKey) {
                                                                        if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                                                            moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                                                            whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                                                        } else if (!_.isArray(valueKey) &&
                                                                            !_.isObject(valueKey)) {
                                                                            whereClause[indexKey] = valueKey;
                                                                        }
                                                                    });
                                                                    return Service.findOne({
                                                                        attributes: ['ID'],
                                                                        where: whereClause,
                                                                        transaction: t,
                                                                        raw: true
                                                                    });
                                                                } else {
                                                                    var error = new Error('service.not.exist');
                                                                    defer.reject({
                                                                        error: error,
                                                                        transaction: t
                                                                    });
                                                                }
                                                            }, function(err) {
                                                                defer.reject({
                                                                    error: err,
                                                                    transaction: t
                                                                });
                                                            })
                                                            .then(function(serviceRes) {
                                                                if (!_.isEmpty(serviceRes)) {
                                                                    var objectUpdateRelRosterService = {
                                                                        data: arrObjectRosterUpdated,
                                                                        service: serviceRes.ID,
                                                                        transaction: t
                                                                    };
                                                                    return Services.UpdateRelRosterService(objectUpdateRelRosterService);
                                                                } else {
                                                                    var error = new Error('service.not.exist');
                                                                    defer.reject({
                                                                        error: error,
                                                                        transaction: t
                                                                    });
                                                                }
                                                            }, function(err) {
                                                                defer.reject({
                                                                    error: err,
                                                                    transaction: t
                                                                });
                                                            })
                                                            .then(function(relRosterServiceUpdated) {
                                                                if (!_.isEmpty(data.Site)) {
                                                                    var whereClause = {};
                                                                    _.forEach(data.Site, function(valueKey, indexKey) {
                                                                        if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                                                            moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                                                            whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                                                        } else if (!_.isArray(valueKey) &&
                                                                            !_.isObject(valueKey)) {
                                                                            whereClause[indexKey] = valueKey;
                                                                        }
                                                                    });
                                                                    return Site.findOne({
                                                                        attributes: ['ID'],
                                                                        where: whereClause,
                                                                        transaction: t,
                                                                        raw: true
                                                                    });
                                                                } else {
                                                                    var error = new Error('service.not.exist');
                                                                    defer.reject({
                                                                        error: error,
                                                                        transaction: t
                                                                    });
                                                                }
                                                            }, function(err) {
                                                                defer.reject({
                                                                    error: err,
                                                                    transaction: t
                                                                });
                                                            })
                                                            .then(function(siteRes) {
                                                                if (!_.isEmpty(siteRes)) {
                                                                    var objectUpdateRelRosterSite = {
                                                                        data: arrObjectRosterUpdated,
                                                                        site: siteRes.ID,
                                                                        transaction: t
                                                                    };
                                                                    return Services.UpdateRelRosterSite(objectUpdateRelRosterSite);
                                                                } else {
                                                                    var error = new Error('site.not.exist');
                                                                    defer.reject({
                                                                        error: error,
                                                                        transaction: t
                                                                    });
                                                                }
                                                            }, function(err) {
                                                                defer.reject({
                                                                    error: err,
                                                                    transaction: t
                                                                });
                                                            })
                                                            .then(function(relRosterSiteUpdated) {
                                                                if (!_.isEmpty(arrayRosterCreate)) {
                                                                    arrayRosterCreate = _.uniq(arrayRosterCreate, 'UID');
                                                                    var arrayUIDRosterCreate = _.map(arrayRosterCreate, 'UID');
                                                                    var objectCheckOverlap = {
                                                                        data: arrayRosterCreate,
                                                                        transaction: t,
                                                                        userAccount: data.UserAccount,
                                                                        Bookable: data.Service.Bookable,
                                                                        action: 'create'
                                                                    };
                                                                    var objectCreateRoster = {
                                                                        data: arrayRosterCreate,
                                                                        userInfo: userInfo,
                                                                        transaction: t
                                                                    };
                                                                    var arrayRosterID = null;
                                                                    return Services.BulkCreateRoster(objectCreateRoster)
                                                                        .then(function(rosterCreated) {
                                                                            var rosterCreated =
                                                                                JSON.parse(JSON.stringify(rosterCreated));
                                                                            arrayRosterID = _.map(_.groupBy(rosterCreated, function(R) {
                                                                                return R.ID;
                                                                            }), function(subGrouped) {
                                                                                return subGrouped[0].ID;
                                                                            });
                                                                            if (!_.isEmpty(data.UserAccount)) {
                                                                                var whereClause = {};
                                                                                _.forEach(data.UserAccount, function(valueKey, indexKey) {
                                                                                    if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                                                                        moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                                                                        whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                                                                    } else if (!_.isArray(valueKey) &&
                                                                                        !_.isObject(valueKey)) {
                                                                                        whereClause[indexKey] = valueKey;
                                                                                    }
                                                                                });
                                                                                return UserAccount.findOne({
                                                                                    attributes: ['ID'],
                                                                                    where: whereClause,
                                                                                    transaction: t
                                                                                });
                                                                            } else {
                                                                                var error = new Error('userAccount.not.exist');
                                                                                defer.reject({
                                                                                    error: error,
                                                                                    transaction: t
                                                                                });
                                                                            }
                                                                        }, function(err) {
                                                                            defer.reject({
                                                                                error: err,
                                                                                transaction: t
                                                                            });
                                                                        })
                                                                        .then(function(userAccountRes) {
                                                                            if (!_.isEmpty(userAccountRes)) {
                                                                                return userAccountRes.addRosters(arrayRosterID, {
                                                                                    transaction: t
                                                                                });
                                                                            } else {
                                                                                var error = new Error('userAccount.not.exist');
                                                                                defer.reject({
                                                                                    error: error,
                                                                                    transaction: t
                                                                                });
                                                                            }
                                                                        }, function(err) {
                                                                            defer.reject({
                                                                                error: err,
                                                                                transaction: t
                                                                            });
                                                                        })
                                                                        .then(function(relUserAccountRosterCreated) {
                                                                            if (!_.isEmpty(data.Service)) {
                                                                                var whereClause = {};
                                                                                _.forEach(data.Service, function(valueKey, indexKey) {
                                                                                    if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                                                                        moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                                                                        whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                                                                    } else if (!_.isArray(valueKey) &&
                                                                                        !_.isObject(valueKey)) {
                                                                                        whereClause[indexKey] = valueKey;
                                                                                    }
                                                                                });
                                                                                return Service.findOne({
                                                                                    attributes: ['ID'],
                                                                                    where: whereClause,
                                                                                    transaction: t
                                                                                });
                                                                            } else {
                                                                                var error = new Error('service.not.exist');
                                                                                defer.reject({
                                                                                    error: error,
                                                                                    transaction: t
                                                                                });
                                                                            }
                                                                        }, function(err) {
                                                                            defer.reject({
                                                                                error: err,
                                                                                transaction: t
                                                                            });
                                                                        })
                                                                        .then(function(serviceRes) {
                                                                            if (!_.isEmpty(serviceRes)) {
                                                                                return serviceRes.addRosters(arrayRosterID, {
                                                                                    transaction: t
                                                                                });
                                                                            } else {
                                                                                var error = new Error('service.not.exist');
                                                                                defer.reject({
                                                                                    error: error,
                                                                                    transaction: t
                                                                                });
                                                                            }
                                                                        }, function(err) {
                                                                            defer.reject({
                                                                                error: err,
                                                                                transaction: t
                                                                            });
                                                                        })
                                                                        .then(function(relRosterServiceCreated) {
                                                                            if (!_.isEmpty(data.Site)) {
                                                                                var whereClause = {};
                                                                                _.forEach(data.Site, function(valueKey, indexKey) {
                                                                                    if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                                                                        moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                                                                        whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                                                                    } else if (!_.isArray(valueKey) &&
                                                                                        !_.isObject(valueKey)) {
                                                                                        whereClause[indexKey] = valueKey;
                                                                                    }
                                                                                });
                                                                                return Site.findOne({
                                                                                    attributes: ['ID'],
                                                                                    where: whereClause,
                                                                                    transaction: t
                                                                                });
                                                                            } else {
                                                                                var error = new Error('Site.not.exist');
                                                                                defer.reject({
                                                                                    error: error,
                                                                                    transaction: t
                                                                                });
                                                                            }
                                                                        }, function(err) {
                                                                            defer.reject({
                                                                                error: err,
                                                                                transaction: t
                                                                            });
                                                                        })
                                                                        .then(function(siteRes) {
                                                                            if (!_.isEmpty(siteRes)) {
                                                                                return siteRes.addRosters(arrayRosterID, {
                                                                                    transaction: t
                                                                                });
                                                                            } else {
                                                                                var error = new Error('service.not.exist');
                                                                                defer.reject({
                                                                                    error: error,
                                                                                    transaction: t
                                                                                });
                                                                            }
                                                                        }, function(err) {
                                                                            defer.reject({
                                                                                error: err,
                                                                                transaction: t
                                                                            });
                                                                        })
                                                                        .then(function(relRosterSiteCreated) {
                                                                            defer.resolve({
                                                                                status: 'success',
                                                                                transaction: t
                                                                            });
                                                                        }, function(err) {
                                                                            defer.reject({
                                                                                error: err,
                                                                                transaction: t
                                                                            });
                                                                        });
                                                                } else {
                                                                    defer.resolve({
                                                                        status: 'success',
                                                                        transaction: t
                                                                    });
                                                                }
                                                            }, function(err) {
                                                                defer.reject({
                                                                    error: err,
                                                                    transaction: t
                                                                });
                                                            });
                                                    }, function(err) {
                                                        if (!_.isEmpty(err) &&
                                                            !_.isEmpty(err.dataOverlap) &&
                                                            err.status === 'overlaps') {
                                                            defer.reject({
                                                                transaction: t,
                                                                dataOverlap: err.dataOverlap
                                                            });
                                                        } else {
                                                            defer.reject({
                                                                transaction: t,
                                                                error: err
                                                            });
                                                        }
                                                    });
                                            }, function(err) {
                                                if (!_.isEmpty(err) &&
                                                    !_.isEmpty(err.dataExistAppt) &&
                                                    err.status === 'existAppt') {
                                                    defer.reject({
                                                        transaction: t,
                                                        dataExistAppt: err.dataExistAppt
                                                    });
                                                } else {
                                                    defer.reject({
                                                        transaction: t,
                                                        error: err
                                                    });
                                                }
                                            });
                                    }
                                } else {
                                    var error = new Error('UpdateRequestRoster.failed.RepeatRoster');
                                    defer.reject({
                                        error: error,
                                        transaction: t
                                    });
                                }
                            } else {
                                defer.resolve({
                                    status: 'success',
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        });
                },
                function(err) {
                    defer.reject({
                        error: err
                    });
                });
    } else {
        var error = new Error('UpdateRequestRoster.data.not.exist');
        defer.reject({
            error: error
        });
    }
    return defer.promise;
};
