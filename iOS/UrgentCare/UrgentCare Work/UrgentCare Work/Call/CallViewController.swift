//
//  ScreenCallingViewController.swift
//  UrgentCare Work
//
//  Created by Nguyen Duc Manh on 9/22/15.
//  Copyright © 2015 Nguyen Duc Manh. All rights reserved.
//

import UIKit

let videoWidthPub : CGFloat = 100
let videoHeightPub : CGFloat = 100

var ApiKey  = String()
var SessionID = String()
var Token = String()
let SubscribeToSelf = false


class ScreenCallingViewController: BaseViewController,OTSessionDelegate, OTSubscriberKitDelegate, OTPublisherDelegate {
    
    var videoWidth : CGFloat  = UIScreen.mainScreen().bounds.width
    var videoHeight : CGFloat  = UIScreen.mainScreen().bounds.height
    var session : OTSession?
    var publisher : OTPublisher?
    var subscriber : OTSubscriber?
    
    var startTime = NSTimeInterval()
    var timer:NSTimer = NSTimer()
    let panRec = UIPanGestureRecognizer()
    let screenSize: CGRect = UIScreen.mainScreen().bounds
    
    @IBOutlet weak var displayTimeLabel: UILabel!
    @IBOutlet weak var buttonHoldCall: DesignableButton!
    @IBOutlet weak var buttonEndCall: DesignableButton!
    @IBOutlet weak var buttonMuteCall: DesignableButton!
    @IBOutlet weak var buttonOffMic: DesignableButton!
    @IBOutlet weak var timeEffect: UIVisualEffectView!
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        let apiKey = receiveMessageData.apiKey
        let sessionId = receiveMessageData.sessionId
        let token = receiveMessageData.token
        
        ApiKey = String(apiKey)
        SessionID = String(sessionId)
        Token = String(token)
        
