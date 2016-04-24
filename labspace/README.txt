Tessel project for Formula Slug lab space open/closed status notifier. Sends post requests to Slack Webhooks API to post to Formula Slug's #lab-space Slack channel.

Installation (Global installs prevent from being added to the tessel's build):
- npm install
- npm install -g tessel
- npm install -g transcend
- create a const.js (details below)
- bash run.sh [or push.sh]

The source/const.js file requires the following definitions:
- - - - - - - - - - - - - - - - - - - - - - -
var logsChannel  = "#<CHANNEL-NAME>"; // channel to send dev logs to
//@if env == "dev"
  var channel = logsChannel; // channel to send actual status changes to
//@else
  var channel = "#<CHANNEL-NAME>";
//@endif
var apiToken = "<XXX-YOUR-API-TOKEN-XXX>";
var triggerLightLevel = <DESIRED-TRIGGER-LEVEL>; // float between 0 and 1 (non-inclusive)
var pollRate = 500; // in ms
var refreshRate = 15000;
var username = "<BOT-NAME>";
- - - - - - - - - - - - - - - - - - - - - - -

The transcend.js file (env can be `prod` or `dev`):
- - - - - - - - - - - - - - - - - - - - - - -
{
  "input": "./source",
  "output": "./build",
  "env": "prod"
}
- - - - - - - - - - - - - - - - - - - - - - -

Misc Notes:
- Currently only works with tessel firmware version 0.1.19 and ambient module version 0.1.9
- Switch between tessel firmware versions using: tessel update -b [version]
- Project developed on Tessel 1 and MacOSX 10.10.3

Todo:
- Prevent bash scripts from uploading to Tessel if Transcend returns an error
