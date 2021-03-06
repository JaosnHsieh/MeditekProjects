//
//  Define.swift
//  UrgentCare Work
//
//  Created by Meditek on 7/13/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//


import Foundation
import UIKit

class Define: NSObject {
    
    static let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
    static let versionBuild = "UIApplication.sharedApplication().versionBuild()"
    
    static let LogoutFunction = "LogoutFunction"
    
    struct keyNSDefaults {
        static let DeviceID = "deviceID"
        static let Appid = "appid"
        static let pastUrls = "pastUrls"
        static let UserUID = "UserUID"
        
        static let Authorization = "Authorization"
        static let userInfor = "userInfor"
        static let Cookie = "Cookie"
        static let userLogin = "userLogin"
        static let companyInfor = "companyInfor"
        static let UIDLogoutFail = "UIDLogoutFail"
        static let UID = "UID"
        static let RefreshCode = "refreshCode"
        static let IsCompanyAccount = "IsCompanyAccount"
        static let PatientUID = "PatientUID"
        static let TeleheathUserDetail = "TeleheathUserDetail"
        static let PhoneLogin = "PhoneLogin"
        static let TelehealthUserUID = "TelehealthUserUID"
        
        
        static let DeviceToken = "DeviceToken"
        static let DetailStaff = "DetailStaff"
        static let DetailStaffCheck = "DetailStaffCheck"
        static let DetailSite = "DetailSite"
        static let DetailSiteCheck = "DetailSiteCheck"
    }
    
    struct Redisite {
        static let templateUID_InjuryEFormUID = "e060e666-6c51-4a19-8523-708d9242a2c0"
        static let templateUID_GeneralEFormUID = "e81b4ec9-0442-4abf-a76f-b0808101c3f6"
    }
    
    struct MessageString {
        
        static let required = "Required"
        static let PleaseWait = "Please wait..."
        static let CallAnswer : String = "answer"
        static let CallEndCall : String = "end"
        static let Decline : String = "decline"
        static let Call : String = "call"
        static let Cancel : String = "cancel"
        static let VersionAndBuild : String = "© REDIMED 2015 \(UIApplication.sharedApplication().versionBuild()) – App Design by Meditek"
        static let QuestionCallPhone : String = "You want to contact us?"
        static let MessageLogout : String = "Do you want to logout the system?"
        static let StringHealthCare:String = "Personalised + Customised, HEALTHCARE anywhere"
        static let phoneNumberCallUs : String = "tel://0892300900"
        static let savedPictureMessage : String = "Your picture was saved to Camera Roll"
        static let placeHolderDescription : String = "Description of injury"
        
    }
    struct PushNotification{
        static let PushChangePassword = "PushChangePassword"
    }
    struct  forHTTPHeaderField {
        static let ContentType = "Content-type"
        static let Authorization = "Authorization"
        static let Cookie = "Cookie"
        static let DeviceId = "deviceId"
        static let UserUID = "UserUID"
        static let Appid = "appid"
        static let ApplicationJson = "application/json"
        static let IOS = "IOS"
        static let SystemType = "systemType"
        static let Requireupdatetoken = "requireupdatetoken"
    }
    
    enum UIUserInterfaceIdiom : Int
    {
        case Unspecified
        case Phone
        case Pad
    }
    struct imageName {
        static let RadioOnWhite = "RadioOnWhite.png"
        static let RadioOffGreen = "RadioOffGreen.png"
        static let StarWhite = "StarWhite.png"
        static let StarGreen = "StarGreen.png"
        static let CheckedGreen = "checked.png"
        static let UnCheckedGreen = "Uncheck.png"
        static let CheckedBox = "CheckedBox.png"
    }
    struct ScreenSize
    {
        static let SCREEN_WIDTH         = UIScreen.mainScreen().bounds.size.width
        static let SCREEN_HEIGHT        = UIScreen.mainScreen().bounds.size.height
        static let SCREEN_MAX_LENGTH    = max(ScreenSize.SCREEN_WIDTH, ScreenSize.SCREEN_HEIGHT)
        static let SCREEN_MIN_LENGTH    = min(ScreenSize.SCREEN_WIDTH, ScreenSize.SCREEN_HEIGHT)
        static var RATIO_WIDTH          = (DeviceType.IS_IPHONE_5 ? 1.0 : ScreenSize.SCREEN_WIDTH /  320)
        static var RATIO_HEIGHT         = (DeviceType.IS_IPHONE_5 ? 1.0 : ScreenSize.SCREEN_WIDTH /  568)
        static var FONT_SCALE_IPHONE6S  = (DeviceType.IS_IPHONE_6P ? 1.27 : (DeviceType.IS_IPHONE_6 ? 1.15 : 1))
    }
    
