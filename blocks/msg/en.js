'use strict';

goog.provide('Blockly.Msg.Webduino.en');

goog.require('Blockly.Msg.Webduino');

Blockly.Msg.WEBDUINO_TIMER_AFTER = "After";
Blockly.Msg.WEBDUINO_TIMER_SECOND = "seconds";
Blockly.Msg.WEBDUINO_TIMER_DO = "do";
Blockly.Msg.WEBDUINO_DO = "do";
Blockly.Msg.WEBDUINO_EXEC_SEQ = "sequence";
Blockly.Msg.WEBDUINO_EXEC_THEN = "then";
Blockly.Msg.WEBDUINO_EXEC_THEN_STMS = "then";

Blockly.Msg.WEBDUINO_BOARD_READY_WEBDUINO = "Board";
Blockly.Msg.WEBDUINO_BOARD_READY_DEVICE = "device";

Blockly.Msg.WEBDUINO_LED = "LED";
Blockly.Msg.WEBDUINO_LED_PIN = "pin";
Blockly.Msg.WEBDUINO_LED_SET_STATE = "set state";
Blockly.Msg.WEBDUINO_LED_TOGGLE = "toggle";

Blockly.Msg.WEBDUINO_RGBLED = "RGB LED";
Blockly.Msg.WEBDUINO_RGBLED_RED = "Red";
Blockly.Msg.WEBDUINO_RGBLED_GREEN = "Green";
Blockly.Msg.WEBDUINO_RGBLED_BLUE = "Blue";
Blockly.Msg.WEBDUINO_RGBLED_SETCOLOR = "set color";

Blockly.Msg.WEBDUINO_ULTRASONIC_NEW_TRIG = "Ultrasonic, Trig:";
Blockly.Msg.WEBDUINO_ULTRASONIC_NEW_ECHO = "  Echo:";
Blockly.Msg.WEBDUINO_ULTRASONIC_GET_DISTANCE = "get distance over every";
Blockly.Msg.WEBDUINO_ULTRASONIC_GET_TIME = "ms ( 1/1000 sec )";
Blockly.Msg.WEBDUINO_ULTRASONIC_GET_DO = "do";
Blockly.Msg.WEBDUINO_ULTRASONIC_DISTANCE = "s distance ( cm )";

Blockly.Msg.WEBDUINO_BUTTON_NEW = "Button , pin:";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_WHEN = "When";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_WAS = "was";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_TO = "";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_DO = "do:";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_PRESSED = "Pressed";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_RELEASED = "Released";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_LONGPRESS = "Long Pressed";

Blockly.Msg.WEBDUINO_CAR = "Car";
Blockly.Msg.WEBDUINO_CAR_F = "Forward";
Blockly.Msg.WEBDUINO_CAR_B = "Backward";
Blockly.Msg.WEBDUINO_CAR_L = "Left";
Blockly.Msg.WEBDUINO_CAR_R = "Right";
Blockly.Msg.WEBDUINO_CAR_MOVE_FOR = "for";
Blockly.Msg.WEBDUINO_CAR_MOVE_SEC = "secs";

// LED

Blockly.Msg.WEBDUINO_LIGHT = "Light";
Blockly.Msg.WEBDUINO_LIGHT_CLICK = "Click light, do";
Blockly.Msg.WEBDUINO_LIGHT_STATUS = "Light status = ";

Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB = "Bulb";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT = "Left";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT = "Right";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_CLICK = "Bulb click, do";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_STATUS = "Bulb status = ";

Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_SET = "Set Blinking Clock:";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_TIME = "time:";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_MSEC = "ms ( 1/1000 sec )";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATUS1 = "status 1:";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATUS2 = "status 2:";

Blockly.Msg.WEBDUINO_STOP_CLOCK = "Stop Clock:";

// RGB

Blockly.Msg.WEBDUINO_RGB_LED_AREA_COLOR = "Set demo area color:";
Blockly.Msg.WEBDUINO_RGB_LED_BTN_CLICK = "Click";
Blockly.Msg.WEBDUINO_RGB_LED_BTN_BUTTON = "Button";
Blockly.Msg.WEBDUINO_RGB_LED_BTN_DO = "do:";

Blockly.Msg.WEBDUINO_RGB_LED_RANGE_CHANGE = "Range change";
Blockly.Msg.WEBDUINO_RGB_LED_RANGE_DO = "do:";
Blockly.Msg.WEBDUINO_RGB_LED_CURRENT_COLOR = "Current color";

Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CLOCK_NAME = "Set Color Clock:";
Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_TIME = "Time:";
Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_MSEC = Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_MSEC;
Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CHANGE = "Change:";

Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_STATUS = " Status:";

// UltraSonic

Blockly.Msg.WEBDUINO_ULTRASONIC_SET_SHOW_DISTANCE = "Show distance:";

Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_SIZE = "Image size:";
Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_URL = "Image url:";

Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_VOLUME = "Music Volume";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY = "Music:";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PLAY = "Paly";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PAUSE = "Pause";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_STOP = "Stop";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_ADD = "Add Music";

// Button

Blockly.Msg.WEBDUINO_SHOW_TEXT = "Show text: ";

Blockly.Msg.WEBDUINO_SHOW_CALCULATE_NUMBER = "Show Number = Current number";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_PLUS = "+";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_MINUS = "-";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_TIMES = "*";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_DIVIDED = "/";

Blockly.Msg.WEBDUINO_SHOW_SET_CURRENT_NUMBER = "Set Current number";

Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE = "Image move";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_MOVE = "";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_PX = "Pixel";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_RESET = "Reset image position";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_UP = "up";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_DOWN = "down";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_LEFT = "left";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_RIGHT = "right";
