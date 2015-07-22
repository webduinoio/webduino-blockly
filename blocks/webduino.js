'use strict';

goog.provide('Blockly.Blocks.webduino');
goog.require('Blockly.Blocks');

Blockly.Blocks['board_setup'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Board")
      .appendField("Setup")
      .appendField(new Blockly.FieldTextInput("[device_id]"), "device_");
    this.appendStatementInput("setup_");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['led_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Led")
      .appendField("pin")
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
      .appendField("set state")
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
      .appendField("toggle");
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
      .appendField("RGBLed")
      .appendField("red")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "red_")
      .appendField("green")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "green_")
      .appendField("blue")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
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
      .appendField("set color");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['car_init_control'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("set car controller")
      .appendField("F")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "F_pin_")
      .appendField("B")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "B_pin_")
      .appendField("L")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "L_pin_")
      .appendField("R")
      .appendField(new Blockly.FieldDropdown([
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]), "R_pin_");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['car_move'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ["↑", "F"],
        ["↓", "B"],
        ["↺", "L"],
        ["↻", "R"],
        ["STOP", "STOP"]
      ]), "move_")
      .appendField("for")
      .appendField(new Blockly.FieldTextInput("1"), "secs_")
      .appendField("secs");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['car_move_then'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ["↑", "F"],
        ["↓", "B"],
        ["↺", "L"],
        ["↻", "R"],
        ["STOP", "STOP"]
      ]), "move_")
      .appendField("for")
      .appendField(new Blockly.FieldTextInput("1"), "secs_")
      .appendField("secs");
    this.setOutput(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['timer'] = {
  init: function () {
    this.appendValueInput("secs_")
      .appendField("After");
    this.appendDummyInput()
      .appendField("second(s),");
    this.appendStatementInput("do_")
      .appendField("do");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['exec_then'] = {
  init: function () {
    this.appendValueInput("then_")
      .appendField("then");
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
      .appendField("then");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
