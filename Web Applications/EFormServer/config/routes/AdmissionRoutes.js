module.exports = {
    'post /api/admission/create': {
        controller: 'Admission/AdmissionController',
        action: 'RequestAdmission'
    },
    'post /api/admission/list': {
        controller: 'Admission/AdmissionController',
        action: 'GetListAdmission'
    },
    'get /api/admission/detail/:UID': {
        controller: 'Admission/AdmissionController',
        action: 'GetDetailAdmission'
    },
    'post /api/admission/update': {
        controller: 'Admission/AdmissionController',
        action: 'UpdateRequestAdmission'
    },
    'get /api/admission/destroy/:UID': {
        controller: 'Admission/AdmissionController',
        action: 'DestroyAdmission'
    }
};
