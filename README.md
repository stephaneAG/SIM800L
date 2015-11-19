# SIM800L
Code & doc for the SIM800L module

## hardware specs
- Quad band GSM/GPRS module
- Supply voltage: 3.4-4.4V
- Interface: USART 2.8V

The module requires a maximum 4.4V on Vcc from a "strong" power source.Manufacturer states that consumption can be up to 2A  ( in peaks ).  
With a 5V power supply, we can either use a 1N4007 diode, for example ( it has a 0.7V drop ), or use a simple resistor voltage divider:  

<img src="https://cdn.rawgit.com/stephaneAG/SIM800L/master/resistor_voltage_divider__power.svg" width="100%" height="300">

It can be used with any USB-TTL module & a laptop or any uC.  
While most of the sellers claim it to be 5V tolerant ( & it seems to be ), the hardware design manual, however, defines the maximum voltage of the HIGH level to be 2.8V.To follow the design manual guidelines, we can use another resistor voltage divider:  

<img src="https://cdn.rawgit.com/stephaneAG/SIM800L/master/resistor_voltage_divider__rx2.svg" width="100%" height="300">

Aside info, both 1.8V & 3.0V SIM cards are said to be compatible

## connections & pinouts

Espruino Pico  | SIM800L        | Notes
-------------- | ---------------| ------------------------------
+5V            | Vcc ( 4.4V ! ) | Power supply input
B6 / USART1 Tx | Rx  ( 2.8V ! ) | Serial data Espruino -> SIM800L
B7 / USART1 Rx | Tx             | Serial data SIM800L -> Espruino
B4             | RST            | Reset pin
Gnd            | Gnd            |

<img src="http://stephaneadamgarnier.com/SIM800L/SIM800L_pinouts.jpg" width="100%">
<img src="http://stephaneadamgarnier.com/SIM800L/SIM800L_connections.jpg" width="100%">  

## warnings & errors
Depending on the implementation of the SIM800L module in a circuit, it can throw errors as unsollicited messages on the Tx line, or just not work correctly.  
Aside from throwing errors, the blinking pattern of the Net light can help identifying the status of the module & possible troubles.  

The module software monitors the suply voltage constantly, & may throw the following errors/warnings:
- if Vcc voltage is <= 3.5V:  
  ```
  UNDER-VOLTAGE WARNING
  ```
- if Vcc voltage is <= 3.4V:  
  ```
  UNDER-VOLTAGE POWER DOWN
  ```
- if Vcc voltage is >= 4.3V:  
  ```
  OVER-VOLTAGE WARNING
  ```
- if Vcc voltage is >= 4.4V:  
  ```
  OVER-VOLTAGE POWER DOWN
  ```

R: the above infos may differ depending on the module ( the one in the picture is said to need 3.7-4.2V for Vcc )

Quick reminder: if debug comm is impossible using ```screen /dev/ttyUSB0 115200```, then try shorting the RST pin to Gnd
If the output looks like the following, it may be cause the module is under-running ( aka doesn't get enough power )
```
F1: 5004 0000
F8: 380C 0000
F9: 4800 000B
F9: 4800 000B
F9: 4800 000B
F9: 4800 000B
00: 102C 0004
01: 1005 0000
U0: 0000 0001 [0000]
T0: 0000 00C3
Boot failed, reset ...
```
To solve that, power the module from +5V  instead of +3.3V, & just use a 1N4007 diode ( 0.7 drop ) to be in the accepted range for the module input voltage.

## using it with a laptop
Any script/program 'll do, starting with the following cmd, which 'll start an interactive session using "screen"  
```screen /dev/ttyUSB0 115200```

## using it with a uC
Depending on the uC used, the docs to digg can differ ..  

For the AVR/Arduino family of stuff, check the Adafruit tuts -> they're GREAT ! :)  

For the RPi family ( more than just a uC .. ), digg the linux implms ;)  

