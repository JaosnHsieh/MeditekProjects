package com.redimed.telehealth.patient.appointment.view;

import android.content.SharedPreferences;
import android.support.v4.app.Fragment;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.models.Doctor;

import java.util.List;

/**
 * Created by Fox on 1/19/2016.
 */
public interface IAppointmentView {
    void onLoadAppointment(JsonObject dataAppt, String msg);
    void onLoadToolbar();
    void onResultUpload(String picturePath, boolean result);
    void onLoadListImage(List<String> listImage, SharedPreferences spTelehealth);
}