var app = angular.module('app.blank.receive.controller', []);

app.controller('receiveCtrl', function($scope, $stateParams, $timeout) {
    var apiKey = $stateParams.apiKey;
    var sessionId = $stateParams.sessionId;
    var token = $stateParams.token;
    var uidCall = ($stateParams.uidCall) ? $stateParams.uidCall : null;
    var uidUser = ($stateParams.uidUser) ? $stateParams.uidUser : null;
    $scope.userName = $stateParams.userName;
    var session = OT.initSession(apiKey, sessionId);
    console.log(apiKey);
    console.log(sessionId);
    console.log(token);
    console.log("$stateParams", $stateParams);
    o.loadingPage(true);
    session.connect(token, function(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisherOptions = { insertMode: 'append', publishAudio: true, publishVideo: true, audioVolume: 100 };
            $scope.publisher = OT.initPublisher('publisher', publisherOptions);
            session.publish($scope.publisher);
        } else {
            console.log('There was an error connecting to the session: ', error.code, error.message);
        }
    });

    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        var stream = event.stream;
        displayStream(stream);
    });

    function displayStream(stream) {
        o.loadingPage(false);
        var subscriberOptions = { insertMode: 'append', width: '100%', height: '100%', subscribeToAudio: true, subscribeToVideo: true, audioVolume: 100 };
        $scope.subscriber = session.subscribe(stream, 'subscriber', subscriberOptions);
        var mytimeout = $timeout($scope.onTimeout, 1000);
    }


    //disconect
    session.on('sessionDisconnected', function(event) {
        console.log('You were disconnected from the session.', event.reason);
        window.close();
    });

    session.on('connectionDestroyed', function() {
        console.log("connectionDestroyed");
        window.close();
    })

    session.on('streamDestroyed', function() {
        console.log("streamDestroyed");
        window.close();
    })

    session.on("signal:endCall", function(event) {
        console.log("Signal sent from connection ", event);
        window.close();
    });



    $scope.counter = 0;

    $scope.onTimeout = function() {
        $scope.counter++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.aaa = function() {
        $scope.subscriber.subscribeToAudio(false)
    };

    $scope.bbb = function() {
        session.signal({
                data: "end",
                type: "endCall"
            },
            function(error) {
                if (error) {
                    console.log("signal error (" + error.code + "): " + error.message);
                } else {
                    console.log("signal sent.");
                }
            }
        );
        session.disconnect();
    };

    $scope.cancel = function() {
        console.log("socketTelehealth", socketTelehealth);
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', {
            from: uidUser,
            to: uidCall,
            message: "cancel"
        }, function(data) {
            console.log("send call", data);
            window.close();
        });
        window.close();
    }

    $scope.toggle = false;
    $scope.zoom = false;
    $scope.size = '900px';
    $scope.src = 'E-call_10.png';
    $scope.listUser = function() {
        $scope.toggle = $scope.toggle === true ? false : true;
    };
    $scope.ZoomScreen = function(size) {
        angular.element(".my-skype").attr("style", "width:" + size);
        $scope.src = $scope.src === 'E-call_10.png' ? 'E-call_09.png' : 'E-call_10.png';
        $scope.size = $scope.size === '100%' ? '900px' : '100%';
        $scope.zoom = $scope.zoom === false ? true : false;
    };
});

app.filter('formatTimer', function() {
    return function(input) {
        function z(n) {
            return (n < 10 ? '0' : '') + n;
        }
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        var hours = Math.floor(minutes / 60);
        return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
    };
});