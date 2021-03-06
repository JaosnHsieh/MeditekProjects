package com.redimed.telehealth.patient.request;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AutoCompleteTextView;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.request.presenter.IRequestPresenter;
import com.redimed.telehealth.patient.request.presenter.RequestPresenter;
import com.redimed.telehealth.patient.request.view.IRequestView;
import com.redimed.telehealth.patient.adapter.ImageRequestAdapter;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.widget.DialogConnection;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;
import com.redimed.telehealth.patient.views.SignaturePad;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class RequestFragment extends Fragment implements IRequestView, View.OnClickListener, View.OnFocusChangeListener {

    private Context context;
    private String apptType;
    private boolean flagBack;
    private ActionBar actionBar;
    private ArrayList<EditText> arrEditText;
    private IRequestPresenter iRequestPresenter;
    private ArrayList<CustomGallery> customGalleries;
    private static final String TAG = "=====REQUEST=====";

    /* View Flipper contain layout Request and Confirm */
    @Bind(R.id.vfContainerRequest)
    ViewFlipper vfContainerRequest;
    /* Field layout Request */
    @Bind(R.id.layoutRequest)
    LinearLayout layoutRequest;
    @Bind(R.id.txtFirstName)
    EditText txtFirstName;
    @Bind(R.id.txtLastName)
    EditText txtLastName;
    @Bind(R.id.txtMobile)
    EditText txtMobile;
    @Bind(R.id.txtHome)
    EditText txtHome;
    @Bind(R.id.autoCompleteSuburb)
    AutoCompleteTextView autoCompleteSuburb;
    @Bind(R.id.spinnerApptType)
    Spinner spinnerApptType;
    @Bind(R.id.lblInvisibleError)
    TextView lblInvisibleError;
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtEmail)
    EditText txtEmail;
    @Bind(R.id.txtDescription)
    EditText txtDescription;
    @Bind(R.id.lblSubmit)
    TextView btnSubmit;
    @Bind(R.id.rvRequestImage)
    RecyclerView rvRequestImage;
    @Bind(R.id.lblImage)
    TextView lblImage;

    /* Field layout Confirm */
    @Bind(R.id.layoutConfirm)
    LinearLayout layoutConfirm;
    @Bind(R.id.lblRequestDate)
    TextView lblRequestDate;
    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;
    @Bind(R.id.lblPhone)
    TextView lblPhone;
    @Bind(R.id.lblSuburb)
    TextView lblSuburb;
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.lblEmail)
    TextView lblEmail;
    @Bind(R.id.chkConsent1)
    CheckBox chkConsent1;
    @Bind(R.id.chkConsent2)
    CheckBox chkConsent2;
    @Bind(R.id.chkConsent3)
    CheckBox chkConsent3;
    @Bind(R.id.lblComplete)
    TextView btnComplete;
    @Bind(R.id.lblFAQs)
    TextView btnFAQs;
    /* Signature */
    @Bind(R.id.signaturePad)
    SignaturePad signaturePad;
    @Bind(R.id.vfContainer)
    ViewFlipper vfContainer;
    @Bind(R.id.lblClear)
    TextView btnClear;
    @Bind(R.id.lblSave)
    TextView btnSave;
    @Bind(R.id.layoutSubmit)
    LinearLayout layoutSubmit;
    @Bind(R.id.imgSignature)
    ImageView imgSignature;

    /* Upload */
    @Bind(R.id.layoutUpload)
    RelativeLayout layoutUpload;
    @Bind(R.id.lblUpload)
    TextView btnUpload;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;

    public RequestFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_request_telehealth, container, false);
        setHasOptionsMenu(true);
        context = v.getContext();
        ButterKnife.bind(this, v);

        iRequestPresenter = new RequestPresenter(context, this, getActivity());
        iRequestPresenter.hideKeyboardFragment(v);

        init();
        initSpinner();
        initSignature();
        onLoadToolbar();

        /* Action layout Request */
        btnUpload.setOnClickListener(this);
        btnSubmit.setOnClickListener(this);
        txtDOB.setOnFocusChangeListener(this);

        /* Action layout Confirm */
        btnFAQs.setOnClickListener(this);
        btnSave.setOnClickListener(this);
        btnClear.setOnClickListener(this);
        btnComplete.setOnClickListener(this);

        return v;
    }

    void init() {

        onLoadData(iRequestPresenter.loadDataInfoExists());
        customGalleries = new ArrayList<>();

        //init array EditText
        arrEditText = new ArrayList<>();
        arrEditText.add(txtFirstName);
        arrEditText.add(txtLastName);
        arrEditText.add(txtMobile);
        arrEditText.add(txtDOB);
        arrEditText.add(txtEmail);
        arrEditText.add(txtHome);
        arrEditText.add(txtDescription);

        //init Suburb
        if (iRequestPresenter.loadJsonData() != null) {
            autoCompleteSuburb.setThreshold(1);
            autoCompleteSuburb.setAdapter(iRequestPresenter.loadJsonData());
        }
    }

    private void initSpinner() {
        spinnerApptType.setAdapter(iRequestPresenter.setDataApptType());
        spinnerApptType.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedItemText = (String) parent.getItemAtPosition(position);
                // If user change the default selection
                // First item is disable and it is used for hint
                if (position == 0) {
                    apptType = "";
                } else {
                    // Notify the selected item text
                    apptType = selectedItemText;
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    private void initSignature() {
        signaturePad.setOnSignedListener(new SignaturePad.OnSignedListener() {
            @Override
            public void onStartSigning() {
                Toast.makeText(context, "OnStartSigning", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onSigned() {
                btnSave.setEnabled(true);
                btnClear.setEnabled(true);
            }

            @Override
            public void onClear() {
                btnSave.setEnabled(false);
                btnClear.setEnabled(false);
            }
        });
    }

    private void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        actionBar = appCompatActivity.getSupportActionBar();
        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(getResources().getString(R.string.res_title));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

            // Change color image back, set a custom icon for the default home button
            final Drawable upArrow = ContextCompat.getDrawable(context, R.drawable.abc_ic_ab_back_material);
            upArrow.setColorFilter(ContextCompat.getColor(context, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
            actionBar.setHomeAsUpIndicator(upArrow);
        }

        Bundle bundle = getArguments();
        if (bundle != null) {
            flagBack = bundle.getBoolean("confirmRequest", false);
            if (flagBack) {
                actionBar.setTitle(getResources().getString(R.string.confirm_title));

                customGalleries = bundle.getParcelableArrayList("fileUploads");
                lblNamePatient.setText(bundle.getString("firstName") + " " + bundle.getString("lastName"));
                lblDOB.setText(bundle.getString("dob"));
                lblEmail.setText(bundle.getString("email"));
                lblPhone.setText(bundle.getString("mobile"));
                lblSuburb.setText(bundle.getString("suburb"));
                lblRequestDate.setText(iRequestPresenter.getCurrentDateSystem());

                vfContainerRequest.setDisplayedChild(vfContainerRequest.indexOfChild(layoutConfirm));
                iRequestPresenter.returnData(bundle);
                bundle.clear();
            }
        }
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                if (vfContainerRequest.indexOfChild(vfContainerRequest.getCurrentView()) == 0) {
                    iRequestPresenter.changeFragment(new HomeFragment());
                } else {
                    vfContainerRequest.setDisplayedChild(vfContainerRequest.indexOfChild(layoutRequest));
                }
//                if (flagBack) {
//                    onLoadToolbar();
//                    vfContainerRequest.setDisplayedChild(vfContainerRequest.indexOfChild(layoutRequest));
//                } else {
//                    vfContainerRequest.setDisplayedChild(vfContainerRequest.indexOfChild(layoutConfirm));
//                }
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void onLoadData(Patient[] patients) {
        if (patients != null) {

            btnUpload.setVisibility(View.VISIBLE);
            layoutUpload.setVisibility(View.VISIBLE);

            for (Patient patient : patients) {
                txtFirstName.setText(patient.getFirstName() == null ? "" : patient.getFirstName());
                txtLastName.setText(patient.getLastName() == null ? "" : patient.getLastName());
                txtMobile.setText(patient.getPhoneNumber() == null ? "" : patient.getPhoneNumber());
                txtDOB.setText(patient.getDOB() == null ? "" : patient.getDOB());
                txtEmail.setText(patient.getEmail() == null ? "" : patient.getEmail());
                autoCompleteSuburb.setText(patient.getSuburb() == null ? "" : patient.getSuburb());
                txtHome.setText(patient.getHomePhoneNumber() == null ? "" : patient.getHomePhoneNumber());

                //Get value signature
                iRequestPresenter.getValueSign(patient.getSignature() == null ? "" : patient.getSignature());
            }
        }
    }

    @Override
    public void onLoadDOB(String dob) {
        txtDOB.setText(dob);
    }

    @Override
    public void onResultField(EditText editText) {
        if (editText != null) {
            editText.requestFocus(); // Scrolls view to this field.
            editText.setError(getResources().getString(R.string.field_empty));
        }
    }

    @Override
    public void onResultMobile(boolean phone) {
        if (!phone) {
            txtMobile.setText("");
            txtMobile.requestFocus();
            txtMobile.setError(getResources().getString(R.string.phone_format));
        }
    }

    @Override
    public void onResultEmail(boolean email) {
        if (!email) {
            txtEmail.setText("");
            txtEmail.requestFocus();
            txtEmail.setError(getResources().getString(R.string.email_valid));
        }
    }

    @Override
    public void onResultSuburb(boolean suburb) {
        if (!suburb) {
            autoCompleteSuburb.setText("");
            autoCompleteSuburb.requestFocus();
            autoCompleteSuburb.setError(getResources().getString(R.string.field_empty));
        }
    }

    @Override
    public void onResultApptType(boolean apptType) {
        if (!apptType) {
            // Set fake TextView to be in error so that the error message appears
            lblInvisibleError.requestFocus();
            lblInvisibleError.setError(getResources().getString(R.string.field_empty));
        }
    }

    @Override
    public void onLoadImgSignature(Bitmap bitmap, String path) {
        if (bitmap != null) {
            imgSignature.setImageBitmap(bitmap);
            vfContainer.setDisplayedChild(vfContainer.indexOfChild(layoutSubmit));
            if (!path.equals("")) {
                iRequestPresenter.uploadNonLogin(path);
            }
        }
    }

    @Override
    public void onLoadGallery(ArrayList<CustomGallery> customGalleries) {
        this.customGalleries = customGalleries;
        if (customGalleries.size() > 0)
            lblImage.setVisibility(View.GONE);

        ImageRequestAdapter imageRequestAdapter = new ImageRequestAdapter(customGalleries, context);

        PreCachingLayoutManager layoutManagerCategories = new PreCachingLayoutManager(context);
        layoutManagerCategories.setOrientation(LinearLayoutManager.HORIZONTAL);
        layoutManagerCategories.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

        rvRequestImage.setLayoutManager(layoutManagerCategories);
        rvRequestImage.setAdapter(imageRequestAdapter);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.lblUpload:
                Intent i = new Intent("ACTION_MULTIPLE_PICK");
                startActivityForResult(i, 200);
                break;
            case R.id.lblSubmit:
                actionBar.setTitle(getResources().getString(R.string.confirm_title));
                iRequestPresenter.checkFields(arrEditText, autoCompleteSuburb.getText().toString(), apptType);
                break;
            case R.id.lblSave:
                iRequestPresenter.saveBitmapSign(signaturePad);
                break;
            case R.id.lblClear:
                signaturePad.clear();
                break;
            case R.id.lblComplete:
                if (!iRequestPresenter.isCheckPatientConsent(chkConsent1, chkConsent2, chkConsent3)) {
                    Toast.makeText(context, getString(R.string.confirm_alert), Toast.LENGTH_SHORT).show();
                } else {
                    iRequestPresenter.completeRequest(customGalleries);
                }
                break;
            case R.id.lblFAQs:
                iRequestPresenter.displayFAQs(customGalleries);
                break;
            default:
                break;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case 200:
                    String[] allPath = data.getStringArrayExtra("all_path");
                    iRequestPresenter.setImageGallery(allPath);
                    break;
                default:
                    break;
            }
        }
    }

    @Override
    public void changeViewFlipper() {
        lblNamePatient.setText(txtFirstName.getText() + " " + txtLastName.getText());
        lblDOB.setText(txtDOB.getText());
        lblEmail.setText(txtEmail.getText());
        lblPhone.setText(txtMobile.getText());
        lblSuburb.setText(autoCompleteSuburb.getText());
        lblRequestDate.setText(iRequestPresenter.getCurrentDateSystem());

        vfContainerRequest.setDisplayedChild(vfContainerRequest.indexOfChild(layoutConfirm));
    }

    @Override
    public void onLoadSuccess() {
        iRequestPresenter.changeFragment(new HomeFragment());
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
                    .setContentText(getResources().getString(R.string.token_expired))
                    .show();
        } else {
            new SweetAlertDialog(context, SweetAlertDialog.ERROR_TYPE)
                    .setContentText(msg)
                    .show();
        }
    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        if (hasFocus) {
            txtDOB.setError(null);
            iRequestPresenter.displayDatePickerDialog();
        }
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        if (getView() != null) {
            getView().setFocusableInTouchMode(true);
            getView().requestFocus();
            getView().setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                        iRequestPresenter.changeFragment(new HomeFragment());
                        return true;
                    }
                    return false;
                }
            });
        }
    }
}
