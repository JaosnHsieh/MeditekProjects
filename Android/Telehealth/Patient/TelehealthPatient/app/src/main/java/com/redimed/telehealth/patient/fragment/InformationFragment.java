package com.redimed.telehealth.patient.fragment;

import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.LauncherActivity;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MapsActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.GPSTrackerService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.redimed.telehealth.patient.utils.CircleTransform;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.utils.DialogAlert;
import com.redimed.telehealth.patient.utils.DialogConnection;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;
import com.squareup.picasso.UrlConnectionDownloader;

import org.w3c.dom.Text;

import java.io.IOException;
import java.net.HttpURLConnection;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class InformationFragment extends Fragment implements View.OnClickListener {

    private View v;
    private Intent i;
    private Gson gson;
    private Patient[] patients;
    private RegisterApi restClient;
    private String TAG = "INFORMATION", uid;
    private SharedPreferences sharedPreferences, telehealthPatient;

    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.lblEmail)
    TextView lblEmail;
    @Bind(R.id.lblHomePhone)
    TextView lblHomePhone;
    @Bind(R.id.lblAddress)
    TextView lblAddress;
    @Bind(R.id.lblSuburb)
    TextView lblSuburb;
    @Bind(R.id.lblPostCode)
    TextView lblPostCode;
    @Bind(R.id.lblCountry)
    TextView lblCountry;
    @Bind(R.id.btnSubmit)
    Button btnSubmit;
    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.scrollViewInfo)
    ScrollView scrollViewInfo;
    @Bind(R.id.avatarPatient)
    ImageView avatarPatient;
    @Bind(R.id.infoLayout)
    RelativeLayout infoLayout;
    @Bind(R.id.btnLogout)
    TextView btnLogout;

    public InformationFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        v = inflater.inflate(R.layout.fragment_information, container, false);
        ButterKnife.bind(this, v);

        init();
        SwipeRefresh();
        BlurBackground();

        btnSubmit.setOnClickListener(this);
        btnLogout.setOnClickListener(this);
        btnSubmit.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                GPSTrackerService gps = new GPSTrackerService(v.getContext());
                i = new Intent(v.getContext(), MapsActivity.class);
                if (gps.canGetLocation()) {
                    i.putExtra("lat", gps.getLatitude());
                    i.putExtra("long", gps.getLongitude());
                } else {
                    gps.showSettingsAlert();
                }
                startActivity(i);
                return true;
            }
        });

        return v;
    }

    //initialization variable
    private void init() {
        gson = new Gson();
        restClient = RESTClient.getRegisterApi();
        uid = getArguments().getString("telehealthUID", "");

        sharedPreferences = v.getContext().getSharedPreferences("PatientInfo", v.getContext().MODE_PRIVATE);
        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);

        patients = gson.fromJson(sharedPreferences.getString("info", null), Patient[].class);
        if (patients != null) {
            DisplayInfo(patients);
        } else {
            GetInfoPatient();
        }
    }

    //Handler action click
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnSubmit:
                ((MainActivity) v.getContext()).Display(0);
                break;
            case R.id.btnLogout:
                DialogConfirm();
                break;
        }
    }

    //Make Background and add blur animation
    private void BlurBackground() {
        Picasso.with(v.getContext()).load(R.drawable.slider2).transform(new BlurTransformation(v.getContext(), 20))
                .into(new Target() {
                    @Override
                    public void onBitmapLoaded(Bitmap bitmap, Picasso.LoadedFrom from) {
                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                            infoLayout.setBackgroundDrawable(new BitmapDrawable(v.getContext().getResources(), bitmap));
                            infoLayout.invalidate();
                        } else {
                            infoLayout.setBackground(new BitmapDrawable(v.getContext().getResources(), bitmap));
                            infoLayout.invalidate();
                        }
                    }

                    @Override
                    public void onBitmapFailed(Drawable errorDrawable) {
                        Log.d(TAG, "Error" + errorDrawable);
                    }

                    @Override
                    public void onPrepareLoad(Drawable placeHolderDrawable) {
                        Log.d(TAG, "Prepare Load");
                    }
                });
    }

    //Display dialog choose camera or gallery to upload image
    private void DialogConfirm() {
        final android.support.v7.app.AlertDialog alertDialog = new android.support.v7.app.AlertDialog.Builder(v.getContext()).create();
        alertDialog.setTitle(v.getContext().getResources().getString(R.string.unregistered));
        alertDialog.setMessage(v.getContext().getResources().getString(R.string.un_title));

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Unregistered", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String result = MyApplication.getInstance().Logout();
                if (result.equalsIgnoreCase("success")) {
                    ((MainActivity) v.getContext()).Display(0);
                    startActivity(new Intent(v.getContext(), LauncherActivity.class));
                } else if (result.equalsIgnoreCase("Network Error")) {
                    new DialogConnection(v.getContext()).show();
                } else if (!result.equalsIgnoreCase(" ")) {
                    new DialogAlert(v.getContext(), DialogAlert.State.Error, result).show();
                }
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

    //Call api to get data information patient from server
    private void GetInfoPatient() {
        restClient.getDetailsPatient(uid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    DisplayInfo(gson.fromJson(jsonObject.get("data").toString(), Patient[].class));
                    swipeInfo.setRefreshing(false);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                    new DialogConnection(v.getContext()).show();
                } else {
                    if (error.getLocalizedMessage().equalsIgnoreCase("TokenExpiredError")) {
                        new DialogAlert(v.getContext(), DialogAlert.State.Warning, "Sorry for inconvenience, please refresh application").show();
                    } else {
                        new DialogAlert(v.getContext(), DialogAlert.State.Error, error.getLocalizedMessage()).show();
                    }
                }
                swipeInfo.setRefreshing(false);
            }
        });
    }

    //Show data information in layout
    private void DisplayInfo(Patient[] patients) {
        String firstName, lastName;
        if (patients != null) {
            for (Patient patient : patients) {
                firstName = patient.getFirstName() == null ? "NONE" : patient.getFirstName();
                lastName = patient.getLastName() == null ? " " : patient.getLastName();
                lblNamePatient.setText(firstName + " " + lastName);
                lblHomePhone.setText(patient.getHomePhoneNumber() == null ? "NONE" : patient.getHomePhoneNumber());
                lblEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
                lblDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());
                lblAddress.setText(patient.getAddress1() == null ? "NONE" : patient.getAddress1());
                lblSuburb.setText(patient.getSuburb() == null ? "NONE" : patient.getSuburb());
                lblPostCode.setText(patient.getPostCode() == null ? "NONE" : patient.getPostCode());
                lblCountry.setText(patient.getCountryName() == null ? "NONE" : patient.getCountryName());
                LoadAvatar(Config.apiURLDownload + patient.getFileUID() == null ? " " : Config.apiURLDownload + patient.getFileUID());
            }
        }
    }

    //Down load and show image avatar
    private void LoadAvatar(String url) {
        Picasso picasso = new Picasso.Builder(v.getContext())
                .downloader(new UrlConnectionDownloader(v.getContext()) {
                    @Override
                    protected HttpURLConnection openConnection(Uri uri) throws IOException {
                        HttpURLConnection connection = super.openConnection(uri);
                        connection.addRequestProperty("Authorization", "Bearer " + telehealthPatient.getString("token", null));
                        connection.addRequestProperty("DeviceID", telehealthPatient.getString("deviceID", null));
                        connection.addRequestProperty("SystemType", "ARD");
                        connection.addRequestProperty("Cookie", telehealthPatient.getString("cookie", null));
                        connection.addRequestProperty("AppID", "com.redimed.telehealth.patient");
                        return connection;
                    }
                })
                .listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage() + "");
                    }
                }).build();

        picasso.load(url)
                .transform(new CircleTransform())
                .error(R.drawable.icon_error_image)
                .into(avatarPatient);
    }

    //Refresh information patient
    private void SwipeRefresh() {
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                GetInfoPatient();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);

        scrollViewInfo.post(new Runnable() {
            @Override
            public void run() {
                scrollViewInfo.fullScroll(ScrollView.FOCUS_UP);
                scrollViewInfo.scrollTo(0, 0);
            }
        });

        scrollViewInfo.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                int scrollY = scrollViewInfo.getScrollY();
                if (scrollY == 0) {
                    swipeInfo.setEnabled(true);
                } else swipeInfo.setEnabled(false);
            }
        });
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }
}
