//
//  ConfigurationSystem.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/24/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
import Alamofire


var config  = ConfigurationSystem()
var savedData  = CallContainer()
let defaults = NSUserDefaults.standardUserDefaults()
var tokens :String = String()
var userUID :String = String()
var cookies :String = String()
let manager = Alamofire.Manager.sharedInstance

struct ConfigurationSystem {
    static let http :String = Constants.Path.SERVICE_URL
    static let Http_3009 :String = "\(http):3009"
    static let Http_3005 :String =  "\(http):3005"
    static let Http_3006 :String =  "\(http):3006"
    
    //
    static let uploadfileID = "2d0626f3-e741-11e5-8fab-0050569f3a15"
    //
    
    var headers = [
        "Authorization": "Bearer \(tokens)",
        "Version" : "1.0",
        "systemtype": "IOS",
        "deviceId" : "",
        "useruid":"\(userUID ?? "")",
        "Cookie": cookies as String,
        "appid":UIApplication.sharedApplication().bundleID()
        ]
}






