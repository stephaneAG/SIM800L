/* -- MODULE TESTING -- */
var exports = {};
/* ---------------------*/


/* -- MODULE EXAMPLE -- */

var sim800l = exports.connect(Serial1, B4, function(err){
//var sim800l = require('SIM800L').connect(Serial1, B4, function(err){
  if(!err){
    // send a text message
    sim800l.sendSMS('0681382722', 'I am gonna call you and then hang up !', function(){
      sim800l.placeCall('0681382722', function(){
        setTimeout(function(){
          sim800l.hangupCall(function(){
            sim800l.sendSMS('0681382722', 'Did it ring your bell ?',function(data){
              console.log(data.type, data.message, data.status);
            });
          });
        },3000);
      });
    });
    // place a call then hangup
  } else {
    console.log(err);
  }
});
/* ---------------------*/


/* -- ACTUAL MODULE -- */

var at;
var SIM800L = {};
/* -- TEXT -- */
// handle sending a SMS
SIM800L.sendSMS = function(number, message, callback){
  at.cmd("AT+CMGF=1\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    // d is now the result
    console.log('AT+CMGF=1 result: ' + d);
    at.cmd('AT+CMGS="'+number+'"\r\n', 1000, function(d) {
      if (d===undefined) ; // we timed out!
      // d is now the result
      console.log('AT+CMGS=0681382722 result: ' + d);
      setTimeout(function(){ 
        at.write([message+"\r\n",0x1A]);
        if(callback) callback({type: 'SMS', message: message, status: 'sent'}); // ex: play audio "SMS sent"
      },1000);
    });
  });
};


// handle receiving a SMS ( when a message is received --> +CMTI: "SM",<n> )
SIM800L.receiveSMS = function(callback){
  // on [get last] message received
  // pass a function that handles "stuff" when a message is received ( ex: save it to SD card & remove it from SIM )
  if(callback) callback({type: 'SMS', message: message, status: 'received'});  // ex: play audio "SMS received"
};

// get a particular or all SMSes
// R: if no index is passed, we return all SMSes
// R: get last/<n> message received --> AT+CMGR=1/<n>
// R: calling the above TWICE marks it as "read" ( hum .. would it be possible that it's copied by fais ? .. )
// R: get all messages received --> AT+CMGL="ALL"
SIM800L.getSMS = function(indexOrFlag){
  // if !isNaN -> index => get SMS[i]
  // else -> flag => getSMS[flag]
};


// delete a particular or all SMSes
// R: if no index is passed, we delete all SMSes
// R: delete a message --> AT+CMGD=<n>
// R: delete all messages --> AT+CMGDA="DEL <chunk> ( chunks: READ,UNREAD,SENT,UNSENT,INBOX,ALL) in text mode
SIM800L.delSMS = function(indexOrFlag){
  // if !isNaN -> index => get SMS[i]
  // else -> flag => getSMS[flag]
};


/* -- VOICE --*/
// handle initiating a call ( --> ATD )
SIM800L.placeCall = function(number, callback){
  at.cmd("ATD"+number+";\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if(callback) callback({type: 'Call', status: 'initiated'}); // ex: play audio "Call initiated"
  });
};

// handle receiving a call ( when a call is received --> RING )
// R: if module detects DTMF, URC 'll be reported via serial port --> ATD<the_num>; ==> +DTMF
// R: enable DTMF detection --> AT+DDET=1
// R: accept incoming call --> ATA
// R: when a call is aborted ( on the remote side --> NO CARRIER )
// R: to hangup --> ATH
SIM800L.receiveCall = function(callback){
  at.registerLine("RING", function(){ 
    callback({type: 'Call', status: 'ringing'}); // ex: play audio "Call received"
  });
};

// handle accepting a call
SIM800L.acceptCall = function(callback){
  at.registerLine("ATA", function(){ 
    callback({type: 'Call', status: 'accepted'}); // ex: play audio "Call accepted"
  });
};

// handle call ended
SIM800L.callEnded = function(callback){
  at.registerLine("NO CARRIER", function(){ 
    callback({type: 'Call', status: 'ended'}); // ex: play audio "Call ended" 
  });
};


// handle hanging up
SIM800L.hangupCall = function(callback){
  at.cmd("ATH\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if(callback) callback({type: 'Call', status: 'hangup'}); // ex: play audio "Call hangup confirmed"
  });
};


// handle rejecting calls
// R: modes --> 0 => Enable incoming, 1 => forbid incoming, 2 => for incoming voice calls but enable CSD calls
SIM800L.rejectCalls = function(mode, callback){
  at.cmd("AT+GSMBUSY="+mode+"\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if(callback) callback({type: 'Call', status: 'hangup'});
  });
};


// handle using or not the buzzer sound for incoming calls
// R: modes --> 0 => don't use buzzer sound as incoming call ring, 1 => use it as ..
SIM800L.buzzerRing = function(mode, callback){
  at.cmd("AT+CBUZZERRING="+mode+"\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if(callback) callback({type: 'Call', status: 'hangup'});
  });
};


// handle toggling the Net light
// R: modes --> 0 => close the Net LED, 1 => open it to shining
SIM800L.toggleNetLight = function(mode, callback){
  at.cmd("AT+CNETLIGHT="+mode+"\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if(callback) callback({type: 'Call', status: 'hangup'});
  });
};


// handle using the Net light to indicate the GPRS status
// R: modes --> 0 => disable, 1 => enable
// if enabled, it's forced to enter 64msON/"00msOFF blinking in GPRS data transmission, 
// otherwise its state is not restricted
SIM800L.toggleNetLightIndicateGprsStatus = function(mode, callback){
  at.cmd("AT+CSGS="+mode+"\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if(callback) callback({type: 'Call', status: 'hangup'});
  });
};

/* -- GENERAL --*/
// handle opening or closing the microphone
// R: modes --> 0 => re-open the mike, 1 => close it
SIM800L.toggleMike = function(mode, callback){
  at.cmd("AT+CEXTERNTONE="+mode+"\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if(callback) callback({type: 'Call', status: 'hangup'});
  });
};


/* -- HELPERS -- */
// handle resetting the SIM800L module by triggering its RST pin ( R: shorting it to Gnd  )
SIM800L.reset = function(callback){
  digitalWrite(B4, 0); // power off SIM800L module
  setTimeout(function(){
    digitalWrite(B4, 1);  // power on SIM800L module
    SIM800L.init(callback);
  }, 1000);
};

// does nothing for the moment ;p
SIM800L.init = function(callback){
  callback(null);
};

/** This is 'exported' so it can be used with `require('MOD123.js').connect(pin1,pin2)` */
exports.connect = function (usart, resetPin, connectedCallback) {
  at = require('AT').connect(usart);
  return SIM800L;
};
