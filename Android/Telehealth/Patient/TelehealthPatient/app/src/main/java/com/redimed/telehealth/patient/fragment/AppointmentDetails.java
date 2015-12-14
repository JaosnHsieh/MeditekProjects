package com.redimed.telehealth.patient.fragment;

import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.ModelActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.redimed.telehealth.patient.utils.Config;
import com.redimed.telehealth.patient.utils.RVAdapterImage;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class AppointmentDetails extends Fragment {

    private static String TAG = "DETAILS";
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int RESULT_RELOAD = 3;
    private View v;
    private Intent i;
    private Gson gson;
    private RegisterApi registerApi;
    private List<String> urlPicasso;
    private boolean flagLayout = false;
    private RVAdapterImage rvAdapterImage;
    private SharedPreferences telehealthPatient;
    private LinearLayoutManager layoutManagerCategories;
    private String fromTime, status, firstDoctor, middleDoctor, lastDoctor, appointmentUID;
    private Uri fileUri; // file url to store image
    public static final int MEDIA_TYPE_IMAGE = 1;

    @Bind(R.id.lblDate)
    TextView lblDate;
    @Bind(R.id.lblTime)
    TextView lblTime;
    @Bind(R.id.lblStatus)
    TextView lblStatus;
    @Bind(R.id.lblDoctorName)
    TextView lblDoctorName;
    @Bind(R.id.btnUpload)
    Button btnUpload;
    @Bind(R.id.rvImageAppointment)
    RecyclerView rvImageAppointment;
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblHome)
    TextView btnHome;
    @Bind(R.id.apptDetailLayout)
    LinearLayout apptDetailLayout;
    @Bind(R.id.imgTitle)
    ImageView imgTitle;

    public AppointmentDetails() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        v = inflater.inflate(R.layout.fragment_appointment_details, container, false);
        ButterKnife.bind(this, v);

        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        urlPicasso = new ArrayList<String>();
        gson = new Gson();
        registerApi = RESTClient.getRegisterApi();

        appointmentUID = this.getArguments().getString("appointmentUID", null);
        if (appointmentUID != null) {
            GetAppointmentDetails(appointmentUID);
        }
        if (savedInstanceState != null) {
            fileUri = savedInstanceState.getParcelable("fileUri");
        }

        rvImageAppointment.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(v.getContext(), LinearLayout.HORIZONTAL, false);
        rvImageAppointment.setLayoutManager(layoutManagerCategories);
        rvAdapterImage = new RVAdapterImage();
        rvImageAppointment.setAdapter(rvAdapterImage);

        btnUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogUploadImage();
            }
        });

        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        Picasso.with(v.getContext()).load(R.drawable.slider2).transform(new BlurTransformation(v.getContext(), 20)).into(new Target() {
            @Override
            public void onBitmapLoaded(Bitmap bitmap, Picasso.LoadedFrom from) {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                    apptDetailLayout.setBackgroundDrawable(new BitmapDrawable(v.getContext().getResources(), bitmap));
                    apptDetailLayout.invalidate();
                } else {
                    apptDetailLayout.setBackground(new BitmapDrawable(v.getContext().getResources(), bitmap));
                    apptDetailLayout.invalidate();
                }
            }

            @Override
            public void onBitmapFailed(Drawable errorDrawable) {
                Log.d(TAG, "Error " + errorDrawable);
            }

            @Override
            public void onPrepareLoad(Drawable placeHolderDrawable) {
                Log.d(TAG, "Prepare Load " + placeHolderDrawable);
            }
        });
        lblTitle.setText(getResources().getString(R.string.appt_title));
        Picasso.with(v.getContext()).load(R.drawable.detail_appt_icon).into(imgTitle);
        btnHome.setText(getResources().getString(R.string.back));
        btnHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ((MainActivity) v.getContext()).Display(2);
            }
        });
        return v;
    }

    //    Get Detail Appointment with param UID Appointment
    private void GetAppointmentDetails(String appointmentUID) {
        registerApi.getAppointmentDetails(appointmentUID, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                if (jsonObject.get("data").getAsJsonObject() != null) {
                    String doctor = jsonObject.get("data").getAsJsonObject().get("Doctors").toString();
                    Doctor[] doctors = gson.fromJson(doctor, Doctor[].class);

                    fromTime = jsonObject.get("data").getAsJsonObject().get("FromTime").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString();
                    status = jsonObject.get("data").getAsJsonObject().get("Status").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("Status").getAsString();

                    if (doctors.length > 0) {
                        for (int i = 0; i < doctors.length; i++) {
                            firstDoctor = doctors[i].getFirstName() == null ? " " : doctors[i].getFirstName();
                            middleDoctor = doctors[i].getMiddleName() == null ? " " : doctors[i].getMiddleName();
                            lastDoctor = doctors[i].getLastName() == null ? " " : doctors[i].getLastName();
                        }
                    } else {
                        firstDoctor = " ";
                        middleDoctor = " ";
                        lastDoctor = " ";
                    }

                    if (fromTime.equalsIgnoreCase("NONE")) {
                        AlertDialog alertDialog = new AlertDialog.Builder(v.getContext()).create();
                        alertDialog.setTitle(R.string.title_dialog_appt);
                        alertDialog.setMessage(v.getContext().getResources().getString(R.string.message_dialog_appt));

                        alertDialog.setButton(DialogInterface.BUTTON_POSITIVE, "Close", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ((MainActivity) v.getContext()).Display(2);
                            }
                        });
                        alertDialog.show();
                    } else {
                        lblDate.setText(MyApplication.getInstance().ConvertDate(fromTime));
                        lblTime.setText(MyApplication.getInstance().ConvertTime(fromTime));
                        if (status.equalsIgnoreCase("Approved")) {
                            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.approved));
                        } else {
                            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.unapproved));
                        }
                        lblStatus.setText(status);
                        lblDoctorName.setText(firstDoctor + middleDoctor + lastDoctor);
                    }

                    String fileUpload = jsonObject.get("data").getAsJsonObject().get("FileUploads").toString();
                    FileUpload[] fileUploads = gson.fromJson(fileUpload, FileUpload[].class);
                    GetFileUpload(fileUploads);
                } else {
                    Log.d(TAG, "No Result");
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }

    private void GetFileUpload(FileUpload[] fileUploads) {
        for (int i = 0; i < fileUploads.length; i++) {
            urlPicasso.add(Config.apiURLDownload + fileUploads[i].getUID());
        }
        rvAdapterImage.swapData(urlPicasso, telehealthPatient);
    }

    private void DialogUploadImage() {
        AlertDialog alertDialog = new AlertDialog.Builder(v.getContext()).create();
        alertDialog.setTitle("Choose an action");
        alertDialog.setMessage("Choose an action Camera or Gallery");

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Gallery", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(galleryIntent, RESULT_PHOTO);
            }
        });

        alertDialog.setButton(Dialog.BUTTON_POSITIVE, "Camera", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                fileUri = getOutputMediaFileUri(MEDIA_TYPE_IMAGE);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri);
                startActivityForResult(cameraIntent, RESULT_CAMERA);
            }
        });
        alertDialog.show();
    }

    public Uri getOutputMediaFileUri(int type) {
        return Uri.fromFile(getOutputMediaFile(type));
    }

    private static File getOutputMediaFile(int type) {
        // External sdcard location
        File mediaStorageDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "Telehealth");
        // Create the storage directory if it does not exist
        if (!mediaStorageDir.exists()) {
            if (!mediaStorageDir.mkdirs()) {
                Log.d(TAG, "Oops! Failed create " + TAG + " directory");
                return null;
            }
        }
        // Create a media file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        File mediaFile;
        if (type == MEDIA_TYPE_IMAGE) {
            mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
        } else {
            return null;
        }
        return mediaFile;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        outState.putParcelable("fileUri", fileUri);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        String picturePath = null;
        int columnIndex;
        Cursor cursor;
        Bitmap image = null;
        try {
            if (resultCode == getActivity().RESULT_OK) {
                switch (requestCode) {
                    case RESULT_PHOTO:
                        //Get uri image
                        Uri selectedImage = data.getData();
                        String[] filePathColumn = {MediaStore.Images.Media.DATA};
                        //Get cursor
                        cursor = v.getContext().getContentResolver().query(selectedImage, filePathColumn, null, null, null);
                        cursor.moveToFirst();
                        //Get path form cursor index
                        columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                        picturePath = cursor.getString(columnIndex);
                        cursor.close();
                        flagLayout = true;
                        break;

                    case RESULT_CAMERA:
                        // Downsizing image as it throws OutOfMemory Exception for larger images
                        picturePath = fileUri.getPath();
                        flagLayout = true;
                        break;

                    case RESULT_RELOAD:
                        flagLayout = false;
                        GetAppointmentDetails(appointmentUID);
                        break;
                }
                if (flagLayout) {
                    i = new Intent(v.getContext(), ModelActivity.class);
                    i.putExtra("picturePath", picturePath);
                    i.putExtra("appointmentUID", appointmentUID);
                    startActivityForResult(i, RESULT_RELOAD);
                }
            } else {
                Toast.makeText(v.getContext(), "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(2);
                    return true;
                }
                return false;
            }
        });
    }
}
