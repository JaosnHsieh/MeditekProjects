//
//  PatientAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/13/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON
class PatientAPI:TokenAPI {
    //Giap: Get information Patient by UID
    func getInformationPatientByUUID(UUID:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        print(config.headers)
        if(UIApplication.sharedApplication().isConnectedToNetwork()){
            Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getInformationPatientByUID + UUID,headers:config.headers).responseJSON{
                response in
                print(response)
                switch response.result {
                case .Success(let JSONData):
                    if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                        if requireupdatetoken as! String == "true" {
                            print("Update token",requireupdatetoken)
                            self.getNewToken()
                        }
                    }
                    let data = JSON(JSONData)
                    print(data["ErrorsList"])
                    if(data["ErrorsList"][0] == "isAuthenticated.notAuthenticated"){
                        self.getNewToken()
                    }else if(data["ErrorsList"][0] == "isAuthenticated.invalidRefreshCode"){
                        self.getNewToken()
                    }
                    completionHandler(data)
                case .Failure(let error):
                    print("Request failed with error: \(error)")
                    completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                    
                }
            }
        }else{
            completionHandler(JSON(["internetConnection":ErrorMessage.internetConnection]))
        }
    }
    
    func updateInfomationPatient(parameter:[String : Dictionary<String, String!>],completionHandler:(JSON) -> Void){
        config.setHeader()
        if(UIApplication.sharedApplication().isConnectedToNetwork()){
            Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.updateProfile,parameters: parameter,headers:config.headers,encoding: .JSON).responseJSON{
                response in
                
                switch response.result {
                case .Success(let JSONData):
                    if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                        if requireupdatetoken as! String == "true" {
                            print("Update token",requireupdatetoken)
                            self.getNewToken()
                        }
                    }
                    let data = JSON(JSONData)
                    
                    completionHandler(data)
                case .Failure(let error):
                    print("Request failed with error: \(error)")
                    completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                    
                }
            }
        }else{
            completionHandler(JSON(["internetConnection":ErrorMessage.internetConnection]))
        }
        
    }
    
    func updateAvarta(parameter:[String : Dictionary<String, String>],completionHandler:(JSON) -> Void){
        config.setHeader()
        if(UIApplication.sharedApplication().isConnectedToNetwork()){
            Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.updateAvatar,parameters: parameter,headers:config.headers,encoding: .JSON).responseJSON{
                response in
                
                switch response.result {
                case .Success(let JSONData):
                    if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                        if requireupdatetoken as! String == "true" {
                            print("Update token",requireupdatetoken)
                            self.getNewToken()
                        }
                    }
                    let data = JSON(JSONData)
                    
                    completionHandler(data)
                case .Failure(let error):
                    print("Request failed with error: \(error)")
                    completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                    
                }
            }
        }else{
            completionHandler(JSON(["internetConnection":ErrorMessage.internetConnection]))
        }
        
    }
    
}