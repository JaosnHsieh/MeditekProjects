//
//  Context.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import Foundation
import SystemConfiguration
var cookies :String = String()
import UIKit
import ObjectMapper

struct FAIcon {
    static let volume_off : String = "\u{f026}"
    static let volume_up : String = "\u{f028}"
    static let pause : String = "\u{f04c}"
    static let play : String = "\u{f04b}"
    static let fa_close : String = "\u{f00d}"
    static let microphone_on : String = "\u{f130}"
    static let microphone_off : String = "\u{f131}"
    
}
class Context {
    static var headers = [String:String]()
    class func setValueHeader( value: String, header: String ) {
        headers[header] = value
    }
    class func getTokenHeader() -> [String : String]{
        if (NSUserDefaults.standardUserDefaults().objectForKey("token") == nil){
            return ["x-access-token" : ""]
        }
        return["x-access-token" : (NSUserDefaults.standardUserDefaults().objectForKey("token") as! String),]
        
    }
    
    class func getHeader()->[String: String] {
        let defaults = NSUserDefaults.standardUserDefaults()
        let deviceId = defaults.valueForKey("deviceID") as? String
        let headers: [String: String] = [
            "content-type" : "application/json",
            "systemtype" : "IOS",
            "Cookie" : "",
            "deviceID": deviceId!,
            "appid": NSBundle.mainBundle().bundleIdentifier!
        ]
        return headers
    }
    
    class func getErrorMessage(ErrorType:String)->String {
        var message :String = ""
        if(ErrorType == "User.notFound"){
            message = "User Not Found !"
        }else if(ErrorType == "Password.Invalid"){
            message = "Password Invalid !"
        }else if(ErrorType == "DetailCompanyByUser.error"){
            message = "Detail Company By User Error"
        }else if(ErrorType == "UserActivation.Error"){
            message = "User Is Not Exist"
        }else if(ErrorType == "Activation.Error"){
            message = "Activation Code Invalid"
        }else if(ErrorType == "PinNumber.Invalid"){
            message = "Pin Number Invalid"
        }else if(ErrorType == "PinNumber.Expired"){
            message = "Pin Number Expired"
        }else if(ErrorType == "NotRegistered"){
            message = "Not Registered "
        }else if(ErrorType == "GetListStaff.error"){
            message = "User is Not Admin"
        }else if(ErrorType == "Policies.isAuthenticated.Error" ){
            if (Context.getDataDefasults(Define.keyNSDefaults.userLogin) as! String != "") {
                NSNotificationCenter.defaultCenter().postNotificationName(Define.LogoutFunction, object: self)
                message = "Please login again !"
            }else{
                message = ""
            }
        }else if (ErrorType == "Authentication Error - invalid username"){
            message = "Authentication Error - invalid username"
        }else if (ErrorType == "Telehealth.UpdatePinNumber.Error"){
            message = "Invalid Params"
        }else if (ErrorType == "Missing credentials"){
            message = "Missing credentials"
        }else if(ErrorType == "connect ECONNREFUSED"){
            message = "Connect ECONNREFUSED"
        }
        return message
    }
    
    class func getAppID() -> String {
        //let appid =  NSBundle.mainBundle().bundleIdentifier!
        let appid = "au.com.redimed.workinjury"
        return appid
    }
    
    class func setDataDefaults(data :AnyObject, key:String) {
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.setObject(data, forKey: key)
        defaults.synchronize()
    }
    
    class func deleteDatDefaults(key:String) -> Void {
        let preferences = NSUserDefaults.standardUserDefaults()
        preferences.removeObjectForKey(key)
        preferences.synchronize()
    }
    
    class func getDataDefasults(key:String)->AnyObject{
        if (NSUserDefaults.standardUserDefaults().objectForKey(key) == nil){
            return ""
        }
        return NSUserDefaults.standardUserDefaults().objectForKey(key)! as AnyObject
    }
    
    class func NowDate()->String{
        let nowdate = NSDate()
        var DateString:String = ""
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss Z"
        DateString = dateFormatter.stringFromDate(nowdate)
        return DateString
    }
    
    class func isConnectedToNetwork() -> Bool {
        
