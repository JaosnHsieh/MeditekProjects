//
//  RequestFactory.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import ObjectMapper

class RequestFactory {
    
    class func get(url:String, completion: Response <AnyObject, NSError> -> Void )-> Request {
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        print("url",url)
        request.HTTPMethod = "GET"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Authorization)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Cookie)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.DeviceId)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in
            Completion(request,response:response ){
                response in completion(response)
                print(response.response?.allHeaderFields)
            }
        }
        return alamofireRequest
    }
    
    class func post(url:String, model:BaseModel, completion: Response <AnyObject, NSError> -> Void)-> Request {
        
        let jsonString = Mapper().toJSONString(model, prettyPrint: true)
        print("url",url)
        print("jsonString",jsonString)
    
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        
        request.HTTPMethod = "POST"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Authorization)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Cookie)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.DeviceId)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        print(request.allHTTPHeaderFields)
        let alamofireRequest = Alamofire.request(request)
        
        
        alamofireRequest.responseJSON{response in
            Completion(request,response:response ){
                response in completion(response)
            }
        }
        return alamofireRequest
    }
    
    class func postRequestAppoint(url:String, model:BaseModel, completion: Response <AnyObject, NSError> -> Void)-> Request {
        
        let jsonString = Mapper().toJSONString(model, prettyPrint: true)
        print("url",url)
        print("jsonString",jsonString)
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        
        request.HTTPMethod = "POST"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        
        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        print(request.allHTTPHeaderFields)
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in
            Completion(request,response:response ){
                response in completion(response)
            }
        }
        return alamofireRequest
    }
    
    class func Completion(request:NSMutableURLRequest,response:Response <AnyObject, NSError>,completion: Response <AnyObject, NSError> -> Void) {
        if let requireupdatetoken = response.response?.allHeaderFields[Define.forHTTPHeaderField.Requireupdatetoken] {
            let refreshCode = RefreshCode()
            if(requireupdatetoken as! String == "true"){
                postGetNewToken(refreshCode) { response in
                    if let refreshCodeResponse = Mapper<RefreshCodeResponse>().map(response.result.value) {
                        Context.setDataDefaults(refreshCodeResponse.refreshCode, key: Define.keyNSDefaults.RefreshCode)
                        let token =  "Bearer \(refreshCodeResponse.token)"
                        Context.setDataDefaults(token, key: Define.keyNSDefaults.Authorization)
                        let alamofireRequest = Alamofire.request(request)
                        alamofireRequest.responseJSON{response in
                            print(response.response?.allHeaderFields)
                            completion(response)
                        }
                    }
                }
            }else{
                print(response.response?.allHeaderFields)
                completion(response)
            }
        }else{
            print(response.response?.allHeaderFields)
            completion(response)
        }
    }
    
    class func postGetNewToken(model:BaseModel,completion: Response <AnyObject, NSError> -> Void) {
        
        let jsonString = Mapper().toJSONString(model, prettyPrint: true)
        let request = NSMutableURLRequest(URL: NSURL(string: Constants.UserURL.GET_NEW_TOKEN)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        print("jsonString",jsonString)
        request.HTTPMethod = "POST"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Authorization)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Cookie)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.DeviceId)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        
        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in
            completion(response)
        }
        
    }
}

