//
//  VerifyPhoneNumberController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON


class VerifyPhoneNumberController {
    

    
    func GetDataAPI (url:String,completionHandler: (JSON) -> Void)  {
        
        Alamofire.request(.GET, url)
            .responseJSON { response in
                completionHandler(JSON(response.2.value!) )
                
        }
        
    }
    //Giap: Check phone number and send verify code
    func SendVerifyPhoneNumber (deviceID:String,var phoneNumber:String,completionHandler:(JSON) -> Void){
        //Split number 0
        let removedChar = phoneNumber.removeAtIndex(phoneNumber.startIndex)
       
        let parameters = [
            "data": [
//                "phone":"+61"+phoneNumber,
                "phone":"+841654901590",
                "deviceId":deviceID,
                "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlAPICheckPhoneNumber.SendVerifyCodePhoneNumber , parameters: parameters).responseJSON{
            request, response, result  in
            switch result {
            case .Success(let JSONData):
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":"Request Time Out"]))
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }

    }
    //Giap: Check verify code
    func CheckVerifyPhoneNumber (verifyCode:String,deviceID:String,completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                "code":verifyCode,
                "deviceId":deviceID,
                "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlAPICheckPhoneNumber.CheckVerifyCode , parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":"Request Time Out"]))
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }

            
        }
    }
    //Giap: Get information Patient by UID
    func getInformationPatientByUUID(UUID:String,completionHandler:(JSON) -> Void){
        print("UID GET:\(config.headers)")
        let parameters = [
            "data": [
                "uid" : UUID
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlInformationPatient.getInformationPatientByUID ,headers:config.headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):

                completionHandler(JSON(JSONData))
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":"Request Time Out"]))
                
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }

        }
        
     
        
 
    }
    
}