        socketService.emitDataToServer(Define.MessageString.CallAnswer, uidFrom: receiveMessageData.to, uuidTo: receiveMessageData.from)
        NSNotificationCenter.defaultCenter().removeObserver(self,name:"endCallAnswer",object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(ScreenCallingViewController.endCallAnswer), name: "endCallAnswer", object: nil)
        
    }
    func start() {
        if (!timer.valid) {
            let aSelector : Selector = #selector(ScreenCallingViewController.updateTime)
            timer = NSTimer.scheduledTimerWithTimeInterval(0.01, target: self, selector: aSelector, userInfo: nil, repeats: true)
            startTime = NSDate.timeIntervalSinceReferenceDate()
        }
    }
    func stop() {
        timer.invalidate()
    }
    func updateTime() {
        let currentTime = NSDate.timeIntervalSinceReferenceDate()
        var elapsedTime: NSTimeInterval = currentTime - startTime
        
        let minutes = UInt8(elapsedTime / 60.0)
        elapsedTime -= (NSTimeInterval(minutes) * 60)
        
        let seconds = UInt8(elapsedTime)
        elapsedTime -= NSTimeInterval(seconds)
        
        let fraction = UInt8(elapsedTime * 100)
        
        let strMinutes = String(format: "%02d", minutes)
        let strSeconds = String(format: "%02d", seconds)
        _ = String(format: "%02d", fraction)
        displayTimeLabel.text = "\(strMinutes):\(strSeconds)"
    }
    
    @IBAction func buttonHoldCallAction(sender: DesignableButton) {
        
        if publisher?.publishVideo.boolValue == true {
            publisher?.publishVideo = false
            publisher?.view.hidden = true
            
            sender.setTitle(FAIcon.play, forState: .Normal)
        } else {
            publisher?.publishVideo = true
            sender.setTitle(FAIcon.pause, forState: .Normal)
            publisher?.view.hidden = false
        }
        
    }
    @IBAction func buttonMuteAudioAction(sender: DesignableButton) {
        if subscriber?.subscribeToAudio.boolValue == true {
            subscriber?.subscribeToAudio = false
            sender.setTitle(FAIcon.volume_off, forState: .Normal)
        }else {
            subscriber?.subscribeToAudio = true
            sender.setTitle(FAIcon.volume_up, forState: .Normal)
        }
    }
    
    @IBAction func buttonOnOffMic(sender: AnyObject) {
        if publisher?.publishAudio.boolValue == true {
            publisher?.publishAudio = false
            sender.setTitle(FAIcon.microphone_off, forState: .Normal)
        }else {
            publisher?.publishAudio = true
            sender.setTitle(FAIcon.microphone_on, forState: .Normal)
        }
    }
    
    @IBAction func buttonEndCallAction(sender: DesignableButton) {
        session?.signalWithType("endCall", string: Define.MessageString.CallEndCall, connection: nil, error: nil)
        endCallAnswer()
    }
    
    func session(session: OTSession!, receivedSignalType type: String!, fromConnection connection: OTConnection!, withString string: String!) {
        if type == "endCall"{
            if string == "end"{
                //                endCallAnswer()
            }
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    override func viewWillAppear(animated: Bool) {
        // Step 2: As the view comes into the foreground, begin the connection process.
        session = OTSession(apiKey: ApiKey, sessionId: SessionID, delegate: self)
        print("daadadad------\(session?.sessionConnectionStatus)")
        doConnect()
        view.showLoading()
    }
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
    
    
    /**
     * Asynchronously begins the session connect process. Some time later, we will
     * expect a delegate method to call us back with the results of this action.
     */
    func doConnect() {
        
        if let session = self.session {
            var maybeError : OTError?
            session.connectWithToken(Token, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
                print("----error---calling---",error)
            }
            
        }
    }
    
    /**
     * Sets up an instance of OTPublisher to use with this session. OTPubilsher
     * binds to the device camera and microphone, and will provide A/V streams
     * to the OpenTok session.
     */
    func doPublish() {
        publisher = OTPublisher(delegate: self)
        
        var maybeError : OTError?
        session?.publish(publisher, error: &maybeError)
        
        if let error = maybeError {
            showAlert(error.localizedDescription)
        }
        view.addSubview((publisher?.view)!)
        view.addSubview(buttonEndCall)
        view.addSubview(buttonHoldCall)
        view.addSubview(buttonMuteCall)
        view.addSubview(buttonOffMic)
        
        panRec.addTarget(self, action: #selector(ScreenCallingViewController.draggedView(_:)))
        publisher!.view.frame = CGRect(x: 0.0, y: 0, width: videoWidthPub, height: videoHeightPub)
        publisher?.view.userInteractionEnabled = true
        publisher?.view.addGestureRecognizer(panRec)
        
    }
    func draggedView(sender:UIPanGestureRecognizer){
        self.view.bringSubviewToFront(sender.view!)
        let translation = sender.translationInView(self.view)
        sender.view!.center = CGPointMake(sender.view!.center.x + translation.x, sender.view!.center.y + translation.y)
        sender.setTranslation(CGPointZero, inView: self.view)
    }
    
    /**
     * Instantiates a subscriber for the given stream and asynchronously begins the
     * process to begin receiving A/V content for this stream. Unlike doPublish,
     * this method does not add the subscriber to the view hierarchy. Instead, we
     * add the subscriber only after it has connected and begins receiving data.
     */
    func doSubscribe(stream : OTStream) {
        if let session = self.session {
            subscriber = OTSubscriber(stream: stream, delegate: self)
            var maybeError : OTError?
            session.subscribe(subscriber, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
        }
        
    }
    
    /**
     * Cleans the subscriber from the view hierarchy, if any.
     */
    func doUnsubscribe() {
        if let subscriber = self.subscriber {
            var maybeError : OTError?
            session?.unsubscribe(subscriber, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
            subscriber.view.removeFromSuperview()
            self.subscriber = nil
        }
    }
    
    // MARK: - OTSession delegate callbacks
    
    func sessionDidConnect(session: OTSession) {
        NSLog("sessionDidConnect (\(session.sessionId))")
        
        print("----ssss---",session.sessionConnectionStatus.rawValue)
        // Step 2: We have successfully connected, now instantiate a publisher and
        // begin pushing A/V streams into OpenTok.
        doPublish()
    }
    
    func sessionDidDisconnect(session : OTSession) {
        NSLog("Session disconnected (\( session.sessionId))")
        
        
    }
    
    func session(session: OTSession, streamCreated stream: OTStream) {
        NSLog("session streamCreated (\(stream.streamId))")
        
        // Step 3a: (if NO == subscribeToSelf): Begin subscribing to a stream we
        // have seen on the OpenTok session.
        
        
        if subscriber == nil && !SubscribeToSelf {
            doSubscribe(stream)
        }
    }
    
    func session(session: OTSession, streamDestroyed stream: OTStream) {
        NSLog("session streamCreated (\(stream.streamId))")
        
        if subscriber?.stream.streamId == stream.streamId {
            doUnsubscribe()
        }
    }
    
    func session(session: OTSession, connectionCreated connection : OTConnection) {
        NSLog("session connectionCreated (\(connection.connectionId))")
        
    }
    
    func session(session: OTSession, connectionDestroyed connection : OTConnection) {
        NSLog("session connectionDestroyed (\(connection.connectionId))")
        
        endCallAnswer()
    }
    
    func session(session: OTSession, didFailWithError error: OTError) {
        NSLog("session didFailWithError (%@)", error)
        
    }
    
    // MARK: - OTSubscriber delegate callbacks
    
    func subscriberDidConnectToStream(subscriberKit: OTSubscriberKit) {
        NSLog("subscriberDidConnectToStream (\(subscriberKit))")
        
        if let views = subscriber?.view {
            views.frame =  CGRect(x: 0.0, y: 0, width: view.bounds.width, height: view.bounds.height)
            
        }
        //add button in subcriber
        view.addSubview(subscriber!.view)
        
        subscriber?.view.addSubview((publisher?.view)!)
        subscriber?.view.addSubview(buttonEndCall)
        subscriber?.view.addSubview(buttonHoldCall)
        subscriber?.view.addSubview(buttonMuteCall)
        subscriber?.view.addSubview(buttonOffMic)
        subscriber?.view.addSubview(timeEffect)
        start()
        view.hideLoading()
        
        
    }
    
    func subscriber(subscriber: OTSubscriberKit, didFailWithError error : OTError) {
        NSLog("subscriber %@ didFailWithError %@", subscriber.stream.streamId, error)
        
    }
    
    // MARK: - OTPublisher delegate callbacks
    
    func publisher(publisher: OTPublisherKit, streamCreated stream: OTStream) {
        NSLog("publisher streamCreated %@", stream)
        
        // Step 3b: (if YES == subscribeToSelf): Our own publisher is now visible to
        // all participants in the OpenTok session. We will attempt to subscribe to
        // our own stream. Expect to see a slight delay in the subscriber video and
        // an echo of the audio coming from the device microphone.
        if subscriber == nil && SubscribeToSelf {
            doSubscribe(stream)
        }
        if subscriber == nil {
            endCallAnswer()
        }
        
        
    }
    
    func publisher(publisher: OTPublisherKit, streamDestroyed stream: OTStream) {
        NSLog("publisher streamDestroyed %@", stream)
        if subscriber?.stream.streamId == stream.streamId {
            doUnsubscribe()
        }
    }
    
    func publisher(publisher: OTPublisherKit, didFailWithError error: OTError) {
        NSLog("publisher didFailWithError %@", error)
        
    }
    
    // MARK: - Helpers
    
    func showAlert(message: String) {
        // show alertview on main UI
        dispatch_async(dispatch_get_main_queue()) {
            print("Message",message)
        }
    }
    func changeIconCallingView(button:DesignableButton,nameImg:String){
        button.setImage(UIImage(named: nameImg), forState: UIControlState.Normal)
    }
    
    
    
    func endCallAnswer() {
        sessionDidDisconnect(session!)
        session?.disconnect()
        doUnsubscribe()
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    override func shouldAutorotate() -> Bool {
        if (UIDevice.currentDevice().orientation == UIDeviceOrientation.LandscapeLeft ||
            UIDevice.currentDevice().orientation == UIDeviceOrientation.LandscapeRight ||
            UIDevice.currentDevice().orientation == UIDeviceOrientation.Unknown) {
            return false
        }
        else {
            return true
        }
    }
    
    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return [UIInterfaceOrientationMask.Portrait ,UIInterfaceOrientationMask.PortraitUpsideDown]
    }
    
}
