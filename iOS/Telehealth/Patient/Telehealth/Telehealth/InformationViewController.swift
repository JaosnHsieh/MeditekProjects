//
//  InformationViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class InformationViewController: UIViewController {
    
    let patientService = PatientService()
    let alertView = UIAlertView()
    var patientInformation : PatientContainer!
   
    @IBOutlet weak var fullName: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var suburbLabel: UILabel!
    @IBOutlet weak var postCodeLabel: UILabel!
    @IBOutlet weak var countryLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var homePhoneLabel: UILabel!
    @IBOutlet weak var avarta: UIImageView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        avarta.layer.cornerRadius = CGRectGetWidth(avarta.frame) / 4.0
        avarta.clipsToBounds = true  
      
    }
    override func viewWillAppear(animated: Bool) {
        getInformationPatient()
    }
    
    //get information patient
    func getInformationPatient(){
        
                    self.avarta.image = UIImage(named: "A1a Copy 2.png")!
                    self.fullName.text = patientInformation!.FirstName + " " + patientInformation!.MiddleName + " " + patientInformation!.LastName
                    self.dobLabel.text = (patientInformation!.DOB).toDateTimeZone(formatTime.dateTime, format: formatTime.formatDate)
                    self.suburbLabel.text = patientInformation!.Suburb
                    self.postCodeLabel.text = patientInformation!.Postcode
                    self.countryLabel.text = patientInformation!.Country
                    self.addressLabel.text = patientInformation!.Address1
                    self.emailLabel.text = patientInformation!.Email1
                    self.homePhoneLabel.text = patientInformation!.HomePhoneNumber
                    self.patientService.getImage((patientInformation?.ImageUID)!, completionHandler: { image in
                        self.avarta.image = image
                    })
                    
    
    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
    }
    
    
    
    //handle logout
    @IBAction func LogoutAction(sender: AnyObject) {
        
        let alertController = UIAlertController(title: "Unregistered", message: MessageString.MessageLogout, preferredStyle: .Alert)
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in
        }
        alertController.addAction(cancelAction)
        
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
           
//            if let uuid = defaults.valueForKey("uid") as? String {
//                self.api.updateTokenPush(uuid,deviceToken:"")
//            }
//            
//            self.api.logOut({
//            response in
//                print(response)
//                if response["status"] == "success"{
//                    let defaults = NSUserDefaults.standardUserDefaults()
//                    defaults.removeObjectForKey("verifyUser")
//                    defaults.synchronize()
//                    sharedSocket.socket.disconnect()
//                  
//
//                    self.performSegueWithIdentifier("logoutSegue", sender: self)
//                }
//                
//            })
            
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            // ...
        }
        
    }
    
    
}


