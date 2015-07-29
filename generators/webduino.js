'use strict';

goog.provide('Blockly.JavaScript.webduino');
goog.require('Blockly.JavaScript');

Blockly.JavaScript['board_ready'] = function (block) {
  var value_device_ = Blockly.JavaScript.valueToCode(block, 'device_', Blockly.JavaScript.ORDER_ATOMIC);
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
  var value_color_ = Blockly.JavaScript.valueToCode(block, 'color_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_rgbled_ + '.setColor(' + value_color_ + ');\n';
  return code;
};

Blockly.JavaScript['car_init_control'] = function (block) {
  var dropdown_f_pin_ = block.getFieldValue('F_pin_');
  var dropdown_b_pin_ = block.getFieldValue('B_pin_');
  var dropdown_l_pin_ = block.getFieldValue('L_pin_');
  var dropdown_r_pin_ = block.getFieldValue('R_pin_');
  var code = 'board.F = new webduino.module.Led(board, board.getDigitalPin(' + dropdown_f_pin_ + '));\n' +
    'board.B = new webduino.module.Led(board, board.getDigitalPin(' + dropdown_b_pin_ + '));\n' +
    'board.L = new webduino.module.Led(board, board.getDigitalPin(' + dropdown_l_pin_ + '));\n' +
    'board.R = new webduino.module.Led(board, board.getDigitalPin(' + dropdown_r_pin_ + '));\n';
  return code;
};

Blockly.JavaScript['car_move'] = function (block) {
  var dropdown_move_ = block.getFieldValue('move_');
  var text_secs_ = block.getFieldValue('secs_');
  var functionName = Blockly.JavaScript.provideFunction_(
    'move_promise', [Blockly.car_move_promise.toString().replace('function (', 'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(')]
  );
  var code = functionName + "(board, '" + dropdown_move_ + "', " + text_secs_ + ')';
  return code;
};

Blockly.JavaScript['car_move_then'] = function (block) {
  var dropdown_move_ = block.getFieldValue('move_');
  var text_secs_ = block.getFieldValue('secs_');
  Blockly.JavaScript.provideFunction_(
    'move_promise', [Blockly.car_move_promise.toString().replace('function (', 'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(')]
  );
  var functionName = Blockly.JavaScript.provideFunction_(
    'move', [Blockly.car_move.toString().replace('function (', 'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(')]
  );
  var code = functionName + "(board, '" + dropdown_move_ + "', " + text_secs_ + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.car_move = function (board, dir, secs) {
  return function () {
    return Blockly.car_move_promise(board, dir, secs);
  };
};

Blockly.car_move_promise = function (board, dir, secs) {
  return new Promise(function (resolve, reject) {
    console.log('>>', dir, secs);

    switch (dir) {
    case 'F':
      board.send([0x90, 0x00, 0x01, 0x91, 0x01, 0x00]);
      setTimeout(function () {
        board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, secs * 1000);
      break;

    case 'B':
      board.send([0x90, 0x40, 0x00, 0x91, 0x02, 0x00]);
      setTimeout(function () {
        board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, secs * 1000);
      break;

    case 'L':
      board.send([0x90, 0x40, 0x00, 0x91, 0x01, 0x00]);
      setTimeout(function () {
        board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, 1000 * secs);
      break;

    case 'R':
      board.send([0x90, 0x00, 0x01, 0x91, 0x02, 0x00]);
      setTimeout(function () {
        board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, 1000 * secs);
      break;

    default:
      setTimeout(function () {
        resolve();
      }, 1000 * secs);
      break;
    }
  });
}

Blockly.JavaScript['timer'] = function (block) {
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'setTimeout(function () {\n' + statements_do_ + '}, ' + 1000 * value_secs_ + ');\n';
  return code;
};

Blockly.JavaScript['exec_then'] = function (block) {
  var value_then_ = Blockly.JavaScript.valueToCode(block, 'then_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '\n.then(' + value_then_ + ')';
  return code;
};

Blockly.JavaScript['exec_then_stms'] = function (block) {
  var statements_then_ = Blockly.JavaScript.statementToCode(block, 'then_');
  var code = '\n.then(function () {\n' + statements_then_ + '})';
  return code;
};

Blockly.JavaScript['ultrasonic_new'] = function(block) {
  var dropdown_trig_ = block.getFieldValue('trig_');
  var dropdown_echo_ = block.getFieldValue('echo_');
  var code = 'getUltrasonic(board, ' + dropdown_trig_ + ', ' + dropdown_echo_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['ultrasonic_get'] = function(block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do = Blockly.JavaScript.statementToCode(block, 'do');
  var code = variable_var_+'.ping(function(cm){\n'+
              '  '+variable_var_+'.distance = cm*1;\n'+
              '  console.log('+variable_var_+'.distance);\n'+
              '  '+statements_do+
              '},'+value_time+');\n';
  return code;
};

Blockly.JavaScript['ultrasonic_distance'] = function(block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var code = variable_var_+'.distance';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

