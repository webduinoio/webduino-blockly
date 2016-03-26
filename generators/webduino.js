'use strict';

goog.provide('Blockly.JavaScript.webduino');
goog.require('Blockly.JavaScript');

/* 
      .o8                                        
     "888                                        
 .oooo888   .ooooo.  ooo. .oo.  .oo.    .ooooo.  
d88' `888  d88' `88b `888P"Y88bP"Y88b  d88' `88b 
888   888  888ooo888  888   888   888  888   888 
888   888  888    .o  888   888   888  888   888 
`Y8bod88P" `Y8bod8P' o888o o888o o888o `Y8bod8P' 
*/

Blockly.JavaScript['demo_show_text'] = function (block) {
  var value_show_ = Blockly.JavaScript.valueToCode(block, 'show_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("demo-area-01-show").innerHTML = ' + value_show_ + ';\n';
  return code;
};


Blockly.JavaScript['demo_text_size'] = function (block) {
  var value_size_ = Blockly.JavaScript.valueToCode(block, 'size_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("demo-area-01-show").style.fontSize = ' + value_size_ + '+"px";\n';
  return code;
};


Blockly.JavaScript['demo_text_lineheight'] = function (block) {
  var value_lineheight_ = Blockly.JavaScript.valueToCode(block, 'lineheight_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("demo-area-01-show").style.lineHeight = ' + value_lineheight_ + '+"px";\n';
  return code;
};


Blockly.JavaScript['demo_text_color'] = function (block) {
  var value_color_ = Blockly.JavaScript.valueToCode(block, 'color_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("demo-area-01-show").style.color = ' + value_color_ + ';\n';
  return code;
};


Blockly.JavaScript['demo_image_url'] = function (block) {
  var value_url_ = Blockly.JavaScript.valueToCode(block, 'url_', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_url_ == '\'\'' || !value_url_) {
    value_url_ = '"http://blockly.webduino.io/media/off.png"';
  }
  var code = 'document.getElementById("demo-area-03-image").setAttribute("src",' + value_url_ + ');\n';
  return code;
};


Blockly.JavaScript['demo_light_click'] = function (block) {
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'document.getElementById("demo-area-02-light").addEventListener("click",function(){\n' +
    statements_do_ +
    '});\n';
  return code;
};


Blockly.JavaScript['demo_light_state'] = function (block) {
  var dropdown_state_ = block.getFieldValue('state_');
  var code = 'document.getElementById("demo-area-02-light").className = "' + dropdown_state_ + '";\n';
  return code;
};


Blockly.JavaScript['demo_light_ifelse'] = function (block) {
  var dropdown_state_ = block.getFieldValue('state_');
  var code = 'document.getElementById("demo-area-02-light").className == "' + dropdown_state_ + '"';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['demo_light_toggle'] = function (block) {
  var code = 'if (document.getElementById("demo-area-02-light").className == "on") {\n' +
    '   document.getElementById("demo-area-02-light").className = "off";\n' +
    '} else {\n' +
    '  document.getElementById("demo-area-02-light").className = "on";\n' +
    '}\n';
  return code;
};


Blockly.JavaScript['demo_image_size'] = function (block) {
  var value_w_ = Blockly.JavaScript.valueToCode(block, 'w_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_h_ = Blockly.JavaScript.valueToCode(block, 'h_', Blockly.JavaScript.ORDER_ATOMIC);
  var imageWidth = Blockly.JavaScript.variableDB_.getDistinctName(
    'imageWidth', Blockly.Variables.NAME_TYPE);
  var imageHeight = Blockly.JavaScript.variableDB_.getDistinctName(
    'imageHeight', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + imageWidth + ' = ' + value_w_ + ';\n' +
    'var ' + imageHeight + ' = ' + value_h_ + ';\n' +
    'document.getElementById("demo-area-03-image").style.width = ' + imageWidth + '+"px";\n' +
    'document.getElementById("demo-area-03-image").style.height = ' + imageHeight + '+"px";\n';
  return code;
};


Blockly.JavaScript['demo_image_rotate'] = function (block) {
  var value_deg_ = Blockly.JavaScript.valueToCode(block, 'deg_', Blockly.JavaScript.ORDER_ATOMIC);
  var deg = Blockly.JavaScript.variableDB_.getDistinctName(
    'deg', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + deg + ' = ' + value_deg_ + ';\n' +
    'document.getElementById("demo-area-03-image").style.transform = "rotate("+' + deg + '+"deg)";\n';
  return code;
};


Blockly.JavaScript['demo_image_opacity'] = function (block) {
  var value_opacity_ = Blockly.JavaScript.valueToCode(block, 'opacity_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("demo-area-03-image").style.opacity = ' + value_opacity_ + ';\n';
  return code;
};


Blockly.JavaScript['demo_image_position'] = function (block) {
  var dropdown_direction_ = block.getFieldValue('direction_');
  var value_position_ = Blockly.JavaScript.valueToCode(block, 'position_', Blockly.JavaScript.ORDER_ATOMIC);
  var code;
  if (dropdown_direction_ == 'x') {
    code = 'document.getElementById("demo-area-03-image").style.left = ' + value_position_ + '+"px";\n';
  } else {
    code = 'document.getElementById("demo-area-03-image").style.top = ' + value_position_ + '+"px";\n';
  }
  return code;
};


Blockly.JavaScript['demo_button_click'] = function (block) {
  var dropdown_name_ = block.getFieldValue('name_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'document.getElementById("demo-area-05-btn' + dropdown_name_ + '").addEventListener("click",function(){\n' +
    statements_do_ +
    '});\n';
  return code;
};


Blockly.JavaScript['demo_area_input'] = function (block) {
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'document.getElementById("demo-area-04-color").oninput = function(_color){\n' +
    '_color = this.value;\n' +
    statements_do_ +
    '};\n';
  return code;
};


Blockly.JavaScript['demo_area_input_color'] = function (block) {
  var code = '_color';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['demo_area_color'] = function (block) {
  var value_color_ = Blockly.JavaScript.valueToCode(block, 'color_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("demo-area-04-area").style.background = ' + value_color_ + ';\n';
  return code;
};


Blockly.JavaScript['demo_range_set'] = function (block) {
  var value_min_ = Blockly.JavaScript.valueToCode(block, 'min_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_max_ = Blockly.JavaScript.valueToCode(block, 'max_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_step_ = Blockly.JavaScript.valueToCode(block, 'step_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value_ = Blockly.JavaScript.valueToCode(block, 'value_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'document.getElementById("demo-area-06-input").setAttribute("min",' + value_min_ + ');\n' +
    'document.getElementById("demo-area-06-input").setAttribute("max",' + value_max_ + ');\n' +
    'document.getElementById("demo-area-06-input").setAttribute("step",' + value_step_ + ');\n' +
    'document.getElementById("demo-area-06-input").setAttribute("value",' + value_value_ + ');\n' +
    'document.getElementById("demo-area-06-input").oninput = function(_value){\n' +
    '  _value = this.value;\n' +
    statements_do_ +
    '};\n';
  return code;
};


Blockly.JavaScript['demo_range_show'] = function (block) {
  var value_show_ = Blockly.JavaScript.valueToCode(block, 'show_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("demo-area-06-input-value").innerHTML = ' + value_show_ + ';\n';
  return code;
};


Blockly.JavaScript['demo_range_input'] = function (block) {
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'document.getElementById("demo-area-06-input").oninput = function(_value){\n' +
    '_value = this.value;\n' +
    statements_do_ +
    '};\n';
  return code;
};


Blockly.JavaScript['demo_range_input_value'] = function (block) {
  var code = '_value';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['demo_youtube'] = function (block) {
  var value_name_ = Blockly.JavaScript.valueToCode(block, 'name_', Blockly.JavaScript.ORDER_ATOMIC);
  var text_id_ = block.getFieldValue('id_');
  var code = 'function onYouTubeIframeAPIReady() {\n' +
    '  ' + value_name_ + ' = new YT.Player("player", {\n' +
    '    height: "240",\n' +
    '    width: "96%",\n' +
    '    videoId: "' + text_id_ + '",\n' +
    '    playerVars: {\n' +
    '      "autoplay": 1,\n' +
    '      "controls": 1},\n' +
    '    events: {\n' +
    '      "onReady": onPlayerReady,\n' +
    '    },\n' +
    '    playerReady: false\n' +
    '  });\n' +
    '  function onPlayerReady(event) {\n' +
    '    event.target.playVideo();\n' +
    '    ' + value_name_ + '.playerReady=true;\n' +
    '  }\n' +
    '}\n\n' +
    'onYouTubeIframeAPIReady();\n\n';
  return code;
};


Blockly.JavaScript['demo_youtube_volume'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_volume_ = Blockly.JavaScript.valueToCode(block, 'volume_', Blockly.JavaScript.ORDER_ATOMIC);
  var varA = Blockly.JavaScript.variableDB_.getDistinctName(
    'varA', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + varA + ' = ' + value_volume_ + ';\n' +
    '  if(' + varA + '>=100){\n' +
    '    ' + varA + '=100;\n' +
    '  }\n' +
    '  if(' + variable_name_ + '.playerReady){\n' +
    '    ' + variable_name_ + '.setVolume(' + varA + ');\n' +
    '  }\n';
  return code;
};


Blockly.JavaScript['demo_youtube_speed'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_speed_ = block.getFieldValue('speed_');
  var code = '  if(' + variable_name_ + '.playerReady){\n' +
    '    ' + variable_name_ + '.setPlaybackRate(' + dropdown_speed_ + ');\n' +
    '  }\n';
  return code;
};


Blockly.JavaScript['demo_youtube_control'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_status_ = block.getFieldValue('status_');
  var code;
  if (dropdown_status_ == '1') {
    code = '  if(' + variable_name_ + '.playerReady){\n' +
      '    ' + variable_name_ + '.playVideo();\n' +
      '  }\n';
  } else if (dropdown_status_ == '2') {
    code = '  if(' + variable_name_ + '.playerReady){\n' +
      '    ' + variable_name_ + '.pauseVideo();\n' +
      '  }\n';
  } else if (dropdown_status_ == '0') {
    code = '  if(' + variable_name_ + '.playerReady){\n' +
      '    ' + variable_name_ + '.seekTo(0);\n' +
      '    ' + variable_name_ + '.stopVideo();\n' +
      '  }\n';
  }
  return code;
};


Blockly.JavaScript['demo_youtube_status'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_status_ = block.getFieldValue('status_');
  var code = variable_name_ + '.getPlayerState()==' + dropdown_status_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['demo_youtube_id'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_id_ = Blockly.JavaScript.valueToCode(block, 'id_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_name_ + '.loadVideoById(' + value_id_ + ');\n';
  return code;
};

/*
                                .   oooo        
                              .o8   `888        
ooo. .oo.  .oo.    .oooo.   .o888oo  888 .oo.   
`888P"Y88bP"Y88b  `P  )88b    888    888P"Y88b  
 888   888   888   .oP"888    888    888   888  
 888   888   888  d8(  888    888 .  888   888  
o888o o888o o888o `Y888""8o   "888" o888o o888o 
*/

Blockly.JavaScript['math_round_digit'] = function (block) {
  var dropdown_type_ = block.getFieldValue('type_');
  var dropdown_digit_ = block.getFieldValue('digit_');
  var value_round_ = Blockly.JavaScript.valueToCode(block, 'round_', Blockly.JavaScript.ORDER_ATOMIC);
  var code;
  if (dropdown_digit_ == 0) {
    code = 'Math.' + dropdown_type_ + '(' + value_round_ + ')';
  } else {
    var a = Math.pow(10, dropdown_digit_);
    code = '(Math.' + dropdown_type_ + '((' + value_round_ + ')*' + a + '))/' + a;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['math_value_conversion'] = function (block) {
  var value_source_ = Blockly.JavaScript.valueToCode(block, 'source_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_omin_ = Blockly.JavaScript.valueToCode(block, 'omin_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_omax_ = Blockly.JavaScript.valueToCode(block, 'omax_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_cmin_ = Blockly.JavaScript.valueToCode(block, 'cmin_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_cmax_ = Blockly.JavaScript.valueToCode(block, 'cmax_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '((' + value_source_ + ' - (' + value_omin_ + ')) * (1/((' + value_omax_ + ')-(' + value_omin_ + ')))) * ((' + value_cmax_ + ')-(' + value_cmin_ + ')) + (' + value_cmin_ + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['number_to_string'] = function (block) {
  var value_number_ = Blockly.JavaScript.valueToCode(block, 'number_', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_string_ = block.getFieldValue('string_');
  var code = '(' + value_number_ + ').toString(' + dropdown_string_ + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


/*
    .                                oooo        
  .o8                                `888        
.o888oo oooo d8b  .oooo.    .ooooo.   888  oooo  
  888   `888""8P `P  )88b  d88' `"Y8  888 .8P'   
  888    888      .oP"888  888        888888.    
  888 .  888     d8(  888  888   .o8  888 `88b.  
  "888" d888b    `Y888""8o `Y8bod8P' o888o o888o 
*/

Blockly.JavaScript['demo_tracking'] = function (block) {
  var value_var_ = Blockly.JavaScript.valueToCode(block, 'var_', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_type_ = block.getFieldValue('type_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var share = value_var_ + '.myTracker.on("track", function(event) {\n' +
    '  if (event.data.length === 0) {\n' +
    '    ' + value_var_ + '.context.clearRect(0, 0, ' + value_var_ + '.canvas.width, ' + value_var_ + '.canvas.height);\n' +
    '  } else {\n' +
    '    ' + value_var_ + '.context.clearRect(0, 0, ' + value_var_ + '.canvas.width, ' + value_var_ + '.canvas.height);\n' +
    '    event.data.forEach(function(data) {\n' +
    '    ' + statements_do_ +
    '      if(data.color){\n' +
    '        ' + value_var_ + '.context.strokeStyle = ' + value_var_ + '.storkColor[data.color];\n' +
    '      }else{\n' +
    '        ' + value_var_ + '.context.strokeStyle = "#f00";\n' +
    '      }\n' +
    '      ' + value_var_ + '.context.lineWidth = 5;\n' +
    '      ' + value_var_ + '.context.strokeRect(data.x, data.y, data.width, data.height-30);\n' +
    '      ' + value_var_ + '.context.font = "11px Helvetica";\n' +
    '      ' + value_var_ + '.context.fillStyle = "#fff";\n' +
    '    });\n' +
    '  }\n' +
    '});\n' +
    value_var_ + '.trackerTask = tracking.track("#demo-area-08-video", ' + value_var_ + '.myTracker, {\n' +
    '  camera: true\n' +
    '});\n\n';
  var code;
  if (dropdown_type_ == 'color') {
    code = value_var_ + ' = {};\n' +
      value_var_ + '.canvas = document.getElementById("demo-area-08-canvas");\n' +
      value_var_ + '.context = ' + value_var_ + '.canvas.getContext("2d");\n' +
      'tracking.ColorTracker.registerColor("red", function(r, g, b) {\n' +
      '  if (r > 160 && g < 80 && b < 80) {\n' +
      '    return true;\n' +
      '  }\n' +
      '  return false;\n' +
      '});\n' +
      'tracking.ColorTracker.registerColor("green", function(r, g, b) {\n' +
      '  if (r < 80 && g > 160 && b < 80) {\n' +
      '    return true;\n' +
      '  }\n' +
      '  return false;\n' +
      '});\n\n' +
      'tracking.ColorTracker.registerColor("blue", function(r, g, b) {\n' +
      '  if (r < 80 && g < 80 && b > 160) {\n' +
      '    return true;\n' +
      '  }\n' +
      '  return false;\n' +
      '});\n\n' +
      value_var_ + '.myTracker = new tracking.ColorTracker(["magenta", "cyan", "yellow", "red", "green", "blue"]);\n' +
      value_var_ + '.storkColor = {\n' +
      '  magenta: "#f0a",\n' +
      '  red: "#f00",\n' +
      '  cyan: "#0ff",\n' +
      '  yellow: "#ff0",\n' +
      '  green: "#0c0",\n' +
      '  blue: "#00f"\n' +
      '};\n\n' +
      share;
  } else if (dropdown_type_ == 'face') {
    code = value_var_ + ' = {};\n' +
      value_var_ + '.canvas = document.getElementById("demo-area-08-canvas");\n' +
      value_var_ + '.context = ' + value_var_ + '.canvas.getContext("2d");\n' +
      value_var_ + '.myTracker = new tracking.ObjectTracker("face");\n' +
      value_var_ + '.myTracker.setInitialScale(4);\n' +
      value_var_ + '.myTracker.setStepSize(0.5);\n' +
      value_var_ + '.myTracker.setEdgesDensity(0.1);\n\n' +
      share;
  }
  return code;
};


Blockly.JavaScript['demo_tracking_face'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_ed_ = block.getFieldValue('ed_');
  var dropdown_ss_ = block.getFieldValue('ss_');
  var dropdown_is_ = block.getFieldValue('is_');
  var code = variable_name_ + '.myTracker.setInitialScale(' + dropdown_is_ + ');\n' +
    variable_name_ + '.myTracker.setStepSize(' + dropdown_ss_ + ');\n' +
    variable_name_ + '.myTracker.setEdgesDensity(' + dropdown_ed_ + ');\n\n';
  return code;
};


Blockly.JavaScript['demo_tracking_action'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_action_ = block.getFieldValue('action_');
  var code = variable_name_ + '.context.clearRect(0, 0, ' + variable_name_ + '.canvas.width, ' + variable_name_ + '.canvas.height);\n' +
    variable_name_ + '.trackerTask.' + dropdown_action_ + '();\n';
  return code;
};


Blockly.JavaScript['demo_tracking_val'] = function (block) {
  var dropdown_val_ = block.getFieldValue('val_');
  var code = 'data.' + dropdown_val_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


/*
                             o8o              
                             `"'              
ooo. .oo.  .oo.    .oooo.   oooo  ooo. .oo.   
`888P"Y88bP"Y88b  `P  )88b  `888  `888P"Y88b  
 888   888   888   .oP"888   888   888   888  
 888   888   888  d8(  888   888   888   888  
o888o o888o o888o `Y888""8o o888o o888o o888o 
*/

Blockly.JavaScript['console'] = function (block) {
  var value_console = Blockly.JavaScript.valueToCode(block, 'console', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'console.log(' + value_console + ');\n';
  return code;
};


Blockly.JavaScript['getdate'] = function (block) {
  var dropdown_date_ = block.getFieldValue('date_');
  var functionName = Blockly.JavaScript.provideFunction_(
    'get_date', ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(t) {',
      _getdate.toString().replace('function _getdate() {\n', '')
    ]);
  var code = functionName + '("' + dropdown_date_ + '")';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

function _getdate() {
  var varDay = new Date(),
    varYear = varDay.getFullYear(),
    varMonth = varDay.getMonth() + 1,
    varDate = varDay.getDate();
  var varNow;
  if (t == "ymd") {
    varNow = varYear + "/" + varMonth + "/" + varDate;
  } else if (t == "mdy") {
    varNow = varMonth + "/" + varDate + "/" + varYear;
  } else if (t == "dmy") {
    varNow = varDate + "/" + varMonth + "/" + varYear;
  } else if (t == "y") {
    varNow = varYear;
  } else if (t == "m") {
    varNow = varMonth;
  } else if (t == "d") {
    varNow = varDate;
  }
  return varNow;
}



Blockly.JavaScript['gettime'] = function (block) {
  var dropdown_time_ = block.getFieldValue('time_');
  var functionName = Blockly.JavaScript.provideFunction_(
    'get_time', ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(t) {',
      _gettime.toString().replace('function _gettime() {\n', '')
    ]);
  var code = functionName + '("' + dropdown_time_ + '")';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

function _gettime() {
  var varTime = new Date(),
    varHours = varTime.getHours(),
    varMinutes = varTime.getMinutes(),
    varSeconds = varTime.getSeconds();
  var varNow;
  if (t == "hms") {
    varNow = varHours + ":" + varMinutes + ":" + varSeconds;
  } else if (t == "h") {
    varNow = varHours;
  } else if (t == "m") {
    varNow = varMinutes;
  } else if (t == "s") {
    varNow = varSeconds;
  }
  return varNow;
}


Blockly.JavaScript['board_server'] = function (block) {
  var value_server_ = Blockly.JavaScript.valueToCode(block, 'server_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'webduino.WebArduino.DEFAULT_SERVER = ' + value_server_ + ';\n';
  return code;
};

Blockly.JavaScript['board_ready'] = function (block) {
  var value_device_ = Blockly.JavaScript.valueToCode(block, 'device_', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_type_ = block.getFieldValue('type_');
  var checkbox_check_ = block.getFieldValue('check_');
  var dropdown_rate_ = block.getFieldValue('rate_');
  var statements_callbacks_ = Blockly.JavaScript.statementToCode(block, 'callbacks_');

  var type;
  if (checkbox_type_ == '1') {
    type = 'boardReady(' + value_device_ + ', async function (board) {\n';
  } else if (checkbox_type_ == '2') {
    type = 'boardReady({ transport: \'serial\', path:' + value_device_ + ' }, async function (board) {\n';
  } else if (checkbox_type_ == '3') {
    type = 'boardReady({ transport: \'bluetooth\', address:' + value_device_ + ' }, async function (board) {\n';
  }

  var code;
  if (checkbox_check_ == 'FALSE') {
    code = type +
      '  board.samplingInterval = ' + dropdown_rate_ + ';\n' +
      statements_callbacks_ +
      '});\n';
  } else if (checkbox_check_ == 'TRUE') {
    code = 'if(window.readyBoardLength){\n' +
      '  window.readyBoardLength = window.readyBoardLength + 1;\n' +
      '}else{\n' +
      '  window.readyBoardLength = 1;\n' +
      '}\n\n' +
      type +
      '  board.samplingInterval = ' + dropdown_rate_ + ';\n' +
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


Blockly.JavaScript['board_error'] = function (block) {
  var statements_callbacks_ = Blockly.JavaScript.statementToCode(block, 'callbacks_');
  var code = "board.on('error', function (err) {\n  board.error = err;\n" +
    statements_callbacks_ +
    "});\n";
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


Blockly.JavaScript['board_query_pin_state'] = function (block) {
  var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'board.queryPinState(' + value_pin + ',function(){\n' +
    '  var _localPinVar_ = board.getDigitalPin(' + value_pin + ');\n' +
    statements_do_ + '\n' +
    '});\n';
  return code;
};


Blockly.JavaScript['board_pin_state'] = function (block) {
  var code = '_localPinVar_.state';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['pin_get'] = function (block) {
  var input_pin_block = block.getInputTargetBlock('pin');
  var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'getPin(' + (input_pin_block.type === 'pin_num' || input_pin_block.type === 'math_number' ? 'board, ' : '') + value_pin + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['pin_num'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = dropdown_pin_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['pin_board'] = function (block) {
  var dropdown_board_ = block.getFieldValue('board_');
  var value_pin_ = Blockly.JavaScript.valueToCode(block, 'pin_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = dropdown_board_ + ', ' + value_pin_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['pin_set_mode'] = function (block) {
  var variable_pin_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('pin_'), Blockly.Variables.NAME_TYPE);
  var dropdown_mode_ = block.getFieldValue('mode_');
  var code = variable_pin_ + '.setMode(' + dropdown_mode_ + ');\n';
  return code;
};

Blockly.JavaScript['pin_read'] = function (block) {
  var variable_pin_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('pin_'), Blockly.Variables.NAME_TYPE);
  var code = 'await ' + variable_pin_ + '.read()';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['pin_write'] = function (block) {
  var variable_pin_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('pin_'), Blockly.Variables.NAME_TYPE);
  var value_value_ = Blockly.JavaScript.valueToCode(block, 'value_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_pin_ + '.write(' + value_value_ + ');\n';
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

Blockly.JavaScript['led_blink'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_time_ = Blockly.JavaScript.valueToCode(block, 'time_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_name_ + '.blink(' + value_time_ + '*1000);\n';
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


Blockly.JavaScript['led_blink_callback'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_time_ = Blockly.JavaScript.valueToCode(block, 'time_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_name_ + '.blink(' + value_time_ * 1000 + ', function(){\n  ' + statements_do_ + '\n});\n';
  return code;
};


Blockly.JavaScript['rgbled_new'] = function (block) {
  var dropdown_red_ = block.getFieldValue('red_');
  var dropdown_green_ = block.getFieldValue('green_');
  var dropdown_blue_ = block.getFieldValue('blue_');
  var code = 'getRGBLed(board, ' + dropdown_red_ + ', ' + dropdown_green_ + ', ' + dropdown_blue_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['rgbled_new_cathode'] = function (block) {
  var dropdown_red_ = block.getFieldValue('red_');
  var dropdown_green_ = block.getFieldValue('green_');
  var dropdown_blue_ = block.getFieldValue('blue_');
  var code = 'getRGBLedCathode(board, ' + dropdown_red_ + ', ' + dropdown_green_ + ', ' + dropdown_blue_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['rgbled_setcolor'] = function (block) {
  var variable_rgbled_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('rgbled_'), Blockly.Variables.NAME_TYPE);
  var value_color_ = Blockly.JavaScript.valueToCode(block, 'color_', Blockly.JavaScript.ORDER_NONE);
  var code = variable_rgbled_ + '.setColor(' + value_color_ + ');\n';
  return code;
};


Blockly.JavaScript['rgbled_setcolor_callback'] = function (block) {
  var variable_rgbled_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('rgbled_'), Blockly.Variables.NAME_TYPE);
  var value_color_ = Blockly.JavaScript.valueToCode(block, 'color_', Blockly.JavaScript.ORDER_NONE);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_rgbled_ + '.setColor(' + value_color_ + ' , function(){\n  ' + statements_do_ + '\n});\n';
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
  var code = 'await ' + variable_car_ + '.' + dropdown_move_ + '(' + value_secs_ + ');\n';
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
  var code = 'await ' + variable_fish_ + '.' + dropdown_angle_ + '(' + value_secs_ + ');\n';
  return code;
};


Blockly.JavaScript['fish_move'] = function (block) {
  var variable_fish_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('fish_'), Blockly.Variables.NAME_TYPE);
  var dropdown_direction_ = block.getFieldValue('direction_');
  var value_secs_ = Blockly.JavaScript.valueToCode(block, 'secs_', Blockly.JavaScript.ORDER_NONE);
  var dropdown_speed_ = block.getFieldValue('speed_');
  var code = 'await ' + variable_fish_ + ".flap(" + value_secs_ + ", " + dropdown_speed_ + (dropdown_direction_.length ? ", " + dropdown_direction_ : '') + ");\n";
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
  var code = 'await delay(' + value_secs_ + ');\n';
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
  var code = 'await ' + variable_var_ + '.ping();\n';
  return code;
};

Blockly.JavaScript['ultrasonic_stop'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var code = variable_var_ + '.stopPing();\n';
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
  var code;
  if (dropdown_status_ == 'detected') {
    code = variable_item_ + '.on("' + dropdown_status_ + '",function(){\n' +
      '  ' + statements_var_ + '\n' +
      '});\n';
  } else {
    code = variable_item_ + '.on("' + dropdown_status_ + '",function(){\n' +
      '  setTimeout(function(){\n' +
      '  ' + statements_var_ + '\n' +
      '  },300);\n' +
      '});\n';
  }
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
  var functionName = Blockly.JavaScript.provideFunction_(
    'buzzer_music', ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(m) {',
      _buzzer_music.toString().replace('function _buzzer_music(m) {\n', '')
    ]);
  var code = value_music_name_ + ' = ' + functionName + '([' + statements_music_ + ']);\n';
  return code;
};

function _buzzer_music(m) {
  var musicNotes = {};
  musicNotes.notes = [];
  musicNotes.tempos = [];
  if (m[0].notes.length > 1) {
    for (var i = 0; i < m.length; i++) {
      if (Array.isArray(m[i].notes)) {
        var cn = musicNotes.notes.concat(m[i].notes);
        musicNotes.notes = cn;
      } else {
        musicNotes.notes.push(m[i].notes);
      }
      if (Array.isArray(m[i].tempos)) {
        var ct = musicNotes.tempos.concat(m[i].tempos);
        musicNotes.tempos = ct;
      } else {
        musicNotes.tempos.push(m[i].tempos);
      }
    }
  } else {
    musicNotes.notes = [m[0].notes];
    musicNotes.tempos = [m[0].tempos];
  }
  return musicNotes;
}


Blockly.JavaScript['buzzer_music_array'] = function (block) {
  var value_music_name_ = Blockly.JavaScript.valueToCode(block, 'music_name_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_notes_ = Blockly.JavaScript.valueToCode(block, 'notes_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_tempos_ = Blockly.JavaScript.valueToCode(block, 'tempos_', Blockly.JavaScript.ORDER_ATOMIC);
  var next = block.getNextBlock();
  var notes = value_notes_.replace(/\'/g, '');
  var tempos = value_tempos_.replace(/\'/g, '');
  var notesGen = notes.split(',');
  var temposGen = tempos.split(',');
  if (notesGen.length > temposGen.length) {
    var nt = notesGen.length - temposGen.length;
    var tl = temposGen.length - 1;
    for (var i = 0; i < nt; i++) {
      temposGen.push(temposGen[tl])
    }
  } else if (notesGen.length < temposGen.length) {
    var nb = temposGen.length - notesGen.length;
    temposGen.splice(notesGen.length, nb);
  }
  for (var i = 0; i < notesGen.length; i++) {
    notesGen[i] = '"' + notesGen[i] + '"';
  }
  for (var i = 0; i < temposGen.length; i++) {
    temposGen[i] = '"' + temposGen[i] + '"';
  }
  var code;
  if (next === null) {
    code = '{notes : [' + notesGen + '] , tempos : [' + temposGen + '] }';
  } else {
    code = '{notes : [' + notesGen + '] , tempos : [' + temposGen + '] },';
  }
  return code;
};


Blockly.JavaScript['buzzer_notes_tempos'] = function (block) {
  var dropdown_tone_ = block.getFieldValue('tone_');
  var dropdown_pitch_ = block.getFieldValue('pitch_');
  var dropdown_tempos_ = block.getFieldValue('tempos_');
  var next = block.getNextBlock();
  var code;
  if (dropdown_tone_ == '0') {
    dropdown_pitch_ = '';
  }
  if (next === null) {
    code = '{notes:"' + dropdown_tone_ + dropdown_pitch_ + '",tempos:"' + dropdown_tempos_ + '"}';
  } else {
    code = '{notes:"' + dropdown_tone_ + dropdown_pitch_ + '",tempos:"' + dropdown_tempos_ + '"},';
  }
  return code;
};


Blockly.JavaScript['buzzer_single'] = function (block) {
  var variable_var_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('var_'), Blockly.Variables.NAME_TYPE);
  var dropdown_tone_ = block.getFieldValue('tone_');
  var dropdown_pitch_ = block.getFieldValue('pitch_');
  var dropdown_tempos_ = block.getFieldValue('tempos_');
  var code = variable_var_ + '.play(["' + dropdown_tone_ + dropdown_pitch_ + '"],[' + dropdown_tempos_ + ']);\n';
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
  var notes, tempos;
  var next = block.getNextBlock();
  if (dropdown_music_ == 'm1') {
    notes = '["E7","E7","0","E7","0","C7","E7","0","G7","0","0","0","G6","0","0","0","C7","0","0","G6","0","0","E6","0","0","A6","0","B6","0","AS6","A6","0","G6","E7","0","G7","A7","0","F7","G7","0","E7","0","C7","D7","B6","0","0","C7","0","0","G6","0","0","E6","0","0","A6","0","B6","0","AS6","A6","0","G6","E7","0","G7","A7","0","F7","G7","0","E7","0","C7","D7","B6","0","0"]';
    tempos = '["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"]';
  } else if (dropdown_music_ == 'm2') {
    notes = '["c4","e4","e4","0","e4","g4","g4","0","d4","f4","f4","0","a4","b4","b4","0","c4","d4","e4","c4","e4","c4","e4","0","d4","e4","f4","f4","e4","d4","f4","0","e4","f4","g4","e4","g4","e4","g4","0","f4","g4","a4","a4","g4","f4","a4","0","g4","c4","d4","e4","f4","g4","a4","0","a4","d4","e4","f4","g4","a4","b4","0","b4","e4","f4","g4","a4","b4","c5","0","c5","b4","a4","f4","b4","g4","c5"]';
    tempos = '["6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"]';
  } else if (dropdown_music_ == 'm3') {
    notes = '["C5","C5","G4","G4","A4","A4","G4","0","E4","G4","C5","A4","G4","0","0","A4","0","G4","0","E4","A4","G4","0","E4","0","G4","0","E4","D4","C4","0","E4","E4","G4","G4","A4","A4","G4","G4","0","D5","0","C5","A4","G4","A4","C5","G4","0","A4","A4","G4","A4","C5","G4","0","A4","A4","G4","A4","D5","C5"]';
    tempos = '["6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"]';
  } else if (dropdown_music_ == 'm4') {
    notes = '["FS6","FS6","0","FS6","0","D6","FS6","0","B6","0","0","0","G6","0","0","0","G6","0","0","E6","0","0","C6","0","0","F6","0","G6","0","FS6","F6","0","E6","C7","0","E7","F7","0","D7","E7","0","C7","0","A6","B6","G6","0","0","G6","0","0","E6","0","0","C6","0","0","F6","0","G6","0","FS6","F6","0","E6","G6","0","E7","F7","0","D7","E7","0","C7","0","A6","B6","G6","0","0"]';
    tempos = '["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"]';
  }
  var code;
  if (next === null) {
    code = '{notes:' + notes + ' , tempos:' + tempos + '}';
  } else {
    code = '{notes:' + notes + ' , tempos:' + tempos + '},';
  }
  return code;
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
  var c = '';
  for (var n = 0; n < block.itemCount_; n++) {
    var name = block.getFieldValue('name_' + n) || 'unknow';
    var val = Blockly.JavaScript.valueToCode(block, 'data_' + n) || '""';
    if (n < (block.itemCount_ - 1)) {
      c = c + '  ' + name + ':' + val + ',\n';
    } else {
      c = c + '  ' + name + ':' + val + '\n';
    }
  }
  var code = variable_var_ + '.push({\n' + c +
    '});\n';
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
  var dropdown_type_ = block.getFieldValue('type_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code;
  if (dropdown_type_ == 1) {
    code = variable_name_ + '.on("value", function(snapshot) {\n' +
      '   ' + value_read_ + '=[];\n' +
      '     snapshot.forEach(function(data) {\n' +
      '     ' + value_read_ + '.push(data.val().' + text_attr_ + ');\n' +
      '   });\n' +
      '   ' + statements_do_ + '\n' +
      ' }, function (errorObject) {\n' +
      '   console.log("The read failed: " + errorObject.code);\n' +
      '});\n';
  } else {
    code = variable_name_ + '.on("value", function(snapshot) {\n' +
      '   ' + value_read_ + '=[];\n' +
      '     snapshot.forEach(function(data) {\n' +
      '     ' + value_read_ + '.push(data.val().' + text_attr_ + ');\n' +
      '   });\n' +
      '   ' + value_read_ + '=' + value_read_ + '[' + value_read_ + '.length-1];\n' +
      '   ' + statements_do_ + '\n' +
      ' }, function (errorObject) {\n' +
      '   console.log("The read failed: " + errorObject.code);\n' +
      '});\n';
  }
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


Blockly.JavaScript['car_test_new'] = function (block) {
  var value_var_ = Blockly.JavaScript.valueToCode(block, 'var_', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_rf_ = block.getFieldValue('rf_');
  var dropdown_rb_ = block.getFieldValue('rb_');
  var dropdown_lf_ = block.getFieldValue('lf_');
  var dropdown_lb_ = block.getFieldValue('lb_');
  var code = value_var_ + ' = getToyCar(board,' + dropdown_rf_ + ',' + dropdown_rb_ + ',' + dropdown_lf_ + ',' + dropdown_lb_ + ');\n';
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
  var a = value_name_.split('');
  value_name_ = a.splice(1, (a.length - 2)).join('');
  var code;
  if (dropdown_type_ == 1) {
    code = 'function ' + setCookie + '(c_name,value,expiredays){\n' +
      '  var exdate=new Date();\n' +
      '  exdate.setDate(exdate.getDate()+expiredays);\n' +
      '  document.cookie=c_name+ "=" +escape(value)+\n' +
      '  ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());\n' +
      '}\n' +
      setCookie + '("' + value_name_ + '",' + value_value_ + ');\n';
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
  var a = value_name_.split('');
  value_name_ = a.splice(1, (a.length - 2)).join('');
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
      '  return ' + getCookie + '("' + value_name_ + '");\n' +
      '})()';
  } else if (dropdown_type_ == 2) {
    code = 'localStorage.' + value_name_;
  } else if (dropdown_type_ == 3) {
    code = 'sessionStorage.' + value_name_;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['sound_recognition'] = function (block) {
  var dropdown_lang_ = block.getFieldValue('lang_');
  var dropdown_interimresults_ = block.getFieldValue('interimResults_');
  var statements_recognition_ = Blockly.JavaScript.statementToCode(block, 'recognition_');
  var resultLength = Blockly.JavaScript.variableDB_.getDistinctName(
    'resultLength', Blockly.Variables.NAME_TYPE);
  var resultTranscript = Blockly.JavaScript.variableDB_.getDistinctName(
    'resultTranscript', Blockly.Variables.NAME_TYPE);
  var speechRecognition = Blockly.JavaScript.variableDB_.getDistinctName(
    'speechRecognition', Blockly.Variables.NAME_TYPE);
  var inter1, inter2, consoleFinal1, consoleFinal2;
  if (dropdown_interimresults_ == 'on') {
    inter1 = 'false';
    inter2 = 'true';
    consoleFinal1 = '';
    consoleFinal2 = 'console.log("final");\n';
  } else if (dropdown_interimresults_ == 'off') {
    inter1 = 'true';
    inter2 = 'false';
    consoleFinal1 = 'console.log("final");\n';
    consoleFinal2 = '';
  }
  var code = 'async function ' + speechRecognition + '(){\n' +
    '  if (!("webkitSpeechRecognition" in window)) {\n' +
    '    alert("本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)");\n' +
    '  } else{\n' +
    '    window._recognition = new webkitSpeechRecognition();\n' +
    '    window._recognition.continuous = true;\n' +
    '    window._recognition.interimResults = true;\n' +
    '    window._recognition.lang = "' + dropdown_lang_ + '";\n\n' +
    '    window._recognition.onstart = async function() {\n' +
    '      console.log("Start recognize...");\n' +
    '    };\n\n' +
    '    window._recognition.onend = async function() {\n' +
    '      console.log("Stop recognize");\n' +
    '    };\n\n' +
    '    window._recognition.onresult = async function(event,result) {\n' +
    '      result = {};\n' +
    '      result.resultLength = event.results.length-1;\n' +
    '      result.resultTranscript = event.results[result.resultLength][0].transcript;\n' +
    '      if(event.results[result.resultLength].isFinal===' + inter1 + '){\n' +
    '        console.log(result.resultTranscript);\n' +
    '        ' + statements_recognition_ +
    '        ' + consoleFinal1 +
    '      }else if(event.results[result.resultLength].isFinal===' + inter2 + '){\n' +
    '        ' + consoleFinal2 +
    '      }\n' +
    '    };\n' +
    '    window._recognition.start();\n' +
    '  }\n' +
    '}\n' +
    speechRecognition + '();\n';
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
    code = 'if(result.resultTranscript.indexOf("' + b[0] + '")!==-1){\n' +
      '        ' + statements_do_ +
      '      }\n';
  } else {
    code = 'if(result.resultTranscript.indexOf("' + b[0] + '")!==-1){\n' +
      '        ' + statements_do_ +
      '      }\n';
    for (var i = 1; i < b.length; i++) {
      code += 'if(result.resultTranscript.indexOf("' + b[i] + '")!==-1){\n' +
        '        ' + statements_do_ +
        '      }\n';
    }
  }
  return code;
};


Blockly.JavaScript['sound_recognition_stop'] = function (block) {
  var code = 'window._recognition.stop();\n';
  return code;
};


Blockly.JavaScript['sound_recognition_text'] = function (block) {
  var code = 'result.resultTranscript';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['translate_speech'] = function (block) {
  var text_id_ = block.getFieldValue('id_');
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
  var appID = text_id_;
  var language = dropdown_lang_;
  var format = 'audio/mp3&options=MinSize|' + dropdown_sex_;
  var a = value_speech_.split('');
  value_speech_ = a.splice(1, (a.length - 2)).join('');
  var code = '(function(){\n' +
    '  var ' + body + ' = document.querySelector("body");\n' +
    '  var ' + creatAudio + ' = document.createElement("audio");\n' +
    '  ' + body + '.appendChild(' + creatAudio + ');\n' +
    '  var ' + audio + ' = document.querySelector("audio");\n' +
    '  ' + audio + '.setAttribute("autoplay","true");\n' +
    '  ' + audio + '.setAttribute("src","http://api.microsofttranslator.com/v2/http.svc/speak?appId=' + appID + '&language=' + language + '&format=' + format + '&text=' + value_speech_ + '");\n' +
    '})();\n';
  return code;
};


Blockly.JavaScript['status_repeat'] = function (block) {
  var value_times_ = Blockly.JavaScript.valueToCode(block, 'times_', Blockly.JavaScript.ORDER_ATOMIC);
  var repeat = Blockly.JavaScript.variableDB_.getDistinctName(
    'repeat', Blockly.Variables.NAME_TYPE);
  var repeatNum = Blockly.JavaScript.variableDB_.getDistinctName(
    'repeatNum', Blockly.Variables.NAME_TYPE);
  var timer = Blockly.JavaScript.variableDB_.getDistinctName(
    'timer', Blockly.Variables.NAME_TYPE);
  var time = Blockly.JavaScript.variableDB_.getDistinctName(
    'time', Blockly.Variables.NAME_TYPE);
  var repeatDelay = Blockly.JavaScript.variableDB_.getDistinctName(
    'repeatDelay', Blockly.Variables.NAME_TYPE);
  var repeatPromise = Blockly.JavaScript.variableDB_.getDistinctName(
    'repeatPromise', Blockly.Variables.NAME_TYPE);
  var code;
  var codeArray = {};
  codeArray.code = [];
  codeArray.argument = [];
  codeArray.delayTime = [];
  if (value_times_ == 0) {
    value_times_ = 1;
  } else if (value_times_ == 1) {
    value_times_ = 2;
  }
  if (block.itemCount_ == 0) {
    return code = '';
  } else if (block.itemCount_ == 1) {
    var argument0 = Blockly.JavaScript.statementToCode(block, 'ADD0');
    var time0 = block.getFieldValue('time0');
    if (isNaN(time0 * 1)) {
      code = 'alert("時間格式錯誤！請填入數字！Time format error! Please enter number!");';
    } else {
      code = 'var ' + timer + ', ' + repeatNum + '=0;\n' +
        'var ' + repeat + ' = function(){\n' +
        '  if(' + repeatNum + '<' + value_times_ + '){\n' +
        '  ' + argument0 +
        '    ' + repeatNum + ' = ' + repeatNum + ' + 1;\n' +
        '    ' + timer + ' = setTimeout(' + repeat + ',' + (time0 * 1000) + ');\n' +
        '  }else{\n' +
        '    ' + repeatNum + '=0;\n' +
        '    clearTimeout(' + timer + ');\n' +
        '  }\n' +
        '};\n' +
        '' + repeat + '();\n';
    }
    return code;
  } else {
    for (var n = 0; n < block.itemCount_; n++) {
      codeArray.argument[n] = Blockly.JavaScript.statementToCode(block, 'ADD' + n);
      codeArray.delayTime[n] = block.getFieldValue('time' + n);
      if (isNaN(codeArray.delayTime[n] * 1)) {
        codeArray.code[n] = '.then(function(){\n' +
          '      alert("時間格式錯誤！請填入數字！Time format error! Please enter number!");\n' +
          '    })';
      } else {
        codeArray.code[n] = '.then(function(){\n' +
          '      ' + codeArray.argument[n] +
          '      return ' + repeatDelay + '(' + (1000 * codeArray.delayTime[n]) + ');\n' +
          '    })';
      }
    }
    var codeContent = codeArray.code.join('');
    code = 'var ' + timer + ', ' + repeatNum + '=0;\n' +
      'var ' + repeat + ' = function(){\n' +
      '  var ' + time + ';\n' +
      '  var ' + repeatDelay + ' = function(' + time + '){\n' +
      '    return new Promise(function(resolve){\n' +
      '      ' + timer + ' = setTimeout(resolve,' + time + ');\n' +
      '    });\n' +
      '  };\n' +
      '  var ' + repeatPromise + ' = function(){\n' +
      '    ' + repeatDelay + '(1)' + codeContent + '.then(function(){\n' +
      '      if(' + repeatNum + '<' + (value_times_ - 1) + '){\n' +
      '        ' + repeatNum + ' = ' + repeatNum + ' + 1;\n' +
      '        ' + repeatPromise + '();\n' +
      '      }else{\n' +
      '        ' + repeatNum + '=0;\n' +
      '        clearTimeout(' + timer + ');\n' +
      '      }\n' +
      '    });\n' +
      '  };\n' +
      '  ' + repeatPromise + '();\n' +
      '};\n' +
      '' + repeat + '();\n';
    return code;
  }
};


Blockly.JavaScript['status_repeat_forever'] = function (block) {
  var value_name_ = Blockly.JavaScript.valueToCode(block, 'name_', Blockly.JavaScript.ORDER_ATOMIC);
  var repeat = Blockly.JavaScript.variableDB_.getDistinctName(
    'repeat', Blockly.Variables.NAME_TYPE);
  var time = Blockly.JavaScript.variableDB_.getDistinctName(
    'time', Blockly.Variables.NAME_TYPE);
  var repeatDelay = Blockly.JavaScript.variableDB_.getDistinctName(
    'repeatDelay', Blockly.Variables.NAME_TYPE);
  var repeatPromise = Blockly.JavaScript.variableDB_.getDistinctName(
    'repeatPromise', Blockly.Variables.NAME_TYPE);
  var code;
  var codeArray = {};
  codeArray.code = [];
  codeArray.argument = [];
  codeArray.delayTime = [];
  if (block.itemCount_ == 0) {
    return code = '';
  } else if (block.itemCount_ == 1) {
    var argument0 = Blockly.JavaScript.statementToCode(block, 'ADD0');
    var time0 = block.getFieldValue('time0');
    if (isNaN(time0 * 1)) {
      code = 'alert("時間格式錯誤！請填入數字！Time format error! Please enter number!");';
    } else {
      code = 'var ' + repeat + ' = function(){\n' +
        '  ' + argument0 +
        '    ' + value_name_ + ' = setTimeout(' + repeat + ',' + (time0 * 1000) + ');\n' +
        '};\n' +
        '' + repeat + '();\n';
    }
    return code;
  } else {
    for (var n = 0; n < block.itemCount_; n++) {
      codeArray.argument[n] = Blockly.JavaScript.statementToCode(block, 'ADD' + n);
      codeArray.delayTime[n] = block.getFieldValue('time' + n);
      if (isNaN(codeArray.delayTime[n] * 1)) {
        codeArray.code[n] = '.then(function(){\n' +
          '      alert("時間格式錯誤！請填入數字！Time format error! Please enter number!");\n' +
          '    })';
      } else {
        codeArray.code[n] = '.then(function(){\n' +
          '      ' + codeArray.argument[n] +
          '      return ' + repeatDelay + '(' + (1000 * codeArray.delayTime[n]) + ');\n' +
          '    })';
      }
    }
    var codeContent = codeArray.code.join('');
    code = 'var ' + repeat + ' = function(){\n' +
      '  var ' + time + ';\n' +
      '  var ' + repeatDelay + ' = function(' + time + '){\n' +
      '    return new Promise(function(resolve){\n' +
      '      ' + value_name_ + ' = setTimeout(resolve,' + time + ');\n' +
      '    });\n' +
      '  };\n' +
      '  var ' + repeatPromise + ' = function(){\n' +
      '    ' + repeatDelay + '(1)' + codeContent + '.then(function(){\n' +
      '        ' + repeatPromise + '();\n' +
      '    });\n' +
      '  };\n' +
      '  ' + repeatPromise + '();\n' +
      '};\n' +
      '' + repeat + '();\n';
    return code;
  }
};


Blockly.JavaScript['status_repeat_stop'] = function (block) {
  var value_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = 'clearTimeout(' + value_name_ + ');\n';
  return code;
};


Blockly.JavaScript['max7219_new'] = function (block) {
  var dropdown_din_ = block.getFieldValue('din_');
  var dropdown_cs_ = block.getFieldValue('cs_');
  var dropdown_clk_ = block.getFieldValue('clk_');
  var code = 'getMax7219(board, ' + dropdown_din_ + ', ' + dropdown_cs_ + ', ' + dropdown_clk_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['max7219_draw'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_code_ = Blockly.JavaScript.valueToCode(block, 'code_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_name_ + '.on(' + value_code_ + ');\n';
  return code;
};


Blockly.JavaScript['max7219_animate'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_times_ = Blockly.JavaScript.valueToCode(block, 'times_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_list_ = Blockly.JavaScript.valueToCode(block, 'list_', Blockly.JavaScript.ORDER_ATOMIC);
  var varData = Blockly.JavaScript.variableDB_.getDistinctName(
    'varData', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + varData + ' = ' + value_list_ + ';\n' +
    variable_name_ + '.animateStop();\n'+
    variable_name_ + '.animate(' + varData + ',' + value_times_ + ');\n';
  return code;
};


Blockly.JavaScript['max7219_animate_horse'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_times_ = Blockly.JavaScript.valueToCode(block, 'times_', Blockly.JavaScript.ORDER_ATOMIC);
  var value_code_ = Blockly.JavaScript.valueToCode(block, 'code_', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_state_ = '"' + block.getFieldValue('state_') + '"';
  var functionName = Blockly.JavaScript.provideFunction_(
    'max7219_horse', ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(state,code) {',
      '  var b = code.split("");',
      '  var d = [];',
      '  if(state=="left"){',
      '    for(var i=0; i<code.length/2; i++){',
      '      a(i);',
      '    }',
      '    function a(j){',
      '      var c=b.splice(0,2);',
      '      b.push(c[0],c[1]);',
      '      d[j] = b.join("");',
      '      d[j] = d[j].split("").splice(0,16).join("");',
      '    }',
      '  }else{',
      '    for(var i=0; i<code.length/2; i++){',
      '      a(i);',
      '    }',
      '    function a(j){',
      '      var c=b.splice((code.length-2),code.length);',
      '      b.unshift(c[0],c[1]);',
      '      d[j] = b.join("");',
      '      d[j] = d[j].split("").splice(0,16).join("");',
      '    }',
      '  }',
      '  return d;',
      '}'
    ]);
  //var code = 'console.log('+functionName+'('+dropdown_state_+','+value_code_ +'));\n';
  var code = variable_name_ + '.animateStop();\n'+
             variable_name_ + '.animate(' + functionName + '(' + dropdown_state_ + ',' + value_code_ + '),' + value_times_ + ');\n';
  return code;

};


Blockly.JavaScript['max7219_stop'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.animateStop();\n';
  return code;
};


Blockly.JavaScript['max7219_off'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.animateStop();\n'+
             variable_name_ + '.off();\n';
  return code;
};

Blockly.JavaScript['max7219_88'] = function (block) {
  var a = [];
  for (var i = 1; i < 65; i++) {
    var j = 'm' + i;
    a[i - 1] = block.getFieldValue(j) == 'TRUE'
  }
  var array = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  for (var k = 0; k < 64; k++) {
    if (a[k] == true) {
      array[Math.floor((k) / 8)][((k + 8) % 8)] = 1;
    }
  }
  var b = '';
  var c = '';
  for (var p = 0; p < 8; p++) {
    for (var q = 7; q > -1; q--) {
      b = b + array[q][p];
    }
    console.log(b);
    var b2 = parseInt(b, 2);
    var b10 = b2.toString(10);
    var b16 = b2.toString(16);
    if (b10 * 1 < 16) {
      b16 = '0' + b16;
    }
    c = c + b16;
    console.log(c);
    b = '';
  }
  var code;
  code = '"' + c + '"';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['max7219_val_alphabet'] = function (block) {
  var dropdown_case_ = block.getFieldValue('case_');
  var dropdown_alphabet_ = block.getFieldValue('alphabet_') * 1;
  var upper = [
    ["A", "00fc262226fc0000"],
    ["B", "00fe929292fc0000"],
    ["C", "007cc68282820000"],
    ["D", "00fe8282c67c0000"],
    ["E", "00fe929292920000"],
    ["F", "00fe121212020000"],
    ["G", "00fe829292f20000"],
    ["H", "00fe101010fe0000"],
    ["I", "008282fe82820000"],
    ["J", "00828282fe020000"],
    ["K", "00fe102844820000"],
    ["L", "00fe808080800000"],
    ["M", "00fe02fc02fe0000"],
    ["N", "00fe0c30c0fe0000"],
    ["O", "007cc682c67c0000"],
    ["P", "00fe2222223e0000"],
    ["Q", "007cc6a246bc0000"],
    ["R", "00fe2262e2be0000"],
    ["S", "009e929292f20000"],
    ["T", "000202fe02020000"],
    ["U", "00fe808080fe0000"],
    ["V", "003e60c0603e0000"],
    ["W", "00fe80fe80fe0000"],
    ["X", "00c66c106cc60000"],
    ["Y", "000e18f0180e0000"],
    ["Z", "00c2a2928a860000"]
  ];
  var lower = [
    ["a", "00f08888f8800000"],
    ["b", "00fe9090f0000000"],
    ["c", "00f0909090000000"],
    ["d", "0000f09090fe0000"],
    ["e", "00f8a8a8a8b80000"],
    ["f", "000008fe0a000000"],
    ["g", "0000bca4a4fc0000"],
    ["h", "00fe1010f0000000"],
    ["i", "000000f400000000"],
    ["j", "000080f400000000"],
    ["k", "00fe205088000000"],
    ["l", "000000fe00000000"],
    ["m", "00f010f010f00000"],
    ["n", "00f01010f0000000"],
    ["o", "00f09090f0000000"],
    ["p", "00fc24243c000000"],
    ["q", "003c2424fc800000"],
    ["r", "00f0201000000000"],
    ["s", "00b8a8a8e8000000"],
    ["t", "0004fe8400000000"],
    ["u", "00f08080f0000000"],
    ["v", "0070807000000000"],
    ["w", "00f080f080f00000"],
    ["x", "0088502050880000"],
    ["y", "0000b8a0a0f80000"],
    ["z", "00c8a8a898000000"]
  ];
  var code;
  if (dropdown_case_ == 'upper') {
    code = '"' + upper[dropdown_alphabet_][1] + '"';
  } else {
    code = '"' + lower[dropdown_alphabet_][1] + '"';
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['max7219_val_num'] = function (block) {
  var dropdown_tens_ = block.getFieldValue('tens_') * 10;
  var dropdown_ones_ = block.getFieldValue('ones_') * 1;
  var num = [
    ["0", "0000fe8282fe0000"],
    ["1", "00000082fe800000"],
    ["2", "0000f292929e0000"],
    ["3", "0000929292fe0000"],
    ["4", "00001e1010fe0000"],
    ["5", "00009e9292f20000"],
    ["6", "0000fe9292f20000"],
    ["7", "0000020202fe0000"],
    ["8", "0000fe9292fe0000"],
    ["9", "00009e9292fe0000"],
    ["10", "82fe8000fe82fe00"],
    ["11", "82fe800082fe8000"],
    ["12", "82fe8000f2929e00"],
    ["13", "82fe80009292fe00"],
    ["14", "82fe80001e10fe00"],
    ["15", "82fe80009e92f200"],
    ["16", "82fe8000fe92f200"],
    ["17", "82fe80000202fe00"],
    ["18", "82fe8000fe92fe00"],
    ["19", "82fe80009e92fe00"],
    ["20", "f2929e00fe82fe00"],
    ["21", "f2929e0082fe8000"],
    ["22", "f2929e00f2929e00"],
    ["23", "f2929e009292fe00"],
    ["24", "f2929e001e10fe00"],
    ["25", "f2929e009e92f200"],
    ["26", "f2929e00fe92f200"],
    ["27", "f2929e000202fe00"],
    ["28", "f2929e00fe92fe00"],
    ["29", "f2929e009e92fe00"],
    ["30", "9292fe00fe82fe00"],
    ["31", "9292fe0082fe8000"],
    ["32", "9292fe00f2929e00"],
    ["33", "9292fe009292fe00"],
    ["34", "9292fe001e10fe00"],
    ["35", "9292fe009e92f200"],
    ["36", "9292fe00fe92f200"],
    ["37", "9292fe000202fe00"],
    ["38", "9292fe00fe92fe00"],
    ["39", "9292fe009e92fe00"],
    ["40", "1e10fe00fe82fe00"],
    ["41", "1e10fe0082fe8000"],
    ["42", "1e10fe00f2929e00"],
    ["43", "1e10fe009292fe00"],
    ["44", "1e10fe001e10fe00"],
    ["45", "1e10fe009e92f200"],
    ["46", "1e10fe00fe92f200"],
    ["47", "1e10fe000202fe00"],
    ["48", "1e10fe00fe92fe00"],
    ["49", "1e10fe009e92fe00"],
    ["50", "9e92f200fe82fe00"],
    ["51", "9e92f20082fe8000"],
    ["52", "9e92f200f2929e00"],
    ["53", "9e92f2009292fe00"],
    ["54", "9e92f2001e10fe00"],
    ["55", "9e92f2009e92f200"],
    ["56", "9e92f200fe92f200"],
    ["57", "9e92f2000202fe00"],
    ["58", "9e92f200fe92fe00"],
    ["59", "9e92f2009e92fe00"],
    ["60", "fe92f200fe82fe00"],
    ["61", "fe92f20082fe8000"],
    ["62", "fe92f200f2929e00"],
    ["63", "fe92f2009292fe00"],
    ["64", "fe92f2001e10fe00"],
    ["65", "fe92f2009e92f200"],
    ["66", "fe92f200fe92f200"],
    ["67", "fe92f2000202fe00"],
    ["68", "fe92f200fe92fe00"],
    ["69", "fe92f2009e92fe00"],
    ["70", "0202fe00fe82fe00"],
    ["71", "0202fe0082fe8000"],
    ["72", "0202fe00f2929e00"],
    ["73", "0202fe009292fe00"],
    ["74", "0202fe001e10fe00"],
    ["75", "0202fe009e92f200"],
    ["76", "0202fe00fe92f200"],
    ["77", "0202fe000202fe00"],
    ["78", "0202fe00fe92fe00"],
    ["79", "0202fe009e92fe00"],
    ["80", "fe92fe00fe82fe00"],
    ["81", "fe92fe0082fe8000"],
    ["82", "fe92fe00f2929e00"],
    ["83", "fe92fe009292fe00"],
    ["84", "fe92fe001e10fe00"],
    ["85", "fe92fe009e92f200"],
    ["86", "fe92fe00fe92f200"],
    ["87", "fe92fe000202fe00"],
    ["88", "fe92fe00fe92fe00"],
    ["89", "fe92fe009e92fe00"],
    ["90", "9e92fe00fe82fe00"],
    ["91", "9e92fe0082fe8000"],
    ["92", "9e92fe00f2929e00"],
    ["93", "9e92fe009292fe00"],
    ["94", "9e92fe001e10fe00"],
    ["95", "9e92fe009e92f200"],
    ["96", "9e92fe00fe92f200"],
    ["97", "9e92fe000202fe00"],
    ["98", "9e92fe00fe92fe00"],
    ["99", "9e92fe009e92fe00"]
  ];
  var code = '"' + num[dropdown_tens_ + dropdown_ones_][1] + '"';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['max7219_val_img'] = function (block) {
  var dropdown_img_ = block.getFieldValue('img_');
  var code = '"' + dropdown_img_ + '"';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['photocell_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getPhotocell(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['photocell_detected'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_detected_ = Blockly.JavaScript.statementToCode(block, 'detected_');
  var code = variable_name_ + '.on(function(val){\n' +
    '  ' + variable_name_ + '.detectedVal = val;\n' +
    statements_detected_ +
    '});\n';
  return code;
};


Blockly.JavaScript['photocell_val'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.detectedVal';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['photocell_stop'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.off();\n';
  return code;
};


Blockly.JavaScript['irrecv_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getIRRecv(board, ' + dropdown_pin_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['irrecv_on'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_on_ = Blockly.JavaScript.statementToCode(block, 'on_');
  var code = variable_name_ + '.on(function(val){\n' +
    '  ' + variable_name_ + '.onVal = val;\n' +
    statements_on_ +
    '},function(){});\n';
  return code;
};


Blockly.JavaScript['irrecv_val'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.onVal';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['irrecv_off'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.off();\n';
  return code;
};


Blockly.JavaScript['irled_new'] = function (block) {
  var dropdown_pin_ = block.getFieldValue('pin_');
  var code = 'getIRLed(board, "ffffffff")';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['irled_launch'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_code_ = Blockly.JavaScript.valueToCode(block, 'code_', Blockly.JavaScript.ORDER_ATOMIC);
  var code;
  if (value_code_.length > 2) {
    code = variable_name_ + '.send(' + value_code_ + ');\n';
  } else {
    code = variable_name_ + '.send("ffffffff");\n';
  }
  return code;
};


Blockly.JavaScript['adxl345_new'] = function (block) {
  var dropdown_sda_ = block.getFieldValue('sda_');
  var dropdown_scl_ = block.getFieldValue('scl_');
  var code = 'getADXL345(board)';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['adxl345_on'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_on_ = Blockly.JavaScript.statementToCode(block, 'on_');
  var code = variable_name_ + '.setSensitivity = 0;\n' +
    variable_name_ + '.setBaseAxis = "x";\n' +
    variable_name_ + '.on(function(_x,_y,_z,_r,_p){\n' +
    '  ' + variable_name_ + '._x = _x;\n' +
    '  ' + variable_name_ + '._y = _y;\n' +
    '  ' + variable_name_ + '._z = _z;\n' +
    '  ' + variable_name_ + '._r = _r;\n' +
    '  ' + variable_name_ + '._p = _p;\n' +
    statements_on_ +
    '});\n';
  return code;
};


Blockly.JavaScript['adxl345_val'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_val_ = block.getFieldValue('val_');
  var code = variable_name_ + '.' + dropdown_val_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['adxl345_off'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.off();\n';
  return code;
};


Blockly.JavaScript['joystick_new'] = function (block) {
  var dropdown_vrx_ = block.getFieldValue('vrx_');
  var dropdown_vry_ = block.getFieldValue('vry_');
  var dropdown_sw_ = block.getFieldValue('sw_');
  var code = 'getJoystick(board, ' + dropdown_vrx_ + ', ' + dropdown_vry_ + ', ' + dropdown_sw_ + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['joystick_on'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_on_ = Blockly.JavaScript.statementToCode(block, 'on_');
  var code = variable_name_ + '.on("message",_read_);\n' +
    'function _read_(_x, _y, _z){\n' +
    '  ' + variable_name_ + '._x = _x;\n' +
    '  ' + variable_name_ + '._y = _y;\n' +
    '  ' + variable_name_ + '._z = _z;\n' +
    statements_on_ +
    '}\n';
  return code;
};


Blockly.JavaScript['joystick_val'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_val_ = block.getFieldValue('val_');
  var code = variable_name_ + '.' + dropdown_val_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['joystick_off'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.off("message",_read_);\n';
  return code;
};


Blockly.JavaScript['document_keyboard'] = function (block) {
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var dropdown_event_ = block.getFieldValue('event_');
  var e = Blockly.JavaScript.variableDB_.getDistinctName(
    'e', Blockly.Variables.NAME_TYPE);
  var code = 'document.' + dropdown_event_ + ' = function(' + e + '){\n' +
    '  console.log(' + e + '.keyCode);\n' +
    '  switch(' + e + '.keyCode){\n' +
    statements_do_ +
    '  }\n' +
    '};\n';
  return code;
};


Blockly.JavaScript['document_keyboard_stop'] = function (block) {
  var code = 'document.onkeydown = function(){};\n' +
    'document.onkeyup = function(){};\n';
  return code;
};


Blockly.JavaScript['document_keycode'] = function (block) {
  var dropdown_keycode_ = block.getFieldValue('keycode_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = '  case ' + dropdown_keycode_ + ':\n' +
    '  ' + statements_do_ +
    '  break;\n';
  return code;
};


Blockly.JavaScript['text_indexof'] = function (block) {
  var value_input_ = Blockly.JavaScript.valueToCode(block, 'input_', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_state_ = block.getFieldValue('state_');
  var value_indexof_ = Blockly.JavaScript.valueToCode(block, 'indexof_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_input_ + '.indexOf(' + value_indexof_ + ')' + dropdown_state_;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['rfid_new'] = function (block) {
  var dropdown_sda_ = block.getFieldValue('sda_');
  var dropdown_sck_ = block.getFieldValue('sck_');
  var dropdown_mosi_ = block.getFieldValue('mosi_');
  var dropdown_miso_ = block.getFieldValue('miso_');
  var code = 'getRFID(board)';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['rfid_enter'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_on_ = Blockly.JavaScript.statementToCode(block, 'on_');
  var code = variable_name_ + '.read();\n' +
    variable_name_ + '.on("enter",function(_uid){\n' +
    '  ' + variable_name_ + '._uid = _uid;\n' +
    statements_on_ +
    '});\n';
  return code;
};


Blockly.JavaScript['rfid_uid'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '._uid';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['rfid_if'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_uid_ = Blockly.JavaScript.valueToCode(block, 'uid_', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = 'if(' + variable_name_ + '._uid == ' + value_uid_ + '){\n' +
    statements_do_ +
    '}\n';
  return code;
};


Blockly.JavaScript['rfid_leave'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_name_ + '.on("leave",function(_uid){\n' +
    statements_do_ +
    '});\n';
  return code;
};


Blockly.JavaScript['rfid_stopread'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.stopRead();\n';
  return code;
};
