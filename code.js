/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

var slice = Array.prototype.slice;

var baseUrl = baseUrl || '.';

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'en': 'English',
  'zh-hant': '正體中文'
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function (name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function () {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'zh-hant';
  }
  return lang;
};

Code.getPage = function () {
  var page = Code.getStringParamFromUrl('page', 'index');
  return page;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function () {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function (defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(Code.workspace, xml);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(Code.workspace, xml);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function () {
  // Store the blocks for the duration of the reload.
  // This should be skipped for the index page, which has no blocks and does
  // not load Blockly.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (typeof Blockly != 'undefined' && window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
    languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
    window.location.host + window.location.pathname + search;
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function (el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function () {
  //<link rel="stylesheet" href="../prettify.css">
  //<script src="../prettify.js"></script>
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', baseUrl + '/prettify-tomorrow.css');
  link.onload = function () {
    Blockly.fireUiEvent(window, 'resize');
  };
  document.head.appendChild(link);
  var script = document.createElement('script');
  script.setAttribute('src', baseUrl + '/prettify.js');
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function (element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};
Code.checkDeviceOnline = function (device) {
  device = {};
  device.inputArea = document.getElementById('input-device');
  device.btn = document.getElementById('check-btn');
  device.icon = document.getElementById('check-icon');

  if (!localStorage.boardCheckOpen) {
    localStorage.boardCheckOpen = 0;
  }

  device.btn.onclick = function () {
    if (localStorage.boardCheckOpen == 1) {
      localStorage.boardCheckOpen = 0;
      device.inputArea.className = device.inputArea.className.replace("open", "");
    } else {
      localStorage.boardCheckOpen = 1;
      device.inputArea.className = device.inputArea.className + "open";
    }
  };

  device.check = function (v) {
    device.boardEvent = webduino.BoardEvent,
      device.board = new webduino.WebArduino({
        device: v,
        multi: true
      });
    device.icon.setAttribute('class', 'check icon21 board-error');

    device.board.on(device.boardEvent.READY, function () {
      console.log(v + ' : ok');
      device.icon.setAttribute('class', 'check icon21 board-online');
    });

    device.board.on(device.boardEvent.ERROR, function () {
      device.icon.setAttribute('class', 'check icon21 board-error');
    });
  }

  device.inputArea.oninput = function () {
    localStorage.boardState = this.value;
    if (this.value.length > 3) {
      device.check(this.value.toString());
    } else {
      device.icon.setAttribute('class', 'check icon21');
    }
  };

  if (localStorage.boardState) {
    device.inputArea.value = localStorage.boardState;
    device.inputArea.oninput();
  }

  if (localStorage.boardCheckOpen == 0) {
    device.inputArea.className = device.inputArea.className.replace("open", "");
  } else if (localStorage.boardCheckOpen == 1 && device.inputArea.value.length < 4) {
    localStorage.boardCheckOpen = 0;
    device.inputArea.className = device.inputArea.className.replace("open", "");
  } else {
    device.inputArea.className = device.inputArea.className + "open";
  }

}

Code.copyCode = function(copy){
  copy = {};
  copy.jsTab = document.getElementById('tab_javascript');
  copy.copyBtn = document.getElementById('copyCode');

  copy.clipboard = new Clipboard('#copyCode');

  copy.clipboard.on('success', function(e) {
      copy.copyBtn.setAttribute('data-tooltip','Copied!!!');
  });
  copy.copyBtn.addEventListener('mouseleave',function(){
      copy.copyBtn.setAttribute('data-tooltip','Copy to clipboard');
  });

  copy.jsTab.addEventListener('click',function(){
    copy.copyBtn.style.display = 'table-cell';
  });

  document.getElementById('tab_blocks').addEventListener('click',function(){
    copy.copyBtn.style.display = 'none';
  });
}

Code.loadDemoArea = function (demo) {
  if (document.getElementById('demo-area')) {
    demo = {};
    demo.btn = document.getElementById('demoButton');
    demo.area = document.getElementById('demo-area');
    demo.select = document.getElementById('demo-select');
    demo.close = document.querySelector('.close-btn');
    demo.da = document.querySelectorAll('.da');
    demo.option = document.querySelectorAll('#demo-select option');
    demo.contentHeight = document.getElementById('content_blocks').offsetHeight;
    demo.area.style.height = (demo.contentHeight - 130) + 'px';
    demo.resizeBar = document.getElementById('demo-resize-bar');

    if (localStorage.demoAreaWidth) {
      demo.area.style.width = localStorage.demoAreaWidth;
    }

    window.addEventListener('resize', function () {
      demo.contentHeight = document.getElementById('content_blocks').offsetHeight;
      demo.area.style.height = (demo.contentHeight - 130) + 'px';
    });

    demo.resizeBar.onmousedown = function (e, dr) {
      demo.area.style.opacity = '0.4';
      dr = {};
      dr.ox = e.pageX;
      dr.dw = demo.area.offsetWidth;
      demo.area.className = demo.area.className + " resize";
      document.onmousemove = function (event) {
        dr.rx = event.pageX;
        demo.area.style.width = dr.dw - dr.rx + dr.ox - 20 + 'px';
        localStorage.demoAreaWidth = demo.area.style.width;
      }
    }

    document.onmouseup = function () {
      demo.area.style.opacity = '1';
      demo.area.className = demo.area.className.replace(" resize", "");
      document.onmousemove = null;
    }

    demo.content = function (p, s) {
      s = {};
      for (s.i = 0; s.i < demo.da.length; s.i++) {
        demo.da[s.i].className = demo.da[s.i].className.replace("show", "");
      }
      demo.option[p - 1].selected = true;
      document.getElementById('demo-area-0' + p).className = document.getElementById('demo-area-0' + p).className + " show";
      localStorage.demoAreaSelect = p;
    }

    demo.btn.onclick = function () {
      if (localStorage.demoArea == 'open') {
        demo.area.className = demo.area.className.replace("show", "");
        localStorage.demoArea = 'close';
      } else {
        demo.area.className = demo.area.className.replace("show", "");
        demo.area.className = demo.area.className + "show";
        localStorage.demoArea = 'open';
      }
    };
    demo.close.onclick = function () {
      demo.area.className = demo.area.className.replace("show", "");
      localStorage.demoArea = 'close';
    };

    demo.select.addEventListener('change', function (s) {
      s = {};
      s.selectValue = this.value;
      s.selectId = 'demo-area-0' + s.selectValue;
      localStorage.demoAreaSelect = s.selectValue;
      for (s.i = 0; s.i < demo.da.length; s.i++) {
        demo.da[s.i].className = demo.da[s.i].className.replace("show", "");
      }
      document.getElementById(s.selectId).className = document.getElementById(s.selectId).className + " show"
    });

    if (localStorage.demoArea == 'open') {
      demo.area.className = demo.area.className.replace("show", "");
      demo.area.className = demo.area.className + "show";
    } else {
      demo.area.className = demo.area.className.replace("show", "");
    }

    if (localStorage.demoAreaSelect == 1) {
      demo.content(1);
    } else if (localStorage.demoAreaSelect == 2) {
      demo.content(2);
    } else if (localStorage.demoAreaSelect == 3) {
      demo.content(3);
    } else if (localStorage.demoAreaSelect == 4) {
      demo.content(4);
    } else if (localStorage.demoAreaSelect == 5) {
      demo.content(5);
    } else if (localStorage.demoAreaSelect == 6) {
      demo.content(6);
    } else if (localStorage.demoAreaSelect == 7) {
      demo.content(7);
    }
  }
}

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

Code.PAGE = Code.getPage();

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks', 'javascript'];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function (clickedName) {
  // If the XML tab was open, save and render the content.
  if (Code.TABS_['xml'] && document.getElementById('tab_xml').className == 'tabon') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
        window.confirm(MSG['badXml'].replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(Code.workspace, xmlDom);
    }
  }

  if (document.getElementById('tab_blocks').className == 'tabon') {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    document.getElementById('tab_' + name).className = 'taboff';
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Code.selected = clickedName;
  document.getElementById('tab_' + clickedName).className = 'tabon';
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
    'visible';
  Code.renderContent();
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
  }
  Blockly.fireUiEvent(window, 'resize');
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function () {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_javascript') {
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'js');
      content.innerHTML = code;
    }
  }
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function () {
  Code.initLanguage();

  var rtl = Code.isRtl();
  var container = document.getElementById('content_area');
  var blocklyMenu;
  var onresize = function (e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    }
    if (Code.workspace.toolbox_.width) {
      blocklyMenu = document.querySelector('.blocklyTreeRow.blocklyTreeSelected');
      if (blocklyMenu) {
        document.getElementById('tab_blocks').style.minWidth = (blocklyMenu.offsetWidth - 38) + 'px';
      } else {
        document.getElementById('tab_blocks').style.minWidth = (Code.workspace.toolbox_.width - 38) + 'px';
      }
    }
    // Make the 'Blocks' tab line up with the toolbox.
    //if (Code.workspace.toolbox_.width) {
    //document.getElementById('tab_blocks').style.minWidth =
    //(Code.workspace.toolbox_.width - 38) + 'px';
    // Account for the 19 pixel margin and on each side.
    //}
  };
  window.addEventListener('resize', onresize, false);

  var toolbox = document.getElementById('toolbox');
  Code.workspace = Blockly.inject('content_blocks', {
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    media: baseUrl + '/components/blockly/media/',
    rtl: rtl,
    toolbox: toolbox,
    zoom: {
      controls: true,
      wheel: true
    }
  });

  // Add to reserved word list: Local variables in execution evironment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  Code.loadBlocks('');

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  Code.bindClick('trashButton',
    function () {
      Code.discard();
      Code.renderContent();
    });
  Code.bindClick('runButton', Code.runJS);
  // Disable the link button if page isn't backed by App Engine storage.
  var linkButton = document.getElementById('linkButton');
  if ('BlocklyStorage' in window) {
    BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
    BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
    BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
    BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
    Code.bindClick(linkButton,
      function () {
        BlocklyStorage.link(Code.workspace);
      });
  } else if (linkButton) {
    linkButton.className = 'disabled';
  }

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
      function (name_) {
        return function () {
          Code.tabClick(name_);
        };
      }(name));
  }

  onresize();
  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);
  window.setTimeout(Code.loadDemoArea, 1);
  window.setTimeout(Code.checkDeviceOnline, 1);
  window.setTimeout(Code.copyCode, 1);

};