        var zeroAddress = sockaddr_in()
        zeroAddress.sin_len = UInt8(sizeofValue(zeroAddress))
        zeroAddress.sin_family = sa_family_t(AF_INET)
        let defaultRouteReachability = withUnsafePointer(&zeroAddress) {
            SCNetworkReachabilityCreateWithAddress(nil, UnsafePointer($0))
        }
        var flags = SCNetworkReachabilityFlags()
        if !SCNetworkReachabilityGetFlags(defaultRouteReachability!, &flags) {
            return false
        }
        let isReachable = (flags.rawValue & UInt32(kSCNetworkFlagsReachable)) != 0
        let needsConnection = (flags.rawValue & UInt32(kSCNetworkFlagsConnectionRequired)) != 0
        return (isReachable && !needsConnection)
    }
    
    //Check date
    class func compareDate(dateDOB:NSDate)->Bool {
        let now = NSDate()
        if now.compare(dateDOB) == NSComparisonResult.OrderedDescending
        {
            return true
        } else
        {
            return false
        }
    }
    
    //check validate
    class func CheckRegex(value: String,regex:String) -> Bool {
        let CheckRegex = NSPredicate(format: "SELF MATCHES %@", regex)
        let result =  CheckRegex.evaluateWithObject(value)
        
        return result
        
    }
    class func checkMaxLength(textField:UITextField,length:Int)->Bool{
        if textField.text?.characters.count > length {
            return false
        }else{
            return true
        }
    }
    class func validateRegex(value: String,regex:String) -> Bool {
        
        let REGEX = regex
        
        let checkRegex = NSPredicate(format: "SELF MATCHES %@", REGEX)
        
        let result =  checkRegex.evaluateWithObject(value)
        
        return result
    }
    class func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
    
    class func validateInputOnlyNumber(value: Int) -> Bool {
        switch value {
        case Define.numberHashValue.number0 :
            return true
        case Define.numberHashValue.number1 :
            return true
        case Define.numberHashValue.number2 :
            return true
        case Define.numberHashValue.number3 :
            return true
        case Define.numberHashValue.number4 :
            return true
        case Define.numberHashValue.number5 :
            return true
        case Define.numberHashValue.number6 :
            return true
        case Define.numberHashValue.number7 :
            return true
        case Define.numberHashValue.number8 :
            return true
        case Define.numberHashValue.number9 :
            return true
        case Define.numberHashValue.delete :
            return true
        default:
            return false
        }
    }
    class func EformtData(value:String,name:String,ref:String,type:String,checked:String,refRow:String)-> EformData{
        let eformData = EformData()
        
        eformData.name = name
        eformData.value = value
        eformData.ref = ref
        eformData.type = type
        eformData.checked = checked
        eformData.refRow = refRow
        
        return eformData
    }
    
    class func RadioGetData(selectData :String,title:[[String]]){
        for (_,row) in title.enumerate(){
            if(selectData == row[0]){
                for general in AllRedisiteData.general {
                    if(general.ref == row[1]){
                        general.checked = "true"
                    }
                }
            }else{
                for general in AllRedisiteData.general {
                    if(general.ref == row[1]){
                        general.checked = "false"
                    }
                }
            }
        }
    }
    class func searchAutocompleteEntriesWithSubstring(substring: String , pastUrls:[String])->[String]
    {
        let dataSource = pastUrls
        var autocompleteUrls = [String]()
        let searchString = substring.uppercaseString
        let predicate = NSPredicate(format: "SELF beginswith[c] %@", searchString)
        let searchDataSource = dataSource.filter { predicate.evaluateWithObject($0) }
        autocompleteUrls = searchDataSource
        return autocompleteUrls
    }
    class func getEndDateOfMonth(month: NSInteger, year: NSInteger) -> NSDate? {
        let components = NSDateComponents()
        components.month = month
        components.year = year
        
        let gregorian = NSCalendar(calendarIdentifier: NSCalendarIdentifierGregorian)
        
        return gregorian!.dateFromComponents(components)
    }
    
    class func GetOrientationDevice()->String{
        var orientation = ""
        switch UIDevice.currentDevice().orientation{
        case .Portrait:
            orientation = "Portrait"
        case .PortraitUpsideDown:
            orientation = "PortraitUpsideDown"
        case .LandscapeLeft:
            orientation = "LandscapeLeft"
        case .LandscapeRight:
            orientation = "LandscapeRight"
        default:
            orientation = "Another"
        }
        return orientation
    }
}
