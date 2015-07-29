'use strict';

goog.provide('Blockly.JavaScript.webduino');
goog.require('Blockly.JavaScript');

Blockly.JavaScript['board_ready'] = function (block) {
  var value_device_ = Blockly.JavaScript.valueToCode(block, 'device_', Blockly.JavaScript.ORDER_NONE);
  var statements_callbacks_ = Blockly.JavaScript.statementToCode(block, 'callbacks_');
  var code = 'boardReady(' + value_device_ + ', function (board) {\n' + statements_callbacks_ + '});\n';
  return code;
};

Blockly.JavaScript['led_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getLed(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['led_state'] = function (block) {
  var variable_led_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('led_'), Blockly.Variables.NAME_TYPE);
  var dropdown_state_ = block.getFieldValue('state_');
  var code = variable_led_ + '.' + dropdown_state_ + '();\n';
  return code;
};

Blockly.JavaScript['led_toggle'] = function (block) {
  var variable_led_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('led_'), Blockly.Variables.NAME_TYPE);
  var code = variable_led_ + '.toggle();\n';
  return code;
};

Blockly.JavaScript['rgbled_new'] = function (block) {
  var dropdown_red_ = block.getFieldValue('red_');
  var dropdown_green_ = block.getFieldValue('green_');
  var dropdown_blue_ = block.getFieldValue('blue_');
  var code = 'getRGBLed(board, ' + dropdown_red_ + ', ' + dropdown_green_ + ', ' + dropdown_blue_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['rgbled_setcolor'] = function (block) {
  var variable_rgbled_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('rgbled_'), Blockly.Variables.NAME_TYPE);
  var value_color_ = Blockly.JavaScript.valueToCode(block, 'color_', Blockly.JavaScript.ORDER_NONE);
  var code = variable_rgbled_ + '.setColor(' + value_color_ + ');\n';
  return code;
};

Blockly.JavaScript['car_new'] = function (block) {
  var dropdown_f_ = block.getFieldValue('f_');
  var dropdown_b_ = block.getFieldValue('b_');
  var dropdown_l_ = block.getFieldValue('l_');
  var dropdown_r_ = block.getFieldValue('r_');
  var code = 'getCar(board, ' + dropdown_f_ + ', ' + dropdown_b_ + ', ' + dropdown_l_ + ', ' + dropdown_r_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['car_move'] = function (block) {
  var variable_car_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('car_'), Blockly.Variables.NAME_TYPE);
  var dropdown_move_ = block.getFieldValue('move_');
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_NONE);
  var code = variable_car_ + '.' + dropdown_move_ + '(' + value_secs_ + ')';
  code = promisifyBlockCode(block, code);
  return code;
};

Blockly.JavaScript['do'] = function (block) {
  var value_return_ = Blockly.JavaScript.valueToCode(block, 'return_', Blockly.JavaScript.ORDER_NONE);
  var code = value_return_.trim() + ';\n';
  return code;
};

Blockly.JavaScript['timer'] = function (block) {
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_NONE);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'setTimeout(function () {\n' + statements_do_ + '}, ' + 1000 * value_secs_ + ');\n';
  return code;
};

Blockly.JavaScript['exec_seq'] = function (block) {
  var statements_seq_ = Blockly.JavaScript.statementToCode(block, 'seq_');
  var code = statements_seq_.trim();
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['exec_then'] = function (block) {
  var value_then_ = Blockly.JavaScript.valueToCode(block, 'then_', Blockly.JavaScript.ORDER_NONE);
  var code = '.then(function () {\n  return ' + value_then_ + ';\n})';
  return code;
};

Blockly.JavaScript['exec_then_stms'] = function (block) {
  var statements_then_ = Blockly.JavaScript.statementToCode(block, 'then_');
  var code = '.then(function () {\n' + statements_then_ + '})';
  var next = getNextBlock(block);
  if (next === null || ['car_move', 'exec_then', 'exec_then_stms'].indexOf(next.type) === -1) {
    code += ';\n';
  }
  return code;
};
