module.exports = function(objCreated) {
    return objCreated.appointmentCreated.createTelehealthAppointment(
        objCreated.data, {
            transaction: objCreated.transaction
        });
};
