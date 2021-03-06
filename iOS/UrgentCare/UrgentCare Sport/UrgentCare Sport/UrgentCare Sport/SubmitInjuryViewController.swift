//
//  SubmitInjuryViewController.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import SystemConfiguration
class SubmitInjuryViewController: UIViewController,SSRadioButtonControllerDelegate,UITextViewDelegate,UITextFieldDelegate {
    let colorCustomRed = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    let  colorCustomBrow =  UIColor(red: 238/255, green: 238/255, blue: 238/255, alpha: 1.0)
    @IBOutlet weak var descriptionTextView: UITextView!
    @IBOutlet weak var autoTableView: UITableView!
    @IBOutlet weak var firstNameTextField: UITextField!
    @IBOutlet weak var lastNameTextField: UITextField!
    @IBOutlet weak var contactPhoneTextField: UITextField!
    @IBOutlet weak var suburbTextField: UITextField!
    @IBOutlet weak var birthDayTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var btnYes: SSRadioButton!
    @IBOutlet weak var btnNo: SSRadioButton!
    @IBOutlet weak var Plastic: SSRadioButton!
    @IBOutlet weak var Othopaedic: SSRadioButton!
    
    @IBOutlet weak var specialistLabel: UILabel!
    
    @IBOutlet weak var Navigationbar: UINavigationBar!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var btnMakeAppointment: DesignableButton!
    
    @IBOutlet weak var GPReferralLabel: UILabel!
    var autocompleteUrls = [String]()
    var datePicker = UIDatePicker()
    var checkDOB = true
    var dateofbirth: String = ""
    var GPReferral : String = "Y"
    var radioButtonController: SSRadioButtonsController?
    var radioButtonSpecialistController: SSRadioButtonsController?
    var NavigateBarTitle: String!
    var SportTye: String!
    var pastUrls : [String] = []
    var GP:String = "N"
    var physiotherapy:String = "N"
    var specialist:String = "N"
    var handTherapy:String = "N"
    var specialistType : String = ""
    var urgentRequestType : String = "SportInjury"
    var Info : Information!
    
    @IBOutlet weak var btnSubmit: DesignableButton!
   
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if GP == "Y" {
            GPReferralLabel.hidden = true
            btnYes.hidden = true
            btnNo.hidden = true
            GPReferral = ""
        }
        if specialist == "Y"{
            Plastic.hidden = false
            Othopaedic.hidden = false
            specialistLabel.hidden = false
        }
        
       
        
        
        suburbTextField.delegate = self
        firstNameTextField.delegate = self
        lastNameTextField.delegate = self
        contactPhoneTextField.delegate = self
        emailTextField.delegate = self
        birthDayTextField.delegate = self
        descriptionTextView.delegate = self
        
        //set title navigation bar
        Navigationbar.topItem?.title = NavigateBarTitle
        