    struct DeviceType
    {
        static let IS_IPHONE_4_OR_LESS  = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH < 568.0
        static let IS_IPHONE_5          = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH == 568.0
        static let IS_IPHONE_6          = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH == 667.0
        static let IS_IPHONE_6P         = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH == 736.0
        static let IS_IPAD              = UIDevice.currentDevice().userInterfaceIdiom == .Pad && ScreenSize.SCREEN_MAX_LENGTH == 1024.0
    }
    
    struct Version{
        static let SYS_VERSION_FLOAT = (UIDevice.currentDevice().systemVersion as NSString).floatValue
        static let iOS7 = (Version.SYS_VERSION_FLOAT < 8.0 && Version.SYS_VERSION_FLOAT >= 7.0)
        static let iOS8 = (Version.SYS_VERSION_FLOAT >= 8.0 && Version.SYS_VERSION_FLOAT < 9.0)
        static let iOS9 = (Version.SYS_VERSION_FLOAT >= 9.0 && Version.SYS_VERSION_FLOAT < 10.0)
    }
    
    struct StringContant {
        static let prefixesPhoneNumber :String = "+61"
        static let RolesCompanyID :Int = 6
    }
    
    struct numberHashValue  {
        static let number0 : Int = 915
        static let number1 : Int = 918
        static let number2 : Int = 921
        static let number3 : Int = 924
        static let number4 : Int = 927
        static let number5 : Int = 930
        static let number6 : Int = 933
        static let number7 : Int = 936
        static let number8 : Int = 939
        static let number9 : Int = 942
        static let delete : Int = 0
    }
    
    struct Regex{
        //EX: 04 245 544 45 || 4 564 242 45
        static let PHONE_REGEX = "^0?4[0-9]{8}$"
        static let PhoneNumber = "[0-9]{6,10}$"
        static let MobileNumber = "^(\\+61|0061|0)?4[0-9]{8}$"
        static let Email = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}"
        static let PostCodeLength = "[0-9]{4,6}"
        static let PinNumber = "[0-9]{6}"
    }
    struct formatTime {
        static let dateTime : String = "yyyy-MM-dd HH:mm:ss"
        static let dateTimeZone : String = "yyyy-MM-dd'T'HH:mm:ss.000Z"
        
        static let formatDate : String = "dd/MM/yyyy"
        static let formatDateTime : String = "dd/MM/yyyy HH:mm"
        static let formatTime : String = "HH:mm"
        static let confirmDate : String = "eee, d MMM yyyy 'at' hh:mm a"
    }
    struct colorStatusAppointment{
        static let colorAttended = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
        static let colorWaitlist = "Waitlist"
        static let colorPending = "Pending"
        static let colorReceived = UIColor(red: 72/255, green: 191/255, blue: 226/255, alpha: 1.0)
        static let colorApproved = "Approved"
        static let colorFinished = "Finished"
    }
    struct statusAppointment {
        static let Attended : String = "Attended"
        static let Waitlist : String = "Waitlist"
        static let Pending : String = "Pending"
        static let Received : String = "Received"
        static let Cancelled : String = "Cancelled"
        static let Approved : String = "Approved"
        static let Finished : String = "Finished"
    }
    struct ColorCustom{
        static let colorCustomRed = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
        static let colorCustomBrow =  UIColor(red: 238/255, green: 238/255, blue: 238/255, alpha: 1.0)
        static let grayBack = "16204A"
        static let greenBoldColor = "118076"
        static let greenColor = "18A093"
        static let greenBoderColor = "979797"
        static let placehoderColor = "AAAAAA"
        
    }
    struct UrlAPISocket  {
        static let joinRoom : String = "/api/telehealth/socket/joinRoom?uid=%@"
        static let emit : String = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"
    }
    
}
struct DKOption {
    static let types: [DKImagePickerControllerAssetType] = [.AllAssets, .AllPhotos, .AllVideos, .AllAssets]
}

