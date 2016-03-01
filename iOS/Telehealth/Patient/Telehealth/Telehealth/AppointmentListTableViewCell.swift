//
//  AppointmentListTableViewCell.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/15/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
protocol AppointmentListTableViewCellDelegate : class{
    func AppointmentUpload(cell:AppointmentListTableViewCell,sender:String)
}

class AppointmentListTableViewCell: UITableViewCell {
    
    @IBOutlet weak var appointmentDate: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var status: UILabel!
    var UIDAppointment = String()
 
    weak var delegate : AppointmentListTableViewCellDelegate?
    
    func configAppointment(Appointment:AppointmentContainer,indexPath:Int){
        appointmentDate.text = Appointment.CreatedDate.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatDate)
        
        doctorName.text = Appointment.refName
        status.text =  Appointment.NameDoctor
        UIDAppointment = Appointment.UIDApointment
        
    }
   
}
