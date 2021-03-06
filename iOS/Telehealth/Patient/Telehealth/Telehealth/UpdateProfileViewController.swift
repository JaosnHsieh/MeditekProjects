//
//  UpdateProfileViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 2/29/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class UpdateProfileViewController: BaseViewController {
    @IBOutlet weak var firstNameTxt: UITextField!
    @IBOutlet weak var middlename: UITextField!
    @IBOutlet weak var lastNameTxt: UITextField!
    @IBOutlet weak var homePhoneTxt: UITextField!
    @IBOutlet weak var dobTxt: UITextField!
    @IBOutlet weak var emailTxt: UITextField!
    @IBOutlet weak var addressTxt: UITextField!
    @IBOutlet weak var suburbbTxt: UITextField!
    @IBOutlet weak var postCodeTxt: UITextField!
    @IBOutlet weak var countryTxt: UITextField!
    @IBOutlet weak var imageView: UIImageView!
    
    @IBOutlet weak var viewUpdateForm: UIView!
    var requestTelehealthService = RequestTelehealthService()
    let patientService = PatientService()
    let appointmentService = AppointmentService()
    let colorCustomRed = UIColor.colorRBGValue(redValue: 232, greenValue: 145, blueValue: 147, alphaValue: 1.0)
    let colorAthenGray = UIColor.colorRBGValue(redValue: 202, greenValue: 202, blueValue: 208, alphaValue: 1.0)
    
    var patientInformation : PatientContainer!
    var datePicker = UIDatePicker()
    var dateofbirth: String = ""
    var checkDOB = true
    
    let viewSuburb = UIView()
    let viewCountry = UIView()
    var tableView: UITableView =  UITableView()
    var tableViewCountry: UITableView =  UITableView()
    var autocompleteUrls = [String]()
    var pastUrls : [String] = []
    var autocompleteUrlsCountry = [String]()
    var pastUrlsCountry : [String] = []
    var assets: [DKAsset]?
    var suburbCheck = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
        config.radiusAvatar(imageView)
        let tapGestureRecognizer = UITapGestureRecognizer(target:self, action:#selector(UpdateProfileViewController.imageTapped(_:)))
        imageView.userInteractionEnabled = true
        imageView.addGestureRecognizer(tapGestureRecognizer)
        if patientInformation != nil {
            firstNameTxt.text = patientInformation.FirstName
            middlename.text = patientInformation.MiddleName
            lastNameTxt.text = patientInformation.LastName
            homePhoneTxt.text = patientInformation.HomePhoneNumber
            dobTxt.text = patientInformation.DOB
            emailTxt.text = patientInformation.Email
            addressTxt.text = patientInformation.Address1
            suburbbTxt.text = patientInformation.Suburb
            postCodeTxt.text = patientInformation.Postcode
            countryTxt.text = patientInformation.Country
            self.patientService.getImage((patientInformation?.ImageUID)!, completionHandler: { image in
                self.imageView.image = image
            })
            
        }
        delegateTextField()
        autocompleteUrls = requestTelehealthService.loadDataJson()
        pastUrls = autocompleteUrls
        autocompleteUrlsCountry = requestTelehealthService.loadDataJsonCountry()
        pastUrlsCountry = autocompleteUrlsCountry
        DatepickerMode()
        addCustomView()
        addCustomViewCountry()
    }
    func delegateTextField(){
        addDoneButton(firstNameTxt)
        addDoneButton(middlename)
        addDoneButton(lastNameTxt)
        addDoneButton(homePhoneTxt)
        addDoneButton(emailTxt)
        addDoneButton(suburbbTxt)
        addDoneButton(postCodeTxt)
        addDoneButton(countryTxt)
        addDoneButton(addressTxt)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func imageTapped(img: AnyObject)
    {
        let alert:UIAlertController=UIAlertController(title: "Choose Image", message: nil, preferredStyle: UIAlertControllerStyle.ActionSheet)
        
        let cameraAction = UIAlertAction(title: "Take Photo", style: UIAlertActionStyle.Default)
            {
                UIAlertAction in
                self.openCamera()
                
        }
        let galleryAction = UIAlertAction(title: "Choose From Photos", style: UIAlertActionStyle.Default)
            {
                UIAlertAction in
                self.openGallery()
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel)
            {
                UIAlertAction in
                
        }
        
        // Add the actions
        
        alert.addAction(cameraAction)
        alert.addAction(galleryAction)
        alert.addAction(cancelAction)
        // Present the controller
        if UIDevice.currentDevice().userInterfaceIdiom == .Phone
        {
            self.presentViewController(alert, animated: true, completion: nil)
        }
        else
        {
            
        }
    }
    
    func openCamera()
    {
        
        let assetType = DKOption.types[1]
        let allowMultipleType = true
        let sourceType: DKImagePickerControllerSourceType = DKImagePickerControllerSourceType.Camera
        let allowsLandscape = false
        let singleSelect = false
        showImagePickerWithAssetType(
            assetType,
            allowMultipleType: allowMultipleType,
            sourceType: sourceType,
            allowsLandscape: allowsLandscape,
            singleSelect: singleSelect
        )
    }
    
    func openGallery()
    {
        
        
        let assetType = DKOption.types[1]
        let allowMultipleType = true
        let sourceType: DKImagePickerControllerSourceType = DKImagePickerControllerSourceType.Photo
        let allowsLandscape = false
        let singleSelect = true
        
        showImagePickerWithAssetType(
            assetType,
            allowMultipleType: allowMultipleType,
            sourceType: sourceType,
            allowsLandscape: allowsLandscape,
            singleSelect: singleSelect
        )
        
        
    }
    
    func showImagePickerWithAssetType(
        assetType: DKImagePickerControllerAssetType,
        allowMultipleType: Bool,
        sourceType: DKImagePickerControllerSourceType = [.Camera, .Photo],
        allowsLandscape: Bool,
        singleSelect: Bool) {
            let pickerController = DKImagePickerController()
            pickerController.assetType = assetType
            pickerController.allowsLandscape = allowsLandscape
            pickerController.allowMultipleTypes = allowMultipleType
            pickerController.sourceType = sourceType
            pickerController.singleSelect = singleSelect
            pickerController.showsCancelButton = true
            pickerController.showsEmptyAlbums = false
            
            
            // Clear all the selected assets if you used the picker controller as a single instance.
            //			pickerController.defaultSelectedAssets = nil
            pickerController.defaultSelectedAssets = self.assets
            
            pickerController.didSelectAssets = { [unowned self] (assets: [DKAsset]) in
                print("didSelectAssets")
                if assets.count > 0 {
                    assets[0].fetchFullScreenImage(true, completeBlock: { image, info in
                        self.imageView.image = image
                        self.patientInformation.Image = image
                        if let uuid = defaults.valueForKey("userUID") as? String {
                            
                            self.uploadImage(image!, userUID: uuid)
                        }
                        
                    })
                }
            }
            self.presentViewController(pickerController, animated: true) {}
    }
    
    //Upload image to user
    func uploadImage(image:UIImage,userUID:String){
        
        appointmentService.uploadImage(image, userUID: userUID,fileType:"ProfileImage" , compailer: {
            response in
            if response["message"] == "success"{
                //                let  data = response["data"].string
                
                self.patientService.updateAvatar(self.patientInformation.ImageUID, completionHandler: {
                    response in
                    print("2222",response)
                    if response["message"] == "success"{
                    }
                })
            }else {
                self.view.hideLoading()
                print("error",response["ErrorType"])
                let error = response["ErrorType"].string
                self.alertView.alertMessage("Error", message: error!)
            }
        })
        
    }
    
    
    @IBAction func updateProfileButton(sender: AnyObject) {
        self.view.showLoading()
        patientInformation.FirstName = firstNameTxt.text
        patientInformation.MiddleName = middlename.text
        patientInformation.LastName = lastNameTxt.text
        patientInformation.HomePhoneNumber = homePhoneTxt.text
        patientInformation.DOB = dobTxt.text
        patientInformation.Email = emailTxt.text
        patientInformation.Address1 = addressTxt.text
        patientInformation.Suburb = suburbbTxt.text
        patientInformation.Postcode = postCodeTxt.text
        patientInformation.Country = countryTxt.text
        
        patientService.updateInfomationPatient(patientInformation, completionHandler: {
            data in
            if data["message"] == "success"{
                self.view.hideLoading()
                self.alertView.alertMessage("", message: "Update Success")
                self.performSegueWithIdentifier("unwindToProfileSegue", sender: self)
            }else{
                self.view.hideLoading()
                print(data)
                self.alertView.alertMessage("", message: "Update Error")
            }
        })
        
    }
    
    
    @IBAction func suburbSearchAction(sender: AnyObject) {
        if(sender.tag == 102){
            suburbCheck = true
            searchAutocompleteEntriesWithSubstring(suburbbTxt.text!)
            if suburbbTxt.text == "" || autocompleteUrls.count == 0 {
                self.viewSuburb.alpha = 0
            }else {
                self.viewSuburb.alpha = 1
            }
        }
        if(sender.tag == 103){
            suburbCheck = false
            searchAutocompleteEntriesWithSubstringCountry(countryTxt.text!)
            if countryTxt.text == "" || autocompleteUrlsCountry.count == 0 {
                self.viewCountry.alpha = 0
            }else {
                
                self.viewCountry.alpha = 1
                
            }
        }
        
    }
    @IBAction func countrySearchAction(sender: AnyObject) {
        searchAutocompleteEntriesWithSubstring(countryTxt.text!)
        if countryTxt.text == "" || autocompleteUrlsCountry.count == 0 {
            self.countryTxt.alpha = 0
        }else {
            
            self.countryTxt.alpha = 1
            
        }
    }
    @IBAction func countryEndEdit(sender: AnyObject) {
        self.countryTxt.alpha = 0
    }
    @IBAction func suburbEndEdit(sender: AnyObject) {
        if(sender.tag == 102){
            suburbCheck = true
            self.viewSuburb.alpha = 0
        }
        if(sender.tag == 103){
            suburbCheck = false
            self.viewCountry.alpha = 0
        }
    }
    func searchAutocompleteEntriesWithSubstringCountry(substring: String)
    {
        autocompleteUrlsCountry = requestTelehealthService.handleSearchData(pastUrlsCountry, substring: substring)
        if substring == "" {
            autocompleteUrlsCountry = pastUrlsCountry
        }
        tableViewCountry.reloadData()
    }
    func searchAutocompleteEntriesWithSubstring(substring: String)
    {
        autocompleteUrls = requestTelehealthService.handleSearchData(pastUrls, substring: substring)
        if substring == "" {
            autocompleteUrls = pastUrls
        }
        tableView.reloadData()
    }
    func searchAutocompleteEntriesWithSubstringContry(substring: String)
    {
        autocompleteUrls = requestTelehealthService.handleSearchData(pastUrlsCountry, substring: substring)
        if substring == "" {
            autocompleteUrlsCountry = pastUrlsCountry
        }
        tableView.reloadData()
    }

    
    
    func addCustomViewCountry() {
        viewCountry.backgroundColor = UIColor.blackColor()
        viewCountry.translatesAutoresizingMaskIntoConstraints = false
        self.viewCountry.alpha = 0
        viewUpdateForm.addSubview(viewCountry)
        
        
        tableViewCountry.delegate      =   self
        tableViewCountry.dataSource    =   self
        tableViewCountry.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
        tableViewCountry.translatesAutoresizingMaskIntoConstraints = false
        
        viewCountry.addSubview(tableViewCountry)
        
        // view autolayout
        NSLayoutConstraint(item: viewCountry, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: viewCountry, attribute: .Leading, relatedBy: .Equal, toItem: view, attribute: .Leading, multiplier: 1.0, constant: 2).active = true
        NSLayoutConstraint(item: viewCountry, attribute: .Top, relatedBy: .Equal, toItem: countryTxt, attribute: .BottomMargin, multiplier: 1.0, constant: 10).active = true
        NSLayoutConstraint(item: viewCountry, attribute: .CenterX, relatedBy: .Equal, toItem: view, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        
        
        //table view autolayout
        NSLayoutConstraint(item: tableViewCountry, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: tableViewCountry, attribute: .Leading, relatedBy: .Equal, toItem: viewCountry, attribute: .Leading, multiplier: 1.0, constant: 0).active = true
        NSLayoutConstraint(item: tableViewCountry, attribute: .CenterX, relatedBy: .Equal, toItem: viewCountry, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        NSLayoutConstraint(item: tableViewCountry, attribute: .CenterY, relatedBy: .Equal, toItem: viewCountry, attribute: .CenterY, multiplier: 1.0, constant: 0.0).active = true
        
    }
    
    func addCustomView() {
        viewSuburb.backgroundColor = UIColor.blackColor()
        viewSuburb.translatesAutoresizingMaskIntoConstraints = false
        self.viewSuburb.alpha = 0
        viewUpdateForm.addSubview(viewSuburb)
        
        
        tableView.delegate      =   self
        tableView.dataSource    =   self
        tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        viewSuburb.addSubview(tableView)
        
        // view autolayout
        NSLayoutConstraint(item: viewSuburb, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .Leading, relatedBy: .Equal, toItem: view, attribute: .Leading, multiplier: 1.0, constant: 2).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .Top, relatedBy: .Equal, toItem: suburbbTxt, attribute: .BottomMargin, multiplier: 1.0, constant: 10).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .CenterX, relatedBy: .Equal, toItem: view, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        
        
        //table view autolayout
        NSLayoutConstraint(item: tableView, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: tableView, attribute: .Leading, relatedBy: .Equal, toItem: viewSuburb, attribute: .Leading, multiplier: 1.0, constant: 0).active = true
        NSLayoutConstraint(item: tableView, attribute: .CenterX, relatedBy: .Equal, toItem: viewSuburb, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        NSLayoutConstraint(item: tableView, attribute: .CenterY, relatedBy: .Equal, toItem: viewSuburb, attribute: .CenterY, multiplier: 1.0, constant: 0.0).active = true
        
    }
    
    //show date picker
    func DatepickerMode(){
        dobTxt.tintColor = UIColor.clearColor()
        datePicker.datePickerMode = .Date
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        // Adds the buttons
        let doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: #selector(UpdateProfileViewController.doneClick))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: #selector(UpdateProfileViewController.cancelClick))
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        // Adds the toolbar to the view
        dobTxt.inputView = datePicker
        dobTxt.inputAccessoryView = toolBar
    }
    
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = formatTime.formatDate
        dateFormatter.dateFormat = formatTime.formatDate
        dateofbirth = SaveDatetime.stringFromDate(datePicker.date)
        dobTxt.text = dateFormatter.stringFromDate(datePicker.date)
        dobTxt.resignFirstResponder()
        if(requestTelehealthService.compareDate(datePicker.date)){
            checkDOB = true
            requestTelehealthService.borderTextFieldValid(dobTxt, color: colorAthenGray,check: true)
        }else{
            checkDOB = false
            requestTelehealthService.borderTextFieldValid(dobTxt, color: colorCustomRed)
        }
        
    }
    
    //cancel button in datepicker
    func cancelClick() {
        dobTxt.resignFirstResponder()
    }
    
    
    func textFieldDidEndEditing(textField: UITextField) {
        
        switch textField {
        case firstNameTxt:
            if textField.text != "" && requestTelehealthService.checkMaxLength(textField.text! , length: 50) == true {
                requestTelehealthService.borderTextFieldValid(firstNameTxt, color: colorAthenGray,check:true)
                firstNameTxt.text = textField.text!.capitalizeFirst
            }else {
                requestTelehealthService.borderTextFieldValid(firstNameTxt, color: colorCustomRed)
            }
            break;
        case middlename:
            if textField.text != "" && requestTelehealthService.checkMaxLength(textField.text! , length: 50) == true {
                requestTelehealthService.borderTextFieldValid(middlename, color: colorAthenGray,check:true)
                middlename.text = textField.text!.capitalizeFirst
            }else {
                requestTelehealthService.borderTextFieldValid(middlename, color: colorCustomRed)
            }
            break;
        case lastNameTxt:
            if textField.text != "" && requestTelehealthService.checkMaxLength(textField.text! , length: 50) == true {
                requestTelehealthService.borderTextFieldValid(lastNameTxt, color: colorAthenGray,check:true)
                lastNameTxt.text = textField.text!.capitalizeFirst
            }else {
                requestTelehealthService.borderTextFieldValid(lastNameTxt, color: colorCustomRed)
            }
            break;
        case homePhoneTxt:
            if textField.text! != "" && config.validateRegex(textField.text!, regex: Regex.PhoneNumber)  == false {
                requestTelehealthService.borderTextFieldValid(homePhoneTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(homePhoneTxt, color: colorAthenGray,check: true)
            }
            break;
        case dobTxt:
            if textField.text == "" {
                requestTelehealthService.borderTextFieldValid(dobTxt, color: colorCustomRed)
            }
            break;
        case emailTxt:
            if config.validateRegex(textField.text!, regex: Regex.Email)  == false || textField.text == "" {
                requestTelehealthService.borderTextFieldValid(emailTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(emailTxt, color: colorAthenGray,check:true)
            }
            
            break;
        case postCodeTxt:
            if textField.text! != "" && config.validateRegex(textField.text!, regex: Regex.PostCodeLength)  == false {
                requestTelehealthService.borderTextFieldValid(postCodeTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(postCodeTxt, color: colorAthenGray,check: true)
            }
            break;
        case addressTxt:
            break;
        case suburbbTxt:
            if textField.text == "" {
                requestTelehealthService.borderTextFieldValid(suburbbTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(suburbbTxt, color: colorAthenGray,check: true)
            }
            break;
        case countryTxt:
            break;
        default:
            break
            
        }
        
    }
    
}

// TableView
extension UpdateProfileViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if(suburbCheck == true){
            return self.autocompleteUrls.count
        }else{
            return self.autocompleteUrlsCountry.count
        }
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell:UITableViewCell = tableView.dequeueReusableCellWithIdentifier("cell")! as UITableViewCell
        if(suburbCheck == true){
            cell.textLabel?.text = self.autocompleteUrls[indexPath.row]
        }else{
            cell.textLabel?.text = self.autocompleteUrlsCountry[indexPath.row]
        }
        
        return cell
        
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        if(suburbCheck == true){
            suburbbTxt.text = self.autocompleteUrls[indexPath.row]
            requestTelehealthService.borderTextFieldValid(suburbbTxt, color: colorAthenGray,check: true)
        }else{
            countryTxt.text = self.autocompleteUrlsCountry[indexPath.row]
            requestTelehealthService.borderTextFieldValid(countryTxt, color: colorAthenGray,check: true)
        }
        
        
        
        UIView.animateWithDuration(0.5, animations: {
            if(self.suburbCheck == true){
                self.viewSuburb.alpha = 0
            }else{
                self.viewCountry.alpha = 0
            }
        })
        
    }
    
}
