# SIM800L
Code & doc for the SIM800L module

<img src="http://stephaneadamgarnier.com/SIM800L/SIM800L_pinouts.jpg" width="100%">
<img src="http://stephaneadamgarnier.com/SIM800L/SIM800L_connections.jpg" width="100%">  

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
To solve that, power the module from +5V  instead of +3.3V, & just use a 1N4007 diode ( 0.7 drop ) to be "right" for the [3.7V..4.2V] accepted range for the module input voltage

For the ```OVER-VOLTAGE WARNNING```, I don't know yet why it sometimes happen, but it seems it's when the module is up for a long time ( or maybe my diode is free runnig ? :/ )

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
  

place a call:
  * to init a call:  
    ```javascript
    ATD<the_number>;
    ```
    
  * once chatting, to hang up:  
    ```javascript
    ATH
    ```
