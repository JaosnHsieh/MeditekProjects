var https = require('http');
module.exports = {

    postData: function(req, res) {
        var postData = req.body.data;
        var check="";
        var modelName =[];
        Services.Paperless.Check(postData,check,modelName);
        for(var i = 0; i < modelName.length; i++) {
            modelName[i].ModelName = modelName[i].ModelName.substr(1,modelName[i].ModelName.length);
        }
        var objparse = {};
        for(var i = 0; i < modelName.length; i++) {
            objparse = Services.Paperless.parseObj(objparse,modelName[i].ModelName);
        }
        res.ok(objparse);
        
    },

    insertTemplate : function(req, res) {
        var data = req.body.data;
        console.log(data);
        // res.ok({data:data});
        Services.Paperless.insertTemplate(data)
        .then(function(success){
            res.ok({message:"success"});
        })
        .catch(function(err){
            res.serverError(ErrorWrap(err));
        });
    },

    getTemplate : function(req, res) {
        var data = req.body.data;
        Services.Paperless.getTemplate(data)
        .then(function(result){
            // res.ok(result);
            var objparse = {};
            var sectionNames = {};
            for(var i = 0; i < result.EFormSectionTemplate.length; i++) {
                objparse[result.EFormSectionTemplate[i].Name] = {};
            }
            for(var i = 0; i < result.EFormLineTemplate.length; i++) {
                objparse = Services.Paperless.parseObj(objparse,result.EFormLineTemplate[i].Name, result.EFormLineTemplate[i].Value);
            }
            for(var i = 0; i < result.EFormQuestionTemplate.length; i++) {
                for(var j = 0; j < result.EFormSectionTemplate.length; j++) {
                    if(result.EFormQuestionTemplate[i].EFormSectionTemplateID == result.EFormSectionTemplate[j].ID)
                        result.EFormQuestionTemplate[i].dataValues.SectionName = result.EFormSectionTemplate[j].Name;
                }
            }
            for(var i = 0; i < result.EFormSectionTemplate.length; i++) {
                var lastChar = result.EFormSectionTemplate[i].Name.substr(result.EFormSectionTemplate[i].Name.length - 1);
                sectionNames['sectionName'+lastChar] = result.EFormSectionTemplate[i].Description;
            }
            console.log("------------------------------- day ne ",sectionNames);
            // res.ok({data:result.EFormQuestionTemplate});
            res.ok({data:{
                Name           : result.EFormTemplate[0].Name,
                EFormID        : result.EFormID,
                DetailTemplate : objparse,
                ListQuestion   : result.EFormQuestionTemplate,
                sectionNames   : sectionNames,
                section        : result.EFormSectionTemplate.length,
                question       : result.EFormQuestionTemplate.length
            },message:"success"});
        })
        .catch(function(err){
            res.serverError(ErrorWrap(err));
        })
    },

    insertData : function(req, res) {
        var data = req.body.data;
        console.log("--------------------------------- ",data.PatientDetails);
        var EFormID;
        var tempstring="";
        var modelName =[];
        Services.Paperless.Check(data.data,tempstring,modelName);
        return sequelize.transaction()
        .then(function(t){
            return EForm.create({
                UID : UUIDService.Create(),
                EFormTemplateID: data.EFormUID,
                Name : data.Name,
                // Name: chua co
                CreatedBy : data.PatientDetails.patientInfo.ID
            },{transaction:t})
            .then(function(created_EForm){
                EFormID = created_EForm.ID;
                for(var i = 0; i < modelName.length; i++) {
                    modelName[i].Name = modelName[i].Name.substr(1,modelName[i].Name.length);
                    modelName[i].UID = UUIDService.Create();
                    modelName[i].EFormID = created_EForm.ID;
                }
                return EFormData.bulkCreate(modelName,{transaction:t,individualHooks:true});
            },function(err){
                t.rollback();
                return res.serverError(ErrorWrap(err));
            })
            .then(function(success){
               if(data.apptuid != undefined && data.apptuid != null && data.apptuid != ""){
                    return Appointment.findOne({
                        where:{
                            UID : data.apptuid
                        },
                        transaction : t
                    });
               }
                // t.commit();
                else{
                    return success;
                }
            },function(err) {
                t.rollback();
                return res.serverError(ErrorWrap(err));
            })
            .then(function(select_Appt){
                if(data.apptuid != undefined && data.apptuid != null && data.apptuid != ""){
                    if(select_Appt == null || select_Appt == "" || select_Appt.length == 0){
                        var err = new Error("insertData.Error");
                        err.pushError("notFound.Appointment");
                        t.rollback();
                        return res.serverError(ErrorWrap(err));
                    }
                    else {
                        console.log(select_Appt);
                        return RelEFormAppointment.create({
                            EFormID       : EFormID,
                            AppointmentID : select_Appt.ID
                        },{transaction:t});
                    }
                }
                else {
                    return select_Appt;
                }
            },function(err){
                t.rollback();
                return res.serverError(ErrorWrap(err));
            })
            .then(function(finish){
                if(data.apptuid != undefined && data.apptuid != null && data.apptuid != ""){
                    if(finish != null && finish != "" && finish.length != 0){
                        t.commit();
                        return res.ok({message:"success"});
                    }
                    else {
                        t.rollback();
                        var err = new Error("insertData.Error");
                        err.pushError("insertData.RelEFormAppointment.queryError");
                        return res.serverError(ErrorWrap(err));
                    }
                }
                else {
                    t.commit();
                    return res.ok({message:"success"});
                }
            },function(err){
                t.rollback();
                return res.serverError(ErrorWrap(err));
            });
        },function(err){
            return res.serverError(ErrorWrap(err));
        });
    },

    getData : function(req, res) {
        var data = req.body.data;
        if(!('UID' in data) || data.UID == null || data.UID == ""){
            var err = new Error("getData.Error");
            err.pushError("Params.Required");
            res.serverError(ErrorWrap(err));
        }
        else {
            return sequelize.transaction()
            .then(function(t){
                return EForm.findAll({
                    where:{
                        UID : data.UID
                    },
                    transaction : t
                })
                .then(function(got_EForm){
                    if(got_EForm == null || got_EForm == "" || got_EForm.length == 0){
                        var err = new Error("getData.Error");
                        err.pushError("EForm.NotFound");
                        return res.serverError(ErrorWrap(err));
                    }
                    else {
                        if(!('ID' in got_EForm[0])){
                            return got_EForm;
                        }
                        else{
                            return EFormData.findAll({
                                where : {
                                    EFormID : got_EForm[0].ID
                                },
                                transaction : t
                            });
                        }
                    }
                },function(err){
                    t.rollback();
                    return res.serverError(ErrorWrap(err));
                })
                .then(function(success){
                    if(success == null || success == "" || success.length == 0){
                        t.commit();
                        return res.ok({data:[],message:"success"});
                    }
                    else {
                        if(!('ID' in success[0])){
                            t.rollback();
                            return res.serverError(ErrorWrap(err));
                        }
                        else{
                            t.commit();
                            var objparse = {};
                            for(var i = 0; i < success.length; i++) {
                                objparse = Services.Paperless.parseObj(objparse,success[i].Name, success[i].Value);
                            }
                            return res.ok({data:objparse,message:"success"});
                        }
                    }
                    
                },function(err){
                    t.rollback();
                    return res.serverError(ErrorWrap(err));
                })
            });
        }
    },

    listEFormsAppointment : function(req, res) {
        var data = req.body.data;
        if(data == null || data == "" || data.UID == null || data.UID == ""){
            var err = new Error("listEFormsAppointment.Error");
            err.pushError("invalid.Params");
            res.serverError(ErrorWrap(err));
        }
        else {
            Services.Paperless.listEFormsAppointment(data)
            .then(function(result){
                res.ok({data:result.data,count:result.count,message:"success"});
            })
            .catch(function(err){
                res.serverError(ErrorWrap(err));
            });
        }

    },

    listTemplate : function(req, res) {
        var data = req.body.data;
        Services.Paperless.listTemplate(data)
        .then(function(result){
            if(result == null || result == "" || result.length == 0){
                var err = new Error("listTemplate.Error");
                err.pushError("notFound.Template");
                res.serverError(ErrorWrap(err));
            }
            else {
                res.ok({data:result,message:"success"});
            }
        })
        .catch(function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    getUIDTemplate : function(req, res) {
        var data = req.body.data;
        if(data == null || data == "" || data.EFormTemplateID == null || data.EFormTemplateID == "") {
            var err = new Error("getUIDTemplate.Error");
            err.pushError("invalid.Params");
            res.serverError(ErrorWrap(err));
        }
        else {
            return EFormTemplate.findAll({
                where:{
                    ID : data.EFormTemplateID
                }
            })
            .then(function(result) {
                if(result == undefined || result == null || result =="" || result.length ==0){
                    var err = new Error("getUIDTemplate.Error");
                    err.pushError("notFound.Template");
                    res.serverError(ErrorWrap(err));
                }
                else {
                    res.ok({data:result,message:"success"});
                }
            },function(err) {
                res.serverError(ErrorWrap(err));
            });
        }
    },

    updateData : function(req, res) {
        var data = req.body.data;
        return sequelize.transaction()
        .then(function(t){
            return EForm.findAll({
                where:{
                    UID : data.uid
                },
                transaction : t
            })
            .then(function(got_EForm){
                if(got_EForm != null && got_EForm != "" && got_EForm.length != 0) {
                    var string="";
                    var modelName =[];
                    Services.Paperless.Check(data.info,string,modelName);
                    for(var i = 0; i < modelName.length; i++) {
                        modelName[i].Name = modelName[i].Name.substr(1,modelName[i].Name.length);
                    }
                    var size = 0;
                    return Services.Paperless.updateData(modelName, got_EForm[0].ID, t, size);
                    
                }
                else {
                    t.rollback();
                    var err = new Error("updateData.Error");
                    err.pushError("notFound.EForm");
                    return res.serverError(ErrorWrap(err));
                }
            },function(err){
                t.rollback();
                return res.serverError(ErrorWrap(err));
            })
            .then(function(result){
                t.commit();
                if(result.message != undefined && result.message != null && result.message != "")
                    return res.ok({message:"success"});
            },
            function(err){
                t.rollback();
                return res.serverError(err);
            })
        },function(err){
            return res.serverError(ErrorWrap(err));
        });
    },

    printData : function(req, res) {
        var data = req.body.data;
        var string="";
        var dataArray =[];
        Services.Paperless.convert(data.info,string,dataArray);
        console.log(dataArray);
        for(var i = 0; i < dataArray.length; i++) {
            dataArray[i].name = dataArray[i].name.substr(1,dataArray[i].name.length);
        }
        console.log(dataArray);
        var printOption = {
            host     : 'http://192.168.1.100:8080',
            path         : '/print',
            method       : 'POST',
            body : {
                printMethod : data.printMethod,
                templateUID : data.templateUID,
                data        : {sadkjopasd:"asdasd"}
            }
        };

        Services.Paperless.CreateRequest(printOption)
        .then(function(response) {
            if(response != null && response != "") {
                res.ok({message:"success",data:response.body});
            }
            else {
                var err = new Error("printData.Error");
                err.pushError("callServerPrint.Error");
                res.serverError(ErrorWrap(err));
            }
        })
        .catch(function(err) {
            console.log(err);
            res.serverError(ErrorWrap(err));
        });
    },

    updateTemplate : function(req, res) {
        var data = req.body.data;
        Services.Paperless.updateTemplate(data)
        .then(function(success){
            res.ok({message:"success"});
        })
        .catch(function(err){
            res.serverError(ErrorWrap(err));
        });
    }

};
