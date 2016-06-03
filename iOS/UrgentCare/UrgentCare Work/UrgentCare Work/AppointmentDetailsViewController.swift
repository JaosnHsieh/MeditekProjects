//
//  AppointmentDetailsViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import ObjectMapper

class AppointmentDetailsViewController: BaseViewController,UIViewControllerTransitioningDelegate,UIAlertViewDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UIPopoverControllerDelegate ,NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate,reloadCollectionDelegate {
    
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var status: UILabel!
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var selectOptionImage: UIButton!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var Code: UILabel!
    
    @IBOutlet weak var fullNameLabel: UILabel!
    @IBOutlet weak var mobileLabel: UILabel!
    @IBOutlet weak var homePhoneLabel: UILabel!
    @IBOutlet weak var suburbLabel: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var messageImageLabel: UILabel!
    var UIDApointment = String()
    var imageDetails : UIImage!
    var picker:UIImagePickerController?=UIImagePickerController()
    var popover:UIPopoverController?=nil
    var appointmentListResponseDetail = AppointmentListResponseDetail()
    var ArrayImageUID : [UIImage] = []
    
    // let alertView = UIAlertView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //picker?.delegate = self
        setDataInit()
    }
    override func viewWillAppear(animated: Bool) {
        self.ArrayImageUID.removeAll()
        self.collectionView.reloadData()
        getDetailsAppointment(appointmentListResponseDetail.UID)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func getDetailsAppointment(AppointmentUID:String){
        UserService.getDetailAppointment(AppointmentUID) { [weak self] (response) in
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        print(JSON(response.result.value!))
                        if let detailAppointment = Mapper<DetailAppointment>().map(response.result.value!["data"]) {
                            print(detailAppointment.PatientAppointments)
                           
                            self!.getAllImageInAppointmentDetails(detailAppointment.fileUploads)
                            let Patients = detailAppointment.Patients.count != 0 ? detailAppointment.Patients[0] : detailAppointment.PatientAppointments[0]
                            self!.fullNameLabel.text = Patients.FirstName + " " + Patients.LastName
                            self!.mobileLabel.text = Patients.PhoneNumber
                            self!.homePhoneLabel.text = Patients.HomePhoneNumber
                            self!.suburbLabel.text = Patients.Suburb
                            self!.emailLabel.text = Patients.Email1
                            self!.dobLabel.text = Patients.DOB
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
            }
        }
    }
    func setDataInit(){
        dateLabel.text = appointmentListResponseDetail.CreatedDate.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatDate)
        //Check To time
        if appointmentListResponseDetail.ToTime == "" {
            timeLabel.text = "\(appointmentListResponseDetail.CreatedDate.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatTime))"
            
        }else{
            timeLabel.text = "\(appointmentListResponseDetail.CreatedDate.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatTime)) - \(appointmentListResponseDetail.ToTime.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatTime))"
        }
        doctorName.text = appointmentListResponseDetail.DoctorsName
        status.text = appointmentListResponseDetail.Status
        Code.text = appointmentListResponseDetail.Code
        print(appointmentListResponseDetail)
        
    }
    @IBAction func actionTracking(sender: AnyObject) {
        let detailsViewController :TrackingRefferalViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("TrackingRefferalViewControllerID") as! TrackingRefferalViewController
        detailsViewController.appointmentDetails = appointmentListResponseDetail
        self.navigationController?.pushViewController(detailsViewController, animated: true)
    }
    
    //Get all image in appointment details
    func getAllImageInAppointmentDetails(fileUploads:[FileUploads]){
        
        for i in 0  ..< fileUploads.count  {
            self.downloadImage(fileUploads[i].UID)
        }
    }
    
    //Giap: Download image
    func downloadImage(imageUID:String){
        UserService.getImage(imageUID) { [weak self] (response) in
            if let _ = self {
                if response.result.isSuccess {
                    if  let images = UIImage(data: response.result.value!) {
                        self!.ArrayImageUID.append(images)
                        self!.insertDataToCollectionView()
                    }
                } else {
                   // self?.showMessageNoNetwork()
                }
            }
            
        }
}
//
//
//    //send data view to view
//    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
//        if segue.identifier == "ImageDetailSegue" {
//            //get index path selected image in collection view
//            if let indexPath = sender as? NSIndexPath {
//                let destVC = segue.destinationViewController as! ImageDetailViewController
//                destVC.imageDetail = ArrayImageUID[indexPath.row]
//
//            }
//        } else if segue.identifier == "BodyUploadSegue" {
//            let body = segue.destinationViewController as! BodyUploadViewController
//            body.imageSelect = imageDetails
//            body.appointmentID = appointmentDetails.UIDApointment
//            body.delegate = self
//        } else if segue.identifier == "TrackingSegue" {
//            let Tracking = segue.destinationViewController as! TrackingRefferalViewController
//            Tracking.appointmentDetails = appointmentDetails
//        }
//    }