For the Espruino ( uC with an onboard javascript interpreter ), the following links can come handy  
[Modules](http://www.espruino.com/Modules)  
[SIM900](http://www.espruino.com/SIM900)  
[SIM900.js](http://www.espruino.com/modules/SIM900.js)  
[AT](http://www.espruino.com/AT)  
[AT.js](http://www.espruino.com/modules/AT.js)
[USART](http://www.espruino.com/USART)


## Espruino SIM800L module API
[wipCode API](https://github.com/stephaneAG/SIM800L/blob/master/wipCode.md)  
[wipCode JS](https://github.com/stephaneAG/SIM800L/blob/master/wipCode.js)  
[SIM800L_moduleTesting.js](https://github.com/stephaneAG/SIM800L/blob/master/SIM800L_moduleTesting.js)  
To load the wip module code in the Espruino Web IDE ==> <a href="http://www.espruino.com/webide?codeurl=https://raw.githubusercontent.com/stephaneAG/SIM800L/master/SIM800L_moduleTesting.js" class="codelink" title="Send to Web IDE"> <img src="http://www.espruino.com/favicon.ico"></a>  

#### Examples
the bare minimum is the following:  
```javascript
var sim800l = require('SIM800L').connect(Serial1, B4, function(err){
  if(!err){
    // some code here
  } else {
    console.log(err);
  }
});
```

to send a SMS:
```javascript
// ( .. )
sim800l.sendSMS('<phone_number>', 'Shall we play a game ?', function(){
  console.log('SMS sent !');
});
// ( .. )
```

to place a call:
```javascript
// ( .. )
sim800l.placeCall('<phone_number>', function(){
  console.log('placing call ..');
});
// ( .. )
```

to place a call, hangup after a while, and then send a SMS:
```javascript
// ( .. )
sim800l.placeCall('<phone_number>', function(){
      console.log('placing call ..');
      setTimeout(function(){
        sim800l.hangupCall(function(){
          console.log('.. hanging up call :D !');
          setTimeout(function(){
            sim800l.sendSMS('<phone_number>', 'Did it ring your bell ?',function(data){
              console.log('.. third & last SMS sent :P !');
              console.log(data.type, data.message, data.status);
            });
          },5000);
        });
      },15000);
    });
// ( .. )
```


#### SMS
send SMS ( ```AT+CMGS="<the_number>"``` ):
```javascript
SIM800L.sendSMS(number, message, callback)
```

send unicode SMS ( ```AT+CMGS="<the_number>"``` ):
```javascript
SIM800L.sendUnicodeSMS(number, message, callback)
```

receive SMS ( ``` +CMTI: "SM",<total>``` ):
```javascript
SIM800L.receiveSMS(callback)
```

get one/all SMS ( ```AT+CMGR=<index>```, ```AT+CMGL="ALL"```):
```javascript
SIM800L.getSMS(indexOrFlag)
```

delete all/one SMS ( ```AT+CMGD=<index>```, ```AT+CMGDA="DEL ALL"``` ):
```javascript
SIM800L.delSMS(indexOrFlag)
```

#### Calls
initiate calls ( ```ATD<number>;``` ):
```javascript
SIM800L.placeCall(number, callback)
```

receive calls ( ```RING``` ):
```javascript
SIM800L.receiveCall(callback)
```

accept calls ( ```ATA``` ):
```javascript
SIM800L.acceptCall(callback)
```

know if call ended ( ```NO CARRIER``` ):
```javascript
SIM800L.callEnded(callback)
```

hangup call ( ```ATH``` ):
```javascript
SIM800L.hangupCall(callback)
```

reject calls ( ```AT+GSMBUSY``` ):
```javascript
SIM800L.rejectCalls(mode, callback)
```

use or not buzzer sound for incoming calls ( ```AT+CBUZZERRING``` ):
```javascript
SIM800L.buzzerRing(mode, callback)
```

#### General
toggle Net LED ( ```AT+CNETLIGHT``` ):
```javascript
SIM800L.toggleNetLight(mode, callback)
```

toggle using the Net LED as GPRS status indicator ( ```AT+CSGS``` ):
```javascript
SIM800L.toggleNetLightIndicateGprsStatus(mode, callback)
```

toggle opening or closing the mike ( ```AT+CEXTERNTONE``` ):
```javascript
SIM800L.toggleMike(mode, callback)
```

get module name & version ( ```ATI``` ):
```javascript
SIM800L.nameVersion(callback)
```

turn on verbose errors ( ```ATI+CMEE=2``` ):
```javascript
SIM800L.verboseErrors(callback)
```

get SIM card number ( ```AT+CCID``` ):
```javascript
SIM800L.simNum(callback)
```

check network connection ( ```AT+COPS?``` ):
```javascript
SIM800L.connStat(callback)
```

check signal strength ( ```AT+CSQ``` ):
```javascript
SIM800L.sigPow(callback)
```

check battery state ( ```AT+CBC``` ):
```javascript
SIM800L.battPow(callback)
```

check the codepages supported by the module, for ex IRA,GSM,UCS2,HEX,PCCP,PCDN,8859-1..: ( ```AT+CSCS=?``` ):
```javascript
SIM800L.codePages(callback)
```

for locked SIM cards, to enter PIN before connecting to a network ( ```AT+PIN=<pin_code>``` ):
```javascript
SIM800L.unlockPin(callback)
```


## useful AT cmds

Essential downloads, thanks to the Adafruit friends :)  
[SIM800L Downloads](https://learn.adafruit.com/adafruit-fona-mini-gsm-gprs-cellular-phone-module/downloads)  
[AT commands](http://www.adafruit.com/datasheets/sim800_series_at_command_manual_v1.01.pdf)  
[FTP/HTTP](http://www.adafruit.com/datasheets/sim800_series_ip_application_note_v1.00.pdf)  

init the auto-bauder:  
```javascript
AT
```

get module name & version:  
```javascript
ATI
```

turn on verbose errors:  
```javascript
ATI+CMEE=2
```

get SIM card number:  
```javascript
AT+CCID
```

check that we're connected to a network:  
```javascript
AT+COPS?
```

check signal strength:  
```javascript
AT+CSQ
```

check battery state:  
```javascript
AT+CBC
```

check the codepages supported by the module (IRA,GSM,UCS2,HEX,PCCP,PCDN,8859-1):  
```javascript
AT+CSCS=?
```

for locked SIM cards, to enter PIN before connecting to a network:  
```javascript
AT+PIN=<pin_code>
```

send a SMS:  
  * set the module to TEXT mode ( not PDU/data ) to be able to enter a message:  
    ```javascript
    AT+CMGF=1
    ```
    
  * send a text message ( 'll return a '>' prompt, type/send Ctrl-Z on an empty line to send ):  
    ```javascript
    AT+CMGS="<the_number>"
    ```
    
send a unicode SMS (if the codepages list contains HEX or UCS2 ):  
  * set the module to HEX or UCS2 mode to be able to enter a unicode message:  
    ```javascript
    AT+CSCS="HEX"
    ```
    
  * specify the correct DCS ( Data Coding Scheme ) for Unicode messages ( 0X08 ):  
    R: check ```<cmd>=?```, current values ```<cmd>?```, set ```<cmd>=..```  
    We have to change the last parameter of ```AT+CSMP?``` ( ```17,168,0,0``` ) to 8:  
    ```javascript
    AT+CSMP=17,168,0,8
    ```
    
  * send unicode message ( 'll return a '>' prompt, type/send Ctrl-Z on an empty line to send ):  
    ```javascript
    AT+CMGS="<the_number>"
    ```
    
  * now, we just have to write some code to convert a unicode glyph to a hex string  ( echo -e "\xEF\xA3\xBF" )  
    R: the following seems to ne quite handy :) [smssplit](http://chadselph.github.io/smssplit/)  

place a call:
  * to init a call:  
    ```javascript
    ATD<the_number>;
    ```
    
  * once chatting, to hang up:  
    ```javascript
    ATH
    ```
