Tessel project for Formula Slug lab space open/closed status notifier. Sends post requests to Slack Webhooks API to post to Formula Slug's #lab-space Slack channel.

Installation (Global installs prevent from being added to the tessel's build):
- npm install
- npm install -g tessel
- npm install -g transcend
- create a const.js (details below)
- bash run.sh [or push.sh]

The source/const.js file requires the following definitions:
- - - - - - - - - - - - - - - - - - - - - - -
var apiToken = "<XXX-YOUR-API-TOKEN-XXX>";
var triggerLightLevel = <DESIRED-TRIGGER-LEVEL>; // float between 0 and 1 (non-inclusive)
var pollRate = 500; // in ms
var refreshRate = 15000;
var channel = "#<CHANNEL-NAME>";
var username = "<BOT-NAME>";
- - - - - - - - - - - - - - - - - - - - - - -

Misc Notes:
- Currently only works with tessel firmware version 0.1.19 and ambient module version 0.1.9
- Switch between tessel firmware versions using: tessel update -b [version]