//Select image or capture imge
@IBAction func SelectImageUpload(sender: AnyObject) {
    let alert:UIAlertController=UIAlertController(title: "Choose Image", message: nil, preferredStyle: UIAlertControllerStyle.ActionSheet)
    
    let cameraAction = UIAlertAction(title: "Camera", style: UIAlertActionStyle.Default)
    {
        UIAlertAction in
        self.openCamera()
        
    }
    let galleryAction = UIAlertAction(title: "Gallery", style: UIAlertActionStyle.Default)
    {
        UIAlertAction in
        self.openGallery()
    }
    let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel)
    {
        UIAlertAction in
        
    }
    
    // Add the actions
    picker?.delegate = self
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
        popover=UIPopoverController(contentViewController: alert)
        popover!.presentPopoverFromRect(selectOptionImage.frame, inView: self.view, permittedArrowDirections: UIPopoverArrowDirection.Any, animated: true)
    }
    
}

func openCamera()
{
    if(UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.Camera))
    {
        picker!.sourceType = UIImagePickerControllerSourceType.Camera
        self.presentViewController(picker!, animated: true, completion: nil)
    }
    else
    {
        openGallery()
    }
}

func openGallery()
{
    picker!.sourceType = UIImagePickerControllerSourceType.PhotoLibrary
    self.presentViewController(picker!, animated: true, completion: nil)
    
}

func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject])
{
    picker .dismissViewControllerAnimated(true, completion: nil)
    imageDetails = info[UIImagePickerControllerOriginalImage] as? UIImage
    //Check capture and save image to Gallery
    if(picker.sourceType == UIImagePickerControllerSourceType.Camera)
    {
        // Access the uncropped image from info dictionary
        let imageToSave: UIImage = info[UIImagePickerControllerOriginalImage] as! UIImage //same but with different way
        UIImageWriteToSavedPhotosAlbum(imageToSave, nil, nil, nil)
        //  alertView.alertMessage("Saved!", message:MessageString.savedPictureMessage)
        
    }
    let bodyUploadViewController :BodyUploadViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("BodyUploadViewControllerID") as! BodyUploadViewController
    bodyUploadViewController.imageSelect = imageDetails
    bodyUploadViewController.appointmentID = appointmentListResponseDetail.UID
    self.navigationController?.pushViewController(bodyUploadViewController, animated: true)
}

func imagePickerControllerDidCancel(picker: UIImagePickerController)
{
    print("picker cancel.")
    self.dismissViewControllerAnimated(true, completion: nil)
}


//Add new item to collection view
func reloadCollectionView(controller: BodyUploadViewController, sender: UIImage) {
    
    ArrayImageUID.append(sender)
    insertDataToCollectionView()
    alertView.alertMessage("Upload", message: "Upload Success")
    if ArrayImageUID.count != 0{
        messageImageLabel.hidden = true
    }
    
}
//add an image to collection view
func insertDataToCollectionView(){
    let newRowIndex = ArrayImageUID.count
    let indexPath = NSIndexPath(forRow: newRowIndex - 1 , inSection: 0)
    collectionView.insertItemsAtIndexPaths([indexPath])
}



}

extension AppointmentDetailsViewController : UICollectionViewDataSource, UICollectionViewDelegate {
    //Giap: Collection View
    func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return ArrayImageUID.count
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier("AppointmentCollectionCell", forIndexPath: indexPath) as! AppointmentImageCollectionViewCell
        let data = ArrayImageUID[indexPath.row]
        cell.imageView.image = data
        cell.imageView.layer.shadowRadius = 4
        cell.imageView.layer.shadowOpacity = 0.5
        cell.imageView.layer.shadowOffset = CGSize.zero
        return cell
    }
    //select 1 item in collection view
    func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        //performSegueWithIdentifier("ImageDetailSegue", sender: indexPath)
    }
    
    
    //animation collection view cell scrolling
    func collectionView(collectionView: UICollectionView, willDisplayCell cell: UICollectionViewCell, forItemAtIndexPath indexPath: NSIndexPath) {
        cell.alpha = 0
        UIView.animateWithDuration(0.5, animations: {
            cell.alpha = 1
        })
    }
    
}
