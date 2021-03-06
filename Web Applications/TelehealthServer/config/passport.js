var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    moment = require('moment');
passport.serializeUser(function(sessionUser, done) {
    done(null, sessionUser);
});
passport.deserializeUser(function(sessionUser, done) {
    done(null, sessionUser);
});
// passport.use(new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback: true
// }, function(req, u, p, done) {
//     var deviceId = req.headers.deviceid;
//     var deviceType = req.headers.systemtype;
//     var appid = req.headers.appid;
//     var activationInfo = null;
//     if (req.body.activationInfo) activationInfo = req.body.activationInfo;
//     var requestBody = {
//         'UserName': u,
//         'Password': p,
//         'UserUID': !activationInfo ? null : activationInfo.userUID,
//         'DeviceID': !activationInfo ? null : deviceId,
//         'VerificationToken': !activationInfo ? null : activationInfo.verifyCode,
//         'AppID': appid
//     }
//     TelehealthService.MakeRequest({
//         path: '/api/login',
//         method: 'POST',
//         body: requestBody,
//         headers: {
//             'DeviceID': deviceId,
//             'SystemType': HelperService.const.systemType[deviceType.toLowerCase()],
//             'AppID': appid
//         }
//     }).then(function(response) {
//         var data = response.getBody();
//         var user = data.user;
//         TelehealthUser.findOrCreate({
//             where: {
//                 UserAccountID: user.ID
//             },
//             defaults: {
//                 UID: UUIDService.GenerateUUID()
//             }
//         }).spread(function(teleUser, created) {
//             user.TeleUID = teleUser.UID;
//             if (activationInfo) user.PatientUID = activationInfo.patientUID;
//             user.SystemType = HelperService.const.systemType[deviceType.toLowerCase()];
//             user.DeviceID = deviceId;
//             data.user = user;
//             RefreshToken.find({
//                 where: {
//                     UserAccountID: user.ID,
//                     SystemType: HelperService.const.systemType[deviceType.toLowerCase()],
//                     DeviceID: deviceId
//                 }
//             }).then(function(refreshToken) {
//                 if (refreshToken) {
//                     var secretExpiredPlusAt = null;
//                     if (HelperService.checkListData(refreshToken.SecretExpired, refreshToken.SecretExpiredPlus)) secretExpiredPlusAt = moment(refreshToken.SecretCreatedAt).add(refreshToken.SecretExpired + refreshToken.SecretExpiredPlus, 'seconds').toDate();
//                     var sessionUser = {
//                         ID: user.ID,
//                         UID: user.UID,
//                         Activated: user.Activated,
//                         roles: user.roles,
//                         SystemType: HelperService.const.systemType[deviceType.toLowerCase()],
//                         DeviceID: deviceId,
//                         SecretKey: refreshToken.SecretKey,
//                         SecretCreatedAt: refreshToken.SecretCreatedAt,
//                         SecretExpired: refreshToken.SecretExpired,
//                         SecretExpiredPlus: refreshToken.SecretExpiredPlus,
//                         SecretExpiredPlusAt: secretExpiredPlusAt,
//                         AppID: refreshToken.AppID
//                     }
//                     data.sessionUser = sessionUser;
//                     return done(null, data, response.getBody().message);
//                 } else return done(null, false, {
//                     message: 'Error'
//                 })
//             }).catch(function(err) {
//                 return done(err);
//             })
//         }).catch(function(err) {
//             return done(err);
//         })
//     }).catch(function(err) {
//         return done(null, false, err.getBody());
//     })
// }));