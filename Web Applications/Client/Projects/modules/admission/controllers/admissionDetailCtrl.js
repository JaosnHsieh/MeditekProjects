var app = angular.module('app.authentication.admission.detail.controller', []);
app.controller('admissionDetailCtrl', function($scope, $cookies, toastr, $timeout, $uibModal, AdmissionService, $stateParams, consultationServices, PatientService) {
    /* THAO */
    var PREVIOUS_SURGERY_PROCEDURES = [];
    var MEDICATIONS = [];
    var GPid;
    var flagGP = false;
    var flag = false;
    var RadioComment = [
        { radio: 'anti_inflammatory', comment: ['anti_inflammatory_comment'] },
        { radio: 'herbal_supplements', comment: ['herbal_supplements_comment'] },
        { radio: 'allergies_alerts_hyperthermia', comment: ['allergies_alerts_details_reaction'] },
        { radio: 'allergies_alerts_substances', comment: ['allergies_alerts_substances_list'] },
        { radio: 'lifestyle_smoked', comment: ['lifestyle_smoked_daily_amount', 'lifestyle_smoked_ceased'] },
        { radio: 'lifestyle_alcohol', comment: ['lifestyle_alcohol_daily_amount'] },
        { radio: 'lifestyle_drugs', comment: ['lifestyle_drugs_daily_amount', 'lifestyle_drugs_type'] },
        { radio: 'cardiovascular_triglycerides', comment: ['cardiovascular_triglycerides_comment'] },
        { radio: 'cardiovascular_hypertension', comment: ['cardiovascular_hypertension_comment'] },
        { radio: 'cardiovascular_angina', comment: ['cardiovascular_angina_comment'] },
        { radio: 'cardiovascular_fibrillation', comment: ['cardiovascular_fibrillation_comment'] },
        { radio: 'cardiovascular_condition', comment: ['cardiovascular_condition_comment'] },
        { radio: 'cardiovascular_disease', comment: ['cardiovascular_disease_comment'] },
        { radio: 'cardiovascular_cardiac_disease', comment: ['cardiovascular_cardiac_disease_comment'] },
        { radio: 'endocrinology_diabetes', comment: ['endocrinology_diabetes_comment'] },
        { radio: 'endocrinology_blood_glucose', comment: ['endocrinology_blood_glucose_comment'] },
        { radio: 'endocrinology_goitre', comment: ['endocrinology_goitre_comment'] },
        { radio: 'gastrointestinal_reflux', comment: ['gastrointestinal_reflux_comment'] },
        { radio: 'gastrointestinal_jaundice', comment: ['gastrointestinal_jaundice_comment'] },
        { radio: 'gastrointestinal_ibs', comment: ['gastrointestinal_ibs_comment'] },
        { radio: 'bleeding_disorders_lungs', comment: ['bleeding_disorders_lungs_comment'] },
        { radio: 'bleeding_disorders_anaemia', comment: ['bleeding_disorders_anaemia_comment'] },
        { radio: 'bleeding_disorders_problems', comment: ['bleeding_disorders_problems_comment'] },
        { radio: 'musculoskeletal_osteoarthritis', comment: ['musculoskeletal_osteoarthritis_comment'] },
        { radio: 'musculoskeletal_problems', comment: ['musculoskeletal_problems_comment'] },
        { radio: 'neurology_dystrophies', comment: ['neurology_dystrophies_comment'] },
        { radio: 'neurology_tia', comment: ['neurology_tia_comment'] },
        { radio: 'neurology_weakness', comment: ['neurology_weakness_comment'] },
        { radio: 'neurology_turns', comment: ['neurology_turns_comment'] },
        { radio: 'respiratory_emphysema', comment: ['respiratory_emphysema_comment'] },
        { radio: 'respiratory_inclines', comment: ['respiratory_inclines_comment'] }
    ]

    function setValue() {
        //thao (default "NO" cho toan bo checkbox)
        // ($scope.admissionDetail.cardiovascular_triglycerides) ? $scope.admissionDetail.cardiovascular_triglycerides: $scope.admissionDetail.cardiovascular_triglycerides = 'N';
        // ($scope.admissionDetail.cardiovascular_hypertension) ? $scope.admissionDetail.cardiovascular_hypertension: $scope.admissionDetail.cardiovascular_hypertension = 'N';
        // ($scope.admissionDetail.cardiovascular_angina) ? $scope.admissionDetail.cardiovascular_angina: $scope.admissionDetail.cardiovascular_angina = 'N';
        // ($scope.admissionDetail.cardiovascular_fibrillation) ? $scope.admissionDetail.cardiovascular_fibrillation: $scope.admissionDetail.cardiovascular_fibrillation = 'N';
        // ($scope.admissionDetail.cardiovascular_condition) ? $scope.admissionDetail.cardiovascular_condition: $scope.admissionDetail.cardiovascular_condition = 'N';
        // ($scope.admissionDetail.cardiovascular_disease) ? $scope.admissionDetail.cardiovascular_disease: $scope.admissionDetail.cardiovascular_disease = 'N';
        // ($scope.admissionDetail.cardiovascular_cardiac_disease) ? $scope.admissionDetail.cardiovascular_cardiac_disease: $scope.admissionDetail.cardiovascular_cardiac_disease = 'N';
        // ($scope.admissionDetail.endocrinology_diabetes) ? $scope.admissionDetail.endocrinology_diabetes: $scope.admissionDetail.endocrinology_diabetes = 'N';
        // ($scope.admissionDetail.endocrinology_blood_glucose) ? $scope.admissionDetail.endocrinology_blood_glucose: $scope.admissionDetail.endocrinology_blood_glucose = 'N';
        // ($scope.admissionDetail.endocrinology_goitre) ? $scope.admissionDetail.endocrinology_goitre: $scope.admissionDetail.endocrinology_goitre = 'N';
        // ($scope.admissionDetail.gastrointestinal_reflux) ? $scope.admissionDetail.gastrointestinal_reflux: $scope.admissionDetail.gastrointestinal_reflux = 'N';
        // ($scope.admissionDetail.gastrointestinal_jaundice) ? $scope.admissionDetail.gastrointestinal_jaundice: $scope.admissionDetail.gastrointestinal_jaundice = 'N';
        // ($scope.admissionDetail.gastrointestinal_ibs) ? $scope.admissionDetail.gastrointestinal_ibs: $scope.admissionDetail.gastrointestinal_ibs = 'N';
        // ($scope.admissionDetail.bleeding_disorders_lungs) ? $scope.admissionDetail.bleeding_disorders_lungs: $scope.admissionDetail.bleeding_disorders_lungs = 'N';
        // ($scope.admissionDetail.bleeding_disorders_anaemia) ? $scope.admissionDetail.bleeding_disorders_anaemia: $scope.admissionDetail.bleeding_disorders_anaemia = 'N';
        // ($scope.admissionDetail.bleeding_disorders_problems) ? $scope.admissionDetail.bleeding_disorders_problems: $scope.admissionDetail.bleeding_disorders_problems = 'N';
        // ($scope.admissionDetail.musculoskeletal_osteoarthritis) ? $scope.admissionDetail.musculoskeletal_osteoarthritis: $scope.admissionDetail.musculoskeletal_osteoarthritis = 'N';
        // ($scope.admissionDetail.musculoskeletal_problems) ? $scope.admissionDetail.musculoskeletal_problems: $scope.admissionDetail.musculoskeletal_problems = 'N';
        // ($scope.admissionDetail.neurology_dystrophies) ? $scope.admissionDetail.neurology_dystrophies: $scope.admissionDetail.neurology_dystrophies = 'N';
        // ($scope.admissionDetail.neurology_tia) ? $scope.admissionDetail.neurology_tia: $scope.admissionDetail.neurology_tia = 'N';
        // ($scope.admissionDetail.neurology_weakness) ? $scope.admissionDetail.neurology_weakness: $scope.admissionDetail.neurology_weakness = 'N';
        // ($scope.admissionDetail.neurology_turns) ? $scope.admissionDetail.neurology_turns: $scope.admissionDetail.neurology_turns = 'N';
        // ($scope.admissionDetail.respiratory_emphysema) ? $scope.admissionDetail.respiratory_emphysema: $scope.admissionDetail.respiratory_emphysema = 'N';
        // ($scope.admissionDetail.respiratory_inclines) ? $scope.admissionDetail.respiratory_inclines: $scope.admissionDetail.respiratory_inclines = 'N';
        // ($scope.admissionDetail.anti_inflammatory) ? $scope.admissionDetail.anti_inflammatory: $scope.admissionDetail.anti_inflammatory = 'N';
        // ($scope.admissionDetail.herbal_supplements) ? $scope.admissionDetail.herbal_supplements: $scope.admissionDetail.herbal_supplements = 'N';
        // ($scope.admissionDetail.lifestyle_alcohol) ? $scope.admissionDetail.lifestyle_alcohol: $scope.admissionDetail.lifestyle_alcohol = 'N';
        // ($scope.admissionDetail.lifestyle_drugs) ? $scope.admissionDetail.lifestyle_drugs: $scope.admissionDetail.lifestyle_drugs = 'N';
        // ($scope.admissionDetail.allergies_alerts_hyperthermia) ? $scope.admissionDetail.allergies_alerts_hyperthermia: $scope.admissionDetail.allergies_alerts_hyperthermia = 'N';
        // ($scope.admissionDetail.anti_coagulant) ? $scope.admissionDetail.anti_coagulant: $scope.admissionDetail.anti_coagulant = 'N';
        // ($scope.admissionDetail.lifestyle_smoked) ? $scope.admissionDetail.lifestyle_smoked: $scope.admissionDetail.lifestyle_smoked = 'N';
        // ($scope.admissionDetail.allergies_alerts_substances) ? $scope.admissionDetail.allergies_alerts_substances: $scope.admissionDetail.allergies_alerts_substances = 'N';

        //chien
        PREVIOUS_SURGERY_PROCEDURES = ($scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES) ? $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES : $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES = [];
        MEDICATIONS = ($scope.admissionDetail.MEDICATIONS) ? $scope.admissionDetail.MEDICATIONS : $scope.admissionDetail.MEDICATIONS = [];

        //giang
        $scope.admissionDetail.DoctorDateChoose = moment().format('DD/MM/YYYY');
        if ($scope.wainformation) {
            console.log("admissionDetail ", $scope.admissionDetail);

            if ($scope.wainformation.Doctors.length > 0) {
                if ($scope.wainformation.Doctors[0].FirstName || $scope.wainformation.Doctors[0].LastName) {
                    $scope.admissionDetail.DoctorFullName = $scope.admissionDetail.DoctorFullName ? $scope.admissionDetail.DoctorFullName : $scope.wainformation.Doctors[0].FirstName + ' ' + $scope.wainformation.Doctors[0].LastName;
                }

                if ($scope.wainformation.Doctors[0].FileUpload != null && $scope.wainformation.Doctors[0].FileUpload != '') {
                    $scope.admissionDetail.DoctorSignature = $scope.wainformation.Doctors[0].FileUpload.UID;
                }
            }
            if ($scope.wainformation.Patients.length > 0) {
                console.log("test Patients", $scope.wainformation);
                $scope.admissionDetail.FirstName = $scope.wainformation.Patients[0].FirstName ? $scope.wainformation.Patients[0].FirstName : '';
                $scope.admissionDetail.LastName = $scope.wainformation.Patients[0].LastName ? $scope.wainformation.Patients[0].LastName : '';
                $scope.admissionDetail.DOB = $scope.wainformation.Patients[0].DOB ? $scope.wainformation.Patients[0].DOB : '';
                $scope.admissionDetail.Gender = $scope.wainformation.Patients[0].Gender ? $scope.wainformation.Patients[0].Gender : '';
                PatientService.detailChildPatient({ UID: $scope.wainformation.Patients[0].UID, model: ['PatientMedicare', 'PatientDVA', 'PatientKin', 'PatientGP'] }).then(function(response) {
                    if (response.data) {
                        if (response.data.PatientMedicare.length > 0) {
                            $scope.admissionDetail.MedicareEligible = $scope.admissionDetail.MedicareEligible ? $scope.admissionDetail.MedicareEligible : response.data.PatientMedicare[0].MedicareEligible ? response.data.PatientMedicare[0].MedicareEligible : '';
                            $scope.admissionDetail.MedicareReferenceNumber = $scope.admissionDetail.MedicareReferenceNumber ? $scope.admissionDetail.MedicareReferenceNumber : response.data.PatientMedicare[0].MedicareReferenceNumber ? response.data.PatientMedicare[0].MedicareReferenceNumber : '';
                            $scope.admissionDetail.MedicareNumber = $scope.admissionDetail.MedicareNumber ? $scope.admissionDetail.MedicareNumber : response.data.PatientMedicare[0].MedicareNumber ? response.data.PatientMedicare[0].MedicareNumber : '';
                            $scope.admissionDetail.ExpiryDate = $scope.admissionDetail.ExpiryDate ? $scope.admissionDetail.ExpiryDate : response.data.PatientMedicare[0].ExpiryDate ? response.data.PatientMedicare[0].ExpiryDate : '';
                            $scope.admissionDetail.ExpiryDate = dateFormat.test($scope.admissionDetail.ExpiryDate) == false && $scope.admissionDetail.ExpiryDate ? moment($scope.admissionDetail.ExpiryDate, 'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY') : $scope.admissionDetail.ExpiryDate;
                        }
                        if (response.data.PatientDVA.length > 0) {
                            $scope.admissionDetail.DVANumber = $scope.admissionDetail.DVANumber ? $scope.admissionDetail.DVANumber : response.data.PatientDVA[0].DVANumber ? response.data.PatientDVA[0].DVANumber : '';
                        }
                        if (response.data.PatientKin.length > 0) {
                            $scope.admissionDetail.KinFirstName = $scope.admissionDetail.KinFirstName ? $scope.admissionDetail.KinFirstName : response.data.PatientKin[0].FirstName ? response.data.PatientKin[0].FirstName : '';
                            $scope.admissionDetail.KinLastName = $scope.admissionDetail.KinLastName ? $scope.admissionDetail.KinLastName : response.data.PatientKin[0].LastName ? response.data.PatientKin[0].LastName : '';
                            $scope.admissionDetail.KinFullName = $scope.admissionDetail.KinFullName ? $scope.admissionDetail.KinFullName : Trim((response.data.PatientKin[0].FirstName ? response.data.PatientKin[0].FirstName : '') + " " + (response.data.PatientKin[0].LastName ? response.data.PatientKin[0].LastName : ''));
                            $scope.admissionDetail.Relationship = $scope.admissionDetail.Relationship ? $scope.admissionDetail.Relationship : response.data.PatientKin[0].Relationship ? response.data.PatientKin[0].Relationship : '';
                            $scope.admissionDetail.MobilePhoneNumber = $scope.admissionDetail.MobilePhoneNumber ? $scope.admissionDetail.MobilePhoneNumber : response.data.PatientKin[0].MobilePhoneNumber ? response.data.PatientKin[0].MobilePhoneNumber : '';
                            console.log("PatientKin ", response.data.PatientKin[0]);
                        }
                        if (response.data.PatientGP.length > 0) {
                            for (var key in $scope.admissionDetail) {
                                if (key == 'GPFirstName' || key == 'GPLastName' || key == 'HealthLink' || key == 'ProviderNumber' || key == 'Email' || key == 'PhoneNumber' || key == 'HomePhoneNumber' || key == 'WorkPhoneNumber') {
                                    flagGP = true;
                                }
                            }
                            if (flagGP == false) {
                                GPid = response.data.PatientGP[0].ID;
                            }
                            $scope.admissionDetail.GPFirstName = $scope.admissionDetail.GPFirstName ? $scope.admissionDetail.GPFirstName : response.data.PatientGP[0].FirstName ? response.data.PatientGP[0].FirstName : '';
                            $scope.admissionDetail.GPLastName = $scope.admissionDetail.GPLastName ? $scope.admissionDetail.GPLastName : response.data.PatientGP[0].LastName ? response.data.PatientGP[0].LastName : '';
                            $scope.admissionDetail.HealthLink = $scope.admissionDetail.HealthLink ? $scope.admissionDetail.HealthLink : response.data.PatientGP[0].HealthLink ? response.data.PatientGP[0].HealthLink : '';
                            $scope.admissionDetail.ProviderNumber = $scope.admissionDetail.ProviderNumber ? $scope.admissionDetail.ProviderNumber : response.data.PatientGP[0].ProviderNumber ? response.data.PatientGP[0].ProviderNumber : '';
                            $scope.admissionDetail.Email = $scope.admissionDetail.Email ? $scope.admissionDetail.Email : response.data.PatientGP[0].Email ? response.data.PatientGP[0].Email : '';
                            $scope.admissionDetail.PhoneNumber = $scope.admissionDetail.PhoneNumber ? $scope.admissionDetail.PhoneNumber : response.data.PatientGP[0].PhoneNumber ? response.data.PatientGP[0].PhoneNumber : '';
                            $scope.admissionDetail.HomePhoneNumber = $scope.admissionDetail.HomePhoneNumber ? $scope.admissionDetail.HomePhoneNumber : response.data.PatientGP[0].HomePhoneNumber ? response.data.PatientGP[0].HomePhoneNumber : '';
                            $scope.admissionDetail.WorkPhoneNumber = $scope.admissionDetail.WorkPhoneNumber ? $scope.admissionDetail.WorkPhoneNumber : response.data.PatientGP[0].WorkPhoneNumber ? response.data.PatientGP[0].WorkPhoneNumber : '';
                            $scope.admissionDetail.Address1 = $scope.admissionDetail.Address1 ? $scope.admissionDetail.Address1 : response.data.PatientGP[0].Address1 ? response.data.PatientGP[0].Address1: '';
                            console.log(">>>>>>>>PatientGP", response.data.PatientGP[0]);
                        }
                    }
                }, function(err) {
                    console.log(err);
                })
            } else if ($scope.wainformation.PatientAppointments.length > 0) {
                console.log("test PatientAppointments", $scope.wainformation.PatientAppointments);
                $scope.admissionDetail.MedicareEligible = ($scope.admissionDetail.MedicareEligible ? $scope.admissionDetail.MedicareEligible : ($scope.wainformation.PatientAppointments[0].MedicareEligible ? $scope.wainformation.PatientAppointments[0].MedicareEligible : ''));
                $scope.admissionDetail.MedicareReferenceNumber = $scope.admissionDetail.MedicareReferenceNumber ? $scope.admissionDetail.MedicareReferenceNumber : $scope.wainformation.PatientAppointments.length > 0 ? scope.wainformation.PatientAppointments[0].MedicareReferenceNumber : '';
                $scope.admissionDetail.MedicareNumber = $scope.admissionDetail.MedicareNumber ? $scope.admissionDetail.MedicareNumber : $scope.wainformation.PatientAppointments.length > 0 ? $scope.wainformation.PatientAppointments[0].MedicareNumber : '';
                $scope.admissionDetail.ExpiryDate = $scope.admissionDetail.ExpiryDate ? $scope.admissionDetail.ExpiryDate : $scope.wainformation.PatientAppointments.length > 0 ? $scope.wainformation.PatientAppointments[0].MedicareExpiryDate : '';
                $scope.admissionDetail.ExpiryDate = dateFormat.test($scope.admissionDetail.ExpiryDate) == false && $scope.admissionDetail.ExpiryDate ? moment($scope.admissionDetail.ExpiryDate, 'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY') : $scope.admissionDetail.ExpiryDate;
                $scope.admissionDetail.DVANumber = $scope.admissionDetail.DVANumber ? $scope.admissionDetail.DVANumber : $scope.wainformation.PatientAppointments.length > 0 ? $scope.wainformation.PatientAppointments[0].DVANumber : '';
                $scope.admissionDetail.KinFirstName = $scope.admissionDetail.KinFirstName ? $scope.admissionDetail.KinFirstName : $scope.wainformation.PatientAppointments.length > 0 ? $scope.wainformation.PatientAppointments[0].PatientKinFirstName : '';
                $scope.admissionDetail.KinLastName = $scope.admissionDetail.KinLastName ? $scope.admissionDetail.KinLastName : $scope.wainformation.PatientAppointments.length > 0 ? $scope.wainformation.PatientAppointments[0].PatientKinLastName : '';
                $scope.admissionDetail.Relationship = $scope.admissionDetail.Relationship ? $scope.admissionDetail.Relationship : $scope.wainformation.PatientAppointments.length > 0 ? $scope.wainformation.PatientAppointments[0].PatientKinRelationship : '';
                $scope.admissionDetail.MobilePhoneNumber = $scope.admissionDetail.MobilePhoneNumber ? $scope.admissionDetail.MobilePhoneNumber : $scope.wainformation.PatientAppointments.length > 0 ? $scope.wainformation.PatientAppointments[0].PatientKinMobilePhoneNumber : '';
            } else if ($scope.wainformation.TelehealthAppointment != null) {
                console.log("test TelehealthAppointment", $scope.wainformation.TelehealthAppointment);
                $scope.admissionDetail.MedicareEligible = $scope.admissionDetail.MedicareEligible ? $scope.admissionDetail.MedicareEligible : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible : '';
                $scope.admissionDetail.MedicareReferenceNumber = $scope.admissionDetail.MedicareReferenceNumber ? $scope.admissionDetail.MedicareReferenceNumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareReferenceNumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareReferenceNumber : '';
                $scope.admissionDetail.MedicareNumber = $scope.admissionDetail.MedicareNumber ? $scope.admissionDetail.MedicareNumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareNumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareNumber : '';
                $scope.admissionDetail.ExpiryDate = $scope.admissionDetail.ExpiryDate ? $scope.admissionDetail.ExpiryDate : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate : '';
                $scope.admissionDetail.ExpiryDate = dateFormat.test($scope.admissionDetail.ExpiryDate) == false && $scope.admissionDetail.ExpiryDate ? moment($scope.admissionDetail.ExpiryDate, 'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY') : $scope.admissionDetail.ExpiryDate;
                $scope.admissionDetail.DVANumber = $scope.admissionDetail.DVANumber ? $scope.admissionDetail.DVANumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.DVANumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.DVANumber : '';
                $scope.admissionDetail.KinFirstName = $scope.admissionDetail.KinFirstName ? $scope.admissionDetail.KinFirstName : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinFirstName ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinFirstName : '';
                $scope.admissionDetail.KinLastName = $scope.admissionDetail.KinLastName ? $scope.admissionDetail.KinLastName : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinLastName ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinLastName : '';
                $scope.admissionDetail.Relationship = $scope.admissionDetail.Relationship ? $scope.admissionDetail.Relationship : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinRelationship ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinRelationship : '';
                $scope.admissionDetail.MobilePhoneNumber = $scope.admissionDetail.MobilePhoneNumber ? $scope.admissionDetail.MobilePhoneNumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinMobilePhoneNumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinMobilePhoneNumber : '';
            } else {
                console.log("test null");
            }
        }
    }
    var dateFormat = /^\d{2}[/]\d{2}[/]\d{4}$/;
    $scope.ChangeRadio = function(text) {
        for (var i = 0; i < text.length; i++) {
            //$("input[name=" + text[i] + "]").val(null);
            $scope.admissionDetail[text[i]] = '';
        }
    };

    $scope.getDate = new Date();

    $scope.doctorUseOnly = function() {
        var userprofile = _.findIndex($cookies.getObject("userInfo").roles, function(doctor) {
            if (doctor.ID === 4 || doctor.ID === 5) {
                return doctor;
            }
        });
        if (userprofile != -1) {
            return false;
        } else
            return true;
    };

    $scope.stillToTake = function() {
        $scope.admissionDetail.anti_coagulant_date_to_cease = null;
        $scope.admissionDetail.anti_coagulant_still_to_take = null;
    };

    $scope.DefaultYes = function() {
        $scope.admissionDetail.anti_coagulant_still_to_take = "Y";
    };

    /* END THAO */
    $timeout(function() {
        setValue();
    }, 0);

    /* THAO */
    var isRadioYesNo = function(nameRadioYesNo, fieldsRelation) {
        var radioValue = $('input[name="' + nameRadioYesNo + '"]:checked').val();
        var flag = false;
        if (radioValue === 'Y') {
            fieldsRelation.map(function(field) {
                var value = $scope.admissionDetail[field];
                if (value === '' || value === null || typeof value === 'undefined')
                    flag = true;
            })
            return flag;
        } else {
            return false;
        }
    };


    $scope.checkRadioYesNo = function(nameRadioYesNo, groupsRelation) {
        var radioValue = $('input[name="' + nameRadioYesNo + '"]:checked').val();
        if (radioValue === 'Y') {
            groupsRelation.map(function(group) {
                $(group + '_' + nameRadioYesNo).addClass('has-error');
            })
        } else {
            groupsRelation.map(function(group) {
                $(group + '_' + nameRadioYesNo).removeClass('has-error');
            })
        }
    };
    var isRadioYesNoN = function(nameRadioYesNo, fieldsRelation) {
        var radioValue = $('input[name="' + nameRadioYesNo + '"]:checked').val();
        var flag = false;
        if (radioValue === 'N') {
            fieldsRelation.map(function(field) {
                var value = $scope.admissionDetail[field];
                if (value === '' || value === null || typeof value === 'undefined')
                    flag = true;
            })
            return flag;
        } else {
            return false;
        }
    };


    $scope.checkRadioYesNoN = function(nameRadioYesNo, groupsRelation) {
        var radioValue = $('input[name="' + nameRadioYesNo + '"]:checked').val();
        if (radioValue === 'N') {
            groupsRelation.map(function(group) {
                $(group + '_' + nameRadioYesNo).addClass('has-error');
            })
        } else {
            groupsRelation.map(function(group) {
                $(group + '_' + nameRadioYesNo).removeClass('has-error');
            })
        }
    };

    flag = isRadioYesNoN('anti_coagulant_still_to_take', ['anti_coagulant_date_to_cease']);
    $scope.checkYesNo = function(nameRadio, nameComment) {
        if (flag === false)
            flag = isRadioYesNo(nameRadio, [nameComment]);

    }


    /* END THAO */
    $scope.admission = {
        UID: $stateParams.UID,
        Admissions: [{
            AdmissionData: [],
            UID: $scope.admissionUID
        }]
    };
    $scope.admissionDesibale = false;
    $scope.inputParam = {
        idAdmission: null,
        uid: $stateParams.UIDPatient,
        onClick: function(data) {
            function setDetailAdmission(input, output) {
                _.forEach(input, function(value, name) {
                    var itemData = null;
                    if (value.Name == "PREVIOUS_SURGERY_PROCEDURES" || value.Name == "MEDICATIONS") {
                        itemData = JSON.parse(value.Value);
                    } else {
                        itemData = value.Value;
                    };
                    output[value.Name] = itemData;
                });
            };
            AdmissionService.GetDetailAdmission(data.UID).then(function(data) {
                console.log("$scope.admissionDetail", data);
                $scope.admissionDetail = {};
                setDetailAdmission(data.data.AdmissionData, $scope.admissionDetail);
                setValue();
                console.log($scope.admissionUID);
                console.log(data.data.UID);
                if ($scope.admissionUID != data.data.UID)
                    $scope.admissionDesibale = true;
                else
                    $scope.admissionDesibale = false;
                console.log("$scope.admissionDetail", $scope.admissionDetail);
                console.log("admissionDesibale", $scope.admissionDesibale);
                toastr.success("Select admission success", "Success");
            });
        }
    };
    console.log("$stateParams", $stateParams);

    $scope.UpdateAdmission = function() {
        //THAO
        flag = isRadioYesNoN('anti_coagulant_still_to_take', ['anti_coagulant_date_to_cease']);
        for(var i = 0; i < RadioComment.length; i++) {
            if (flag === false)
                flag = isRadioYesNo(RadioComment[i].radio, RadioComment[i].comment);
        }        
        if (flag) {
            //xuat thong bao
            toastr.error("You haven't entered enough information", "Error");
            return;
        }
        //END THAO

        swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196F3",
                confirmButtonText: "OK",
                closeOnConfirm: false
            },
            function() {
                _.forEach($scope.admissionDetail, function(value, name) {
                    if (value === null) value = '';
                    if (value.length > 0) {
                        var data = {
                            Section: "Admission Details",
                            Category: "Admission",
                            Type: "Admission",
                            Name: name,
                            Value: null
                        }
                        if (name == "PREVIOUS_SURGERY_PROCEDURES" || name == "MEDICATIONS") {
                            data.Value = JSON.stringify(value);
                        } else {
                            data.Value = value;
                        };
                        $scope.admission.Admissions[0].AdmissionData.push(data);
                    }

                });
                console.log("admission update ne", $scope.admission);
                console.log("$scope.wainformation", $scope.wainformation);
                AdmissionService.UpdateAdmission($scope.admission).then(function(data) {
                    // swal("Update success!", "", "success");
                    if (flagGP == false) {
                        var obj = {};
                        if ($scope.admissionDetail['GPFirstName']) {
                            obj['FirstName'] = $scope.admissionDetail['GPFirstName'];
                        }
                        if ($scope.admissionDetail['GPLastName']) {
                            obj['LastName'] = $scope.admissionDetail['GPLastName'];
                        }
                        if ($scope.admissionDetail['HealthLink']) {
                            obj['HealthLink'] = $scope.admissionDetail['HealthLink'];
                        }
                        if ($scope.admissionDetail['ProviderNumber']) {
                            obj['ProviderNumber'] = $scope.admissionDetail['ProviderNumber'];
                        }
                        if ($scope.admissionDetail['Email']) {
                            obj['Email'] = $scope.admissionDetail['Email'];
                        }
                        if ($scope.admissionDetail['PhoneNumber']) {
                            obj['PhoneNumber'] = $scope.admissionDetail['PhoneNumber'];
                        }
                        if ($scope.admissionDetail['HomePhoneNumber']) {
                            obj['HomePhoneNumber'] = $scope.admissionDetail['HomePhoneNumber'];
                        }
                        if ($scope.admissionDetail['WorkPhoneNumber']) {
                            obj['WorkPhoneNumber'] = $scope.admissionDetail['WorkPhoneNumber'];
                        }
                        if ($scope.admissionDetail['Address1']) {
                            obj['Address1'] = $scope.admissionDetail['Address1'];
                        }
                        obj.ID = GPid;
                        var patientInfo = {
                            PatientGP: obj,
                            UID: $stateParams.patientUID
                        }
                        PatientService.updatePatient(patientInfo).then(function(response) {
                            swal("Update success!", "", "success");
                        }, function(error) {
                            swal("Update error!", "", "error");
                        });
                    } else {
                        swal("Update success!", "", "success");
                    }
                }, function(error) {
                    swal("Update error!", "", "error");
                });

            });
    };

    $scope.openModalAdd1 = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd1.html',
            controller: 'modalAdd1Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Add data';
                },
                PREVIOUS_SURGERY_PROCEDURES: function() {
                    return PREVIOUS_SURGERY_PROCEDURES;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                //
            }, function(result) {
                //
            });
    };
    $scope.openModaUpdate1 = function(index) {
        var data = $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES[index];
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd1.html',
            controller: 'modalUpdate1Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Update data';
                },
                dataModal: function() {
                    return data;
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES[result.index] = result.data;
            }, function(result) {
                // dismiss
            });
    };
    $scope.openModalDelete1 = function(index) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'sm',
            templateUrl: 'modules/admission/views/modalDelete1.html',
            controller: 'modalDelete1Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Delete data';
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES.splice(result.index, 1);
            }, function(result) {
                // dismiss
            });
    };

    $scope.openModalAdd2 = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd2.html',
            controller: 'modalAdd2Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Add data';
                },
                MEDICATIONS: function() {
                    return MEDICATIONS;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                //
            }, function(result) {
                //
            });
    };
    $scope.openModaUpdate2 = function(index) {
        var data = $scope.admissionDetail.MEDICATIONS[index];
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd2.html',
            controller: 'modalUpdate2Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Update data';
                },
                dataModal: function() {
                    return data;
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.MEDICATIONS[result.index] = result.data;
            }, function(result) {
                // dismiss
            });
    };
    $scope.openModalDelete2 = function(index) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'sm',
            templateUrl: 'modules/admission/views/modalDelete2.html',
            controller: 'modalDelete2Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Delete data';
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.MEDICATIONS.splice(result.index, 1);
            }, function(result) {
                // dismiss
            });
    };
    $scope.resertSubstancesData = function() {
        $scope.admissionDetail.allergies_alerts_substances_list = "";
    };

    $scope.parse = function(obj, array_data, rows, table_name) {
        var array_attributes = [];
        var col = 0;
        if (table_name == 'PREVIOUS_SURGERY_PROCEDURES') {
            col = 4;
            array_attributes = ['operation', 'appros_year', 'surgeon', 'notes'];
        } else if (table_name == 'MEDICATIONS') {
            col = 6;
            array_attributes = ['medication', 'frequency', 'daily_dose', 'cessation_intruction', 'date_ceased', 'nursing_notes'];
        } else {
            console.log("table_name.Error");
        }
        for (var key in obj) {
            for (var i = 0; i < array_attributes.length; i++) {
                if (key === array_attributes[i]) {
                    array_data.push({
                        ref: table_name + '_table',
                        refChild: 'field_' + rows + '_' + i,
                        name: key,
                        value: obj[key]
                    });
                }
            }
        }
        return col;
    }

    $scope.click = function() {
        console.log($scope.wainformation);
        var postdata = {
            printMethod: 'jasper',
            templateUID: 'patient_admission',
            data: []
        };
        // var data = [];
        // console.log($scope.admissionDetail);

        for (var key in $scope.admissionDetail) {
            if (typeof $scope.admissionDetail[key] == 'string') {
                postdata.data.push({ name: key, value: $scope.admissionDetail[key] });
            } else if (Array.isArray($scope.admissionDetail[key]) == true) {
                var i = 0;
                var col = 0;
                for (var j = 0; j < $scope.admissionDetail[key].length; j++) {
                    col = $scope.parse($scope.admissionDetail[key][j], postdata.data, i, key, col);
                    i++;

                }

                postdata.data.push({ ref: key + '_table', name: key, rows: i, columns: col, type: 'table' });
            }
        }
        //consultationServices.PrintPDF(postdata).then(function(responsePrintPDF) {
        consultationServices.OldPrintPDF(postdata).then(function(responsePrintPDF) {
            //console.log(responsePrintPDF)
            var blob = new Blob([responsePrintPDF.data], {
                type: 'application/pdf'
            });
            saveAs(blob, "PatientAdmission");
        }, function(err) {
            console.log(err);
        });
        //console.log(postdata);
    };

    // $scope.Disabled = function() {
    //   expect(element(by.css('text')).getAttribute('disabled')).toBeFalsy();
    //   element(by.model('radio')).click();
    //   expect(element(by.css('text')).getAttribute('disabled')).toBeTruthy();
    // };

    function Trim(sString) {
        while (sString.substring(0, 1) == '') {
            sString = sString.substring(1, sString.length);
        }
        while (sString.substring(sString.length - 1, sString.length) == '') {
            sString = sString.substring(0, sString.length - 1);
        }
        return sString;
    };
});
