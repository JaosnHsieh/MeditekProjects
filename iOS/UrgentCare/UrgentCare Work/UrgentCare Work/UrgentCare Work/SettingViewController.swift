//
//  SettingViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class SettingViewController: UIViewController,UITableViewDelegate ,UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!

    var array = [["Mineral"],["Harry Berry", "Add New Account"],["Other services", "About Redimed", "LOGOUT"]]
    var arrayTitle = ["Company", "Accounts", "", "", ""]
    var StringIncompleteProfile :String = "Incomplete Profile"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Setting"
    }
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return array.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return array[section].count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        if(indexPath.section == 1 && indexPath.row == 0){
            let cell = tableView.dequeueReusableCellWithIdentifier("CellInfor", forIndexPath: indexPath) as! CustomTableViewCell;
            cell.lbName.text = array[indexPath.section][indexPath.row]
            cell.lbProfile.text = StringIncompleteProfile
            return cell
        }else{
            let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as UITableViewCell;
            cell.textLabel?.text = array[indexPath.section][indexPath.row]
            return cell
        }
        
    }
     func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String?
    {
        return arrayTitle[section]
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        print(indexPath.row,indexPath.section)
        if(indexPath.row == 0 && indexPath.section == 0){
            let company :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("CompanyViewControllerID") as! CompanyViewController
            self.navigationController?.pushViewController(company, animated: true)
        }
        if(indexPath.row == 0 && indexPath.section == 1){
            let account :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("AccountViewControllerID") as! AccountViewController
            self.navigationController?.pushViewController(account, animated: true)
        }
        if(indexPath.row == 0 && indexPath.section == 2){
            let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
            faqs.fileName = "FAQs"
            faqs.navigationBarString = "FAQs"
            self.navigationController?.pushViewController(faqs, animated: true)
        }
        if(indexPath.row == 1 && indexPath.section == 2){
            let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
            faqs.fileName = "UrgentCare"
            faqs.navigationBarString = "ABOUT REDIMED"
            self.navigationController?.pushViewController(faqs, animated: true)
        }
        if(indexPath.row == 2 && indexPath.section == 2){
            let account :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("HomeViewControllerID") as! HomeViewController
            self.navigationController?.pushViewController(account, animated: true)

        }
    }
    
}