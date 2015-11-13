Serial1.setup(115200, { rx: B7, tx : B6 });

var at = require("AT").connect(Serial1);
at.debug();
digitalWrite(B4, 0); // power off SIM800L module
setTimeout(function(){
  digitalWrite(B4, 1);  // power on SIM800L module
}, 1000);
