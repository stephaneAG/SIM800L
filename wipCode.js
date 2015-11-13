Serial1.setup(115200, { rx: B7, tx : B6 });

var at = require("AT").connect(Serial1);
at.debug();
digitalWrite(B4, 0); // power off SIM800L module
setTimeout(function(){
  digitalWrite(B4, 1);  // power on SIM800L module
}, 1000);

var dummyNum = "0681382722";
var SIM800L = {};

/* -- TEXT -- */
// handle sending a SMS
SIM800L.sendSMS = function(number, message, callback){
  at.cmd("AT+CMGF=1\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    if (d!==undefined){
      at.cmd('AT+CMGS="'+number+'"\r\n', 1000, function(m) {
        if (m===undefined) ; // we timed out!
        if (m!==undefined){
          at.write(message+"\r\n", 0x1A);
          // play audio: SMS sent
          if(callback) callback({type: 'SMS', message: message, status: 'sent'});
        }
      });
    }
  });
}

// handle receiving a SMS ( +CMTI: "SM",<n> )
SIM800L.receiveSMS = function(callback(data)){
  
}

/* -- VOICE --*/
// handle initiating a call
SIM800L.placeCall = function(number, callback){
  at.cmd("ATD"+number+";\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    // play audio: call initiated
    if(callback) callback({type: 'Call', status: 'initiated'});
  });
}

// handle receiving a call
SIM800L.receiveCall = function(callback(data)){
  
}

// handle hanging up
SIM800L.hangupCall = function(){
  at.cmd("ATH\r\n", 1000, function(d) {
    if (d===undefined) ; // we timed out!
    // play audio: hangup confirmed
    if(callback) callback({type: 'Call', status: 'hangup'});
  });
}
