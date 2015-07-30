'use strict';

goog.provide('Blockly.Blocks.webduino.tutorials');
goog.require('Blockly.Blocks');

Blockly.Blocks.colour.HUE = 120;

/*
ooooo        oooooooooooo oooooooooo.   
`888'        `888'     `8 `888'   `Y8b  
 888          888          888      888 
 888          888oooo8     888      888 
 888          888    "     888      888 
 888       o  888       o  888     d88' 
o888ooooood8 o888ooooood8 o888bood8P'   
*/

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

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4cypqk
Blockly.Blocks['two_led_start_blinking'] = {
  init: function() {
    this.appendValueInput("timer")
        .setCheck("String")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_SET, "Set clock name: ");
    this.appendValueInput("time")
        .setCheck("Number")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_TIME, ", time:");
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_MSEC, "ms ( 1/1000 sec )");
    this.appendStatementInput("status1")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATUS1, "status 1:");
    this.appendStatementInput("status2")
        .appendField(Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATUS2, "status 2:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#a5m29w
Blockly.Blocks['stop_clock'] = {
  init: function() {
    this.appendValueInput("timer")
        .setCheck("String")
        .appendField(Blockly.Msg.WEBDUINO_STOP_CLOCK, "停止計時器 :");
    this.appendDummyInput();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
ooooooooo.     .oooooo.    oooooooooo.  
`888   `Y88.  d8P'  `Y8b   `888'   `Y8b 
 888   .d88' 888            888     888 
 888ooo88P'  888            888oooo888' 
 888`88b.    888     ooooo  888    `88b 
 888  `88b.  `88.    .88'   888    .88P 
o888o  o888o  `Y8bood8P'   o888bood8P'  
*/

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#hjvosw
Blockly.Blocks['rgb_led_area_color'] = {
  init: function() {
    this.appendValueInput("color")
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_AREA_COLOR,"Demo area's color: ");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#7i3gk5
Blockly.Blocks['rgb_led_btn_click'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_BTN_CLICK,"Click")
        .appendField(new Blockly.FieldDropdown([["red", "redBtn"], ["green", "greenBtn"], ["blue", "blueBtn"], ["clear", "clearBtn"]]), "btn")
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_BTN_BUTTON,"button");
    this.appendStatementInput("do")
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_BTN_DO,"do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#mhys2h
Blockly.Blocks['rgb_led_range'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_RANGE_CHANGE,"Range change");
    this.appendStatementInput("do")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_RANGE_DO,"do:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#rexmw4
Blockly.Blocks['rgb_led_current_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_CURRENT_COLOR,"Current color");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#twfhrf
Blockly.Blocks['rgb_led_start_dancing'] = {
  init: function() {
    this.appendValueInput("timer")
        .setCheck("String")
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CLOCK_NAME, "Set clock name: ");
    this.appendValueInput("time")
        .setCheck("Number")
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_TIME, " ,  time: ");
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_MSEC, "ms ( 1/1000 sec )");
    this.appendStatementInput("status")
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CHANGE,"Change: ");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#hqdjex
Blockly.Blocks['rgb_led_dancing_status'] = {
  init: function() {
    this.appendStatementInput("status")
        .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_STATUS,"Status: ");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
ooooo     ooo ooooo        ooooooooooooo ooooooooo.         .o.       
`888'     `8' `888'        8'   888   `8 `888   `Y88.      .888.      
 888       8   888              888       888   .d88'     .8"888.     
 888       8   888              888       888ooo88P'     .8' `888.    
 888       8   888              888       888`88b.      .88ooo8888.   
 `88.    .8'   888       o      888       888  `88b.   .8'     `888.  
   `YbodP'    o888ooooood8     o888o     o888o  o888o o88o     o8888o 
*/

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ikjd3j
Blockly.Blocks['ultrasonic_set_number'] = {
  init: function() {
    this.appendValueInput("number")
        .setCheck("Number")
        .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_SET_SHOW_DISTANCE,"show distance:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ddafdo
Blockly.Blocks['ultrasonic_change_image_size'] = {
  init: function() {
    this.appendValueInput("size")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_SIZE,"圖片尺寸 ( 寬度 )：");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3m3noj
Blockly.Blocks['ultrasonic_change_image_url'] = {
  init: function() {
    this.appendValueInput("url")
        .setCheck("String")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_URL,"圖片網址");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#dmpbh7
Blockly.Blocks['ultrasonic_change_music_volume'] = {
  init: function() {
    this.appendValueInput("volume")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_VOLUME,"音量大小");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#npydoc
Blockly.Blocks['ultrasonic_change_music_play'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY,"音樂")
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PLAY, "play"], [Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PAUSE, "pause"], [Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_STOP, "stop"]]), "play");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#46pbzq
Blockly.Blocks['ultrasonic_change_add_music'] = {
  init: function() {
    this.appendValueInput("music")
        .setCheck("String")
        .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_ADD,"加入音樂");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
oooooooooo.  ooooo     ooo ooooooooooooo ooooooooooooo   .oooooo.   ooooo      ooo 
`888'   `Y8b `888'     `8' 8'   888   `8 8'   888   `8  d8P'  `Y8b  `888b.     `8' 
 888     888  888       8       888           888      888      888  8 `88b.    8  
 888oooo888'  888       8       888           888      888      888  8   `88b.  8  
 888    `88b  888       8       888           888      888      888  8     `88b.8  
 888    .88P  `88.    .8'       888           888      `88b    d88'  8       `888  
o888bood8P'     `YbodP'        o888o         o888o      `Y8bood8P'  o8o        `8  
*/

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#jvaga8
Blockly.Blocks['show_text'] = {
  init: function() {
    this.appendValueInput("show_")
        .setCheck("String")
        .appendField(Blockly.Msg.WEBDUINO_SHOW_TEXT,"顯示文字：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4qa6xn
Blockly.Blocks['show_calculate_numbers'] = {
  init: function() {
    this.appendValueInput("show_calculate_numbers")
        .setCheck("Number")
        .appendField(Blockly.Msg.WEBDUINO_SHOW_CALCULATE_NUMBER,"顯示數字 ＝ 當前數字")
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.WEBDUINO_SHOW_CALCULATE_PLUS, "plus"], [Blockly.Msg.WEBDUINO_SHOW_CALCULATE_MINUS, "minus"], [Blockly.Msg.WEBDUINO_SHOW_CALCULATE_TIMES, "times"], [Blockly.Msg.WEBDUINO_SHOW_CALCULATE_DIVIDED, "divided"]]), "calculate_");
    this.appendDummyInput();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xcsnik
Blockly.Blocks['show_set_numbers'] = {
  init: function() {
    this.appendValueInput("numbers_")
        .setCheck("Number")
        .appendField(Blockly.Msg.WEBDUINO_SHOW_SET_CURRENT_NUMBER,"設定當前數字為：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};