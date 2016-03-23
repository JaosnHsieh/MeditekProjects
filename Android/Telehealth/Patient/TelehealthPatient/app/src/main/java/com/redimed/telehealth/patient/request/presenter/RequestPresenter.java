package com.redimed.telehealth.patient.request.presenter;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.confirm.ConfirmFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.request.view.IRequestView;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedFile;

/**
 * Created by Fox on 1/22/2016.
 */
public class RequestPresenter implements IRequestPresenter {

    private Gson gson;
    private File file;
    private Context context;
    private IRequestView iRequestView;
    private RegisterApi registerApiCore;
    private SimpleDateFormat dateFormat;
    private ArrayList<String> fileUploads;
    private IMainPresenter iMainPresenter;
    private SharedPreferences uidTelehealth;
    private String firstName, lastName, mobile, home, suburb, apptType, dob, email, des, sign = "";
    private static final String TAG = "===REQUEST_PRESENTER===";

    public RequestPresenter(Context context, IRequestView iRequestView, FragmentActivity activity) {
        this.context = context;
        this.iRequestView = iRequestView;

        iRequestView.onLoadToolbar();

        gson = new Gson();
        fileUploads = new ArrayList<String>();
        registerApiCore = RESTClient.getRegisterApiCore();
        iMainPresenter = new MainPresenter(context, activity);
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
        if (context.getSharedPreferences("ExistsUser", Context.MODE_PRIVATE).getBoolean("exists", false))
            uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public ArrayAdapter loadJsonData() {
        ArrayAdapter adapter = null;
        try {
            file = new File("/data/data/" + context.getApplicationContext().getPackageName() + "/" + context.getResources().getString(R.string.fileSuburb));
            if (file.exists()) {
                FileInputStream is = new FileInputStream(file);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);
                String[] suburbs = gson.fromJson(obj.get("data"), String[].class);
                adapter = new ArrayAdapter(context, android.R.layout.simple_list_item_1, suburbs);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return adapter;
    }

    @Override
    public Patient[] loadDataInfoExists() {
        Patient[] patients = null;
        file = new File("/data/data/" + context.getApplicationContext().getPackageName() + "/shared_prefs/PatientInfo.xml");
        if (file.exists()) {
            SharedPreferences spPatientInfo = context.getSharedPreferences("PatientInfo", Context.MODE_PRIVATE);
            patients = gson.fromJson(spPatientInfo.getString("info", ""), Patient[].class);
        }
        return patients;
    }

    @Override
    public void displayDatePickerDialog() {
        Calendar birthdayCalendar = Calendar.getInstance();
        DatePickerDialog birthdayPickerDialog = new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                iRequestView.onLoadDOB(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    @Override
    public void hideKeyboardFragment(View view) {
        //Set up touch listener for non-text box views to hide keyboard.
        if (!(view instanceof EditText)) {
            view.setOnTouchListener(new View.OnTouchListener() {
                public boolean onTouch(View v, MotionEvent event) {
                    InputMethodManager inputMethodManager = (InputMethodManager)
                            context.getSystemService(Activity.INPUT_METHOD_SERVICE);
                    inputMethodManager.hideSoftInputFromWindow(((Activity) context).getCurrentFocus().getWindowToken(), 0);
                    return false;
                }
            });
        }

        //If a layout container, iterate over children and seed recursion.
        if (view instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                View innerView = ((ViewGroup) view).getChildAt(i);
                hideKeyboardFragment(innerView);
            }
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void changeActivity() {
        Bundle bundle = new Bundle();
        bundle.putString("firstName", firstName);
        bundle.putString("lastName", lastName);
        bundle.putString("mobile", mobile);
        bundle.putString("home", home);
        bundle.putString("suburb", suburb);
        bundle.putString("apptType", apptType);
        bundle.putString("dob", dob);
        bundle.putString("email", email);
        bundle.putString("des", des);
        bundle.putStringArrayList("fileUploads", fileUploads);
        bundle.putString("sign", sign);

        Fragment fragment = new ConfirmFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public void getValueSign(String sign){
        if (sign != null){
            this.sign = sign;
        }
    }

    @Override
    public void checkFields(ArrayList<EditText> arrEditText, String suburb, String apptType) {
        if (isValidateForm(arrEditText) && !suburb.equalsIgnoreCase("") && !apptType.equalsIgnoreCase("")) {
            this.suburb = suburb;
            this.apptType = apptType;

            GetDataField(arrEditText);
        } else if (suburb.equalsIgnoreCase("")) {
            iRequestView.onResultSuburb(false);
        } else if (apptType.equalsIgnoreCase("")) {
            iRequestView.onResultApptType(false);
        }
    }

    private void GetDataField(ArrayList<EditText> arrayList) {
        for (EditText editText : arrayList) {
            switch (editText.getId()) {
                case R.id.txtFirstName:
                    firstName = editText.getText().toString();
                    break;
                case R.id.txtLastName:
                    lastName = editText.getText().toString();
                    break;
                case R.id.txtMobile:
                    mobile = editText.getText().toString();
                    break;
                case R.id.txtDOB:
                    dob = editText.getText().toString();
                    break;
                case R.id.txtEmail:
                    email = editText.getText().toString();
                    break;
                case R.id.txtHome:
                    home = editText.getText().toString();
                    break;
                case R.id.txtDescription:
                    des = editText.getText().toString();
                    break;
            }
        }
        iRequestView.onFieldOk();
    }

    @Override
    public void uploadImage(ArrayList<CustomGallery> customGalleries) {
        TypedFile typedFile;
        for (int i = 0; i < customGalleries.size(); i++) {
            typedFile = new TypedFile("multipart/form-data", new File(customGalleries.get(i).sdcardPath));
            registerApiCore.uploadFile(uidTelehealth.getString("userUID", ""), "MedicalImage", typedFile, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String status = jsonObject.get("status").getAsString();
                    if (status.equalsIgnoreCase("success")) {
                        fileUploads.add(jsonObject.get("fileUID").getAsString());
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    Log.d(TAG, error.getLocalizedMessage());
                }
            });
        }
        changeActivity();
    }

    @Override
    public ArrayAdapter<String> setDataApptType() {
        final Boolean[] flag = {true};
        List<String> apptType = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.appt__type_arrays)));

        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(context, android.R.layout.simple_list_item_1, apptType) {
            @Override
            public boolean isEnabled(int position) {
                return position != 0;
            }

            @Override
            public View getDropDownView(int position, View convertView, ViewGroup parent) {
                View view = super.getDropDownView(position, convertView, parent);
                TextView textView = (TextView) view;
                if (position == 0) {
                    textView.setTextColor(Color.GRAY);
                } else {
                    textView.setTextColor(Color.BLACK);
                }
                return view;
            }

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                if (flag[0]) {
                    flag[0] = false;
                    View view = super.getView(position, convertView, parent);
                    ((TextView) view).setTextColor(Color.GRAY);
                    return view;
                }
                return super.getView(position, convertView, parent);
            }
        };
        spinnerArrayAdapter.setDropDownViewResource(android.R.layout.simple_list_item_1);
        return spinnerArrayAdapter;
    }

    private boolean isValidateForm(ArrayList<EditText> arr) {
        boolean isValid = true;
        // Validation Edit Text
        for (int i = 0; i < arr.size(); i++) {
            if (isRequiredData(arr.get(i)) && arr.get(i).getId() != R.id.txtHome && arr.get(i).getId() != R.id.txtDescription) {
                iRequestView.onResultField(arr.get(i));
                isValid = false;
            }
            if (arr.get(i).getId() == R.id.txtMobile) {
                if (!isContactValid(arr.get(i))) {
                    iRequestView.onResultMobile(isContactValid(arr.get(i)));
                    isValid = false;
                }
            }
            if (arr.get(i).getId() == R.id.txtEmail) {
                if (!isEmailValid(arr.get(i))) {
                    iRequestView.onResultEmail(isEmailValid(arr.get(i)));
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    public boolean isRequiredData(EditText editText) {
        boolean isRequire = false;
        if (editText.getText().length() == 0) {
            isRequire = true;
        }
        return isRequire;
    }

    @Override
    public void setImageGallery(String[] allPath) {
        ArrayList<CustomGallery> dataT = new ArrayList<CustomGallery>();
        for (String string : allPath) {
            CustomGallery item = new CustomGallery();
            item.sdcardPath = string;
            dataT.add(item);
        }
        iRequestView.onLoadGallery(dataT);
    }

    // Validate contact phone
    public boolean isContactValid(EditText editText) {
        boolean isValid = false;
        String editTextContactNo = editText.getText().toString();
        String expression = "^(\\+61|0061|0)?4[0-9]{8}$";
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(editTextContactNo);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    // Validate email
    public boolean isEmailValid(EditText editText) {
        boolean isValid = false;
        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        CharSequence inputStr = editText.getText();
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }
}