Code.renderPage = function (callback) {
  var req = new XMLHttpRequest(),
    head = document.head,
    body = document.body;

  req.addEventListener('load', function () {
    var template = Handlebars.compile(this.responseText);
    body.innerHTML = template(MSG);

    slice.call(body.querySelectorAll('script')).forEach(function (sc) {
      var script = document.createElement('script');
      if (sc.getAttribute('src')) {
        script.setAttribute('src', sc.getAttribute('src'));
        head.appendChild(script);
        body.removeChild(sc);
      } else if (sc.text) {
        script.text = sc.text;
        head.appendChild(script);
        body.removeChild(sc);
      }
    });

    callback();
  });

  req.open("get", baseUrl + '/views/' + Code.PAGE + '.handlebars', true);
  req.send();
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function () {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function (a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', Code.changeLanguage, true);

  // Inject language strings.
  document.title += ' ' + MSG['title'];
  var toolbox = document.getElementById('toolbox');
  var categories = slice.call(toolbox.querySelectorAll('category')).map(function (e) {
    return e.id
  });
  for (var i = 0, cat; cat = categories[i]; i++) {
    document.getElementById(cat).setAttribute('name', MSG[cat]);
  }
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function () {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function () {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval('disconnectBoards(function(){' + code + '});');
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function () {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 ||
    window.confirm(MSG['discard'].replace('%1', count))) {
    Code.workspace.clear();
    window.location.hash = '';
  }
};

Code.promisifyBlock = function (block, code) {
  var prev = block.getParent(),
    next = block.getNextBlock(),
    type, ocurr, count;

  if (block.promise && block.type !== 'controls_if' && block.type !== 'procedures_callnoreturn') {
    code = 'return ' + code;
  }

  if (prev !== null && prev.promise && prev.getNextBlock() === block) {
    count = 0;
    ocurr = code.match(/\n/g).length;
    code = code.replace(/\n/g, function () {
      count++;
      if (count < ocurr) {
        return '\n  ';
      }
      return '\n';
    });
    code = '.then(function () {\n  ' + (block.type === 'procedures_callnoreturn' ? 'return ' : '') + code + '})';
    block.promise = true;
    type = 1;
  } else {
    if (block.promise && code.substring(code.length - 2) === ';\n' && next !== null) {
      code = code.substr(0, code.length - 2);
      type = 2;
    }
  }

  if (block.promise && next === null) {
    if (type) {
      code += ';\n';
    }
  }

  return code;
};

Code.debug = function () {
  var space = '';
  for (var i = 0; i < Blockly.JavaScript.depth; i++) {
    space += '  ';
  }
  console.log.apply(console, [space].concat(Array.prototype.slice.apply(arguments)));
};

Blockly.JavaScript.blockToCode = function (block) {
  if (!block) {
    return '';
  }
  if (block.disabled) {
    // Skip past this block if it is disabled.
    return this.blockToCode(block.getNextBlock());
  }

  var func = this[block.type];
  goog.asserts.assertFunction(func,
    'Language "%s" does not know how to generate code for block type "%s".',
    this.name_, block.type);

  delete block.promise;

  // First argument to func.call is the value of 'this' in the generator.
  // Prior to 24 September 2013 'this' was the only way to access the block.
  // The current prefered method of accessing the block is through the second
  // argument to func.call, which becomes the first parameter to the generator.
  var code = func.call(block, block);
  if (goog.isArray(code)) {
    // Value blocks return tuples of code and operator order.

    // Code.debug('CODE', code[0]);
    Blockly.JavaScript.depth++;
    var scrub = this.scrub_(block, code[0]);
    Blockly.JavaScript.depth--;
    // Code.debug('<- ' + scrub);

    return [scrub, code[1]];
  } else if (goog.isString(code)) {
    if (this.STATEMENT_PREFIX) {
      code = this.STATEMENT_PREFIX.replace(/%1/g, '\'' + block.id + '\'') +
        code;
    }

    // var prev = block.getParent();
    // Code.debug({
    //   type: block.type,
    //   depth: Blockly.JavaScript.depth,
    //   promise: block.promise,
    //   prev: prev ? prev.type : null
    // });
    code = Code.promisifyBlock(block, code);

    // Code.debug('CODE', code);
    Blockly.JavaScript.depth++;
    var scrub = this.scrub_(block, code);
    Blockly.JavaScript.depth--;
    // Code.debug('<- ' + scrub);

    return scrub;
  } else if (code === null) {
    // Block has handled code generation itself.
    return '';
  } else {
    goog.asserts.fail('Invalid code generated: %s', code);
  }
};

Blockly.Block.prototype.setPromise = function (isPromise) {
  var block = this;
  this.promise = isPromise;
  if (isPromise) {
    while ((block = block.getSurroundParent()) !== null) {
      if (block.type.indexOf('procedures_def') === 0) {
        block.promise = true;
        return;
      }
    }
  }
};

Blockly.JavaScript['_procedures_callnoreturn'] = Blockly.JavaScript['procedures_callnoreturn'];

Blockly.JavaScript['procedures_callnoreturn'] = function (block) {
  var funcName = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var code = Blockly.JavaScript['_procedures_callnoreturn'].call(Blockly.JavaScript, block);
  var blocks = Code.workspace.getTopBlocks();
  var blk;
  for (var i = 0; i < blocks.length; i++) {
    blk = blocks[i];
    if (blk.type.indexOf('procedures_def') === 0 && blk.getProcedureDef()[0] === funcName) {
      if (blk.promise) {
        block.promise = true;
      }
      break;
    }
  }
  return code;
};

// ZoomControl icons position
Blockly.ZoomControls.prototype.createDom = function () {
  var workspace = this.workspace_;
  this.svgGroup_ = Blockly.createSvgElement('g', {
    'class': 'blocklyZoom'
  }, null);
  var rnd = String(Math.random()).substring(2);
  var clip = Blockly.createSvgElement('clipPath', {
      'id': 'blocklyZoomresetClipPath' + rnd
    },
    this.svgGroup_);
  Blockly.createSvgElement('rect', {
      'width': 32,
      'height': 32,
      'x': 40,
      'y': 80
    },
    clip);
  var zoomresetSvg = Blockly.createSvgElement('image', {
      'width': Blockly.SPRITE.width,
      'height': Blockly.SPRITE.height,
      'x': 40,
      'y': -12,
      'clip-path': 'url(#blocklyZoomresetClipPath' + rnd + ')'
    },
    this.svgGroup_);
  zoomresetSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    'media/sprites.png');

  var clip = Blockly.createSvgElement('clipPath', {
      'id': 'blocklyZoominClipPath' + rnd
    },
    this.svgGroup_);
  Blockly.createSvgElement('rect', {
      'width': 32,
      'height': 32,
      'x': 0,
      'y': 80
    },
    clip);
  var zoominSvg = Blockly.createSvgElement('image', {
      'width': Blockly.SPRITE.width,
      'height': Blockly.SPRITE.height,
      'x': -32,
      'y': -12,
      'clip-path': 'url(#blocklyZoominClipPath' + rnd + ')'
    },
    this.svgGroup_);
  zoominSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    'media/sprites.png');

  var clip = Blockly.createSvgElement('clipPath', {
      'id': 'blocklyZoomoutClipPath' + rnd
    },
    this.svgGroup_);
  Blockly.createSvgElement('rect', {
      'width': 32,
      'height': 32,
      'x': 80,
      'y': 80
    },
    clip);
  var zoomoutSvg = Blockly.createSvgElement('image', {
      'width': Blockly.SPRITE.width,
      'height': Blockly.SPRITE.height,
      'x': 16,
      'y': -12,
      'clip-path': 'url(#blocklyZoomoutClipPath' + rnd + ')'
    },
    this.svgGroup_);
  zoomoutSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    'media/sprites.png');

  Blockly.bindEvent_(zoomresetSvg, 'mousedown', workspace, workspace.zoomReset);
  Blockly.bindEvent_(zoominSvg, 'mousedown', null, function () {
    workspace.zoomCenter(1);
  });
  Blockly.bindEvent_(zoomoutSvg, 'mousedown', null, function () {
    workspace.zoomCenter(-1);
  });

  return this.svgGroup_;
};

// ZoomControl position and size
Blockly.ZoomControls.prototype.position = function () {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    return;
  }
  if (this.workspace_.RTL) {
    this.left_ = this.MARGIN_SIDE_;
  } else {
    this.left_ = metrics.absoluteLeft -
      this.WIDTH_ - this.MARGIN_SIDE_ + 70;
  }
  this.top_ = metrics.viewHeight + metrics.absoluteTop -
    this.HEIGHT_ - this.MARGIN_BOTTOM_ + 5;
  this.svgGroup_.setAttribute('transform',
    'translate(' + this.left_ + ',' + this.top_ + ')');
};

