//
//  PatientInforViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/2/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class PatientInforViewController: BaseViewController {
    var isPresented = false
    
    @IBOutlet weak var ServicerequestedView: UIView!
    @IBOutlet weak var RelatedContentView: UIView!
    @IBOutlet weak var navigationBar: UINavigationBar!
    
    @IBOutlet weak var txtSuburb: AutoCompleteTextField!
    @IBOutlet weak var txtVeteranNumber: UITextField!
    @IBOutlet weak var txtMembership: UITextField!
    @IBOutlet weak var txtHealthFundName: UITextField!
    @IBOutlet weak var txtExpiry: UITextField!
    @IBOutlet weak var txtPosition: UITextField!
    @IBOutlet weak var txtMedicareNumber: UITextField!
    @IBOutlet weak var txtNOKEmail: UITextField!
    @IBOutlet weak var txtNOKTelephone: UITextField!
    @IBOutlet weak var txtNOKName: UITextField!
    @IBOutlet weak var txtWorkTelephone: UITextField!
    @IBOutlet weak var txtMobileTelephone: UITextField!
    @IBOutlet weak var txtHomeTelephone: UITextField!
    @IBOutlet weak var txtPostCode: UITextField!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var txtOccupation: UITextField!
    @IBOutlet weak var txtDOB: UITextField!
    @IBOutlet weak var txtGivenName: UITextField!
    @IBOutlet weak var txtFamilyName: UITextField!
    @IBOutlet weak var txtClaimNo: UITextField!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var txtSalutation: UITextField!
    @IBOutlet weak var backBarItem: UIBarButtonItem!
    @IBOutlet weak var btnSelect: UIButton!
    
    @IBOutlet weak var btnListSite: UIButton!
    @IBOutlet weak var btnListStaff: UIButton!
    var AppointmentUID = ""
    var pickerView = UIPickerView()
    var datePicker = UIDatePicker()
    let monthYearPickerView = MonthYearPickerView()
    var dataSalutation = ["","Mr", "Mrs", "Ms","Miss", "Master", "Dr"]
    var autocompleteUrls = [String]()
    var site = Site()
    var staff = DataPatientDetail()
    var PatientDataHard = General()
    var PatientDataChange = General()
    var pastUrls : [String] = []
    var expiryDate : String = ""
    var CheckOrientationDevice = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        DatepickerModeExpiry()
        if(Context.getDataDefasults(Define.keyNSDefaults.IsCompanyAccount) as! String != ""){
            btnListSite.hidden = false
            btnListStaff.hidden = false
        }
        print(Context.GetOrientationDevice())
        CheckOrientationDevice = Context.GetOrientationDevice()
        UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeLeft.rawValue), forKey: "orientation")
        txtSuburb.hidesWhenEmpty = true
        txtSuburb.hidesWhenSelected = true
        pastUrls = Context.getDataDefasults(Define.keyNSDefaults.pastUrls) as! [String]
        handleTextFieldInterfaces()
        SetDefautDataPatient()
        
    }
    private func handleTextFieldInterfaces(){
        txtSuburb.onTextChange = {[weak self] text in
            if !text.isEmpty{
                let scrollPoint: CGPoint  = CGPointMake(0.0, 200.0);
                self!.scrollView.setContentOffset(scrollPoint, animated: true)
                self!.txtSuburb.autoCompleteStrings = Context.searchAutocompleteEntriesWithSubstring(text,pastUrls: self!.pastUrls)
            }
        }
    }
    //set data patient
    func SetDefautDataPatient(){
        AllRedisiteData.general.removeAll()
        PatientData.general.removeAll()
        
        PatientDataHard.general.append(Context.EformtData("yes", name: "is_work_related", ref: "field_0_0_0", type: "eform_input_check_radio", checked: "true", refRow: "row_0_0"))
        PatientDataHard.general.append(Context.EformtData("no", name: "is_work_related", ref: "field_0_0_1", type: "eform_input_check_radio", checked: "false", refRow: "row_0_0"))
        
        PatientDataHard.general.append(Context.EformtData("yes", name: "service1", ref: "field_0_2_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_2"))
        PatientDataHard.general.append(Context.EformtData("yes", name: "service2", ref: "field_0_2_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_2"))
        PatientDataHard.general.append(Context.EformtData("yes", name: "service3", ref: "field_0_2_3", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_2"))
        PatientDataHard.general.append(Context.EformtData("yes", name: "service4", ref: "field_0_3_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_3"))
        PatientDataHard.general.append(Context.EformtData("yes", name: "service5", ref: "field_0_3_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_3"))
        PatientDataHard.general.append(Context.EformtData("yes", name: "service6", ref: "field_0_4_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_4"))
        PatientDataHard.general.append(Context.EformtData("yes", name: "service7", ref: "field_0_4_3", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_4"))
        
        PatientDataHard.general.append(Context.EformtData("Mr", name: "p_title", ref: "field_0_5_1", type: "eform_input_check_radio", checked: "false", refRow: "row_0_5"))
        PatientDataHard.general.append(Context.EformtData("Mrs", name: "p_title", ref: "field_0_5_2", type: "eform_input_check_radio", checked: "false", refRow: "row_0_5"))
        PatientDataHard.general.append(Context.EformtData("Ms", name: "p_title", ref: "field_0_5_3", type: "eform_input_check_radio", checked: "false", refRow: "row_0_5"))
        PatientDataHard.general.append(Context.EformtData("Miss", name: "p_title", ref: "field_0_6_1", type: "eform_input_check_radio", checked: "false", refRow: "row_0_6"))
        PatientDataHard.general.append(Context.EformtData("Master", name: "p_title", ref: "field_0_6_2", type: "eform_input_check_radio", checked: "false", refRow: "row_0_6"))
        PatientDataHard.general.append(Context.EformtData("Dr", name: "p_title", ref: "field_0_6_3", type: "eform_input_check_radio", checked: "false", refRow: "row_0_6"))
        
        PatientDataHard.general.append(Context.EformtData("yes", name: "is_private_health", ref: "field_1_1_1", type: "eform_input_check_radio", checked: "false", refRow: "row_1_1"))
        PatientDataHard.general.append(Context.EformtData("no", name: "is_private_health", ref: "field_1_1_2", type: "eform_input_check_radio", checked: "true", refRow: "row_1_1"))
        PatientDataHard.general.append(Context.EformtData("yes", name: "hospital_cover", ref: "field_1_3_1", type: "eform_input_check_radio", checked: "false", refRow: "row_1_3"))
        PatientDataHard.general.append(Context.EformtData("no", name: "hospital_cover", ref: "field_1_3_2", type: "eform_input_check_radio", checked: "true", refRow: "row_1_3"))
        PatientDataHard.general.append(Context.EformtData("na", name: "card_holder", ref: "field_1_5_1", type: "eform_input_check_radio", checked: "true", refRow: "row_1_5"))
        PatientDataHard.general.append(Context.EformtData("gold", name: "card_holder", ref: "field_1_5_2", type: "eform_input_check_radio", checked: "false", refRow: "row_1_5"))
        PatientDataHard.general.append(Context.EformtData("white", name: "card_holder", ref: "field_1_5_3", type: "eform_input_check_radio", checked: "false", refRow: "row_1_5"))
        
        AllRedisiteData.general = PatientDataHard.general
    }
    func CheckRequiredData()->Bool{
        txtSalutation.CheckTextFieldIsEmpty(txtSalutation)
        txtFamilyName.CheckTextFieldIsEmpty(txtFamilyName)
        txtDOB.CheckTextFieldIsEmpty(txtDOB)
        txtAddress.CheckTextFieldIsEmpty(txtAddress)
        txtOccupation.CheckTextFieldIsEmpty(txtOccupation)
        txtHomeTelephone.CheckTextFieldIsEmpty(txtHomeTelephone)
        
        if(txtSalutation.CheckTextFieldIsEmpty(txtSalutation) || txtFamilyName.CheckTextFieldIsEmpty(txtFamilyName) || txtDOB.CheckTextFieldIsEmpty(txtDOB) || txtAddress.CheckTextFieldIsEmpty(txtAddress) || txtOccupation.CheckTextFieldIsEmpty(txtOccupation) || txtHomeTelephone.CheckTextFieldIsEmpty(txtHomeTelephone)){
            self.AlertShow("Waring", message: "Please enter all required fields!")
            return false
        }else{
            if(CheckRegexTextField(txtNOKEmail,regex:Define.Regex.Email)){
                CheckSubmitData()
                return true
            }else{
                self.AlertShow("Waring", message: "Please check format fields!")
                return false
            }
        }
    }
    func CheckRegexTextField(textField:UITextField,regex:String)->Bool{
        if !Context.CheckRegex(textField.text!,regex:regex){
            textField.txtError(textField)
            return false
        }else{
            textField.textFiledOnlyLine(textField)
            return true
        }
    }
    override func shouldAutorotate() -> Bool {
        return false
    }
    func canRotate() -> Void {
        
    }
    func AlertShow(title:String,message:String){
        let alert = UIAlertController(title: title, message:message, preferredStyle: .Alert)
        alert.addAction(UIAlertAction(title: "OK", style: .Default) { _ in })
        self.presentViewController(alert, animated: true){}
    }
    @IBAction func ActionGenerailliness(sender: AnyObject) {
        if(CheckRequiredData()){
            let Generailliness :GeneralIllnessViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("GeneralIllnessViewControllerID") as! GeneralIllnessViewController
            self.presentViewController(Generailliness, animated: true, completion: nil)
        }
    }
    
    @IBAction func ActionInjury(sender: AnyObject) {
        if(CheckRequiredData()){
            let ActionInjury :InjuryViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("InjuryViewControllerID") as! InjuryViewController
            self.presentViewController(ActionInjury, animated: true, completion: nil)
        }
    }
    override func viewWillDisappear (animated: Bool) {
        super.viewWillDisappear(animated)
        self.navigationController?.navigationBarHidden = true
        if(CheckOrientationDevice == "LandscapeRight"){
            if (self.isMovingFromParentViewController()) {
                UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeRight.rawValue), forKey: "orientation")
            }
        }else{
            if (self.isMovingFromParentViewController()) {
                UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.PortraitUpsideDown.rawValue), forKey: "orientation")
            }
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        setUpUI()
        AllRedisiteData.general.removeAll()
        AllRedisiteData.general = PatientDataHard.general
        getStaff()
        backBarItem.width = 20
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if(segue.identifier == "SegueViewRelated"){
            self.SequeTableView(segue, titles: [["Work related","field_0_0_0"],["Not work related","field_0_0_1"]], listID: [0],type: "radio")
        }else if(segue.identifier == "SegueViewServiceRequested"){
            self.SequeTableView(segue, titles: [["Trauma Consult","field_0_2_0"],["First medical Certificate","field_0_2_1"],["Follow up in Perth","field_0_2_3"],["Fitness for work","field_0_3_1"],["Initial Telehealth Consult","field_0_3_2"],["Progress Telehealth Consult","field_0_4_2"],["Transport to/from Airport","field_0_4_3"]], listID: [],type: "")
        }
    }
    @IBAction func ChangePrivateHealth(sender: UISegmentedControl) {
        if(sender.selectedSegmentIndex == 0){
            Context.RadioGetData("no", title: [["no","field_1_1_2"],["yes","field_1_1_1"]])
        }
        else{
            Context.RadioGetData("yes", title: [["no","field_1_1_2"],["yes","field_1_1_1"]])
        }
    }
    @IBAction func ActionHistoryCover(sender: AnyObject) {
        if(sender.selectedSegmentIndex == 0){
            Context.RadioGetData("no", title: [["no","field_1_3_2"],["yes","field_1_3_1"]])
        }
        else{
            Context.RadioGetData("yes", title: [["no","field_1_3_2"],["yes","field_1_3_1"]])
        }
    }
    @IBAction func ActionCardHolder(sender: AnyObject) {
        if(sender.selectedSegmentIndex == 0){
            Context.RadioGetData("na", title: [["na","field_1_5_1"],["gold","field_1_5_2"],["white","field_1_5_3"]])
        }
        else if (sender.selectedSegmentIndex == 1){
            Context.RadioGetData("gold", title: [["na","field_1_5_1"],["gold","field_1_5_2"],["white","field_1_5_3"]])
        }else{
            Context.RadioGetData("white", title: [["na","field_1_5_1"],["gold","field_1_5_2"],["white","field_1_5_3"]])
        }
    }
    
    func loadataCompany() -> RequestAppointPostCompany {
        let requestAppointPostCompany = RequestAppointPostCompany()
        let requestAppointDataCompany = RequestAppointDataCompany()
        let patientAppointment = PatientAppointment()
        let patients = PatientsCompany()
        let dataCompany = DataCompany()
        if(Context.getDataDefasults(Define.keyNSDefaults.IsCompanyAccount) as! String != ""){
            patients.UID = staff.data.count != 0 ? staff.data[0].UID : ""
        }
        requestAppointDataCompany.RequestDate = Context.NowDate()
        requestAppointDataCompany.Type = "RediSite"
        
        patientAppointment.FirstName = txtFamilyName.text!
        patientAppointment.LastName = txtGivenName.text!
        patientAppointment.HomePhoneNumber = txtHomeTelephone.text!
        patientAppointment.PhoneNumber = txtMobileTelephone.text!
        patientAppointment.PhoneNumber = txtMobileTelephone.text!
        patientAppointment.WorkPhoneNumber = txtWorkTelephone.text!
        patientAppointment.Suburb = txtSuburb.text!
        patientAppointment.Postcode = txtPostCode.text!
        patientAppointment.DOB = txtDOB.text!
        patientAppointment.Address1 = txtAddress.text!
        patientAppointment.PatientKinFirstName = txtNOKName.text!
        patientAppointment.PatientKinLastName = txtNOKName.text!
        
        requestAppointDataCompany.appointmentData.append(AppendAppointData("SiteID",value:"\(site.ID)"))
        requestAppointDataCompany.patientAppointment = patientAppointment
        if(patients.UID != ""){
            requestAppointDataCompany.patientsCompany.append(patients)
        }
        dataCompany.appointmentsCompany.append(requestAppointDataCompany)
        requestAppointPostCompany.dataCompany = dataCompany
        return requestAppointPostCompany
    }
    func AppendAppointData(name:String,value:String)-> AppointmentData{
        let appointmentData = AppointmentData()
        appointmentData.Name = name
        appointmentData.Value = value
        return appointmentData
    }
    
    func CheckSubmitData(){
        PatientDataChange.general.removeAll()
        PatientDataChange.general.append(Context.EformtData(txtFamilyName.text!, name: "p_firstname", ref: "field_0_7_1", type: "eform_input_text", checked: "", refRow: "row_0_7"))
        PatientDataChange.general.append(Context.EformtData(txtGivenName.text!, name: "p_lastname", ref: "field_0_7_3", type: "eform_input_text", checked: "", refRow: "row_0_7"))
        PatientDataChange.general.append(Context.EformtData(txtDOB.text!, name: "p_dob", ref: "field_0_8_4", type: "eform_input_date", checked: "", refRow: "row_0_8"))
        PatientDataChange.general.append(Context.EformtData(txtClaimNo.text!, name: "p_claim", ref: "field_0_8_3", type: "eform_input_text", checked: "", refRow: "row_0_8"))
        PatientDataChange.general.append(Context.EformtData(txtAddress.text!, name: "p_address", ref: "field_0_9_1", type: "eform_input_text", checked: "", refRow: "row_0_9"))
        PatientDataChange.general.append(Context.EformtData(txtSuburb.text!, name: "p_suburb", ref: "field_0_10_1", type: "eform_input_text", checked: "", refRow: "row_0_10"))
        PatientDataChange.general.append(Context.EformtData(txtPostCode.text!, name: "p_postcode", ref: "field_0_10_2", type: "eform_input_text", checked: "", refRow: "row_0_10"))
        PatientDataChange.general.append(Context.EformtData(txtOccupation.text!, name: "p_job", ref: "field_0_10_3", type: "eform_input_text", checked: "", refRow: "row_0_10"))
        PatientDataChange.general.append(Context.EformtData(txtHomeTelephone.text!, name: "p_hm_phone", ref: "field_0_11_1", type: "eform_input_text", checked: "", refRow: "row_0_11"))
        PatientDataChange.general.append(Context.EformtData(txtMobileTelephone.text!, name: "p_mb_phone", ref: "field_0_11_2", type: "eform_input_text", checked: "", refRow: "row_0_11"))
        PatientDataChange.general.append(Context.EformtData(txtWorkTelephone.text!, name: "p_wk_phone", ref: "field_0_12_1", type: "eform_input_text", checked: "", refRow: "row_0_12"))
        PatientDataChange.general.append(Context.EformtData(txtNOKEmail.text!, name: "kin_email", ref: "field_0_12_3", type: "eform_input_text", checked: "", refRow: "row_0_12"))
        PatientDataChange.general.append(Context.EformtData(txtNOKName.text!, name: "kin_name", ref: "field_0_13_1", type: "eform_input_text", checked: "", refRow: "row_0_13"))
        PatientDataChange.general.append(Context.EformtData(txtNOKTelephone.text!, name: "kin_phone", ref: "field_0_13_3", type: "eform_input_text", checked: "", refRow: "row_0_13"))
        PatientDataChange.general.append(Context.EformtData(txtMedicareNumber.text!, name: "medicare_no", ref: "field_1_0_1", type: "eform_input_text", checked: "", refRow: "row_1_0"))
        PatientDataChange.general.append(Context.EformtData(txtPosition.text!, name: "pos_no", ref: "field_1_0_2", type: "eform_input_text", checked: "", refRow: "row_1_0"))
        PatientDataChange.general.append(Context.EformtData(txtExpiry.text!, name: "exp_date", ref: "field_1_0_5", type: "eform_input_text", checked: "", refRow: "row_1_0"))
        PatientDataChange.general.append(Context.EformtData(txtHealthFundName.text!, name: "private_fund", ref: "field_1_2_1", type: "eform_input_text", checked: "", refRow: "row_1_2"))
        PatientDataChange.general.append(Context.EformtData(txtMembership.text!, name: "health_fund_member", ref: "field_1_2_2", type: "eform_input_text", checked: "", refRow: "row_1_2"))
        PatientDataChange.general.append(Context.EformtData(txtVeteranNumber.text!, name: "veteran_no", ref: "field_1_4_1", type: "eform_input_text", checked: "", refRow: "row_1_4"))
        
        PatientDataHard.general = AllRedisiteData.general
        PatientData.general.removeAll()
        PatientData.general = PatientDataChange.general + PatientDataHard.general
        requestAppointPostCompany = loadataCompany()
        
        
    }
    @IBAction func ActionSelectStaff(sender: AnyObject) {
        let listStaffViewController :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ListStaffViewControllerID") as! ListStaffViewController
        self.navigationController?.pushViewController(listStaffViewController, animated: true)
    }
    func getStaff(){
        if(Context.getDataDefasults(Define.keyNSDefaults.DetailStaffCheck) as! String == "YES"){
            Context.deleteDatDefaults(Define.keyNSDefaults.DetailStaffCheck)
            let data : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.DetailStaff) as! NSDictionary
            staff = Mapper().map(data)!
            txtFamilyName.text = staff.data[0].FirstName
            txtGivenName.text = staff.data[0].LastName
            txtHomeTelephone.text = staff.data[0].HomePhoneNumber
            txtDOB.text = staff.data[0].DOB
            txtSuburb.text = staff.data[0].Suburb
            txtAddress.text = staff.data[0].Address1
            txtSalutation.text = staff.data[0].Title
            txtOccupation.text = staff.data[0].Occupation
            txtPostCode.text = staff.data[0].Postcode
            txtNOKEmail.text = staff.data[0].Email1
            Context.RadioGetData(staff.data[0].Title, title: [["Mr","field_0_5_1"],["Mrs","field_0_5_2"],["Ms","field_0_5_3"],["Miss","field_0_6_1"],["Master","field_0_6_2"],["Dr","field_0_6_3"]])
        }
        if(Context.getDataDefasults(Define.keyNSDefaults.DetailSiteCheck) as! String == "YES"){
            Context.deleteDatDefaults(Define.keyNSDefaults.DetailSiteCheck)
            let data : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.DetailSite) as! NSDictionary
            site = Mapper().map(data)!
            btnSelect.setTitle(site.SiteName, forState: .Normal)
        }
    }
    
    @IBAction func ActionSelectSite(sender: AnyObject) {
        let listContactPerson :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ListContactPersonViewControllerID") as! ListContactPersonViewController
        self.navigationController?.pushViewController(listContactPerson, animated: true)
    }
    @IBAction func ActionBack(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }
}
extension PatientInforViewController: UIPickerViewDataSource, UIPickerViewDelegate {
    func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
        return 1
    }
    func pickerView(pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return dataSalutation.count
    }
    func pickerView(pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return dataSalutation[row]
    }
    func pickerView(pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        txtSalutation.text = dataSalutation[row]
        Context.RadioGetData(dataSalutation[row], title: [["Mr","field_0_5_1"],["Mrs","field_0_5_2"],["Ms","field_0_5_3"],["Miss","field_0_6_1"],["Master","field_0_6_2"],["Dr","field_0_6_3"]])
    }
    
}
extension PatientInforViewController {
    func DatepickerMode(){
        txtDOB.tintColor = UIColor.clearColor()
        datePicker.datePickerMode = .Date
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        let doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: #selector(PatientInforViewController.doneClick))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: #selector(PatientInforViewController.cancelClick))
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        txtDOB.inputView = datePicker
        txtDOB.inputAccessoryView = toolBar
    }
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = "dd/MM/yyyy"
        dateFormatter.dateFormat = "dd/MM/yyyy"
        txtDOB.text = dateFormatter.stringFromDate(datePicker.date)
        txtDOB.resignFirstResponder()
        if(Context.compareDate(datePicker.date)){
            txtDOB.textFiledOnlyLine(txtDOB)
        }else{
            txtDOB.txtError(txtDOB)
        }
        
    }
    //Cancel button in datepicker
    func cancelClick() {
        txtDOB.resignFirstResponder()
    }
    func DatepickerModeExpiry(){
        
        txtExpiry.tintColor = UIColor.clearColor()
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        var fullDate = txtExpiry.text!.characters.split{$0 == "/"}.map(String.init)
        if(fullDate.count == 1){
            if let month : Int = Int(fullDate[0])!{
                if let year : Int =  Int(fullDate[1])! {
                    monthYearPickerView.SetCurrentDate(month,year: year)
                }
            }
        }
        monthYearPickerView.onDateSelected = { (month: Int, year: Int) in}
        let doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: #selector(PatientInforViewController.doneClickExpiry))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: #selector(PatientInforViewController.cancelClickExpiry))
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        txtExpiry.inputView = monthYearPickerView
        txtExpiry.inputAccessoryView = toolBar
    }
    func doneClickExpiry() {
        self.txtExpiry.text = monthYearPickerView.done()
        //        var fullDate = txtExpiry.text!.characters.split{$0 == "/"}.map(String.init)
        //        if(fullDate.count != 0){
        //            if let month : Int = Int(fullDate[0])!{
        //                if let year : Int =  Int(fullDate[1])! {
        //                    print(Context.getEndDateOfMonth(month, year: year))
        //                    let formatter = NSDateFormatter()
        //                    formatter.timeZone = NSTimeZone(abbreviation: "UTC")
        //                    let utcTimeZoneStr = formatter.stringFromDate(Context.getEndDateOfMonth(month, year: year)!)
        //                    print("utcTimeZoneStr",utcTimeZoneStr)
        //                }
        //            }
        //        }
        txtExpiry.resignFirstResponder()
    }
    func cancelClickExpiry() {
        monthYearPickerView.cancel()
        txtExpiry.resignFirstResponder()
    }
    
    
}

