'use strict';

goog.provide('Blockly.Msg.Webduino.zh.hant');

goog.require('Blockly.Msg.Webduino');

Blockly.Msg.CUSTOM_JS_CONSOLE = "控制台顯示";

Blockly.Msg.WEBDUINO_TIMER_AFTER = "在";
Blockly.Msg.WEBDUINO_TIMER_SECOND = "秒之後";
Blockly.Msg.WEBDUINO_TIMER_DO = "執行";

Blockly.Msg.WEBDUINO_DELAY = "延遲";
Blockly.Msg.WEBDUINO_DELAY_SECONDS = "秒";

Blockly.Msg.WEBDUINO_BOARD_READY_WEBDUINO = "開發版";
Blockly.Msg.WEBDUINO_BOARD_READY_DEVICE = "device";

Blockly.Msg.WEBDUINO_LED = "LED 燈";
Blockly.Msg.WEBDUINO_LED_PIN = "，腳位：";
Blockly.Msg.WEBDUINO_LED_SET_STATE = "設定狀態";
Blockly.Msg.WEBDUINO_LED_TOGGLE = "切換狀態";

Blockly.Msg.WEBDUINO_RELAY = "繼電器，腳位：";
Blockly.Msg.WEBDUINO_RELAY_SET_STATE = "設定狀態";

Blockly.Msg.WEBDUINO_RGBLED = "三色 LED";
Blockly.Msg.WEBDUINO_RGBLED_RED = "紅";
Blockly.Msg.WEBDUINO_RGBLED_GREEN = "綠";
Blockly.Msg.WEBDUINO_RGBLED_BLUE = "藍";
Blockly.Msg.WEBDUINO_RGBLED_SETCOLOR = "設定顏色";

Blockly.Msg.WEBDUINO_BUZZER = "蜂鳴器，腳位：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC1 = "建立音樂，音樂名稱：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC1_EDIT = "音符與節奏：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC1_TONE = "音調：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC1_PITCH = "   音高：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC1_TEMPOS = "   節奏 ( 幾分之1秒 )：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC1_NO = "無聲";
Blockly.Msg.WEBDUINO_BUZZER_USE = "使用";
Blockly.Msg.WEBDUINO_BUZZER_PLAY = "播放：";
Blockly.Msg.WEBDUINO_BUZZER_STOP = "停止播放";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC2 = "快速建立音樂，音樂名稱：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC2_NOTES = "音符：";
Blockly.Msg.WEBDUINO_BUZZER_MUSIC2_TEMPOS = "節奏：";
Blockly.Msg.WEBDUINO_BUZZER_CHOOSE_MUSIC = "選擇資料庫音樂：";
Blockly.Msg.WEBDUINO_BUZZER_CHOOSE_MUSIC1 = "超級瑪莉";
Blockly.Msg.WEBDUINO_BUZZER_CHOOSE_MUSIC2 = "真善美";
Blockly.Msg.WEBDUINO_BUZZER_CHOOSE_MUSIC3 = "哥哥爸爸真偉大";
Blockly.Msg.WEBDUINO_BUZZER_CHOOSE_MUSIC4 = "超級瑪莉和弦";

Blockly.Msg.WEBDUINO_ULTRASONIC_NEW_TRIG = "超音波傳感器，Trig：";
Blockly.Msg.WEBDUINO_ULTRASONIC_NEW_ECHO = "  Echo：";
Blockly.Msg.WEBDUINO_ULTRASONIC_GET_DISTANCE = "擷取距離，每";
Blockly.Msg.WEBDUINO_ULTRASONIC_GET_TIME = "豪秒 ( 1/1000 秒 ) 擷取一次";
Blockly.Msg.WEBDUINO_ULTRASONIC_GET_DO = "執行：";
Blockly.Msg.WEBDUINO_ULTRASONIC_DISTANCE = "所截取的距離 ( 公分 )";

Blockly.Msg.WEBDUINO_DHT_NEW = "溫濕度傳感器，腳位：";
Blockly.Msg.WEBDUINO_DHT_GET = "偵測溫濕度，每";
Blockly.Msg.WEBDUINO_DHT_GET_TIME = "豪秒 ( 1/1000 秒 ) 擷取一次";
Blockly.Msg.WEBDUINO_DHT_GET_DO = "執行：";
Blockly.Msg.WEBDUINO_DHT_GET_NOW = "所測得目前的";
Blockly.Msg.WEBDUINO_DHT_GET_T = "溫度 (攝氏)";
Blockly.Msg.WEBDUINO_DHT_GET_H = "濕度 (%)";