        //set radio button
        radioButtonController = SSRadioButtonsController(buttons: btnYes, btnNo)
        radioButtonController!.delegate = self
        radioButtonController!.shouldLetDeSelect = false
        btnYes.selected = true
        suburbTextField.delegate = self
        //set radio specialist group
        radioButtonSpecialistController = SSRadioButtonsController(buttons: Plastic, Othopaedic)
        radioButtonSpecialistController!.delegate = self
        radioButtonSpecialistController!.shouldLetDeSelect = false

        
        getPersonalData()
        
        
        DatepickerMode()
    }
 
    override func viewDidAppear(animated: Bool) {
        customTextField(colorCustomBrow)
        
    }
    
    //select radio button
    func didSelectButton(aButton: UIButton?) {
        if aButton?.titleLabel?.text == "Yes"{
            GPReferral = "Y"
        }else if aButton?.titleLabel?.text == "No"{
            GPReferral = "N"
        }
        
        if aButton?.titleLabel?.text == "Plastic surgeon"{
            specialistType = (aButton?.titleLabel?.text)!
        }else if aButton?.titleLabel?.text == "Orthopaedic surgeon" {
            specialistType = (aButton?.titleLabel?.text)!
        }
        
    }
    
    //custom textFiled
    func customTextField(color:UIColor){
        var arrText : [UITextField] = [firstNameTextField,lastNameTextField,contactPhoneTextField,suburbTextField,birthDayTextField,emailTextField]
        for var i = 0; i < arrText.count ; i++ {
            borderTextFieldValid(arrText[i], color: color)
        }
        
        
        
    }
    
    //get localdata and set texfield
    func getPersonalData(){
        
        
        let defaults = NSUserDefaults.standardUserDefaults()
        firstNameTextField.text = defaults.stringForKey(model.firstName)
        lastNameTextField.text = defaults.stringForKey(model.lastName)
        contactPhoneTextField.text = defaults.stringForKey(model.phonenumber)
        emailTextField.text = defaults.stringForKey(model.email)
        birthDayTextField.text = defaults.stringForKey(model.DOB)
        suburbTextField.text = defaults.stringForKey(model.suburb)
        
    }
    
    //check local data and textfield
    func checkData() -> Bool{
        let defaults = NSUserDefaults.standardUserDefaults()
        
        
        if firstNameTextField.text == defaults.stringForKey(model.firstName) &&
            lastNameTextField.text == defaults.stringForKey(model.lastName) &&
            contactPhoneTextField.text == defaults.stringForKey(model.phonenumber) &&
            emailTextField.text == defaults.stringForKey(model.email) &&
            birthDayTextField.text == defaults.stringForKey(model.DOB) &&
            suburbTextField.text == defaults.stringForKey(model.suburb)
            
        {
            return true
        }else {
            return false
        }
    }
    
    
    @IBAction func makeAppointmentButton(sender: AnyObject) {
        
        //check netword
        if SubmitInjuryViewController.isConnectedToNetwork() == false {
            OpenWifi()
        }else {
            checkfield()
            if firstNameTextField.text == "" || lastNameTextField.text == "" || contactPhoneTextField.text == "" {
                alertMessage("Required", message: "Please Check your information!")
            }else {
                if checkMaxLength(firstNameTextField, length: 50) == false{
                    alertMessage("Required", message: "FirstName is max 50 character!")
                }else if checkMaxLength(lastNameTextField, length: 250) == false {
                    alertMessage("Required", message: "LastName is max 250 character!")
                }else if checkMaxLength(contactPhoneTextField, length: 100) == false{
                    alertMessage("Required", message: "Contact Phone is max 250 character!")
                }else if validatePhoneNumber(contactPhoneTextField.text!,regex:RegexString.MobileNumber) == false {
                    borderTextFieldValid(contactPhoneTextField, color: colorCustomRed)
                    alertMessage("Required", message: "Please Check your phonenumber!")
                }else if emailTextField.text != "" && validatePhoneNumber(emailTextField.text!,regex:RegexString.Email) == false {
                        alertMessage("Required", message: "Please Check your email!")
                        borderTextFieldValid(emailTextField, color: colorCustomRed)
                }else if birthDayTextField.text != "" && checkDOB == false {
                        alertMessage("Required", message: "Please Check your BirthDay!")
                        borderTextFieldValid(birthDayTextField, color: colorCustomRed)
                }
                else {
                    
                    sendingData()
                }
            }
        }
        
        
    }
    
    func sendingData(){
        self.view.showLoading()
        btnMakeAppointment.enabled = false
        Info =  Information(firstName: (firstNameTextField.text?.capitalizeFirst)!, lastName: (lastNameTextField.text?.capitalizeFirst)!, phoneNumber: contactPhoneTextField.text!, email: emailTextField.text!, DOB: birthDayTextField.text!, suburb: suburbTextField.text!, GPReferral: GPReferral, description: descriptionTextView.text!, physiotherapy: physiotherapy, specialist: specialist, handTherapy: handTherapy, urgentRequestType: urgentRequestType, requestDate: NowDate(),GP:GP,specialistType:specialistType)
        submitDataToServe(Info)
    }
    
    func NowDate()->String{
        let nowdate = NSDate()
        var DateString:String = ""
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss Z"
        DateString = dateFormatter.stringFromDate(nowdate)
        return DateString
    }
    
    //post to server
    func submitDataToServe(infor:Information) {
        var phoneNumber = infor.phoneNumber
        let getFourCharacterInPhone =  phoneNumber.substringWithRange(Range<String.Index>(start: phoneNumber.startIndex.advancedBy(0), end: phoneNumber.startIndex.advancedBy(4)))
        if getFourCharacterInPhone == "0061"{
            phoneNumber = "+61" + phoneNumber.substringWithRange(Range<String.Index>(start: phoneNumber.startIndex.advancedBy(4), end: phoneNumber.endIndex.advancedBy(-1)))
            print(phoneNumber)

        }else {
            
            infor.phoneNumber.removeAtIndex(phoneNumber.startIndex)
            phoneNumber = "+61" + infor.phoneNumber
            print(phoneNumber)
        }

        let parameters = [
            "data": [
                "firstName":infor.firstName,
                "lastName":infor.lastName,
                "phoneNumber":phoneNumber,
                "email":infor.email,
                "DOB":infor.DOB,
                "suburb":infor.suburb,
                "GPReferral":infor.GPReferral,
                "description":infor.description,
                "physiotherapy":infor.physiotherapy,
                "specialist":infor.specialist,
                "handTherapy":infor.handTherapy,
                "GP": infor.GP,
                "urgentRequestType":infor.urgentRequestType,
                "requestDate":infor.requestDate,
                "specialistType":infor.specialistType
            ]
        ]
        print(parameters)
        Alamofire.request(.POST,api.submitInjury,headers: headers,parameters: parameters).responseJSON{
            request, response, result  in
            self.view.hideLoading()
            self.btnMakeAppointment.enabled = true
            switch result {
            case .Success(let JSONData):
                let data = JSON(JSONData)
                if data["data"].string == "success" {
                      infor.phoneNumber = self.contactPhoneTextField.text
                    self.successAlert(infor)
                }else {
                    if data["error"]["error"].string == "E_VALIDATION" {
                        self.alertMessage("Error", message: messageString.invalidParams)
                    }else {
                        self.alertMessage("Error", message: messageString.serverErr)
                    }
                }
                print(JSON(JSONData))
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                self.alertMessage("Error", message: "Can't make appointment!")
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }
    }
    
    //change color border
    func borderTextFieldValid(textField:UITextField,color:UIColor){
        let border = CALayer()
        let width = CGFloat(1.0)
        border.borderColor = color.CGColor
        border.frame = CGRect(x: 0, y: textField.frame.size.height - width, width:  textField.frame.size.width, height: textField.frame.size.height)
        border.borderWidth = width
        textField.layer.addSublayer(border)
        textField.layer.masksToBounds = true
    }
    //check textfile is reqired
    func checkfield() {
        var arrText : [UITextField] = [firstNameTextField,lastNameTextField,contactPhoneTextField]
        for var i = 0; i < arrText.count ; i++ {
            if arrText[i].text == "" {
                borderTextFieldValid(arrText[i], color: colorCustomRed)
            }else{
                arrText[i].layer.borderWidth = 0
            }
        }
    }
    
    //check validate
    func validatePhoneNumber(value: String,regex:String) -> Bool {
        //EX: 04 245 544 45 || 4 564 242 45
        let PHONE_REGEX = regex
        
        let phoneTest = NSPredicate(format: "SELF MATCHES %@", PHONE_REGEX)
        
        let result =  phoneTest.evaluateWithObject(value)
        
        return result
        
    }
    func checkMaxLength(textField:UITextField,length:Int)->Bool{
        if textField.text?.characters.count > length {
            return false
        }else{
            return true
        }
    }
    
    //search suburb
    @IBAction func suburbChange(sender: AnyObject) {
        searchAutocompleteEntriesWithSubstring(suburbTextField.text!)
    }

    func searchAutocompleteEntriesWithSubstring(substring: String)
    {
        let dataSource = pastUrls
        let searchString = substring.uppercaseString
        let predicate = NSPredicate(format: "SELF beginswith[c] %@", searchString)
        let searchDataSource = dataSource.filter { predicate.evaluateWithObject($0) }
        autocompleteUrls = searchDataSource
        if autocompleteUrls.count == 0 {
            autoTableView.hidden = true
        }else{
            autoTableView.hidden = false
        }
        autoTableView.reloadData()
        
    }
    
    //show date picker
    func DatepickerMode(){
        birthDayTextField.tintColor = UIColor.clearColor()
        datePicker.datePickerMode = .Date
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        // Adds the buttons
        let doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: "doneClick")
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: "cancelClick")
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        // Adds the toolbar to the view
        birthDayTextField.inputView = datePicker
        birthDayTextField.inputAccessoryView = toolBar
    }
    
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = "dd/MM/yyyy"
        dateFormatter.dateFormat = "dd/MM/yyyy"
        dateofbirth = SaveDatetime.stringFromDate(datePicker.date)
        birthDayTextField.text = dateFormatter.stringFromDate(datePicker.date)
        birthDayTextField.resignFirstResponder()
        if(compareDate(datePicker.date)){
            checkDOB = true
            birthDayTextField.layer.borderWidth = 0
        }else{
            checkDOB = false
            borderTextFieldValid(birthDayTextField, color: colorCustomRed)
        }
        
    }
    
    //cancel button in datepicker
    func cancelClick() {
        birthDayTextField.resignFirstResponder()
    }
    
    //check date
    func compareDate(dateDOB:NSDate)->Bool {
        let now = NSDate()
        if now.compare(dateDOB) == NSComparisonResult.OrderedDescending
        {
            return true
        } else
        {
            return false
        }
    }
    
    //Giap: Show alert message
    func alertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            //Handle if click OK
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    //Alert action back to view
    func successAlert(info:Information){
        
        let alertController = UIAlertController(title: "Success", message: messageString.SubmitInjurySuccess, preferredStyle: .Alert)
        
        
        let SaveAction = UIAlertAction(title: "Save Information", style: .Destructive) { (action) in
            self.setPersonalData(info)
            self.performSegueWithIdentifier("unwindToContainerVC", sender: self)
        }
        if(checkData() == false){
            alertController.addAction(SaveAction)
        }
        let OKAction = UIAlertAction(title: "Close", style: .Default) { (action) in
            
            self.performSegueWithIdentifier("unwindToContainerVC", sender: self)
        }
        alertController.addAction(OKAction)
        self.presentViewController(alertController, animated: true) {
            // ...
        }
    }
    
    //open wifi
    func OpenWifi(){
        let alertController = UIAlertController(title: "No Internet Connection", message: "Make sure your device is connected to the internet ", preferredStyle: .Alert)
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in
            // ...
        }
        alertController.addAction(cancelAction)
        
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            UIApplication.sharedApplication().openURL(NSURL(string:UIApplicationOpenSettingsURLString)!);
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            // ...
        }
    }
    //check connection
    class func isConnectedToNetwork() -> Bool {
        
        var zeroAddress = sockaddr_in()
        zeroAddress.sin_len = UInt8(sizeofValue(zeroAddress))
        zeroAddress.sin_family = sa_family_t(AF_INET)
        let defaultRouteReachability = withUnsafePointer(&zeroAddress) {
            SCNetworkReachabilityCreateWithAddress(nil, UnsafePointer($0))
        }
        var flags = SCNetworkReachabilityFlags()
        if !SCNetworkReachabilityGetFlags(defaultRouteReachability!, &flags) {
            return false
        }
        let isReachable = (flags.rawValue & UInt32(kSCNetworkFlagsReachable)) != 0
        let needsConnection = (flags.rawValue & UInt32(kSCNetworkFlagsConnectionRequired)) != 0
        return (isReachable && !needsConnection)
        
    }
    
    func setPersonalData(data:Information){
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.setValue(data.firstName, forKey: model.firstName)
        defaults.setValue(data.lastName , forKey: model.lastName)
        defaults.setValue(data.phoneNumber, forKey: model.phonenumber)
        defaults.setValue(data.email, forKey: model.email)
        defaults.setValue(data.DOB, forKey: model.DOB)
        defaults.setValue(data.suburb, forKey: model.suburb)
        defaults.synchronize()
    }
    
    
    //check out focus textfield
    func textFieldDidEndEditing(textField: UITextField) {
      
        switch textField {
        case firstNameTextField :
            if firstNameTextField.text != "" &&  checkMaxLength(firstNameTextField, length: 50) == true {
                borderTextFieldValid(firstNameTextField, color: colorCustomBrow)
                firstNameTextField.text = firstNameTextField.text?.capitalizeFirst
            }else{
                borderTextFieldValid(firstNameTextField, color: colorCustomRed)
            }
        case lastNameTextField:
            if lastNameTextField.text != "" &&  checkMaxLength(lastNameTextField, length: 250) == true {
                borderTextFieldValid(lastNameTextField, color: colorCustomBrow)
                lastNameTextField.text = lastNameTextField.text?.capitalizeFirst
            }else{
                borderTextFieldValid(lastNameTextField, color: colorCustomRed)
            }
        case contactPhoneTextField:
            if validatePhoneNumber(contactPhoneTextField.text!,regex:RegexString.MobileNumber) == false || contactPhoneTextField.text == "" {
                borderTextFieldValid(contactPhoneTextField, color: colorCustomRed)
            }else {
                borderTextFieldValid(contactPhoneTextField, color: colorCustomBrow)
            }
        case emailTextField:
            if emailTextField.text != ""{
                if validatePhoneNumber(emailTextField.text!,regex:RegexString.Email) == false {
                    borderTextFieldValid(emailTextField, color: colorCustomRed)
                }else {
                    borderTextFieldValid(emailTextField, color: colorCustomBrow)
                }
            }else {
                borderTextFieldValid(emailTextField, color: colorCustomBrow)
            }
        case suburbTextField :
            autoTableView.hidden = true
        case birthDayTextField:
            if compareDate(datePicker.date) == false {
                borderTextFieldValid(birthDayTextField, color: colorCustomRed)
            }else {
                borderTextFieldValid(birthDayTextField, color: colorCustomBrow)
            }
        default: break
        }
    }
    
    func textViewDidEndEditing(textView: UITextView) {
        if textView == descriptionTextView {
            if descriptionTextView.text != "" {
                descriptionTextView.text = descriptionTextView.text.capitalizeFirst
            }
        }
    }
    
}

extension SubmitInjuryViewController: UITableViewDelegate,UITableViewDataSource {
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return autocompleteUrls.count
    }
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("AutoCompleteRowIdentifier", forIndexPath: indexPath) as! AutocompleteTableViewCell
        cell.name.text = autocompleteUrls[indexPath.row]
        return cell
    }
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        suburbTextField.text = autocompleteUrls[indexPath.row]
        autoTableView.hidden = true
    }
    
}
