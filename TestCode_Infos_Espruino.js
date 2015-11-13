/*
R: the following was working with the red FTDI adaptor providing power & the Pico only having the following in the right pane of the Espruino IDE

```
Serial1.setup(115200, { rx: B7, tx : B6 });

var at = require("AT").connect(Serial1);
at.debug();
// R: we could connect the NET pin & check whether it's pulsating, HIGH, or LOW to know if we have to reboot the module
digitalWrite(B4, 0); // power off SIM800L module
setTimeout(function(){
  digitalWrite(B4, 1);  // power on SIM800L module
}, 1000);
```

To have an interactive console that is somewhat like using 'screen', we can use the following
```
Serial1.on('data', function(d) { USB.write(d); });
at.write("AT\r\n"); // same as typing 'AT' + Enter in 'screen'
```

The following was also quite useful to see some faulty output on the Serial
```
/*
Serial2.setup(115200, { rx: A3, tx : A2 });
Serial2.on('data', function(d) { USB.write(d); }); // log stuff received from SIM800L to web ide console
USB.on('data', function(d) { Serial1.write(d); });
*/

/*
Serial1.setup(115200, { rx: B7, tx : B6 });
Serial1.on('data', function(d) { USB.write(d); }); // log stuff received from SIM800L to web ide console
USB.on('data', function(d) { Serial2.write(d); });
*/
```

*/


// AT
at.cmd("AT\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT result: ' + d);
});


// ATI
at.cmd("ATI\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('ATI result: ' + d);
});


// AT+CCID
at.cmd("AT+CCID\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT+CCID result: ' + d);
});


// AT+COPS?
at.cmd("AT+COPS?\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT+COPS? result: ' + d);
});


// AT+CSQ
at.cmd("AT+CSQ\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT+CSQ result: ' + d);
});


// AT+CBC
at.cmd("AT+CBC\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT+CBC result: ' + d);
});


// AT+PIN=<the_num>
at.cmd("AT+PIN=<the_num>\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT+PIN=<the_num> result: ' + d);
});


// AT+CMGF=1
at.cmd("AT+CMGF=1\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT+CMGF=1 result: ' + d);
});


// AT+CMGS="0681382722"
at.cmd('AT+CMGS="0681382722"\r\n', 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('AT+CMGS=0681382722 result: ' + d);
});

// -- content of the text message --
at.write("Hello World from Pico and SIM800L !\r\n");
// --end message & send ( \x1A === Ctrl-Z ) --
at.write(0x1A);
// or
at.write("\r\n" + 0x1A); // untested

// -- test code for the above, mainly untested
at.write( String.fromCharCode(0x1A) );
// print("\x1A")
// String.fromCharCode(0x1A)
// Serial1.write([0x1A])
// Serial1.write(0x1A)


// ATD<the_num>;
at.cmd("ATD<the_num>;\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('ATD<the_num>; result: ' + d);
});


// ATH
at.cmd("ATH\r\n", 1000, function(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('ATH result: ' + d);
});




// following is, obviously, not working ;)
at.cmd("ATI\r\n", 1000, function cb(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('ATI result: ' + d);
  testStuff += '#'+d;
  if( still_waiting_for_more_info ) return cb;
});
// the below one is, but doesn't do what I expected :/ ..
at.cmd("ATI\r\n", 1000, function cb(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('ATI result: ' + d);
  testStuff += '#'+d;
  //testStuff += '['+ d + ']';
  if( at.isBusy() ) return cb;
});


at.cmd("ATI\r\n", 1000, function cb(d) {
  if (d===undefined) ; // we timed out!
  // d is now the result
  console.log('FKUK result: \r\n' + d) + 'FLOK';
  if( at.isBusy() ) return cb;
});


// register a callback for whenever "ATI" pops
at.registerLine("ATI", function(d) { console.log('regist_ATI START: \r\n' + d + '\r\nEND'); });
// unregister the above
at.unregisterLine("ATI");

// other way of fetching stuff
var testStuff;
Serial1.on('data', function(d) { USB.write(d); testStuff="#"+d; });
at.write('ATI\r\n');
Serial1.removeAllListeners('data');
Serial1.on('data', function(d) { USB.write(d); }); // 'll print pending stuff*

// if we want, we can handle the pending stuff, by using the following
Serial1.available() // different than 0 when data is available
Serial1.read() // read all the buffer content at once & flush it

// testStuff --> "#ATI\r\r\nSIM800 R13.08\r\n\r\nOK\r\n"
var cleanStuff = testStuff.split('\r\n').join(' ').split('\r').join('#');
// cleanStuff --> "#ATI# SIM800 R13.08  OK "
var cmdIssued = cleanStuff.substr(cleanStuff.indexOf('#')+1, cleanStuff.lastIndexOf('#')-1 );
var cmdResult = cleanStuff.substr(cleanStuff.lastIndexOf('#')+2, cleanStuff.lastIndexOf('  ')-6 );
// if the below === "OK", we know we can parse the above stuff ( cmdResult.split(' ')[0], .. )
var cmdRetKod = cleanStuff.substr(cleanStuff.lastIndexOf('  ')+2, cleanStuff.length - cleanStuff.lastIndexOf(' ')+1 );
