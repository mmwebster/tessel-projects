var request = require('request');
// *** Load in constants from const.js (just need api token) ***
//@require const.js

postData = {channel: "#bottesting", username: "Hall Monitor", text: "Lab is now [testing]"};

console.log("Posting data...");

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
