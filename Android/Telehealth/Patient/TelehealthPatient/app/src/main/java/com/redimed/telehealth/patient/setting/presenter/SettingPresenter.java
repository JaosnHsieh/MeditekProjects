package com.redimed.telehealth.patient.setting.presenter;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.faq.FAQsFragment;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.information.InformationFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.pin.PinFragment;
import com.redimed.telehealth.patient.services.SocketService;
import com.redimed.telehealth.patient.setting.view.ISettingView;

import java.io.File;
import java.util.Timer;
import java.util.TimerTask;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/15/2016.
 */
public class SettingPresenter implements ISettingPresenter {

    private Gson gson;
    private Bundle bundle;
    private Context context;
    private Fragment fragment;
    private Patient[] patients;
    private RegisterApi restClient;
    private ISettingView iSettingView;
    private FragmentActivity activity;
    private IMainPresenter iMainPresenter;
    private static final String TAG = "===SETTING_PRESENTER===";

    public SettingPresenter(ISettingView iSettingView, Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.iSettingView = iSettingView;

        gson = new Gson();
        bundle = new Bundle();
        restClient = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
    }

    @Override
    public void getInfoPatient(String teleUID) {
        restClient.getDetailsPatient(teleUID, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    patients = gson.fromJson(jsonObject.get("data").toString(), Patient[].class);
                    iSettingView.displayShortInfo(patients);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iSettingView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void displayInfoPatient(String uid) {
        if (patients != null) {
            bundle.putString("telehealthUID", uid);

            fragment = new InformationFragment();
            fragment.setArguments(bundle);

            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void displayPin(String uid) {
        bundle.putString("telehealthUID", uid);

        fragment = new PinFragment();
        fragment.setArguments(bundle);

        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public void initToolbar(Toolbar toolbar) {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) activity;
        appCompatActivity.setSupportActionBar(toolbar);

        ActionBar actionBar = appCompatActivity.getSupportActionBar();
        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(context.getResources().getString(R.string.setting_title));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

            // Change color image back, set a custom icon for the default home button
            final Drawable upArrow = ContextCompat.getDrawable(context, R.drawable.abc_ic_ab_back_material);
            upArrow.setColorFilter(ContextCompat.getColor(context, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
            actionBar.setHomeAsUpIndicator(upArrow);
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void displayAbout() {
        bundle.putString("msg", "UR");

        fragment = new FAQsFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public void logout(final String uid) {
        final AlertDialog alertDialog = new android.support.v7.app.AlertDialog.Builder(context).create();
        alertDialog.setTitle(context.getResources().getString(R.string.logout));
        alertDialog.setMessage(context.getResources().getString(R.string.un_title));

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Logout", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                logoutTele(uid);
                new Timer().schedule(new TimerTask() {
                    @Override
                    public void run() {
                        logout();
                        clearApplication();
                        iMainPresenter.replaceFragment(new HomeFragment());
                        context.stopService(new Intent(context, SocketService.class));
                    }
                }, 5000);
            }
        });

        alertDialog.setButton(Dialog.BUTTON_POSITIVE, "Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                alertDialog.cancel();
            }
        });
        alertDialog.show();
    }

    // 3009
    private void logoutTele(String uid) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("uid", uid);

        restClient.logoutTelehealth(jsonObject, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                // Return Success
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }


    // 3006
    private void logout() {
        RESTClient.getRegisterApiLogin().logout(new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                // Return Success
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }


    private void clearApplication() {
        File cache = context.getCacheDir();
        File appDir = new File(cache.getParent());
        if (appDir.exists()) {
            //Get all folder include /data/data/com.redimed.telehealth.patient
            String[] children = appDir.list();
            for (String s : children) {
                if (s.equals("shared_prefs")) {
                    clearSharedPreferences(new File(appDir, s));
                }
            }
        }
    }

    private void clearSharedPreferences(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            //Get child in each folder
            for (String aChildren : children) {
                String prefName = aChildren.substring(0, aChildren.length() - 4);
                SharedPreferences pref = context.getApplicationContext().getSharedPreferences(prefName, Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = pref.edit();
                editor.clear().apply();
            }
        }
    }

//    private void clearApplication() {
//        File cache = context.getCacheDir();
//        File appDir = new File(cache.getParent());
//        if (appDir.exists()) {
//            //Get all folder include /data/data/com.redimed.telehealth.patient
//            String[] children = appDir.list();
//            for (String s : children) {
//                if (!s.equals("lib")) {
//                    deleteDir(new File(appDir, s));
//                }
//            }
//        }
//    }
//
//    private static boolean deleteDir(File dir) {
//        if (dir != null && dir.isDirectory()) {
//            String[] children = dir.list();
//            //Get child in each folder
//            for (String aChildren : children) {
//                boolean success = deleteDir(new File(dir, aChildren));
//                if (!success) {
//                    return false;
//                }
//            }
//        }
//        return dir.delete();
//    }
}