extension PatientInforViewController : UITextViewDelegate {
    func setUpUI(){
        self.navigationController?.navigationBarHidden = true
        self.automaticallyAdjustsScrollViewInsets = false
        
        txtVeteranNumber.textFiledOnlyLine(txtVeteranNumber)
        txtMembership.textFiledOnlyLine(txtMembership)
        txtHealthFundName.textFiledOnlyLine(txtHealthFundName)
        txtExpiry.textFiledOnlyLine(txtExpiry)
        txtPosition.textFiledOnlyLine(txtPosition)
        txtMedicareNumber.textFiledOnlyLine(txtMedicareNumber)
        txtNOKEmail.textFiledOnlyLine(txtNOKEmail)
        txtNOKTelephone.textFiledOnlyLine(txtNOKTelephone)
        txtNOKName.textFiledOnlyLine(txtNOKName)
        txtWorkTelephone.textFiledOnlyLine(txtWorkTelephone)
        txtMobileTelephone.textFiledOnlyLine(txtMobileTelephone)
        txtHomeTelephone.textFiledOnlyLine(txtHomeTelephone)
        txtPostCode.textFiledOnlyLine(txtPostCode)
        txtSuburb.textFiledOnlyLine(txtSuburb)
        txtAddress.textFiledOnlyLine(txtAddress)
        txtOccupation.textFiledOnlyLine(txtOccupation)
        txtDOB.textFiledOnlyLine(txtDOB)
        txtGivenName.textFiledOnlyLine(txtGivenName)
        txtFamilyName.textFiledOnlyLine(txtFamilyName)
        txtClaimNo.textFiledOnlyLine(txtClaimNo)
        txtSalutation.textFiledOnlyLine(txtSalutation)
        txtSalutation.textFiledOnlyLine(txtSalutation)
        RelatedContentView.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        ServicerequestedView.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        
        pickerView.delegate = self
        pickerView.dataSource = self
        txtSalutation.inputView = pickerView
        txtSalutation.enabled = true
        txtDOB.delegate = self
        txtSalutation.delegate = self
        txtClaimNo.delegate = self
        txtFamilyName.delegate = self
        txtGivenName.delegate = self
        txtOccupation.delegate = self
        txtAddress.delegate = self
        txtSuburb.delegate = self
        txtPostCode.delegate = self
        txtHomeTelephone.delegate = self
        txtWorkTelephone.delegate = self
        txtMobileTelephone.delegate = self
        txtNOKTelephone.delegate = self
        DatepickerMode()
        
    }
    
    func textFieldDidEndEditing(textField: UITextField) {
        if(textField.tag == 69){
            textField.CheckTextFieldIsEmpty(textField)
        }
    }
    func checkNumberPhone(textField: UITextField,string: String)->Bool{
        let hashValue = string.hash
        let length = ((textField.text?.length)! + string.length)
        if Context.validateInputOnlyNumber(hashValue) == false || length > 10 {
            return false
        }else{
            return true
        }
    }
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        switch textField {
        case txtHomeTelephone:
            return checkNumberPhone(textField,string: string)
        case txtMobileTelephone:
            return checkNumberPhone(textField,string: string)
        case txtWorkTelephone:
            return checkNumberPhone(textField,string: string)
        case txtWorkTelephone:
            return checkNumberPhone(textField,string: string)
        default:
            return true
        }
    }
}