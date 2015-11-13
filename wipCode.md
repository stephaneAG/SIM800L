## API-like functions to be later used to build a SIM800L module

#### SMS
send SMS ( ```AT+CMGF=1``` ):
```javascript
SIM800L.sendSMS(number, message, callback)
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
