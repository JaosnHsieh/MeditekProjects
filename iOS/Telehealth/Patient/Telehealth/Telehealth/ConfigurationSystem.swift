//
//  ConfigurationSystem.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/24/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

let config = ConfigurationSystem()
var savedData  = saveData()
let defaults = NSUserDefaults.standardUserDefaults()
var tokens = String()


class ConfigurationSystem: UIViewController {
    let Http = "http://192.168.1.130:3009"
    
    let deviceID = UIDevice.currentDevice().identifierForVendor?.UUIDString
    
    let headers = [
        "Authorization": "Bearer \(tokens)",
        "Content-Type": "application/x-www-form-urlencoded"
    ]
    //change border color textfield
    func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
    
    //Giap: Check input only number
    func validateInputOnlyNumber(value: Int) -> Bool {
        switch value {
        case numberHashValue.number0.rawValue :
            return true
        case numberHashValue.number1.rawValue :
            return true
        case numberHashValue.number2.rawValue :
            return true
        case numberHashValue.number3.rawValue :
            return true
        case numberHashValue.number4.rawValue :
            return true
        case numberHashValue.number5.rawValue :
            return true
        case numberHashValue.number6.rawValue :
            return true
        case numberHashValue.number7.rawValue :
            return true
        case numberHashValue.number8.rawValue :
            return true
        case numberHashValue.number9.rawValue :
            return true
        case numberHashValue.delete.rawValue :
            return true
        default:
            return false
        }
    }
    
    
}
//class handle get and set data
class saveData {
    var data: JSON = ""
    init(){}
    init(data:JSON){
        self.data = data
    }
}


//Extension Handle
extension String
{
    //Format date time
    func toDateTime() -> String
    {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"//this your string date format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let date = dateFormatter.dateFromString(self)
        
        dateFormatter.dateFormat = "yyyy-MM-dd"///this is you want to convert format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let timeStamp = dateFormatter.stringFromDate(date!)
        //Return Parsed Date
        return String(timeStamp)
    }
}