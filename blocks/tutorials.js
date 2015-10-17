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
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_LIGHT, "light")
      .appendField(new Blockly.FieldDropdown([
        ["on", "on"],
        ["off", "off"]
      ]), "status");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xrjxab
Blockly.Blocks['light_click'] = {
  init: function () {
    this.appendStatementInput("click")
      .appendField(Blockly.Msg.WEBDUINO_LIGHT_CLICK, "Light click, do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8gcyej
Blockly.Blocks['light_check'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_LIGHT_STATUS, "Light status =")
      .appendField(new Blockly.FieldDropdown([
        ["on", "on"],
        ["off", "off"]
      ]), "status");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xjvonm
Blockly.Blocks['two_led_light'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT, "light1"],
        [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT, "light2"]
      ]), "NAME")
      .appendField(Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB, "Bulb")
      .appendField(new Blockly.FieldDropdown([
        ["on", "on"],
        ["off", "off"]
      ]), "status");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['two_led_light_click'] = {
  init: function () {
    this.appendStatementInput("NAME")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT, "light1"],
        [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT, "light2"]
      ]), "NAME")
      .appendField(Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_CLICK, "Bulb Click, do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4qmotm
Blockly.Blocks['two_led_light_check'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT, "light1"],
        [Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT, "light2"]
      ]), "NAME")
      .appendField(Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_STATUS, "Bulb Status  = ")
      .appendField(new Blockly.FieldDropdown([
        ["on", "on"],
        ["off", "off"]
      ]), "check");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4cypqk
Blockly.Blocks['two_led_start_blinking'] = {
  init: function () {
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
  init: function () {
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
  init: function () {
    this.appendValueInput("color")
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_AREA_COLOR, "Demo area's color: ");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#7i3gk5
Blockly.Blocks['rgb_led_btn_click'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_BTN_CLICK, "Click")
      .appendField(new Blockly.FieldDropdown([
        ["red", "redBtn"],
        ["green", "greenBtn"],
        ["blue", "blueBtn"],
        ["clear", "clearBtn"]
      ]), "btn")
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_BTN_BUTTON, "button");
    this.appendStatementInput("do")
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_BTN_DO, "do");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#mhys2h
Blockly.Blocks['rgb_led_range'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_RANGE_CHANGE, "Range change");
    this.appendStatementInput("do")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_RANGE_DO, "do:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#rexmw4
Blockly.Blocks['rgb_led_current_color'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_CURRENT_COLOR, "Current color");
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#twfhrf
Blockly.Blocks['rgb_led_start_dancing'] = {
  init: function () {
    this.appendValueInput("timer")
      .setCheck("String")
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CLOCK_NAME, "Set clock name: ");
    this.appendValueInput("time")
      .setCheck("Number")
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_TIME, " ,  time: ");
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_MSEC, "ms ( 1/1000 sec )");
    this.appendStatementInput("status")
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CHANGE, "Change: ");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#hqdjex
Blockly.Blocks['rgb_led_dancing_status'] = {
  init: function () {
    this.appendStatementInput("status")
      .appendField(Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_STATUS, "Status: ");
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
  init: function () {
    this.appendValueInput("number")
      .setCheck("Number")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_SET_SHOW_DISTANCE, "show distance:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ddafdo
Blockly.Blocks['ultrasonic_change_image_size'] = {
  init: function () {
    this.appendValueInput("size")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_SIZE, "圖片尺寸 ( 寬度 )：");
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
  init: function () {
    this.appendValueInput("url")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_URL, "圖片網址");
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
  init: function () {
    this.appendValueInput("volume")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_VOLUME, "音量大小");
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
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY, "音樂")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PLAY, "play"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PAUSE, "pause"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_STOP, "stop"]
      ]), "play");
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
  init: function () {
    this.appendValueInput("music")
      .setCheck("String")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_ADD, "加入音樂");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wbe3vd
