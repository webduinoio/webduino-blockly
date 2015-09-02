'use strict';

goog.provide('Blockly.JavaScript.webduino');
goog.require('Blockly.JavaScript');

Blockly.JavaScript['console'] = function (block) {
  var value_console = Blockly.JavaScript.valueToCode(block, 'console', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'console.log(' + value_console + ');\n';
  return code;
};

Blockly.JavaScript['getdate'] = function (block) {
  var dropdown_date_ = block.getFieldValue('date_');
  var varNow = Blockly.JavaScript.variableDB_.getDistinctName(
    'varNow', Blockly.Variables.NAME_TYPE);
  var varDate = Blockly.JavaScript.variableDB_.getDistinctName(
    'varDate', Blockly.Variables.NAME_TYPE);
  var code;
  if (dropdown_date_ == 1) {
    code = '(function(){\n' +
      '  var ' + varDate + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varDate + '.getFullYear().toString() + "/" + (' + varDate + '.getMonth()+1).toString() + "/" +' + varDate + '.getDate().toString();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_date_ == 2) {
    code = '(function(){\n' +
      '  var ' + varDate + ' = new Date();\n' +
      '  var ' + varNow + ' = (' + varDate + '.getMonth()+1).toString() + "/" + ' + varDate + '.getDate().toString() + "/" +' + varDate + '.getFullYear().toString();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_date_ == 3) {
    code = '(function(){\n' +
      '  var ' + varDate + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varDate + '.getDate().toString() + "/" + (' + varDate + '.getMonth()+1).toString() + "/" +' + varDate + '.getFullYear().toString();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_date_ == 4) {
    code = '(function(){\n' +
      '  var ' + varDate + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varDate + '.getFullYear();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_date_ == 5) {
    code = '(function(){\n' +
      '  var ' + varDate + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varDate + '.getMonth();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_date_ == 6) {
    code = '(function(){\n' +
      '  var ' + varDate + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varDate + '.getDate();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['gettime'] = function (block) {
  var dropdown_time_ = block.getFieldValue('time_');
  var varNow = Blockly.JavaScript.variableDB_.getDistinctName(
    'varNow', Blockly.Variables.NAME_TYPE);
  var varTime = Blockly.JavaScript.variableDB_.getDistinctName(
    'varTime', Blockly.Variables.NAME_TYPE);
  var code;
  if (dropdown_time_ == 1) {
    code = '(function(){\n' +
      '  var ' + varTime + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varTime + '.getHours().toString() + ":" + ' + varTime + '.getMinutes().toString() + ":" +' + varTime + '.getSeconds().toString();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_time_ == 2) {
    code = '(function(){\n' +
      '  var ' + varTime + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varTime + '.getHours();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_time_ == 3) {
    code = '(function(){\n' +
      '  var ' + varTime + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varTime + '.getMinutes();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  } else if (dropdown_time_ == 4) {
    code = '(function(){\n' +
      '  var ' + varTime + ' = new Date();\n' +
      '  var ' + varNow + ' = ' + varTime + '.getSeconds();\n' +
      '  return ' + varNow + ';\n' +
      '})()';
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

/*Blockly.JavaScript['board_ready'] = function (block) {
  var value_device_ = Blockly.JavaScript.valueToCode(block, 'device_', Blockly.JavaScript.ORDER_NONE);
  var statements_callbacks_ = Blockly.JavaScript.statementToCode(block, 'callbacks_');
  var code = 'boardReady(' + value_device_ + ', function (board) {\n' +
    '  ' + statements_callbacks_ +
    '  if(window.boardReadyNumber){\n' +
    '    window.boardReadyNumber = window.boardReadyNumber +1;\n' +
    '  }else{\n' +
    '    window.boardReadyNumber = 1;\n' +
    '  }\n' +
    '  window.allBoardReady(window.boardReadyNumber);\n' +
    '});\n';
  return code;
};*/

Blockly.JavaScript['board_ready'] = function (block) {
  var value_device_ = Blockly.JavaScript.valueToCode(block, 'device_', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_check_ = block.getFieldValue('check_');
  var statements_callbacks_ = Blockly.JavaScript.statementToCode(block, 'callbacks_');
  var code;
  if (checkbox_check_ == 'FALSE') {
    code = 'boardReady(' + value_device_ + ', function (board) {\n' +
      statements_callbacks_ +
      '});\n';
  } else if (checkbox_check_ == 'TRUE') {
    code = 'if(window.readyBoardLength){\n' +
      '  window.readyBoardLength = window.readyBoardLength + 1;\n' +
      '}else{\n' +
      '  window.readyBoardLength = 1;\n' +
      '}\n\n' +
      'boardReady(' + value_device_ + ', function (board) {\n' +
      statements_callbacks_ +
      '  if(window.boardReadyNumber){\n' +
      '    window.boardReadyNumber = window.boardReadyNumber +1;\n' +
      '  }else{\n' +
      '    window.boardReadyNumber = 1;\n' +
      '  }\n' +
      '  allBoardReady(window.boardReadyNumber);\n' +
      '});\n';
  }
  return code;
};

Blockly.JavaScript['all_board_ready'] = function (block) {
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'function allBoardReady(boardReadyNumber){\n' +
    '  if(window.boardReadyNumber==window.readyBoardLength){\n' +
    '  ' + statements_do_ +
    '  }\n' +
    '}\n';
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


Blockly.JavaScript['led_intensity'] = function (block) {
  var variable_led_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('led_'), Blockly.Variables.NAME_TYPE);
  var value_intensity_ = Blockly.JavaScript.valueToCode(block, 'intensity_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_led_ + '.intensity = ' + value_intensity_ + ';\n';
  return code;
};

Blockly.JavaScript['led_callback'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_state_ = block.getFieldValue('state_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_name_ + '.' + dropdown_state_ + '(function(){\n  ' + statements_do_ + '\n});\n';
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
  var code = variable_car_ + '.' + dropdown_move_ + '(' + value_secs_ + ');\n';
  block.setPromise(true);
  return code;
};

Blockly.JavaScript['fish_new'] = function (block) {
  var code = 'getFish(board)';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['fish_angle'] = function (block) {
  var variable_fish_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('fish_'), Blockly.Variables.NAME_TYPE);
  var dropdown_angle_ = block.getFieldValue('angle_');
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_NONE);
  var code = variable_fish_ + '.' + dropdown_angle_ + '(' + value_secs_ + ');\n';
  block.setPromise(true);
  return code;
};

Blockly.JavaScript['fish_move'] = function (block) {
  var variable_fish_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('fish_'), Blockly.Variables.NAME_TYPE);
  var dropdown_direction_ = block.getFieldValue('direction_');
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_NONE);
  var dropdown_speed_ = block.getFieldValue('speed_');
  var code = variable_fish_ + ".flap(" + value_secs_ + ", " + dropdown_speed_ + (dropdown_direction_.length ? ", " + dropdown_direction_ : '') + ");\n";
  block.setPromise(true);
  return code;
};

Blockly.JavaScript['timer'] = function (block) {
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_NONE);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'setTimeout(function () {\n' + statements_do_ + '}, ' + 1000 * value_secs_ + ');\n';
  return code;
};

Blockly.JavaScript['delay'] = function (block) {
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_NONE);
  var code = 'delay(' + value_secs_ + ');\n';
  block.setPromise(true);
  return code;
};

Blockly.JavaScript['ultrasonic_new'] = function (block) {
  var dropdown_trig_ = block.getFieldValue('trig_');
  var dropdown_echo_ = block.getFieldValue('echo_');
  var code = 'getUltrasonic(board, ' + dropdown_trig_ + ', ' + dropdown_echo_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['ultrasonic_get'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do = Blockly.JavaScript.statementToCode(block, 'do');
  var code = variable_var_ + '.ping(function(cm){\n' +
    '  console.log(' + variable_var_ + '.distance);\n' +
    statements_do +
    '}, ' + value_time + ');\n';
  return code;
};

Blockly.JavaScript['ultrasonic_get_promise'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var code = variable_var_ + '.ping();\n';
  block.setPromise(true);
  return code;
};

Blockly.JavaScript['ultrasonic_distance'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var code = variable_var_ + '.distance';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['button_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getButton(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['button_event'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var dropdown_event_ = block.getFieldValue('event_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_var_ + '.on("' + dropdown_event_ + '",function(){\n' +
    '  console.log("' + dropdown_event_ + '");\n' +
    '  ' + statements_do_ + '\n' +
    '});\n';
  return code;
};

Blockly.JavaScript['pir_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getPir(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['pir_status'] = function (block) {
  var variable_item_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('item_'), Blockly.Variables.NAME_TYPE);
  var dropdown_status_ = block.getFieldValue('status_');
  var statements_var_ = Blockly.JavaScript.statementToCode(block, 'var_');
  var code = variable_item_ + '.on("' + dropdown_status_ + '",function(){\n' +
    statements_var_ + '\n' +
    '});\n';
  return code;
};

Blockly.JavaScript['sound_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getSound(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['sound_status'] = function (block) {
  var variable_item_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('item_'), Blockly.Variables.NAME_TYPE);
  var dropdown_status_ = block.getFieldValue('status_');
  var statements_var_ = Blockly.JavaScript.statementToCode(block, 'var_');
  var code = variable_item_ + '.on("' + dropdown_status_ + '",function(){\n' +
    '  setTimeout(function(){\n' +
    '  ' + statements_var_ + '\n' +
    '  },300);\n' +
    '});\n';
  return code;
};

Blockly.JavaScript['shock_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getShock(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['shock_event'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var dropdown_event_ = block.getFieldValue('event_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_var_ + '.on("' + dropdown_event_ + '",function(){\n' +
    '  console.log("' + dropdown_event_ + '");\n' +
    '  ' + statements_do_ + '\n' +
    '});\n';
  return code;
};

Blockly.JavaScript['dht_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getDht(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['dht_get'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do = Blockly.JavaScript.statementToCode(block, 'do');
  var code = variable_var_ + '.read(function(evt){\n' +
    statements_do +
    '}, ' + value_time + ');\n';
  return code;
};

Blockly.JavaScript['dht_get_number'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_dht_ = block.getFieldValue('dht_');
  var code = variable_name_ + '.' + dropdown_dht_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['buzzer_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getBuzzer(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['buzzer_music'] = function (block) {
  var value_music_name_ = Blockly.JavaScript.valueToCode(block, 'music_name_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_music_ = Blockly.JavaScript.statementToCode(block, 'music_');
  var code = 'var ' + value_music_name_ + '={};\n' +
    '(function(){\n' +
    '  var musicNotes = {};\n' +
    '  musicNotes.notes = [];\n' +
    '  musicNotes.tempos = [];\n' +
    statements_music_ + '\n' +
    '  ' + value_music_name_ + '.notes = musicNotes.notes;\n' +
    '  ' + value_music_name_ + '.tempos = musicNotes.tempos;\n' +
    '})();\n';
  return code;
};

Blockly.JavaScript['buzzer_music_array'] = function (block) {
  var value_music_name_ = Blockly.JavaScript.valueToCode(block, 'music_name_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_notes_ = Blockly.JavaScript.valueToCode(block, 'notes_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_tempos_ = Blockly.JavaScript.valueToCode(block, 'tempos_', Blockly.JavaScript.ORDER_ATOMIC);
  var a = value_notes_.split(',');
  value_notes_ = '[' + a.join('\',\'') + ']';
  var b = value_tempos_.split(',');
  value_tempos_ = '[' + b.join('\',\'') + ']';
  var code = 'var ' + value_music_name_ + '={};\n' +
    '(function(){\n' +
    '  ' + value_music_name_ + '.notes = ' + value_notes_ + ';\n' +
    '  ' + value_music_name_ + '.tempos = ' + value_tempos_ + ';\n' +
    '})();\n';
  return code;
};

Blockly.JavaScript['buzzer_notes_tempos'] = function (block) {
  var dropdown_tone_ = block.getFieldValue('tone_');
  var dropdown_pitch_ = block.getFieldValue('pitch_');
  var dropdown_tempos_ = block.getFieldValue('tempos_');
  if (dropdown_tone_ == '0') {
    dropdown_pitch_ = '';
  }
  var code = 'musicNotes.notes.push("' + dropdown_tone_ + dropdown_pitch_ + '");\n' +
    'musicNotes.tempos.push("' + dropdown_tempos_ + '");\n';
  return code;
};

Blockly.JavaScript['buzzer_play'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var value_play_music_ = Blockly.JavaScript.valueToCode(block, 'play_music_', Blockly.JavaScript.ORDER_ATOMIC);
  var code;
  if (value_play_music_.indexOf(".notes") === 1) {
    code = variable_var_ + '.play(' + value_play_music_ + ');\n';
  } else {
    var code = variable_var_ + '.play(' + value_play_music_ + '.notes, ' + value_play_music_ + '.tempos);\n';
  }
  return code;
};

Blockly.JavaScript['buzzer_event'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var dropdown_event_ = block.getFieldValue('event_');
  var code = variable_var_ + dropdown_event_ + ';\n';
  return code;
};

Blockly.JavaScript['buzzer_state'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var dropdown_state_ = block.getFieldValue('state_');
  var code = variable_var_ + '._state == "' + dropdown_state_ + '"';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['buzzer_load_music'] = function (block) {
  var dropdown_music_ = block.getFieldValue('music_');
  var notes, tempos, a, b;
  var m = function () {
    a = notes.split(',');
    notes = '["' + a.join('","') + '"]';
    b = tempos.split(',');
    tempos = '["' + b.join('","') + '"]';
  }
  if (dropdown_music_ == 'm1') {
    notes = "E7,E7,0,E7,0,C7,E7,0,G7,0,0,0,G6,0,0,0,C7,0,0,G6,0,0,E6,0,0,A6,0,B6,0,AS6,A6,0,G6,E7,0,G7,A7,0,F7,G7,0,E7,0,C7,D7,B6,0,0,C7,0,0,G6,0,0,E6,0,0,A6,0,B6,0,AS6,A6,0,G6,E7,0,G7,A7,0,F7,G7,0,E7,0,C7,D7,B6,0,0";
    tempos = "8";
    m();
  }
  if (dropdown_music_ == 'm2') {
    notes = "c4,e4,e4,0,e4,g4,g4,0,d4,f4,f4,0,a4,b4,b4,0,c4,d4,e4,c4,e4,c4,e4,0,d4,e4,f4,f4,e4,d4,f4,0,e4,f4,g4,e4,g4,e4,g4,0,f4,g4,a4,a4,g4,f4,a4,0,g4,c4,d4,e4,f4,g4,a4,0,a4,d4,e4,f4,g4,a4,b4,0,b4,e4,f4,g4,a4,b4,c5,0,c5,b4,a4,f4,b4,g4,c5";
    tempos = "6, 6, 6,6,6 ,6 ,6 ,6,6 ,6 ,6 ,6,6 ,6 ,6 ,6 ,6 ,6 ,6 ,6 ,6 ,6 ,6,6,6 ,6 ,6 ,6 ,6 ,6 ,6 ,6,6 ,6 ,6 , 6, 6, 6, 6,6, 6, 6, 6, 6, 6, 6, 6,6, 6, 6, 6, 6,6 ,6 ,6 ,6,6 ,6 ,6 ,6 ,6 ,6 ,6 ,6,6 ,6 ,6 ,6 ,6 ,6 ,6 ,6,6 ,6 ,6 ,6 ,6 ,6 ,6";
    m();
  }
  if (dropdown_music_ == 'm3') {
    notes = "C5,C5,G4,G4,A4,A4,G4,0,E4,G4,C5,A4,G4,0,0,A4,0,G4,0,E4,A4,G4,0,E4,0,G4,0,E4,D4,C4,0,E4,E4,G4,G4,A4,A4,G4,G4,0,D5,0,C5,A4,G4,A4,C5,G4,0,A4,A4,G4,A4,C5,G4,0,A4,A4,G4,A4,D5,C5";
    tempos = "6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6";
    m();
  }
  if (dropdown_music_ == 'm4') {
    notes = "FS6,FS6,0,FS6,0,D6,FS6,0,B6,0,0,0,G6,0,0,0,G6,0,0,E6,0,0,C6,0,0,F6,0,G6,0,FS6,F6,0,E6,C7,0,E7,F7,0,D7,E7,0,C7,0,A6,B6,G6,0,0,G6,0,0,E6,0,0,C6,0,0,F6,0,G6,0,FS6,F6,0,E6,G6,0,E7,F7,0,D7,E7,0,C7,0,A6,B6,G6,0,0";
    tempos = "8";
    m();
  }
  var code = notes + ',' + tempos;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['relay_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getRelay(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['relay_state'] = function (block) {
  var variable_relay_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('relay_'), Blockly.Variables.NAME_TYPE);
  var dropdown_state_ = block.getFieldValue('state_');
  var code = variable_relay_ + '.' + dropdown_state_ + '();\n';
  return code;
};

Blockly.JavaScript['servo_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getServo(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['servo_angle'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var angle_angle_ = block.getFieldValue('angle_');
  if (angle_angle_ <= 5) {
    angle_angle_ = 5;
  }
  if (angle_angle_ > 270) {
    angle_angle_ = 5;
  }
  if (angle_angle_ >= 175 && angle_angle_ <= 270) {
    angle_angle_ = 175;
  }
  var code = variable_var_ + '.angle = ' + angle_angle_ + ';\n';
  return code;
};

Blockly.JavaScript['servo_angle_set'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var value_angle_ = Blockly.JavaScript.valueToCode(block, 'angle_', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_angle_ <= 5) {
    value_angle_ = 5;
  }
  if (value_angle_ > 270) {
    value_angle_ = 5;
  }
  if (value_angle_ >= 175 && value_angle_ <= 270) {
    value_angle_ = 175;
  }
  var code = variable_var_ + '.angle = ' + value_angle_ + ';\n';
  return code;
};

Blockly.JavaScript['data_firebase'] = function (block) {
  var value_name_ = Blockly.JavaScript.valueToCode(block, 'name_', Blockly.JavaScript.ORDER_ATOMIC);
  var text_url_ = block.getFieldValue('url_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = value_name_ + ' = new Firebase("' + text_url_ + '");\n' + statements_do_;
  return code;
};

Blockly.JavaScript['data_firebase_write'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var statements_write_ = Blockly.JavaScript.statementToCode(block, 'write_');
  var code = variable_var_ + '.push({\n' +
    '  ' + statements_write_ + '\n' +
    '});\n' +
    'console.log("write ok");\n';
  return code;
};

Blockly.JavaScript['data_firebase_data'] = function (block) {
  var text_attr_ = block.getFieldValue('attr_');
  var value_data_ = Blockly.JavaScript.valueToCode(block, 'data_', Blockly.JavaScript.ORDER_ATOMIC);
  var next = block.getNextBlock();
  var code;
  if (next === null) {
    code = text_attr_ + ':' + value_data_;
  } else {
    code = text_attr_ + ':' + value_data_ + ',';
  }
  return code;
};

Blockly.JavaScript['data_firebase_read'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var text_attr_ = block.getFieldValue('attr_');
  var value_read_ = Blockly.JavaScript.valueToCode(block, 'read_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_name_ + '.on("value", function(snapshot) {\n' +
    '   ' + value_read_ + '=[];\n' +
    '     snapshot.forEach(function(data) {\n' +
    '     ' + value_read_ + '.push(data.val().' + text_attr_ + ');\n' +
    '   });\n' +
    '   ' + statements_do_ + '\n' +
    ' }, function (errorObject) {\n' +
    '   console.log("The read failed: " + errorObject.code);\n' +
    '});\n';
  return code;
};

Blockly.JavaScript['data_firebase_readonce'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var text_attr_ = block.getFieldValue('attr_');
  var value_read_ = Blockly.JavaScript.valueToCode(block, 'read_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_name_ + '.once("value", function(snapshot) {\n' +
    '   ' + value_read_ + '=[];\n' +
    '     snapshot.forEach(function(data) {\n' +
    '     ' + value_read_ + '.push(data.val().' + text_attr_ + ');\n' +
    '   });\n' +
    '   ' + statements_do_ + '\n' +
    ' }, function (errorObject) {\n' +
    '   console.log("The read failed: " + errorObject.code);\n' +
    '});\n';
  return code;
};


Blockly.JavaScript['data_firebase_clear'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.set({});\n' +
    'console.log("clear ok");\n';;
  return code;
};

Blockly.JavaScript['set_pin_state'] = function (block) {
  var value_var_ = Blockly.JavaScript.valueToCode(block, 'var_', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = value_var_ + '= {};\n' +
    value_var_ + '.board_ = board;\n' +
    value_var_ + '.pin_ = ' + dropdown_pin_ + ';\n';
  return code;
};

Blockly.JavaScript['query_pin_state'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var pinNum = Blockly.JavaScript.variableDB_.getDistinctName(
    'pinNum', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + pinNum + '=' + variable_name_ + '.pin_;\n' +
    variable_name_ + '.queryPinState_ = function(' + pinNum + ') {\n' +
    '  ' + variable_name_ + '.pinNum_ = ' + variable_name_ + '.board_.getDigitalPin(' + pinNum + ');\n' +
    '  ' + variable_name_ + '.board_.queryPinState(' + variable_name_ + '.pinNum_,function(){\n' +
    '     ' + statements_do_ + '\n' +
    '  });\n' +
    '};\n' +
    variable_name_ + '.queryPinState_(' + pinNum + ');\n';
  return code;
};

Blockly.JavaScript['pin_state'] = function (block) {
  var variable_pin_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('pin_'), Blockly.Variables.NAME_TYPE);
  var code = variable_pin_ + '.pinNum_.state';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['car_test_new'] = function (block) {
  var value_var_ = Blockly.JavaScript.valueToCode(block, 'var_', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_rf_ = block.getFieldValue('rf_');
  var dropdown_rb_ = block.getFieldValue('rb_');
  var dropdown_lf_ = block.getFieldValue('lf_');
  var dropdown_lb_ = block.getFieldValue('lb_');
  var code = value_var_ + ' = {};\n\n' +
    value_var_ + '.rightFront_ = getLed(board, ' + dropdown_rf_ + ');\n' +
    value_var_ + '.rightBack_ = getLed(board, ' + dropdown_rb_ + ');\n' +
    value_var_ + '.leftFront_ = getLed(board, ' + dropdown_lf_ + ');\n' +
    value_var_ + '.leftBack_ = getLed(board, ' + dropdown_lb_ + ');\n\n' +
    value_var_ + '.goFront_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.on();\n' +
    '  ' + value_var_ + '.rightBack_.off();\n' +
    '  ' + value_var_ + '.leftFront_.on();\n' +
    '  ' + value_var_ + '.leftBack_.off();\n' +
    '};\n' +
    value_var_ + '.goBack_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.off();\n' +
    '  ' + value_var_ + '.rightBack_.on();\n' +
    '  ' + value_var_ + '.leftFront_.off();\n' +
    '  ' + value_var_ + '.leftBack_.on();\n' +
    '};\n' +
    value_var_ + '.goRight_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.on();\n' +
    '  ' + value_var_ + '.rightBack_.off();\n' +
    '  ' + value_var_ + '.leftFront_.off();\n' +
    '  ' + value_var_ + '.leftBack_.off();\n' +
    '};\n' +
    value_var_ + '.goLeft_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.off();\n' +
    '  ' + value_var_ + '.rightBack_.off();\n' +
    '  ' + value_var_ + '.leftFront_.on();\n' +
    '  ' + value_var_ + '.leftBack_.off();\n' +
    '};\n' +
    value_var_ + '.turnRight_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.off();\n' +
    '  ' + value_var_ + '.rightBack_.on();\n' +
    '  ' + value_var_ + '.leftFront_.on();\n' +
    '  ' + value_var_ + '.leftBack_.off();\n' +
    '};\n' +
    value_var_ + '.turnLeft_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.on();\n' +
    '  ' + value_var_ + '.rightBack_.off();\n' +
    '  ' + value_var_ + '.leftFront_.off();\n' +
    '  ' + value_var_ + '.leftBack_.on();\n' +
    '};\n' +
    value_var_ + '.backLeft_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.off();\n' +
    '  ' + value_var_ + '.rightBack_.off();\n' +
    '  ' + value_var_ + '.leftFront_.off();\n' +
    '  ' + value_var_ + '.leftBack_.on();\n' +
    '};\n' +
    value_var_ + '.backRight_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.off();\n' +
    '  ' + value_var_ + '.rightBack_.on();\n' +
    '  ' + value_var_ + '.leftFront_.off();\n' +
    '  ' + value_var_ + '.leftBack_.off();\n' +
    '};\n' +
    value_var_ + '.stop_ = function(){\n' +
    '  ' + value_var_ + '.rightFront_.off();\n' +
    '  ' + value_var_ + '.rightBack_.off();\n' +
    '  ' + value_var_ + '.leftFront_.off();\n' +
    '  ' + value_var_ + '.leftBack_.off();\n' +
    '};\n\n';
  return code;
};

Blockly.JavaScript['car_test_move'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var dropdown_move_ = block.getFieldValue('move_');
  var code = variable_var_ + '.' + dropdown_move_ + '();\n';
  return code;
};

Blockly.JavaScript['temp_data_set'] = function (block) {
  var dropdown_type_ = block.getFieldValue('type_');
  var value_name_ = Blockly.JavaScript.valueToCode(block, 'name_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value_ = Blockly.JavaScript.valueToCode(block, 'value_', Blockly.JavaScript.ORDER_ATOMIC);
  var setCookie = Blockly.JavaScript.variableDB_.getDistinctName(
    'setCookie', Blockly.Variables.NAME_TYPE);
  var code;
  if (dropdown_type_ == 1) {
    code = 'function ' + setCookie + '(c_name,value,expiredays){\n' +
      '  var exdate=new Date();\n' +
      '  exdate.setDate(exdate.getDate()+expiredays);\n' +
      '  document.cookie=c_name+ "=" +escape(value)+\n' +
      '  ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());\n' +
      '}\n' +
      setCookie + '(' + value_name_ + ',' + value_value_ + ');\n';
  } else if (dropdown_type_ == 2) {
    code = 'localStorage.' + value_name_ + ' = ' + value_value_ + ';\n';
  } else if (dropdown_type_ == 3) {
    code = 'sessionStorage.' + value_name_ + ' = ' + value_value_ + ';\n';
  }
  return code;
};

Blockly.JavaScript['temp_data_get'] = function (block) {
  var dropdown_type_ = block.getFieldValue('type_');
  var value_name_ = Blockly.JavaScript.valueToCode(block, 'name_', Blockly.JavaScript.ORDER_ATOMIC);
  var getCookie = Blockly.JavaScript.variableDB_.getDistinctName(
    'getCookie', Blockly.Variables.NAME_TYPE);
  var code;
  if (dropdown_type_ == 1) {
    code = '(function(){\n' +
      '  function getCookie(c_name){\n' +
      '    if (document.cookie.length>0){\n' +
      '      var c_start=document.cookie.indexOf(c_name + "=");\n' +
      '      if (c_start!=-1){\n' +
      '        c_start=c_start + c_name.length+1;\n' +
      '        var c_end=document.cookie.indexOf(";",c_start);\n' +
      '        if (c_end==-1){\n' +
      '          c_end=document.cookie.length;\n' +
      '          return unescape(document.cookie.substring(c_start,c_end));\n' +
      '        }\n' +
      '      }\n' +
      '    }\n' +
      '    return "";\n' +
      '  }\n' +
      '  return ' + getCookie + '(' + value_name_ + ');\n' +
      '})()';
  } else if (dropdown_type_ == 2) {
    code = 'localStorage.' + value_name_ + '\n';
  } else if (dropdown_type_ == 3) {
    code = 'sessionStorage.' + value_name_ + '\n';
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['sound_recognition'] = function (block) {
  var dropdown_lang_ = block.getFieldValue('lang_');
  var statements_recognition_ = Blockly.JavaScript.statementToCode(block, 'recognition_');
  var recognizing = Blockly.JavaScript.variableDB_.getDistinctName(
    'recognizing', Blockly.Variables.NAME_TYPE);
  var recognition = Blockly.JavaScript.variableDB_.getDistinctName(
    'recognition', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + recognizing + ' = false,\n' +
    '    ' + recognition + ';\n' +
    'if (!("webkitSpeechRecognition" in window)) {\n' +
    '  alert("本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)");\n' +
    '} else{\n' +
    '  ' + recognition + ' = new webkitSpeechRecognition();\n' +
    '  ' + recognition + '.continuous = true;\n' +
    '  ' + recognition + '.interimResults = true;\n' +
    '  ' + recognition + '.lang = "'+dropdown_lang_+'";\n\n' +
    '  ' + recognition + '.onstart = function() {\n' +
    '    ' + recognizing + ' = true;\n' +
    '    console.log("Start recognize...");\n' +
    '  };\n\n' +
    '  ' + recognition + '.onend = function() {\n' +
    '    ' + recognizing + ' = false;\n' +
    '    console.log("Stop recognize");\n' +
    '  };\n\n' +
    '  ' + recognition + '.onresult = function(event) {\n' +
    '    var interim_transcript="";\n' +
    '    for (var i = event.resultIndex; i < event.results.length; ++i){\n' +
    '      interim_transcript += event.results[i][0].transcript;\n' +
    '      console.log(interim_transcript);\n' +
    statements_recognition_ +
    '    }\n' +
    '  };\n' +
    '}\n\n' +
    recognition + '.start();\n';
  return code;
};

Blockly.JavaScript['sound_recognition_check'] = function (block) {
  var value_text_ = Blockly.JavaScript.valueToCode(block, 'text_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var a = value_text_.split("'");
  value_text_ = a.splice(1, (a.length - 2)).join('');
  var b = value_text_.split(', ');
  var code;
  if (b.length == 1) {
    code = '      if(interim_transcript.indexOf("' + b[0] + '")!==-1){\n' +
      '        ' + statements_do_ +
      '      }\n';
  } else {
    code = '      if(interim_transcript.indexOf("' + b[0] + '")!==-1){\n' +
      '        ' + statements_do_ +
      '      }\n';
    for (var i = 1; i < b.length; i++) {
      code += '      if(interim_transcript.indexOf("' + b[i] + '")!==-1){\n' +
        '        ' + statements_do_ +
        '      }\n';
    }
  }
  return code;
};


Blockly.JavaScript['translate_speech'] = function(block) {
  var dropdown_lang_ = block.getFieldValue('lang_');
  var dropdown_sex_ = block.getFieldValue('sex_');
  var value_speech_ = Blockly.JavaScript.valueToCode(block, 'speech_', Blockly.JavaScript.ORDER_ATOMIC);
  var body = Blockly.JavaScript.variableDB_.getDistinctName(
    'body', Blockly.Variables.NAME_TYPE);
  var creatAudio = Blockly.JavaScript.variableDB_.getDistinctName(
    'creatAudio', Blockly.Variables.NAME_TYPE);
  var audio = Blockly.JavaScript.variableDB_.getDistinctName(
    'audio', Blockly.Variables.NAME_TYPE);
  var text = Blockly.JavaScript.variableDB_.getDistinctName(
    'text', Blockly.Variables.NAME_TYPE);
  var appID = 'TMXse1GmyYnY4U6jdDskPxJGke0UmpU5BznkpvoTSIyg*';
  var language = dropdown_lang_;
  var format = 'audio/mp3&options=MinSize|'+dropdown_sex_;
  var a = value_speech_.split('');
  value_speech_ = a.splice(1, (a.length - 2)).join('');
  var code = '(function(){\n'+
              '  var '+body+' = document.querySelector("body");\n'+
              '  var '+creatAudio+' = document.createElement("audio");\n'+
              '  '+body+'.appendChild('+creatAudio+');\n'+
              '  var '+audio+' = document.querySelector("audio");\n'+
              '  '+audio+'.setAttribute("autoplay","true");\n'+
              '  var '+text+' = encodeURI("'+value_speech_+'");\n'+
              '  '+audio+'.setAttribute("src","http://api.microsofttranslator.com/v2/http.svc/speak?appId='+appID+'&language='+language+'&format='+format+'&text='+value_speech_+'");\n'+
              '})();\n';
  return code;
};