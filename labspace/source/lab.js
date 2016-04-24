var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['B']);
var request = require('request');

//@require const.js

// Wait for ambient module to be ready
ambient.on('ready', function() {

  //@if env == "dev"
    console.log("[STATUS]: Ambient module ready");
  //@endif

  var currentStatus; // true=OPEN, false=CLOSED... originally undefined
  var currentTrans; // currently active transition (CLOSED->OPEN or OPEN->CLOSED)
  var statusChanged = false;
  var postData = {channel: channel, username: username, text: ""};
  var newStatusText = "";
  var refreshTimer;

  // poll the lab state and post to slack accordingly
  setInterval( function () {
    ambient.getLightLevel( function(err, light) {
      if (err) throw err;
      lightFixed = light.toFixed(8);

      //@if env == "dev"
        console.log("[STATUS]: {light: " + lightFixed + ", statusChanged: " + statusChanged + ", currentStatus: " + currentStatus + ", refreshTimer: " + refreshTimer + "}");
      //@endif
      
      // initialize state on startup
      if (currentStatus === undefined) {
        currentStatus = (light >= triggerLightLevel);

        //@if env == "dev"
           console.log("[STATUS]: Initialized status to " + currentStatus);
        //@endif

        // send "tessel initialized" message to logsChannel
        request.post({
            url: apiToken,
            method: "post",
            json: true,
            body: {channel: logsChannel, username: postData.username, text: "[STATUS]: Tessel Initialized"}
        }, function (error, response, body){
          if(error) {
            console.log(error);
          }
        });

      }

      // check if should change current status
      if (light < triggerLightLevel && currentStatus == true) {
        if (currentTrans != false) { // if not transitioning to CLOSED
          refreshTimer = refreshRate; // restart refresh timer b/c new trans
          currentTrans = false; // define current trans
        }
        refreshTimer -= pollRate; // count down
        if (refreshTimer <= 0) {
          // persist the status change
          currentStatus = false;
          statusChanged = true;
          newStatusText = "CLOSED";
          //@if env == "dev"
            console.log("[STATUS]: Lab is now CLOSED");
          //@endif
        }
      } else if (light >= triggerLightLevel && currentStatus == false) {
        if (currentTrans != true) { // if not transitioning to OPEN
          refreshTimer = refreshRate; // restart refresh timer b/c new trans
          currentTrans = true; // define current trans
        }
        refreshTimer -= pollRate; // count down
        if (refreshTimer <= 0) {
          // persist the change
          currentStatus = true;
          statusChanged = true;
          newStatusText = "OPEN";
          //@if env == "dev"
            console.log("[STATUS]: Lab is now OPEN");
          //@endif
        }
      }  else {
        refreshTimer = refreshRate; // restart refresh timer b/c no trans
        currentTrans = undefined; // reset the current transition
      }

      // check if should post new status
      if (statusChanged) {
        // now post to slack
        //@if env == "dev"
          console.log("[STATUS]: Posting new status to Slack");
        //@endif
        postData.text = "Lab is now " + newStatusText;
        request.post({
            url: apiToken,
            method: "post",
            json: true,
            body: postData
        }, function (error, response, body){
          if(error) {
            console.log(error);
          }
        });
        statusChanged = false;
      }

    });
  }, pollRate);

});

// Catch errors
ambient.on('error', function (err) {
  console.log(err);
});
