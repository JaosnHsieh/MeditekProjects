//
//  Contants.swift
//  VgoUserApp
//
//  Created by admin on 07/02/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import Foundation


struct Constants {
    struct Path {
        static let SERVICE_URL_3006                              = "https://testapp.redimed.com.au:3006"
        static let SERVICE_URL_3005                              = "https://testapp.redimed.com.au:3005"
        static let SERVICE_URL_3009                              = "https://testapp.redimed.com.au:3009"
    }
    
    struct UserURL {
        static let URL_POST_LOGIN                                = Path.SERVICE_URL_3006 + "/api/login";
        static let URL_POST_REQUEST_VERIFY                       = Path.SERVICE_URL_3009 + "/api/telehealth/user/requestActivationCode";
        static let URL_GET_DETAIL_COMPANY_BY_USER                = Path.SERVICE_URL_3005 + "/api/company/detail-company-by-user";
        static let URL_POST_CHECKVERIFY_CODE                     = Path.SERVICE_URL_3009 + "/api/telehealth/user/verifyActivationCode"
        static let URL_GET_GETINFORMATION_PATIENT                = Path.SERVICE_URL_3009 + "/api/telehealth/user/details"
        static let URL_POST_LOGOUT                               = Path.SERVICE_URL_3009 + "/api/telehealth/user/logout"
        static let URL_GET_LIST_STAFF                            = Path.SERVICE_URL_3005 + "/api/company/get-list-staff"
    }
    
    struct StringContant {
        static let prefixesPhoneNumber :String = "+61"
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
    }
}