Blockly.Blocks['tutorial_youtube'] = {
  init: function () {
    this.appendValueInput("name_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE, "設定 Youtube：");
    this.appendDummyInput()
      .appendField("   ID：")
      .appendField(new Blockly.FieldTextInput("..."), "id_");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
oooooo   oooo                           .                .o8                 
 `888.   .8'                          .o8               "888                 
  `888. .8'    .ooooo.  oooo  oooo  .o888oo oooo  oooo   888oooo.   .ooooo.  
   `888.8'    d88' `88b `888  `888    888   `888  `888   d88' `88b d88' `88b 
    `888'     888   888  888   888    888    888   888   888   888 888ooo888 
     888      888   888  888   888    888 .  888   888   888   888 888    .o 
    o888o     `Y8bod8P'  `V88V"V8P'   "888"  `V88V"V8P'  `Y8bod8P' `Y8bod8P' 
*/

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#kqjbv8
Blockly.Blocks['tutorial_youtube_volume'] = {
  init: function () {
    this.appendValueInput("volume_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SET, "設定")
      .appendField(new Blockly.FieldVariable("youtube"), "name_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_VOLUME, "音量：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#tih6od
Blockly.Blocks['tutorial_youtube_speed'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SET, "設定")
      .appendField(new Blockly.FieldVariable("youtube"), "name_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SPEED, " 的播放速度：")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SLOW, "0.5"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_NORMAL, "1"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_FAST, "1.25"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_VERYFAST, "1.5"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SUPERFAST, "2"]
      ]), "speed_");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#tcfvai
Blockly.Blocks['tutorial_youtube_control'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SET, "設定")
      .appendField(new Blockly.FieldVariable("youtube"), "name_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_STATUS, " 的狀態為：")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SETPLAY, "1"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SETPAUSE, "2"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_SETSTOP, "0"]
      ]), "status_");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#metxhc
Blockly.Blocks['tutorial_youtube_status'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable("youtube"), "name_")
      .appendField(Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_STATUS, " 的狀態為：")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_STATUSPLAY, "1"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_STATUSPAUSE, "2"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_STATUSSTOP, "0"],
        [Blockly.Msg.WEBDUINO_ULTRASONIC_YOUTUBE_STATUSSTART, "-1"]
      ]), "status_");
    this.setOutput(true);
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
  init: function () {
    this.appendValueInput("show_")
      .setCheck("String")
      .appendField(Blockly.Msg.WEBDUINO_SHOW_TEXT, "顯示文字：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#4qa6xn
Blockly.Blocks['show_calculate_numbers'] = {
  init: function () {
    this.appendValueInput("show_calculate_numbers")
      .setCheck("Number")
      .appendField(Blockly.Msg.WEBDUINO_SHOW_CALCULATE_NUMBER, "顯示數字 ＝ 當前數字")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_SHOW_CALCULATE_PLUS, "plus"],
        [Blockly.Msg.WEBDUINO_SHOW_CALCULATE_MINUS, "minus"],
        [Blockly.Msg.WEBDUINO_SHOW_CALCULATE_TIMES, "times"],
        [Blockly.Msg.WEBDUINO_SHOW_CALCULATE_DIVIDED, "divided"]
      ]), "calculate_");
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
  init: function () {
    this.appendValueInput("numbers_")
      .setCheck("Number")
      .appendField(Blockly.Msg.WEBDUINO_SHOW_SET_CURRENT_NUMBER, "設定當前數字為：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#o46otn
Blockly.Blocks['button_change_image_position'] = {
  init: function () {
    this.appendValueInput("image_pos_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE, "圖片往")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_UP, "u"],
        [Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_DOWN, "d"],
        [Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_LEFT, "l"],
        [Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_RIGHT, "r"]
      ]), "pos_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_MOVE, "移動");
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_PX, "個像素");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ynuit9
Blockly.Blocks['button_reset_image_position'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_RESET, "重設圖片位置");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#dch7xc
Blockly.Blocks['button_game'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_ADD_SINGLEGAME, "載入 <單人> 遊戲模組");
    this.appendDummyInput();
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC, "電腦角色：")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_CAT, "run-cat.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_PICA, "run-pica.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LION, "run-lion.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_SQU, "run-squirrel.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_MAN2, "run-man2.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_MAN1, "run-man1.gif"]
      ]), "npc_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL, "  電腦強度：")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_5, "5"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_4, "4"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_3, "3"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_2, "2"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_1, "1"]
      ]), "level_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_DISTANCE, "  比賽距離：")
      .appendField(new Blockly.FieldDropdown([
        ["100", "100"],
        ["200", "200"],
        ["300", "300"],
        ["400", "400"],
        ["500", "500"]
      ]), "distance_");
    this.appendDummyInput();
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_USER, "玩家角色：")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_CAT, "run-cat.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_PICA, "run-pica.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LION, "run-lion.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_SQU, "run-squirrel.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_MAN2, "run-man2.gif"],
        [Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_MAN1, "run-man1.gif"]
      ]), "user_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_BUTTON, "  按鈕：")
      .appendField(new Blockly.FieldVariable("button"), "button_");
    this.appendStatementInput("event_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_EVENT, "玩家按鈕行為設定：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ggtrzs
Blockly.Blocks['button_game_user'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_RUN_FORWARD, "角色往前跑")
      .appendField(new Blockly.FieldDropdown([
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"]
      ]), "user_")
      .appendField(Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_RUN_PIXEL, "像素");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
oooooooooo.   ooooo   ooooo ooooooooooooo 
`888'   `Y8b  `888'   `888' 8'   888   `8 
 888      888  888     888       888      
 888      888  888ooooo888       888      
 888      888  888     888       888      
 888     d88'  888     888       888      
o888bood8P'   o888o   o888o     o888o     
*/

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#iek22q
Blockly.Blocks['tutorial_dht_show'] = {
  init: function () {
    this.appendValueInput("show")
      .appendField(Blockly.Msg.WEBDUINO_DHT_SHOW, "顯示")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_DHT_SHOW_T, "t"],
        [Blockly.Msg.WEBDUINO_DHT_SHOW_H, "h"]
      ]), "dht_")
      .appendField(Blockly.Msg.WEBDUINO_DHT_SHOW_IS, "為");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2vu2xz
Blockly.Blocks['tutorial_dht_areachart'] = {
  init: function () {
    this.appendValueInput("name_")
      .appendField(Blockly.Msg.WEBDUINO_DHT_ADD_AREACHART, "加入「區域折線圖」模組：");
    this.appendValueInput("color_t_")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_DHT_ADD_TCOLOR, "溫度顏色：");
    this.appendValueInput("color_h_")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_DHT_ADD_HCOLOR, "濕度顏色：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2vu2xz
Blockly.Blocks['tutorial_dht_gauge'] = {
  init: function () {
    this.appendValueInput("name_")
      .appendField(Blockly.Msg.WEBDUINO_DHT_ADD_GUAGE, "加入「指針」模組：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#6k6o8o
Blockly.Blocks['tutorial_dht_draw'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_DHT_USE, "使用")
      .appendField(new Blockly.FieldVariable("areachart"), "chart_")
      .appendField(Blockly.Msg.WEBDUINO_DHT_DRAW, "開始繪製");
    this.appendValueInput("t_")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_DHT_DRAW_T, "溫度：");
    this.appendValueInput("h_")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.WEBDUINO_DHT_DRAW_H, "濕度：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
 .oooooo..o oooooooooooo ooooooooo.   oooooo     oooo   .oooooo.   
d8P'    `Y8 `888'     `8 `888   `Y88.  `888.     .8'   d8P'  `Y8b  
Y88bo.       888          888   .d88'   `888.   .8'   888      888 
 `"Y8888o.   888oooo8     888ooo88P'     `888. .8'    888      888 
     `"Y88b  888    "     888`88b.        `888.8'     888      888 
oo     .d8P  888       o  888  `88b.       `888'      `88b    d88' 
8""88888P'  o888ooooood8 o888o  o888o       `8'        `Y8bood8P'  
*/

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vzgdvn
Blockly.Blocks['tutorial_servo_button'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_SERVO_CLICKBTN, "點選按鈕")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_SERVO_BTNLEFT90, "btnLeft90"],
        [Blockly.Msg.WEBDUINO_SERVO_BTNLEFT60, "btnLeft60"],
        [Blockly.Msg.WEBDUINO_SERVO_BTNLEFT30, "btnLeft30"],
        [Blockly.Msg.WEBDUINO_SERVO_BTNCENTER, "btnCenter"],
        [Blockly.Msg.WEBDUINO_SERVO_BTNRIGHT30, "btnRight30"],
        [Blockly.Msg.WEBDUINO_SERVO_BTNRIGHT60, "btnRight60"],
        [Blockly.Msg.WEBDUINO_SERVO_BTNRIGHT90, "btnRight90"]
      ]), "btn_");
    this.appendStatementInput("do_")
      .appendField(Blockly.Msg.WEBDUINO_SERVO_DO, "執行：");
    this.setTooltip('');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#58ie7n
Blockly.Blocks['tutorial_servo_button_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_SERVO_SET_ANGLE, "設定起始角度 ( 0-180 ) ")
      .appendField(new Blockly.FieldAngle("90"), "angle_");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3fu4cx
Blockly.Blocks['tutorial_servo_calculate'] = {
  init: function () {
    this.appendValueInput("angle_")
      .setCheck("Number")
      .appendField(Blockly.Msg.WEBDUINO_SERVO_CURRENT_ANGLE, "當前角度")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_SERVO_PLUS, "plus"],
        [Blockly.Msg.WEBDUINO_SERVO_MINUS, "minus"]
      ]), "calculate_");
    this.appendDummyInput();
    this.setOutput(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
oooooooooo.  ooooo     ooo  oooooooooooo  oooooooooooo oooooooooooo ooooooooo.   
`888'   `Y8b `888'     `8' d'""""""d888' d'""""""d888' `888'     `8 `888   `Y88. 
 888     888  888       8        .888P         .888P    888          888   .d88' 
 888oooo888'  888       8       d888'         d888'     888oooo8     888ooo88P'  
 888    `88b  888       8     .888P         .888P       888    "     888`88b.    
 888    .88P  `88.    .8'    d888'    .P   d888'    .P  888       o  888  `88b.  
o888bood8P'     `YbodP'    .8888888888P  .8888888888P  o888ooooood8 o888o  o888o 
*/

//https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#s6hvit
Blockly.Blocks['tutorial_buzzer_1'] = {
  init: function () {
    this.appendValueInput("var_")
      .appendField(Blockly.Msg.WEBDUINO_BUZZER_SHOW, "顯示");
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUZZER_SHOW_NOTESANDTEMPOS, "的音符和節奏");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#twivbo
Blockly.Blocks['tutorial_buzzer_3'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_BUZZER_CLICK, "點選")
      .appendField(new Blockly.FieldDropdown([
        ["music1", "m1"],
        ["music2", "m2"],
        ["music3", "m3"],
        ["stop", "stop"]
      ]), "btn_");
    this.appendStatementInput("do_")
      .appendField(Blockly.Msg.WEBDUINO_BUZZER_DO, "執行：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
ooooooooo.   ooooo   ooooo   .oooooo.   ooooooooooooo   .oooooo.     .oooooo.   oooooooooooo ooooo        ooooo        
`888   `Y88. `888'   `888'  d8P'  `Y8b  8'   888   `8  d8P'  `Y8b   d8P'  `Y8b  `888'     `8 `888'        `888'        
 888   .d88'  888     888  888      888      888      888      888 888           888          888          888         
 888ooo88P'   888ooooo888  888      888      888      888      888 888           888oooo8     888          888         
 888          888     888  888      888      888      888      888 888           888    "     888          888         
 888          888     888  `88b    d88'      888      `88b    d88' `88b    ooo   888       o  888       o  888       o 
o888o        o888o   o888o  `Y8bood8P'      o888o      `Y8bood8P'   `Y8bood8P'  o888ooooood8 o888ooooood8 o888ooooood8 
*/

Blockly.Blocks['photocell_show_number'] = {
  init: function () {
    this.appendValueInput("number_")
      .setCheck("Number")
      .appendField(Blockly.Msg.WEBDUINO_PHOTOCELL_SHOW, "show distance:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
ooo        ooooo       .o.       ooooooo  ooooo  ooooooooo   .oooo.     .o   .ooooo.   
`88.       .888'      .888.       `8888    d8'  d"""""""8' .dP""Y88b  o888  888' `Y88. 
 888b     d'888      .8"888.        Y888..8P          .8'        ]8P'  888  888    888 
 8 Y88. .P  888     .8' `888.        `8888'          .8'       .d8P'   888   `Vbood888 
 8  `888'   888    .88ooo8888.      .8PY888.        .8'      .dP'      888        888' 
 8    Y     888   .8'     `888.    d8'  `888b      .8'     .oP     .o  888      .88P'  
o8o        o888o o88o     o8888o o888o  o88888o   .8'      8888888888 o888o   .oP'     
*/

Blockly.Blocks['tutorial_max7219_button'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_MAX7219_CLICKBTN, "點選按鈕")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_MAX7219_BTN1, "btn1"],
        [Blockly.Msg.WEBDUINO_MAX7219_BTN2, "btn2"],
        [Blockly.Msg.WEBDUINO_MAX7219_BTN3, "btn3"],
        [Blockly.Msg.WEBDUINO_MAX7219_BTNSTOP, "btnStop"],
        [Blockly.Msg.WEBDUINO_MAX7219_BTNOFF, "btnOff"]
      ]), "btn_");
    this.appendStatementInput("do_")
      .appendField(Blockly.Msg.WEBDUINO_MAX7219_DO, "執行：");
    this.setTooltip('');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
                .o8              oooo    .oooo.         .o     oooooooo 
               "888              `888  .dP""Y88b      .d88    dP""""""" 
 .oooo.    .oooo888  oooo    ooo  888        ]8P'   .d'888   d88888b.   
`P  )88b  d88' `888   `88b..8P'   888      <88b.  .d'  888       `Y88b  
 .oP"888  888   888     Y888'     888       `88b. 88ooo888oo       ]88  
d8(  888  888   888   .o8"'88b    888  o.   .88P       888   o.   .88P  
`Y888""8o `Y8bod88P" o88'   888o o888o `8bd88P'       o888o  `8bd88P'   
*/

Blockly.Blocks['tutorial_adxl345_show'] = {
  init: function () {
    this.appendValueInput("show_")
      .appendField(Blockly.Msg.WEBDUINO_ADXL_SHOW, "顯示")
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_ADXL_SHOW_X, "x"],
        [Blockly.Msg.WEBDUINO_ADXL_SHOW_Y, "y"],
        [Blockly.Msg.WEBDUINO_ADXL_SHOW_Z, "z"],
        [Blockly.Msg.WEBDUINO_ADXL_SHOW_R, "r"],
        [Blockly.Msg.WEBDUINO_ADXL_SHOW_P, "p"]
      ]), "value_")
      .appendField(Blockly.Msg.WEBDUINO_ADXL_SHOW_IS, "為");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#iy27yf
Blockly.Blocks['adxl345_image_angle'] = {
  init: function () {
    this.appendValueInput("angle_")
      .appendField(Blockly.Msg.WEBDUINO_ADXL_ANGLE, "圖片旋轉的角度 =");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

/*
 o8o                                                    
 `"'                                                    
oooo  oooo d8b oooo d8b  .ooooo.   .ooooo.  oooo    ooo 
`888  `888""8P `888""8P d88' `88b d88' `"Y8  `88.  .8'  
 888   888      888     888ooo888 888         `88..8'   
 888   888      888     888    .o 888   .o8    `888'    
o888o d888b    d888b    `Y8bod8P' `Y8bod8P'     `8'     
*/

Blockly.Blocks['tutorial_irrecv_code'] = {
  init: function () {
    this.appendValueInput("code_")
      .appendField(Blockly.Msg.WEBDUINO_IRRRECV_SHOW, "show code:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['tutorial_irrecv_color'] = {
  init: function () {
    this.appendValueInput("code_")
      .appendField(Blockly.Msg.WEBDUINO_IRRRECV_COLOR, "區域顏色：");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setColour(Blockly.Blocks.colour.HUE);
    this.setHelpUrl('http://www.example.com/');
  }
};
