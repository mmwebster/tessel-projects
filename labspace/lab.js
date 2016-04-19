var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['B']);
var request = require('request');

// Wait for ambient module to be ready
ambient.on('ready', function() {

  console.log("[STATUS]: Ambient module ready");

  statusChanged = false;
  currentStatus = false; // true=OPEN, false=CLOSED
  triggerLightLevel = 0.21; // range from 0-1. ~.6 is VERY bright, ~.02 is dim
  postData = {channel: "#lab-space", username: "Hall Monitor", text: ""};
  newStatusText = "";

  // poll the lab state and post to slack accordingly
  setInterval( function () {
    ambient.getLightLevel( function(err, light) {
      if (err) throw err;
      lightFixed = light.toFixed(8);

      console.log("[STATUS]: {light: " + lightFixed + ", statusChanged: " + statusChanged + ", currentStatus: " + currentStatus + "}");

      // set status flag if light trigger reached
      if (light < triggerLightLevel && currentStatus == true) {
        currentStatus = false;
        statusChanged = true;
        newStatusText = "CLOSED";
        console.log("[STATUS]: Lab is now CLOSED");
      } else if (light > triggerLightLevel && currentStatus == false) {
        console.log("light [" + light + "] >= triggerLightLevel [" + triggerLightLevel + "]");
        currentStatus = true;
        statusChanged = true;
        newStatusText = "OPEN";
        console.log("[STATUS]: Lab is now OPEN");
      }

      // check if should update status
      if (statusChanged) {
        // now post to slack
        console.log("[STATUS]: Posting new status to Slack");
        postData.text = "Lab is now " + newStatusText;
        request.post({
            url: "XXXXX-Webhooks-Token-XXXXX",
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
  }, 15000);

});

// Catch errors
ambient.on('error', function (err) {
  console.log(err);
});
