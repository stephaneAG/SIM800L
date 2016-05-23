/* -- MODULE TESTING -- */
var exports = {};
/* ---------------------*/


/* -- MODULE EXAMPLE -- */

var sim800l = exports.connect(Serial1, B4, function(err){
//var sim800l = require('SIM800L').connect(Serial1, B4, function(err){
  if(!err){
    /*
    // send a text message
    sim800l.sendSMS('0681382722', 'Shall we play a game ? -> call then hang up ..', function(){
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
    */
    
    // combo test ;p ==> HAHA! "Uncaught Error: Maximum number of scopes exceeded" ==> but the 15000 timeout seems to overcome that ?
    // it SEEMS to, but for a real life implm, we souhld REALLY wait for OK AT confirmations ( -> ex: to have the right order of actions )
    // in others words, register 'OK' & on callback, deregister it & trigger some timeout or other fcn ;P
    /*
    sim800l.sendSMS('0681382722', 'Shall we play a game ? -> call then hang up ..', function(){
      console.log('first SMS sent ..');
      setTimeout(function(){
        sim800l.placeCall('0681382722', function(){
          console.log('placign call ..');
          setTimeout(function(){
            sim800l.sendSMS('0681382722', '.. I will hang up soon ..',function(){
              console.log('.. second SMS sent ..');
              setTimeout(function(){
                sim800l.hangupCall(function(){
                  console.log('.. hanging up call :D !');
                  setTimeout(function(){
                    sim800l.sendSMS('0681382722', 'Did it ring your bell ?',function(data){
                      console.log('.. third & last SMS sent :P !');
                      console.log(data.type, data.message, data.status);
                    });
                  },5000);
                });
              },25000);
            });
          },5000);
        });
      },5000);
    });
    */
    // combo test, with many less logs ;p ==> NOT working, but nice test indeed ^^ .. so yup, 'd need refactoring .. but who use that anw ?
    /*
    sim800l.sendSMS('0681382722', 'Shall we play a game ? -> call then hang up ..', setTimeout(
      sim800l.placeCall('0681382722', setTimeout(
        sim800l.sendSMS('0681382722', '.. I will hang up soon ..', setTimeout(
          sim800l.hangupCall(setTimeout(
            sim800l.sendSMS('0681382722', 'Did it ring your bell ?',function(data){
              console.log(data.type, data.message, data.status);
            })
          , 5000) )
        ),5000)
      ),5000)
    , 5000) );
    */
    
    // simple one: send a SMS
    //sim800l.sendSMS('0681382722', 'Shall we play a game ? -> call then hang up ..', function(){ console.log('first SMS sent ..'); });
    
    // simple two: call & then hangup
    sim800l.placeCall('0681382722', function(){
      console.log('placing call ..');
      setTimeout(function(){
        sim800l.hangupCall(function(){
          console.log('.. hanging up call :D !');
          setTimeout(function(){
            sim800l.sendSMS('0681382722', 'Did it ring your bell ?',function(data){
              console.log('.. third & last SMS sent :P !');
              console.log(data.type, data.message, data.status);
            });
          },5000);
        });
      },15000);
    });
    
    // simple three: handle receiving SMS
    
    
  } else {
    console.log(err);
  }
});
/* ---------------------*/


/* -- ACTUAL MODULE -- */

var at;
var usart;
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
// example usage:
// on [get last] message received
// pass a function that handles "stuff" when a message is received ( ex: save it to SD card & remove it from SIM )
SIM800L.receiveSMS = function(callback){
  at.registerLine('+CMTI: "SM"', function(){ 
    callback({type: 'SMS', message: 'TODO:getMessageAsJsObjOrJson', status: 'received'});  // ex: play audio "SMS received"
  });
};

// get a particular or all SMSes
// R: if no index is passed, we return all SMSes
// R: get last/<n> message received --> AT+CMGR=1/<n>
// R: calling the above TWICE marks it as "read" ( hum .. would it be possible that it's copied by fais ? .. )
// R: get all messages received --> AT+CMGL="ALL"
SIM800L.getSMS = function(indexOrFlag, callback){
  // if !isNaN -> index => get SMS[i]
  // else -> flag => getSMS[flag]
  // for now, don't care of the above distinction -- R: below NOT working .. :/
  at.register('+CMGR=1', function(){
    at.write('AT+CMGR=1\r\n');
    setTimeout(function(){
      var data = usart.read();
      at.unregister('+CMGR=1');
      callback({type: 'SMS', message: data, status: 'received'});
    }, 1000);
  });
};

// ------------------------------------------ WIP STUFF STR ------------------------------------------
// R: since the above is not working, the below replacement fcn has to be tested
SIM800L.getSMSWip = function(indexOrFlag, callback){
  // if !isNaN -> index => get SMS[i]
  // else -> flag => getSMS[flag]
  // for now, don't care of the above distinction -- R: below NOT working .. :/
  var data = ''; // SMS content buffer
  at.cmd("AT+CMGR=1\r\n", 1000, function cb(d) {
    if (d===undefined) ; // we timed out!
    if (d!== 'OK') { data += d; return cb; } // we received part of a SMS
    if (d==='OK') { // we received the entire SMS
      // parse 'data' if necessary ( ex: format a nice obj with sender number & content, .. ), then callback passing that
      if(callback) callback({type: 'SMS', message: data, status: 'received'});
    }
  });
};



// ------------------------------------------ WIP STUFF END ------------------------------------------

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

// get module name & version ( --> ATI )
SIM800L.moduleAndVersion = function(callback){
  
};

// turn on verbose errors ( --> ATI+CMEE=2 )
SIM800L.verbose = function(callback){
  
};

// get SIM card number ( --> AT+CCID )
SIM800L.SIM = function(callback){
  
};

// get connected network ( --> AT+COPS? )
SIM800L.network = function(callback){
  
};

// get signal strength ( --> AT+CSQ )
SIM800L.signalStrength = function(callback){
  
};

// get battery state ( --> AT+CBC )
SIM800L.batteryState = function(callback){
  
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
  usart = usart;
  at = require('AT').connect(usart);
  return SIM800L;
};
