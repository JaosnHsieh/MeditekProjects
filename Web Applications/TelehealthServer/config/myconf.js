var rootPath = process.cwd();
var gcm = require('node-gcm');
var telehealthApiKey = 'AIzaSyAo_sOEWtIEoNgGJxsdd8Fywkep-c5FbB0';
// var telehealthApiKey = 'AIzaSyBdHCijDr0RNRzYYjvImikY8ZmMWibiYkc';
var workinjuryApiKey = 'AIzaSyAg1tnh5akORy2ZhgJR2qZByHjS3F4G4fw';
var gcmTelehealth = new gcm.Sender(telehealthApiKey);
var gcmWorkInjury = new gcm.Sender(workinjuryApiKey);
module.exports.myconf = {
	//============ Twilio SMS Service Key=============
    twilioSID: 'AC7772e542a52ff56dcf0d13f95a99b154',
    twilioToken: '53f0c830cc61f052a5f238fd73f76321',
    twilioPhone: '+61439558227',
    //============ OpenTok Key =======================
    OpentokAPIKey: '45364382',
    OpentokAPISecret: 'eaacb0aba8fa68400314cb9b3316ca12a3dcbd86',
    //============ GCM Push Notification =============
    GCMWorkinjuryApiKey: workinjuryApiKey,
    GCMTelehealthApiKey: telehealthApiKey,
    GCMTelehealth: gcmTelehealth,
    GCMWorkInjury: gcmWorkInjury,
    TelehealthAppid: 'au.com.redimed.telehealth',
    WorkinjuryAppid: 'au.com.redimed.workinjury',
    //============ APN Push Notification DEV=============
    APNCert: rootPath + '/config/push_key/TelePushCert.pem',
    APNKey: rootPath + '/config/push_key/TelePushKey.pem',
    APNIsProduction: false,
    //============ APN Push Notification PRODUCTION=============
    // APNCert: rootPath + '/config/push_key/TelePushCert_Production.pem',
    // APNKey: rootPath + '/config/push_key/TelePushKey_Production.pem',
    // APNIsProduction: true,
    //============ URL ===============================
    // CoreAPI: 'http://testapp.redimed.com.au:3005',
    // AuthAPI: 'http://testapp.redimed.com.au:3006',
    // CoreAPI: 'http://telehealthvietnam.com.vn:3005',
    CoreAPI: 'http://localhost:3005',
    EformAPI: 'http://localhost:3015',
    // AuthAPI: 'http://telehealthvietnam.com.vn:3006'
    AuthAPI: 'http://localhost:3006'
};