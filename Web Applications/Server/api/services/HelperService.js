/*
check data request
input: request from client
output: false: if data miss or parse failed
        data: if exist data and parse success
*/

/**
 * Kiem tra xem bien hop le hay khong
 */
function checkData(value) {
    var result=true;
    if(value===undefined || value===null || value==='')
    {
        result=false;
    }
    else if(_.isObject(value) && _.isEmpty(value)){
        result=false;
    }
    return result;
}

/**
 * Kiem tra danh sach data truyen vao hop le hay kkhong
 */
function checkListData() {
    var result=true;
    for (var i = 0; i < arguments.length; i++) {
        if(arguments[i] === undefined || arguments[i] === null || arguments[i] === '')
        {
            result=false;
        }
        else if(_.isObject(arguments[i]) && _.isEmpty(arguments[i]))
        {   
            result=false;
        }
        if(result===false)
        {
            console.log(">>>>>>>> Vi tri data truyen den bi loi:", i);
            break;
        }
    }
    return result;
}

function exlog() {
    console.log("\n\nBEGIN REDIMED LOG-------------------------------");
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
    console.log("END REDIMED LOG---------------------------------\n\n");
}

function exFileJSON(data, fileName) {

    var file = './temp/' + fileName;
    var obj = {
        name: 'JP'
    }

    jf.writeFile(file, data, function(err) {
        console.log(err);
    })
}

module.exports = {
    CheckPostRequest: function(request) {
        var data;
        if (!_.isUndefined(request) &&
            !_.isUndefined(request.body) &&
            !_.isUndefined(request.body.data)) {
            data = request.body.data;
            if (!_.isObject(data)) {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    console.log(err);
                    return false;
                }
            }
            return data;
        } else {
            return false;
        }
    },

    CheckExistData: function(data) {
        return (!_.isUndefined(data) && !_.isEmpty(data) && !_.isNull(data));
    },

    //define regex pattern
    regexPattern: {
        //emailPattern example :
        //  mysite@ourearth.com
        //  my.ownsite@ourearth.org
        //  mysite@you.me.net
        //reference from: http://www.w3resource.com/javascript/form/email-validation.php
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        date: /^(\d{4})-(\d{1,2})-(\d{1,2})$/,

        //fullPhonePattern example:
        //  (+351) 282 43 50 50
        //  90191919908
        //  555-8909
        //  001 6867684
        //  001 6867684x1
        //  1 (234) 567-8901
        //  1-234-567-8901 x1234
        //  1-234-567-8901 ext1234
        //  1-234 567.89/01 ext.1234
        //  1(234)5678901x1234
        //  (123)8575973
        //  (0055)(123)8575973
        //reference from: http://stackoverflow.com/questions/14639973/javascript-regex-what-to-use-to-validate-a-phone-number

        //international phone number
        fullPhoneNumber: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,

        //autralian phone number
        auPhoneNumber: /^(\+61|0061|0)?4[0-9]{8}$/,

        //except (,),whitespace,- in phone number
        phoneExceptChars: /[\(\)\s\-]/g,

        //autralian home phone number
        auHomePhoneNumber: /^[1-9]{9}$/
    },

    checkData: checkData,

    checkListData: checkListData,

    const: {
        systemType: {
            ios: 'IOS',
            website: 'WEB',
            android: 'ARD'
        },

        roles: {
            admin: 1,
            assistant: 2,
            doctor: 3,
            gp: 4,
            patient: 5
        }
    },

    exlog: exlog,

    exFileJSON: exFileJSON,

    /**
     * copyAttrsValue: 
     * So sánh 2 object destination và source, nếu 2 object có attribute nào trùng nhau
     * thì copy giá trị attribute từ source vào destination
     */
    copyAttrsValue:function(destination,source)
    {
        if(_.isObject(destination))
        {
            if(_.isObject(source) && !_.isEmpty(source))
            {
                for (var key in destination)
                {
                    if(source[key])
                    {
                        destination[key]=source[key];
                    }
                }
            }
        }
        else
        {
            destination={};
        }
        
        return destination;
    },


    /**
     * cleanObject: xóa những thuộc tính nào có giá trị là null, undefined, '' 
     * hoặc giá trị là object rỗng {}
     */
    cleanObject:function(obj)
    {
        if(_.isObject(obj))
        {
            for (var key in obj)
            {
                if(!checkData(obj[key]))
                {
                    delete obj[key];
                }
            }
        }
        else
        {
            obj={};
        }
        return obj;
    },

    /**
     * rationalizeObject:
     * Hợp lệ hóa destination object bằng source object
     * Nếu destination có attributes mà source cũng có thì copy giá trị attributes từ source qua
     * Nếu destination có attributes mà source không có thì xóa attributes đó của destination
     */
    rationalizeObject:function(destination,source)
    {
        if(_.isObject(destination))
        {
            if(_.isObject(source) && !_.isEmpty(source))
            {
                for (var key in destination)
                {
                    if(!source.hasOwnProperty(key))
                    {
                        delete destination[key];
                    }
                }
            }
        }
        else
        {
            destination={};
        }
        
        return destination;
    },


    /**
     * Kiểm tra các attributes của object có giá trị bằng một trong các giá trị trong mảng corrects
     * hay không
     */
    checkCorrectValues:function(obj,corrects)
    {
        var result=true;
        if(_.isObject(obj) && _.keys(obj).length>0)
        {
            for (var key in obj)
            {
                var t=false;
                for (var i=0;i<corrects.length;i++)
                {
                    if(obj[key]==corrects[i]) t=true;
                }
                if(t==false)
                {
                    result=false;
                    break;
                }
            }
            return result;
        }
        else
        {
            result=false;
            return result;
        }
        
    },

    /**
     * Kiểm tra value có nằm trong mảng list hay không
     * có: trả về true
     * 
     */
    existIn:function(value,list)
    {
        var result=false;
        if(_.isArray(list) && list.length>0)
        {
            for (var i=0;i<list.length;i++)
            {
                if(value===list[i]) 
                {
                    result=true;
                    break;
                }   
            }
        }
        return result;  
    }

}
