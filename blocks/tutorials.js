'use strict';

goog.provide('Blockly.Blocks.webduino.tutorials');
goog.require('Blockly.Blocks');

Blockly.Blocks.colour.HUE = 120;

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#fe62nb
Blockly.Blocks['light'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_LIGHT,"light")
        .appendField(new Blockly.FieldDropdown([["on", "on"], ["off", "off"]]), "status");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xrjxab
Blockly.Blocks['light_click'] = {
  init: function() {
    this.appendStatementInput("click")
        .appendField(Blockly.Msg.WEBDUINO_LIGHT_CLICK,"Light click, do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8gcyej
Blockly.Blocks['light_check'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_LIGHT_STATUS,"Light status =")
        .appendField(new Blockly.FieldDropdown([["on", "on"], ["off", "off"]]), "status");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xjvonm
Blockly.Blocks['two_led_light'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT, "light1"], [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT, "light2"]]), "NAME")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB,"Bulb")
        .appendField(new Blockly.FieldDropdown([["on", "on"], ["off", "off"]]), "status");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['two_led_light_click'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT, "light1"], [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT, "light2"]]), "NAME")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_CLICK,"Bulb Click, do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4qmotm
Blockly.Blocks['two_led_light_check'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT, "light1"], [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT, "light2"]]), "NAME")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_STATUS,"Bulb Status  = ")
        .appendField(new Blockly.FieldDropdown([["on", "on"], ["off", "off"]]), "check");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vn3qfq
Blockly.Blocks['two_led_start_blinking'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING,"Start blinking ,  time:");
    this.appendValueInput("time")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_TIME,"ms (1/1000 sec)");
    this.appendStatementInput("status1")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATE1,"status 1:");
    this.appendStatementInput("status2")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATE2,"status 2:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['two_led_stop_blinking'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_STOP_BLANKING,"Stop blinking");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};
