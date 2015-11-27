package com.redimed.telehealth.patient.receiver;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.support.v4.content.WakefulBroadcastReceiver;

import com.redimed.telehealth.patient.service.RegistrationIntentService;

/**
 * Created by LamNguyen on 11/24/2015.
 */
public class GcmBroadcastReceiver extends WakefulBroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // Explicitly specify that RegistrationIntentService will handle the intent.
        ComponentName comp = new ComponentName(context.getPackageName(), RegistrationIntentService.class.getName());
        // Start the service, keeping the device awake while it is launching.
        startWakefulService(context, (intent.setComponent(comp)));
        setResultCode(Activity.RESULT_OK);
    }
}