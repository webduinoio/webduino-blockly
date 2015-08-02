'use strict';

goog.provide('Blockly.Blocks.webduino');
goog.require('Blockly.Blocks');

Blockly.Blocks['board_ready'] = {
  init: function () {
    this.appendValueInput("device_")
      .appendField(Blockly.Msg.WEBDUINO_BOARD_READY_WEBDUINO)
      .appendField(Blockly.Msg.WEBDUINO_BOARD_READY_DEVICE);
    this.appendStatementInput("callbacks_");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['led_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_LED, "Led")
      .appendField(Blockly.Msg.WEBDUINO_LED_PIN, "pin")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "pin_");
    this.setOutput(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['led_state'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable(" "), "led_")
      .appendField(Blockly.Msg.WEBDUINO_LED_SET_STATE, "set state")
      .appendField(new Blockly.FieldDropdown([
        ["on", "on"],
        ["off", "off"]
      ]), "state_");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['led_toggle'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable(" "), "led_")
      .appendField(Blockly.Msg.WEBDUINO_LED_TOGGLE, "toggle");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['rgbled_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_RGBLED, "RGBLed")
      .appendField(Blockly.Msg.WEBDUINO_RGBLED_RED, "red")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "red_")
      .appendField(Blockly.Msg.WEBDUINO_RGBLED_GREEN, "green")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "green_")
      .appendField(Blockly.Msg.WEBDUINO_RGBLED_BLUE, "blue")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "blue_");
    this.setOutput(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['rgbled_setcolor'] = {
  init: function () {
    this.appendValueInput("color_")
      .appendField(new Blockly.FieldVariable(" "), "rgbled_")
      .appendField(Blockly.Msg.WEBDUINO_RGBLED_SETCOLOR, "set color");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['car_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_CAR)
      .appendField(Blockly.Msg.WEBDUINO_CAR_F)
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "f_")
      .appendField(Blockly.Msg.WEBDUINO_CAR_B)
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "b_")
      .appendField(Blockly.Msg.WEBDUINO_CAR_L)
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "l_")
      .appendField(Blockly.Msg.WEBDUINO_CAR_R)
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "r_");
    this.setOutput(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['car_move'] = {
  init: function () {
    this.appendValueInput("secs_")
      .appendField(new Blockly.FieldVariable(" "), "car_")
      .appendField(new Blockly.FieldDropdown([
        ["↑", "forward"],
        ["↓", "backward"],
        ["↺", "left"],
        ["↻", "right"],
        ["✕", "stop"]
      ]), "move_")
      .appendField(Blockly.Msg.WEBDUINO_CAR_MOVE_FOR);
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_CAR_MOVE_SEC);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['timer'] = {
  init: function () {
    this.appendValueInput("secs_")
      .appendField(Blockly.Msg.WEBDUINO_TIMER_AFTER, "After");
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_TIMER_SECOND, "second(s),");
    this.appendStatementInput("do_")
      .appendField(Blockly.Msg.WEBDUINO_TIMER_DO, "do");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['do'] = {
  init: function () {
    this.appendValueInput("return_")
      .appendField(Blockly.Msg.WEBDUINO_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['exec_seq'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_EXEC_SEQ);
    this.appendStatementInput("seq_");
    this.setOutput(true);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['exec_then'] = {
  init: function () {
    this.appendValueInput("then_")
      .appendField(Blockly.Msg.WEBDUINO_EXEC_THEN, "then");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['exec_then_stms'] = {
  init: function () {
    this.appendStatementInput("then_")
      .appendField(Blockly.Msg.WEBDUINO_EXEC_THEN_STMS, "then");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['ultrasonic_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_NEW_TRIG, "UltraSonic,  Trig:")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "trig_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_NEW_ECHO, "  Echo:")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "echo_");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(230);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#s2p7t7
Blockly.Blocks['ultrasonic_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable("ultrasonic"), "var_");
    this.appendValueInput("time")
      .setCheck("Number")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_GET_DISTANCE, "get distance over every ");
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_GET_TIME, "ms ( 1/1000 sec )");
    this.appendStatementInput("do")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_GET_DO, "do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(65);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vv8fx4
Blockly.Blocks['ultrasonic_distance'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable("ultrasonic"), "var_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_DISTANCE, "'s distance");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(65);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#nrzdoq
Blockly.Blocks['button_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_NEW, "Button ,  pin:")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "pin_");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(230);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#hj3nxn
Blockly.Blocks['button_event'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_EVENT_WHEN, "當")
      .appendField(new Blockly.FieldVariable("button"), "var_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_EVENT_WAS, "進行")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_BUTTON_EVENT_PRESSED, "pressed"],
        [Blockly.Msg.WEBDUINO_BUTTON_EVENT_RELEASED, "released"],
        [Blockly.Msg.WEBDUINO_BUTTON_EVENT_LONGPRESS, "longPress"]
      ]), "event_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_EVENT_TO, "時");
    this.appendStatementInput("do_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_EVENT_DO, "執行：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(65);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ninxcs
Blockly.Blocks['pir_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_PIR,"PIR ,  pin:")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "pin_");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(230);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vzwp59
Blockly.Blocks['pir_status'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_PIR_WHEN,"當")
        .appendField(new Blockly.FieldVariable("pir"), "item_")
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.WEBDUINO_PIR_STATUS_DETECTED, "detected"], [Blockly.Msg.WEBDUINO_PIR_STATUS_ENDED, "ended"]]), "status_")
        .appendField(Blockly.Msg.WEBDUINO_PIR_DETECTED,"偵測到人體紅外線變化");
    this.appendStatementInput("var_")
        .appendField(Blockly.Msg.WEBDUINO_PIR_DO,"執行：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(65);
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['sound_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_SOUND,"Sound ,  pin:")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "pin_");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(230);
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['sound_status'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_SOUND_WHEN,"當")
        .appendField(new Blockly.FieldVariable("sound"), "item_")
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.WEBDUINO_SOUND_STATUS_DETECTED, "detected"], [Blockly.Msg.WEBDUINO_SOUND_STATUS_ENDED, "ended"]]), "status_")
        .appendField(Blockly.Msg.WEBDUINO_SOUND_DETECTED,"偵測到聲音變化");
    this.appendStatementInput("var_")
        .appendField(Blockly.Msg.WEBDUINO_SOUND_DO,"執行：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(65);
    this.setHelpUrl('http://www.example.com/');
  }
};