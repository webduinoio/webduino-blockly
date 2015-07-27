'use strict';

goog.provide('Blockly.JavaScript.webduino.tutorials');
goog.require('Blockly.JavaScript');


Blockly.JavaScript['light'] = function(block) {
  var dropdown_status = block.getFieldValue('status');
  var code = 'document.getElementById("light").setAttribute("class","'+dropdown_status+'");\n';
  return code;
};

Blockly.JavaScript['light_click'] = function(block) {
  var statements_click = Blockly.JavaScript.statementToCode(block, 'click');
  var code =  'var timer;\n'+
              'document.getElementById("light").addEventListener("click",function(){\n'+
  						statements_click+'\n});\n';
  return code;
};

Blockly.JavaScript['light_check'] = function(block) {
  var dropdown_status = block.getFieldValue('status');
  var code = 'document.getElementById("light").getAttribute("class")=="'+dropdown_status+'"';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['two_led_light'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var dropdown_status = block.getFieldValue('status');
  var code = 'document.getElementById("'+dropdown_name+'").setAttribute("class","'+dropdown_status+'");\n';
  return code;
};

Blockly.JavaScript['two_led_light_click'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  var code = 'document.getElementById("'+dropdown_name+'").addEventListener("click",function(){\n'+
              statements_name+'\n});\n';
  return code;
};

Blockly.JavaScript['two_led_light_check'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var dropdown_check = block.getFieldValue('check');
  var code = 'document.getElementById("'+dropdown_name +'").getAttribute("class")=="'+dropdown_check+'"';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['two_led_start_blinking'] = function(block) {
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_status1 = Blockly.JavaScript.statementToCode(block, 'status1');
  var statements_status2 = Blockly.JavaScript.statementToCode(block, 'status2');
  var code =  'var a=1;\n'+
              'blink();\n'+
              'function blink(){\n'+
              '  a=a+1;\n'+
              '  if(a%2==0){\n'+statements_status1+
              '  \n}else{\n'+statements_status2+
              '  }\n'+
              '  timer = setTimeout(blink,'+value_time+');\n'+
              '}\n';
  return code;
};

Blockly.JavaScript['two_led_stop_blinking'] = function(block) {
  var code = 'clearTimeout(timer);\n'+
              'a=1;';
  return code;
};
Blockly.JavaScript['two_led_stop_blinking'] = function(block) {
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  var code = 'clearTimeout(timer);\n'+
              'a=1;\n'+statements_name;
  return code;
};


