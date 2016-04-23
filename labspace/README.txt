Tessel project for Formula Slug lab space open/closed status notifier. Sends post requests to Slack Webhooks API to post to Formula Slug's #lab-space Slack channel.

Installation:
- npm install
- create a const.js (details below)
- sudo npm install -g transcend
- transcend compile
- tessel run build/lab.js [or push command]

The const.js file requires the following definitions:
var apiToken = "[XXX-YOUR-API-TOKEN-XXX]";
var triggerLightLevel = [DESIRED-TRIGGER-LEVE]; // float between 0 and 1 (non-inclusive)
var pollRate = 500; // in ms
var refreshRate = 15000;
var channel = "#[CHANNEL-NAME]";
var username = "BOT-NAME";
