# SIM800L
Little repo containing code &amp; docs for the SIM800L module

<img src="http://stephaneadamgarnier.com/SIM800L/SIM800L_pinouts.jpg" width="100%">
<img src="http://stephaneadamgarnier.com/SIM800L/SIM800L_connections.jpg" width="100%">

Essential downloads, thanks to the Adafruit friends :)  
[SIM800L Downloads](https://learn.adafruit.com/adafruit-fona-mini-gsm-gprs-cellular-phone-module/downloads)  
[AT commands](http://www.adafruit.com/datasheets/sim800_series_at_command_manual_v1.01.pdf)  
[FTP/HTTP](http://www.adafruit.com/datasheets/sim800_series_ip_application_note_v1.00.pdf)

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
Any script/program 'll do, starting with the following cmd, whcih 'll start an interactive session using "screen"
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


## useful AT cmds
- init the auto-bauder: ```AT```
- get module name & version: ```ATI```
- turn on verbose errors: ```ATI+CMEE=2```
- get SIM card number: ```AT+CCID```
- check that we're connected to a network: ```AT+COPS?```
- check signal strength: ```AT+CSQ```
- check battery state: ```AT+CBC```
- check the codepages supported by the module (IRA,GSM,UCS2,HEX,PCCP,PCDN,8859-1): ```AT+CSCS=?```
- for locked SIM cards, to enter PIN before connecting to a network: ```AT+PIN=<pin_code>```
- send a SMS: 
  * set the module to TEXT mode ( not PDU/data ) to be able to enter a message: ```AT+CMGF=1```
  * send a text message ( 'll return a '>' prompt, type/send Ctrl-Z on an empty line to send ): ```AT+CMGS="<the_number>"```
- send a unicode SMS (if the codepages list contains HEX or UCS2 ):
  * set the module to HEX or UCS2 mode to be able to enter a unicode message: ```AT+CSCS="HEX"```
  * specify the correct DCS ( Data Coding Scheme ) for Unicode messages ( 0X08 ):  
    R: check ```<cmd>=?```, current values ```<cmd>?```, set ```<cmd>=..```  
    We have to change the last parameter of ```AT+CSMP?``` ( ```17,168,0,0``` ) to 8:
    ```AT+CSMP=17,168,0,8```  
  * send unicode message ( 'll return a '>' prompt, type/send Ctrl-Z on an empty line to send ): ```AT+CMGS="<the_number>"```  
  * now, we just have to write some code to convert a unicode glyph to a hex string  
- place a call:
  * to init a call: ```ATD<the_number>;```
  * once chatting, to hang up: ```ATH```