Blockly.Msg.WEBDUINO_BUTTON_NEW = "按鈕開關，腳位：";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_WHEN = "當";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_WAS = "進行";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_TO = "時";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_DO = "執行：";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_PRESSED = "按下";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_RELEASED = "放開";
Blockly.Msg.WEBDUINO_BUTTON_EVENT_LONGPRESS = "長按";

Blockly.Msg.WEBDUINO_SHOCK_NEW = "震動開關，腳位：";
Blockly.Msg.WEBDUINO_SHOCK_EVENT_WHEN = "當";
Blockly.Msg.WEBDUINO_SHOCK_EVENT_WAS = "狀態為";
Blockly.Msg.WEBDUINO_SHOCK_EVENT_TO = "時";
Blockly.Msg.WEBDUINO_SHOCK_EVENT_DO = "執行：";
Blockly.Msg.WEBDUINO_SHOCK_EVENT_HIGH = "通電";
Blockly.Msg.WEBDUINO_SHOCK_EVENT_LOW = "斷電";

Blockly.Msg.WEBDUINO_PIR = "人體紅外線偵測傳感器，腳位：";
Blockly.Msg.WEBDUINO_PIR_WHEN = "當";
Blockly.Msg.WEBDUINO_PIR_STATUS_DETECTED = "有";
Blockly.Msg.WEBDUINO_PIR_STATUS_ENDED = "沒有";
Blockly.Msg.WEBDUINO_PIR_DETECTED = "偵測到人體紅外線變化";
Blockly.Msg.WEBDUINO_PIR_DO = "執行：";

Blockly.Msg.WEBDUINO_SOUND = "聲音偵測傳感器，腳位：";
Blockly.Msg.WEBDUINO_SOUND_WHEN = "當";
Blockly.Msg.WEBDUINO_SOUND_STATUS_DETECTED = "有";
Blockly.Msg.WEBDUINO_SOUND_STATUS_ENDED = "沒有";
Blockly.Msg.WEBDUINO_SOUND_DETECTED = "偵測到聲音變化";
Blockly.Msg.WEBDUINO_SOUND_DO = "執行：";

Blockly.Msg.WEBDUINO_SERVO = "伺服馬達，腳位：";
Blockly.Msg.WEBDUINO_SERVO_TEXT = "伺服馬達";
Blockly.Msg.WEBDUINO_SERVO_ANGLE = "   旋轉角度 ( 0-180 ) ";

Blockly.Msg.WEBDUINO_CAR = "遙控車";
Blockly.Msg.WEBDUINO_CAR_F = "前進";
Blockly.Msg.WEBDUINO_CAR_B = "後退";
Blockly.Msg.WEBDUINO_CAR_L = "左轉";
Blockly.Msg.WEBDUINO_CAR_R = "右轉";
Blockly.Msg.WEBDUINO_CAR_MOVE_FOR = "持續";
Blockly.Msg.WEBDUINO_CAR_MOVE_SEC = "秒";

// LED

Blockly.Msg.WEBDUINO_LIGHT = "燈泡";
Blockly.Msg.WEBDUINO_LIGHT_CLICK = "點擊燈泡時執行";
Blockly.Msg.WEBDUINO_LIGHT_STATUS = "燈泡狀態為：";

Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB = "燈泡";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_LEFT = "左邊的";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_RIGHT = "右邊的";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_CLICK = "燈泡點擊時，執行：";
Blockly.Msg.WEBDUINO_TWO_LED_LIGHT_BULB_STATUS = "燈泡狀態為";

Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_SET = "設置閃爍計時器名稱：";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_TIME = "閃爍時間";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_MSEC = "毫秒 ( 1/1000 秒 )";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATUS1 = "狀態 1：";
Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_STATUS2 = "狀態 2：";

Blockly.Msg.WEBDUINO_STOP_CLOCK = "停止計時器";

// RGB

Blockly.Msg.WEBDUINO_RGB_LED_AREA_COLOR = "設定展示區域顏色：";
Blockly.Msg.WEBDUINO_RGB_LED_BTN_CLICK = "點選";
Blockly.Msg.WEBDUINO_RGB_LED_BTN_BUTTON = "按鈕";
Blockly.Msg.WEBDUINO_RGB_LED_BTN_DO = "執行：";

