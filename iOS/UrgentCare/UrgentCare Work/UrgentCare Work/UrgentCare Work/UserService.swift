//
//  UserService.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire

class UserService {
    class func postLogin(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.User.URL_POST_LOGIN, model: model, completion: completion)
    }
}