// trashcan position and size
Blockly.Trashcan.prototype.position = function () {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    return;
  }
  if (this.workspace_.RTL) {
    this.left_ = this.MARGIN_SIDE_;
  } else {
    this.left_ = metrics.viewWidth + metrics.absoluteLeft -
      this.WIDTH_ - this.MARGIN_SIDE_ + 10;
  }
  this.top_ = metrics.viewHeight + metrics.absoluteTop -
    (this.BODY_HEIGHT_ + this.LID_HEIGHT_) - this.MARGIN_BOTTOM_ + 10;
  this.svgGroup_.setAttribute('transform',
    'translate(' + this.left_ + ',' + this.top_ + ') scale(.75)');
};

//remove inject css
Blockly.Css.inject = function (hasCss, pathToMedia) {
  if (Blockly.Css.styleSheet_) {
    return;
  }
  var text = '.blocklyDraggable {}\n';
  Blockly.Css.mediaPath_ = pathToMedia.replace(/[\\\/]$/, '');
  text = text.replace(/<<<PATH>>>/g, Blockly.Css.mediaPath_);
  // Inject CSS tag.
  var cssNode = document.createElement('style');
  document.head.appendChild(cssNode);
  var cssTextNode = document.createTextNode(text);
  cssNode.appendChild(cssTextNode);
  Blockly.Css.styleSheet_ = cssNode.sheet;
  Blockly.Css.setCursor(Blockly.Css.Cursor.OPEN);
};

Blockly.JavaScript.depth = 0;

// Load the Code demo's language strings.
document.write('<script src="' + baseUrl + '/msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="' + baseUrl + '/components/blockly/msg/js/' + Code.LANG + '.js"></script>\n');
document.write('<script src="' + baseUrl + '/blocks/msg/' + Code.LANG + '.js"></script>\n');

if (Code.PAGE !== 'index') {
  document.write('<script src="' + baseUrl + '/msg/' + Code.PAGE + '/' + Code.LANG + '.js"></script>\n');
  document.write('<script src="' + baseUrl + '/blocks/' + Code.PAGE.split('/')[0] + '.js"></script>\n');
  document.write('<script src="' + baseUrl + '/generators/' + Code.PAGE.split('/')[0] + '.js"></script>\n');
}

window.addEventListener('load', function () {
  Code.renderPage(function () {
    Code.init();
  });
});