Blockly.Msg.WEBDUINO_RGB_LED_RANGE_CHANGE = "調整拉霸";
Blockly.Msg.WEBDUINO_RGB_LED_RANGE_DO = "執行：";
Blockly.Msg.WEBDUINO_RGB_LED_CURRENT_COLOR = "拉霸調整的顏色";

Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CLOCK_NAME = "色彩計時器名稱：";
Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_TIME = "變換時間：";
Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_MSEC = Blockly.Msg.WEBDUINO_TWO_LED_START_BLANKING_MSEC;
Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_CHANGE = "依序變換";

Blockly.Msg.WEBDUINO_RGB_LED_START_DANCING_STATUS = " 狀態：";

// UltraSonic

Blockly.Msg.WEBDUINO_ULTRASONIC_SET_SHOW_DISTANCE = "顯示距離：";

Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_SIZE = "圖片尺寸 ( 寬度 )：";
Blockly.Msg.WEBDUINO_ULTRASONIC_IMAGE_URL = "圖片網址：";

Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_VOLUME = "音量大小";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY = "音樂";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PLAY = "播放";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_PAUSE = "暫停";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_PLAY_STOP = "停止";
Blockly.Msg.WEBDUINO_ULTRASONIC_MUSIC_ADD = "放入音樂";

// Button

Blockly.Msg.WEBDUINO_SHOW_TEXT = "顯示文字：";

Blockly.Msg.WEBDUINO_SHOW_CALCULATE_NUMBER = "顯示數字 = 當前數字";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_PLUS = "加";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_MINUS = "減";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_TIMES = "乘";
Blockly.Msg.WEBDUINO_SHOW_CALCULATE_DIVIDED = "除";

Blockly.Msg.WEBDUINO_SHOW_SET_CURRENT_NUMBER = "設定當前數字";

Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE = "圖片往";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_MOVE = "移動";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_PX = "個像素";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_RESET = "重設圖片位置";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_UP = "上";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_DOWN = "下";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_LEFT = "左";
Blockly.Msg.WEBDUINO_BUTTON_CHANGE_IMAGE_RIGHT = "右";

Blockly.Msg.WEBDUINO_BUTTON_GAME_ADD_SINGLEGAME = "載入 <單人> 遊戲模組";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC = "電腦角色：";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL = "  電腦強度：";
Blockly.Msg.WEBDUINO_BUTTON_GAME_DISTANCE = "  比賽距離：";
Blockly.Msg.WEBDUINO_BUTTON_GAME_USER = "玩家角色：";
Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_BUTTON = "  按鈕：";
Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_EVENT = "玩家按鈕行為設定：";
Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_RUN_FORWARD = "角色往前跑";
Blockly.Msg.WEBDUINO_BUTTON_GAME_USER_RUN_PIXEL = "像素";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_CAT = "阿貓";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LION = "老獅";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_SQU = "松鼠";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_PICA = "馬力歐";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_MAN1 = "小明";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_MAN2 = "隆";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_5 = "超威";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_4 = "小威";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_3 = "普通";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_2 = "小弱";
Blockly.Msg.WEBDUINO_BUTTON_GAME_NPC_LEVEL_1 = "超弱";

Blockly.Msg.WEBDUINO_DHT_SHOW = "顯示";
Blockly.Msg.WEBDUINO_DHT_SHOW_IS = "為";
Blockly.Msg.WEBDUINO_DHT_SHOW_T = "溫度 (攝氏)";
Blockly.Msg.WEBDUINO_DHT_SHOW_H = "濕度 (%)";
Blockly.Msg.WEBDUINO_DHT_ADD_AREACHART = "加入「區域折線圖」模組：";
Blockly.Msg.WEBDUINO_DHT_ADD_TCOLOR = "溫度顏色：";
Blockly.Msg.WEBDUINO_DHT_ADD_HCOLOR = "濕度顏色：";
Blockly.Msg.WEBDUINO_DHT_ADD_GUAGE = "加入「指針」模組：";
Blockly.Msg.WEBDUINO_DHT_USE = "使用";
Blockly.Msg.WEBDUINO_DHT_DRAW = "開始繪製";
Blockly.Msg.WEBDUINO_DHT_DRAW_T = "溫度：";
Blockly.Msg.WEBDUINO_DHT_DRAW_H = "濕度：";
