'use strict';

goog.provide('Blockly.JavaScript.webduino.tutorials');
goog.require('Blockly.JavaScript');

/*
ooooo        oooooooooooo oooooooooo.   
`888'        `888'     `8 `888'   `Y8b  
 888          888          888      888 
 888          888oooo8     888      888 
 888          888    "     888      888 
 888       o  888       o  888     d88' 
o888ooooood8 o888ooooood8 o888bood8P'   
*/

Blockly.JavaScript['light'] = function (block) {
  var dropdown_status = block.getFieldValue('status');
  var code = 'document.getElementById("light").setAttribute("class","' + dropdown_status + '");\n';
  return code;
};

Blockly.JavaScript['light_click'] = function (block) {
  var statements_click = Blockly.JavaScript.statementToCode(block, 'click');
  var code = 'document.getElementById("light").addEventListener("click",function(){\n' +
    statements_click + '\n});\n';
  return code;
};

Blockly.JavaScript['light_check'] = function (block) {
  var dropdown_status = block.getFieldValue('status');
  var code = 'document.getElementById("light").getAttribute("class")=="' + dropdown_status + '"';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['two_led_light'] = function (block) {
  var dropdown_name = block.getFieldValue('NAME');
  var dropdown_status = block.getFieldValue('status');
  var code = 'document.getElementById("' + dropdown_name + '").setAttribute("class","' + dropdown_status + '");\n';
  return code;
};

Blockly.JavaScript['two_led_light_click'] = function (block) {
  var dropdown_name = block.getFieldValue('NAME');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  var code = 'document.getElementById("' + dropdown_name + '").addEventListener("click",function(){\n' +
    statements_name + '\n});\n';
  return code;
};

Blockly.JavaScript['two_led_light_check'] = function (block) {
  var dropdown_name = block.getFieldValue('NAME');
  var dropdown_check = block.getFieldValue('check');
  var code = 'document.getElementById("' + dropdown_name + '").getAttribute("class")=="' + dropdown_check + '"';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['two_led_start_blinking'] = function (block) {
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_status1 = Blockly.JavaScript.statementToCode(block, 'status1');
  var statements_status2 = Blockly.JavaScript.statementToCode(block, 'status2');
  var blinkVar = Blockly.JavaScript.variableDB_.getDistinctName(
    'blinkVar', Blockly.Variables.NAME_TYPE);
  var blinkTimer = Blockly.JavaScript.variableDB_.getDistinctName(
    'blinkTimer', Blockly.Variables.NAME_TYPE);
  var blinkFunction = Blockly.JavaScript.variableDB_.getDistinctName(
    'blinkFunction', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + blinkVar + '=1;\n' +
    'var ' + blinkTimer + ';\n' +
    'var ' + blinkFunction + '=function(){\n' +
    '  ' + blinkVar + '=' + blinkVar + '+1;\n' +
    '  if(' + blinkVar + '%2==0){\n' + statements_status1 +
    '  \n}else{\n' + statements_status2 +
    '  }\n' +
    '  ' + blinkTimer + ' = setTimeout(' + blinkFunction + ',' + value_time + ');\n' +
    '}\n' +
    blinkFunction + '();\n';
  return code;
};
Blockly.JavaScript['two_led_start_blinking'] = function (block) {
  var value_timer = Blockly.JavaScript.valueToCode(block, 'timer', Blockly.JavaScript.ORDER_ATOMIC);
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_status1 = Blockly.JavaScript.statementToCode(block, 'status1');
  var statements_status2 = Blockly.JavaScript.statementToCode(block, 'status2');
  var blinkVar = Blockly.JavaScript.variableDB_.getDistinctName(
    'blinkVar', Blockly.Variables.NAME_TYPE);
  var blinkFunction = Blockly.JavaScript.variableDB_.getDistinctName(
    'blinkFunction', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + blinkVar + '=1;\n' +
    'var ' + blinkFunction + '=function(){\n' +
    '  ' + blinkVar + '=' + blinkVar + '+1;\n' +
    '  if(' + blinkVar + '%2==0){\n' + statements_status1 +
    '  \n}else{\n' + statements_status2 +
    '  }\n' +
    '  ' + value_timer + ' = setTimeout(' + blinkFunction + ',' + value_time + ');\n' +
    '}\n' +
    blinkFunction + '();\n';
  return code;
};


Blockly.JavaScript['stop_clock'] = function (block) {
  var value_timer = Blockly.JavaScript.valueToCode(block, 'timer', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'clearTimeout(' + value_timer + ');\n';
  return code;
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

Blockly.JavaScript['rgb_led_area_color'] = function (block) {
  var value_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("show").style.background = ' + value_color + ';\n';
  return code;
};

Blockly.JavaScript['rgb_led_btn_click'] = function (block) {
  var dropdown_btn = block.getFieldValue('btn');
  var statements_do = Blockly.JavaScript.statementToCode(block, 'do');
  var code = 'document.getElementById("' + dropdown_btn + '").addEventListener("click",function(){\n' +
    statements_do + '\n});\n';
  return code;
};
Blockly.JavaScript['rgb_led_range'] = function (block) {
  var statements_do = Blockly.JavaScript.statementToCode(block, 'do');
  var varChangeColor = Blockly.JavaScript.variableDB_.getDistinctName(
    'changeColor', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + varChangeColor + ' = function(){\n' +
    '  var color,r="00",g="00",b="00";\n' +
    '  var cc = function(e){\n' +
    '    var id=e.target.id;\n' +
    '    if(id=="redRange"){r=e.target.value*1; if(r<17){r="0"+r.toString(16);}else{r=r.toString(16);}}\n' +
    '    if(id=="greenRange"){g=e.target.value*1; if(g<17){g="0"+g.toString(16);}else{g=g.toString(16);}}\n' +
    '    if(id=="blueRange"){b=e.target.value*1; if(b<17){b="0"+b.toString(16);}else{b=b.toString(16);}}\n' +
    '    color="#"+r+g+b;\n' +
    '  ' + statements_do +
    '  };\n' +
    '  document.getElementById("redRange").addEventListener("change",cc);\n' +
    '  document.getElementById("greenRange").addEventListener("change",cc);\n' +
    '  document.getElementById("blueRange").addEventListener("change",cc);\n' +
    '};\n' +
    varChangeColor + '();\n';
  return code;
};

Blockly.JavaScript['rgb_led_current_color'] = function (block) {
  var code = 'color';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['rgb_led_start_dancing'] = function (block) {
  var value_timer = Blockly.JavaScript.valueToCode(block, 'timer', Blockly.JavaScript.ORDER_ATOMIC);
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_status = Blockly.JavaScript.statementToCode(block, 'status');
  var varDancing = Blockly.JavaScript.variableDB_.getDistinctName(
    'dancing', Blockly.Variables.NAME_TYPE);
  var content;
  if (!statements_status) {
    content = '';
  } else {
    content = 'repeat();\n' +
      'function repeat(){\n' +
      '    delay(1)' + statements_status + '.then(function(){\n' +
      '      repeat();\n    });\n  }\n';
  }
  var code = 'var ' + varDancing + ' = function(){\n' +
    '  var time = ' + value_time + ';\n' +
    '  function delay(time){\n' +
    '    return new Promise(function(resolve) {\n' +
    '      ' + value_timer + ' = setTimeout(resolve, time);\n' +
    '    });\n' +
    '  }\n' +
    '  \n' +
    '  ' + content +
    '};\n' +
    varDancing + '();\n';
  return code;
};

Blockly.JavaScript['rgb_led_dancing_status'] = function (block) {
  var statements_status = Blockly.JavaScript.statementToCode(block, 'status');
  var code = '.then(function(){\n  ' + statements_status + '    return delay(time);\n  })';
  return code;
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

Blockly.JavaScript['ultrasonic_set_number'] = function (block) {
  var value_number = Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("show").innerHTML = ' + value_number + ';\n';
  return code;
};

Blockly.JavaScript['ultrasonic_change_image_size'] = function (block) {
  var value_size = Blockly.JavaScript.valueToCode(block, 'size', Blockly.JavaScript.ORDER_ATOMIC);
  if (!value_size) {
    value_size = 100;
  }
  var code = 'document.getElementById("image").style.width = ' + value_size + '+"px";\n';
  return code;
};

Blockly.JavaScript['ultrasonic_change_image_url'] = function (block) {
  var value_url = Blockly.JavaScript.valueToCode(block, 'url', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_url == '\'\'' || !value_url) {
    value_url = '"https://webduino.io/img/tutorials/tutorial-05-01s.jpg"';
  }
  var code = 'document.getElementById("image").setAttribute("src",' + value_url + ');\n';
  return code;
};

Blockly.JavaScript['ultrasonic_change_music_volume'] = function (block) {
  var value_volume = Blockly.JavaScript.valueToCode(block, 'volume', Blockly.JavaScript.ORDER_ATOMIC);
  var varMusicVolume = Blockly.JavaScript.variableDB_.getDistinctName(
    'musicVolume', Blockly.Variables.NAME_TYPE);
  var varMusicVolumeBar = Blockly.JavaScript.variableDB_.getDistinctName(
    'musicVolumeBar', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + varMusicVolume + ' = ' + value_volume + '/100;\n' +
    'var ' + varMusicVolumeBar + ' = ' + value_volume + ';\n' +
    'if(' + varMusicVolume + '>=1){' + varMusicVolume + '=1;}\n' +
    'if(' + varMusicVolumeBar + '>=255){' + varMusicVolumeBar + '=255;}\n' +
    'document.getElementById("music").volume=' + varMusicVolume + ';\n' +
    'document.getElementById("volume").style.width = (10+' + varMusicVolumeBar + ')+"px";\n' +
    'document.getElementById("volume").style.background = "rgba("+' + varMusicVolumeBar + '+","+(255-' + varMusicVolumeBar + ')+",0,1)";\n';
  return code;
};

Blockly.JavaScript['ultrasonic_change_music_play'] = function (block) {
  var dropdown_play = block.getFieldValue('play');
  var value_play = Blockly.JavaScript.valueToCode(block, 'play', Blockly.JavaScript.ORDER_ATOMIC);
  var code;
  if (dropdown_play == 'play') {
    code = 'document.getElementById("music").play();\n';
  }
  if (dropdown_play == 'pause') {
    code = 'document.getElementById("music").pause();\n';
  }
  if (dropdown_play == 'stop') {
    code = 'document.getElementById("music").pause();\n' +
      'document.getElementById("music").currentTime = 0;\n';
  }
  return code;
};

Blockly.JavaScript['ultrasonic_change_add_music'] = function (block) {
  var value_music = Blockly.JavaScript.valueToCode(block, 'music', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_music == '\'\'' || !value_music) {
    value_music = '\'https://webduinoio.github.io/event20150408/demo/minions/music.mp3\'';
  }
  var code = 'document.getElementById("music").innerHTML = "<source src=' + value_music + ' type=\'audio/mpeg\'>";\n';
  return code;
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

Blockly.JavaScript['show_text'] = function (block) {
  var value_show_ = Blockly.JavaScript.valueToCode(block, 'show_', Blockly.JavaScript.ORDER_ATOMIC);
  var a = value_show_.split('');
  value_show_ = a.splice(1, (a.length - 2)).join('');
  var code = 'document.getElementById("show").innerHTML = "' + value_show_ + '";\n';
  return code;
};

Blockly.JavaScript['show_calculate_numbers'] = function (block) {
  var dropdown_calculate_ = block.getFieldValue('calculate_');
  var value_show_calculate_numbers = Blockly.JavaScript.valueToCode(block, 'show_calculate_numbers', Blockly.JavaScript.ORDER_ATOMIC);
  if (dropdown_calculate_ == 'plus') {
    dropdown_calculate_ = '+';
  }
  if (dropdown_calculate_ == 'minus') {
    dropdown_calculate_ = '-';
  }
  if (dropdown_calculate_ == 'times') {
    dropdown_calculate_ = '*';
  }
  if (dropdown_calculate_ == 'divided') {
    dropdown_calculate_ = '/';
  }
  var varString = Blockly.JavaScript.variableDB_.getDistinctName(
    'varString', Blockly.Variables.NAME_TYPE);
  var varNumber = Blockly.JavaScript.variableDB_.getDistinctName(
    'varNumber', Blockly.Variables.NAME_TYPE);
  var code = 'var ' + varString + ' = document.getElementById("show").innerHTML;\n' +
    'var ' + varNumber + ' = ' + varString + '*1;\n' +
    varNumber + ' = ' + varNumber + dropdown_calculate_ + value_show_calculate_numbers + ';\n' +
    'document.getElementById("show").innerHTML = ' + varNumber + ';\n';
  return code;
};

Blockly.JavaScript['show_set_numbers'] = function (block) {
  var value_numbers_ = Blockly.JavaScript.valueToCode(block, 'numbers_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'document.getElementById("show").innerHTML = ' + value_numbers_ + ';\n';
  return code;
};

Blockly.JavaScript['button_change_image_position'] = function (block) {
  var dropdown_pos_ = block.getFieldValue('pos_');
  var value_image_pos_ = Blockly.JavaScript.valueToCode(block, 'image_pos_', Blockly.JavaScript.ORDER_ATOMIC);
  var code;
  if (dropdown_pos_ == 'u') {
    code = 'if(!window.varImageUD){window.varImageUD = 0;}\n' +
      'if(!window.varImageUp){window.varImageUp = 0;}\n' +
      'if(!window.varImageDown){window.varImageDown = 0;}\n' +
      'window.varImageUp = ' + value_image_pos_ + ';\n' +
      'window.varImageUD = window.varImageUD + (window.varImageDown - window.varImageUp);\n' +
      'document.getElementById("image").style.marginTop = varImageUD+"px";\n' +
      'console.log(window.varImageUD);\n';
  }
  if (dropdown_pos_ == 'd') {
    code = 'if(!window.varImageUD){window.varImageUD = 0;}\n' +
      'if(!window.varImageUp){window.varImageUp = 0;}\n' +
      'if(!window.varImageDown){window.varImageDown = 0;}\n' +
      'window.varImageDown = ' + value_image_pos_ + ';\n' +
      'window.varImageUD = window.varImageUD + (window.varImageDown - window.varImageUp);\n' +
      'document.getElementById("image").style.marginTop = varImageUD+"px";\n' +
      'console.log(window.varImageUD);\n';
  }
  if (dropdown_pos_ == 'l') {
    code = 'if(!window.varImageLR){window.varImageLR = 0;}\n' +
      'if(!window.varImageLeft){window.varImageLeft = 0;}\n' +
      'if(!window.varImageRight){window.varImageRight = 0;}\n' +
      'window.varImageLeft = ' + value_image_pos_ + ';\n' +
      'window.varImageLR = window.varImageLR + (window.varImageRight - window.varImageLeft);\n' +
      'document.getElementById("image").style.marginLeft = varImageLR+"px";\n' +
      'console.log(window.varImageLR);\n';
  }
  if (dropdown_pos_ == 'r') {
    code = 'if(!window.varImageLR){window.varImageLR = 0;}\n' +
      'if(!window.varImageLeft){window.varImageLeft = 0;}\n' +
      'if(!window.varImageRight){window.varImageRight = 0;}\n' +
      'window.varImageRight = ' + value_image_pos_ + ';\n' +
      'window.varImageLR = window.varImageLR + (window.varImageRight - window.varImageLeft);\n' +
      'document.getElementById("image").style.marginLeft = varImageLR+"px";\n' +
      'console.log(window.varImageLR);\n';
  }
  return code;
};

Blockly.JavaScript['button_reset_image_position'] = function (block) {
  var code = 'document.getElementById("image").style.margin = "0 0 0 0";\n' +
    'window.varImageUD=0;\n' +
    'window.varImageLR=0;\n';
  return code;
};

Blockly.JavaScript['button_game'] = function (block) {
  var dropdown_npc_ = block.getFieldValue('npc_');
  var dropdown_level_ = block.getFieldValue('level_');
  var dropdown_distance_ = block.getFieldValue('distance_');
  var dropdown_user_ = block.getFieldValue('user_');
  var variable_button_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('button_'), Blockly.Variables.NAME_TYPE);
  var statements_event_ = Blockly.JavaScript.statementToCode(block, 'event_');
  var code = 'var btnGameNpcShow_ = document.getElementById("npcshow"),\n' +
    '  btnGameUserShow_ = document.getElementById("usershow"),\n' +
    '  btnGameNpc_ = document.getElementById("npc"),\n' +
    '  btnGameUser_ = document.getElementById("user"),\n' +
    '  btnGameNpcImg_ = document.getElementById("npcimg"),\n' +
    '  btnGameUserImg_ = document.getElementById("userimg"),\n' +
    '  btnGameGoal_ = document.getElementById("goal"),\n' +
    '  btnGameStart_ = document.getElementById("start"),\n' +
    '  btnGameTimer_,\n' +
    '  btnGameA_ = 0,\n' +
    '  btnGameB_ = 0,\n' +
    '  btnGameDistance_ = ' + dropdown_distance_ + ',\n' +
    '  btnGameNpcSpeed_ = ' + dropdown_level_ + ',\n' +
    '  btnGameUserSpeed_;\n' +
    '  \n' +
    'btnGameStart_.className = "";\n' +
    'btnGameNpcImg_.setAttribute("src","media/tutorials/' + dropdown_npc_ + '");\n' +
    'btnGameUserImg_.setAttribute("src","media/tutorials/' + dropdown_user_ + '");\n' +
    'btnGameGoal_.innerHTML = btnGameDistance_;\n' +
    'btnGameStart_.addEventListener("click",go);\n' +
    '  \n' +
    'function go(){\n' +
    '  btnGameStart_.className = "go";\n' +
    '  btnGameA_ = 0;\n' +
    '  btnGameB_ = 0;\n' +
    '  ' + statements_event_ +
    '  btnGameTimer_ = setInterval(function(){\n' +
    '    btnGameB_ = btnGameB_ + btnGameNpcSpeed_;\n' +
    '    btnGameNpcShow_.innerHTML = btnGameB_;\n' +
    '    btnGameNpc_.style.marginLeft = btnGameB_+"px";\n' +
    '    if(btnGameB_>=btnGameDistance_){\n' +
    '      alert("GAME OVER!!!! YOU LOSE!!!!!");\n' +
    '      stop();\n' +
    '    }\n' +
    '  },120);\n' +
    '  \n' +
    '  function stop(){\n' +
    '    clearInterval(btnGameTimer_);\n' +
    '    btnGameA_ = 0;\n' +
    '    btnGameB_ = 0;\n' +
    '    btnGameNpcShow_.innerHTML = 0;\n' +
    '    btnGameUserShow_.innerHTML = 0;\n' +
    '    btnGameNpc_.style.marginLeft = 0;\n' +
    '    btnGameUser_.style.marginLeft = 0;\n' +
    '    btnGameStart_.className = "";\n' +
    '    ' + variable_button_ + '.removeAllListeners("pressed");\n' +
    '    ' + variable_button_ + '.removeAllListeners("repressed");\n' +
    '    ' + variable_button_ + '.removeAllListeners("longPress");\n' +
    '  }\n' +
    '}\n';
  return code;
};


Blockly.JavaScript['button_game_user'] = function (block) {
  var dropdown_user_ = block.getFieldValue('user_');
  var code = '      btnGameA_ = btnGameA_ + ' + dropdown_user_ + ';\n' +
    '      btnGameUserShow_.innerHTML = btnGameA_;\n' +
    '      btnGameUser_.style.marginLeft = btnGameA_+"px";\n' +
    '      if(btnGameA_>=btnGameDistance_){\n' +
    '        alert("YOU WIN!!!!!");\n' +
    '        stop();\n' +
    '      }\n';
  return code;
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

Blockly.JavaScript['tutorial_dht_show'] = function(block) {
  var dropdown_dht_ = block.getFieldValue('dht_');
  var value_show = Blockly.JavaScript.valueToCode(block, 'show', Blockly.JavaScript.ORDER_ATOMIC);
  var code;
  if(dropdown_dht_=="t"){
    code = 'document.getElementById("temperature").innerHTML = '+value_show+';\n'
  }
  if(dropdown_dht_=="h"){
    code = 'document.getElementById("humidity").innerHTML = '+value_show+';\n'
  }
  return code;
};
