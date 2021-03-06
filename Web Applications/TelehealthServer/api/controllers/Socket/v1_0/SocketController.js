var config = sails.config.myconf;
//======== Initialize Opentok module ==========
var $q = require('q');
var _ = require('lodash');
var moment = require('moment');
var OpenTok = require('opentok'),
    opentok = new OpenTok(config.OpentokAPIKey, config.OpentokAPISecret);
var redisKey = "TelehealthServer";

function emitError(socket, msg) {
    var err = new Error("Socket.Error");
    err.pushError(msg);
    sails.sockets.emit(socket, 'errorMsg', ErrorWrap(err))
};

function pushGCMNotification(info, devices, gcmSender) {
    var androidMess = {
        collapseKey: 'REDiMED',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        data: info.data ? info.data : {},
        notification: {
            title: "REDiMED",
            icon: "ic_launcher",
            body: info.content ? info.content : 'Push Notification From REDiMED',
            sound: "ringtone.wav"
        }
    };
    TelehealthService.SendGCMPush(androidMess, devices, gcmSender).then(function(result) {
        console.log(result);
    }).catch(function(err) {
        console.log(err);
    })
};

function pushAPNNotification(info, devices) {
    var iosMess = {
        badge: 1,
        alert: info.content ? info.content : 'Push Notification From REDiMED',
        payload: info.data ? info.data : {},
        category: info.category ? info.category : null
    };
    TelehealthService.SendAPNPush(iosMess, devices);
};
module.exports = {
    JoinConferenceRoom: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.JoinConferenceRoom.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }
        console.log("JoinRoom", req.param('uid'), req.isSocket);
        var uid = req.param('uid');
        var error = null;
        if (uid) {
            console.log("JoinConferenceRoom vao roi ne");
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                if (teleUser) {
                    sails.sockets.join(req.socket, uid);
                    var roomNames = JSON.stringify(sails.sockets.rooms());
                    console.log("roomList", roomNames);
                    sails.sockets.leave(req.socket, req.socket.id);
                    console.log("JoinConferenceRoom Successfully", uid);
                    var roomNames1 = JSON.stringify(sails.sockets.rooms());
                    console.log("roomList", roomNames1);
                    RedisWrap.hget(redisKey, uid).then(function(data) {
                        if (data != null) {
                            var awaitTime = moment(new Date()) - moment(data.timeCall);
                            console.log("++++++++++++++++++++++++++++++++++++++++++++", awaitTime);
                            if (awaitTime > 120000) {
                                data.message = "misscall";
                            }
                            sails.sockets.broadcast(uid, 'receiveMessage', data);
                            RedisWrap.hdel(redisKey, uid);
                        }
                    });
                } else error = "User Is Not Exist";
            }).catch(function(err) {
                error = err;
            })
        } else {
            error = "Invalid Params";
        }

        if (error != null) {
            return res.serverError({ error: error });
        }
    },
    MessageTransfer: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.MessageTransfer.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }
        sails.log.debug("Socket MessageTransfer: " + JSON.stringify(req.params.all()));
        var from = req.param('from');
        var to = req.param('to');
        var message = req.param('message');
        var data = {};
        if (!message || !from || !to) return;
        var fromName = req.param('fromName');
        var sessionId = null;
        var appid = null;
        var tokenOptions = {
            role: 'moderator'
        };
        var token = null;
        console.log("111111111111111111111");
        var roomList = sails.sockets.rooms();
        if (message.toLowerCase() == 'call') {
            console.log("2222222222222222222222");
            sessionId = req.param('sessionId');
            if (!sessionId) return;
            console.log("33333333333333333333333");
            token = opentok.generateToken(sessionId, tokenOptions);
            data.apiKey = config.OpentokAPIKey;
            data.sessionId = sessionId;
            data.token = token;
            data.fromName = !fromName ? 'Unknown' : fromName;
            var pushInfo = {
                data: {
                    "data": {
                        "apiKey": config.OpentokAPIKey,
                        "message": message,
                        "fromName": (!fromName ? 'Unknown' : fromName),
                        "sessionId": sessionId,
                        "token": token,
                        "from": from
                    }
                },
                content: 'Calling From ' + (!fromName ? 'Unknown' : fromName),
                category: 'CALLING_MESSAGE'
            };
            TelehealthService.FindByUID(to).then(function(teleUser) {
                if (teleUser) {
                    TelehealthDevice.findAll({
                        where: {
                            TelehealthUserID: teleUser.ID
                        }
                    }).then(function(devices) {
                        var iosDevices = [];
                        var androidDevices = [];
                        var tokens = [];
                        if (devices) {
                            for (var i = 0; i < devices.length; i++) {
                                if (devices[i].Appid == config.WorkinjuryAppid) {
                                    console.log("WorkinjuryAppid", devices[i].DeviceToken);
                                    if (devices[i].DeviceToken != null)
                                        tokens.push(devices[i].DeviceToken);
                                } else {
                                    console.log("TelehealthAppid", devices[i].DeviceToken);
                                    if (devices[i].DeviceToken != null) {
                                        if (devices[i].Type == 'IOS')
                                            iosDevices.push(devices[i].DeviceToken);
                                        else
                                            androidDevices.push(devices[i].DeviceToken);
                                    }
                                }
                            }
                            if (androidDevices.length > 0) {
                                console.log("androidDevices", androidDevices);
                                pushGCMNotification(pushInfo, androidDevices, config.GCMTelehealth);
                            }
                            if (iosDevices.length > 0)
                                pushAPNNotification(pushInfo, iosDevices);
                            if (tokens.length > 0) {
                                console.log("tokens", tokens.length);
                                console.log("tokens", tokens);
                                pushGCMNotification(pushInfo, tokens, config.GCMWorkInjury);
                            }
                        }
                    })
                }
            })
        }

        console.log("44444444444444444444444");

        if (roomList.length > 0) {
            data.from = from;
            data.message = message;
            data.to = to;
            data.timeCall = new Date();
            
            //if uid to online telehealth server
            // RedisWrap.setex(redisKey, to, data);
            switch (message.toLowerCase()) {
                case "call":
                    // RedisWrap.hset(redisKey, to, data);
                    break;
                default:
                //     RedisWrap.hdel(redisKey, to);
            }

            console.log("chiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",data);


            if (_.contains(roomList, to)) {
                console.log(data.message, "calllllllllllllllllllllllllllllllllllllllllllllllllll");
                sails.sockets.broadcast(to, 'receiveMessage', data);
            }

            if (sails.sockets.subscribers(from).length > 1 && message.toLowerCase() != 'call') {
                console.log("3 thang vao 1 phonggggggggggggggggggggggggggggggggggggggggggggggggggg")
                data.message = 'decline';
                data.to = from;
                sails.sockets.emit(from, 'receiveMessage', data, req.socket);
            }
        }
    },
    GenerateConferenceSession: function(req, res) {
        opentok.createSession({
            mediaMode: "routed"
        }, function(err, session) {
            if (err) return res.serverError(ErrorWrap(err));
            var sessionId = session.sessionId;
            var tokenOptions = {
                role: 'moderator',
                expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60),
                data: 'name=Johnny'
            };
            var token = opentok.generateToken(sessionId, tokenOptions);
            console.log("Generate Session Successfully");
            if (token != null && sessionId != null) res.ok({
                message: 'Generate Session Successfully!',
                data: {
                    apiKey: config.OpentokAPIKey,
                    sessionId: sessionId,
                    token: token
                }
            })
        });
    },
    ListRoomSocket: function(req, res) {
        var roomList = sails.sockets.rooms();
        console.log("roomList", roomList);
        res.ok({ roomList: roomList });
    },
    TotalUserInRoom: function(req, res) {
        var roomId = req.body.UID;
        var userInRoom = sails.sockets.subscribers(roomId);
        var toal = sails.sockets.subscribers(roomId).length;
        console.log("userInRoom", userInRoom);
        res.ok({ userInRoom: userInRoom, toal: toal });
    },
    Logout: function(req, res) {
        console.log("aaaaaaa", req.param('uid'), req.isSocket);
        console.log("headers", req.headers.systemtype);
        console.log("Logouttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt");
        var err = new Error("Socket.Logout.Error");

        if (!req.isSocket) {
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }

        var uid = req.param('uid');
        if (req.headers.systemtype === "WEB") {
            sails.sockets.leave(req.socket, uid);
            return res.ok({
                status: "success"
            });
        }

        /*request header*/
        var deviceType = req.headers.deviceid;
        var appid = req.headers.appid;
        if (uid && appid && deviceType) {
            return TelehealthService.FindByUID(uid).then(function(teleUser) {
                return TelehealthDevice.update({
                    DeviceToken: null
                }, {
                    where: {
                        TelehealthUserID: teleUser.ID,
                        DeviceType: deviceType,
                        Appid: appid
                    }
                }).then(function(result) {
                    sails.sockets.leave(req.socket, uid);
                    return res.ok({
                        status: "success"
                    });
                }, function(error) {
                    err.pushError("Update Telehealth Device Error");
                    return res.serverError(ErrorWrap(error));
                });
            })
        } else {
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    AddDoctor: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.AddDoctor.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        };

        console.log("AddDoctor !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        var data = {};
        var sessionId = req.body.sessionId;
        var tokenOptions = {
            role: 'moderator'
        };
        var token;
        var fromName = req.body.fromName;
        var from = req.body.from;
        token = opentok.generateToken(sessionId, tokenOptions);
        data.apiKey = req.body.apiKey;
        data.sessionId = sessionId;
        data.token = token;
        data.fromName = !fromName ? 'Unknown' : fromName;

        var to = req.body.to;
        if (_.indexOf(sails.sockets.rooms(), to) != -1) {
            data.message = 'addDoctor';
            console.log(">>>>>>>>>>>>>>>>> Online <<<<<<<<<<<<<<");
            sails.sockets.broadcast(to, 'receiveMessage', data);
        } else {
            data.message = 'offline';
            console.log(">>>>>>>>>>>>>>>>> Offline <<<<<<<<<<<<<<");
            sails.sockets.broadcast(from, 'receiveMessage', data);
        }
    }
}
