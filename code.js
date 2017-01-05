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

var storage = new JSONStorage('https://glowing-fire-4998.firebaseio.com/hyproto');

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'en': 'English',
  'zh-hant': '正體中文',
  'zh-hans': '简体中文'
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

Code.getTags = function () {
  var tags = Code.getStringParamFromUrl('tags', '').trim();
  if (!tags.length) {
    tags = '*';
  }
  tags = tags.split(/\s*,\s*/);
  return tags;
};

Code.getDemoPage = function () {
  var area = document.querySelector('#demo-area.show');
  if (area) {
    var select = document.querySelector('#demo-select');
    var link;
    if ((select.value) * 1 < 10) {
      link = '0' + select.value;
    } else {
      link = select.value;
    }
    return 'demo-area-' + link;
  }
  return 'default';
};

Code.getPinDropdown = function () {
  var tags = Code.getTags(),
    mappings = [
      [
        ["2", "2"],
        ["3~", "3"],
        ["4", "4"],
        ["5~", "5"],
        ["6~", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9~", "9"],
        ["10~", "10"],
        ["11~", "11"],
        ["12", "12"],
        ["13", "13"],
        ["14 ( A0 )", "14"],
        ["15 ( A1 )", "15"],
        ["16 ( A2 )", "16"],
        ["17 ( A3 )", "17"],
        ["18 ( A4 )", "18"],
        ["19 ( A5 )", "19"]
      ],
      [
        ["12~", "12"],
        ["13~", "13"],
        ["14~", "14"],
        ["15~", "15"],
        ["16~", "16"],
        ["AD", "17"],
        ["0~", "0"],
        ["TX", "1"],
        ["2~", "2"],
        ["RX", "3"],
        ["4~", "4"],
        ["5~", "5"]
      ],
      [
        ["0", "0"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"],
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"],
        ["12", "12"],
        ["13", "13"],
        ["14", "14"],
        ["15", "15"],
        ["16", "16"],
        ["17", "17"],
        ["18", "18"],
        ["19", "19"]
      ]
    ];

  if (tags.length === 1 && tags[0] !== '*') {
    if (tags[0] === 'smart') {
      return mappings[1];
    }
    return mappings[0];
  }
  return mappings[2];
};

Code.loadDoc = function (href, callback) {
  var link = document.createElement('link'),
    tag = document.getElementsByTagName('script')[0];
  link.rel = 'import';
  link.href = href;
  if (typeof callback === 'function') {
    link.onload = function () {
      callback(link.import);
    };
    tag.parentNode.insertBefore(link, tag);
  } else {
    return new Promise(function (resolve) {
      Code.loadDoc(href, resolve);
    });
  }
};

Code.loadJs = function (src, callback) {
  var js = document.createElement('script'),
    tag = document.getElementsByTagName('script')[0];
  js.async = 1;
  js.src = src;
  if (typeof callback === 'function') {
    js.onload = function () {
      callback(js);
    };
    tag.parentNode.insertBefore(js, tag);
  } else {
    return new Promise(function (resolve) {
      Code.loadJs(src, resolve);
    });
  }
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
  if ('BlocklyStorage' in window && BlocklyStorage.isLinkUrl()) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
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
  if (el) {
    el.addEventListener('click', func, true);
    el.addEventListener('touchend', func, true);
  }
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
  Code.loadJs(baseUrl + '/prettify.js');
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
    boardReady({
      device: v,
      multi: true
    }, true, function (board) {
      device.icon.setAttribute('class', 'check board-online icon-power');
      board.once(webduino.BoardEvent.DISCONNECT, function (e) {
        device.icon.setAttribute('class', 'check board-error icon-power');
      });
    });
    device.icon.setAttribute('class', 'check board-error icon-power');
  };

  device.inputArea.oninput = function () {
    localStorage.boardState = this.value;
    if (this.value.length > 3 && this.value.length <= 8 && this.value.indexOf('.') === -1) {
      device.check(this.value);
    } else {
      device.icon.setAttribute('class', 'check icon-power');
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

};

Code.copyCode = function (copy) {
  copy = {};
  copy.jsTab = document.getElementById('tab_javascript');
  copy.copyBtn = document.getElementById('copyCode');

  copy.clipboard = new Clipboard('#copyCode');

  copy.clipboard.on('success', function (e) {
    copy.copyBtn.setAttribute('data-tooltip', 'Copied!!!');
  });
  copy.copyBtn.addEventListener('mouseleave', function () {
    copy.copyBtn.setAttribute('data-tooltip', 'Copy to clipboard');
  });

  copy.jsTab.addEventListener('click', function () {
    copy.copyBtn.style.display = 'table-cell';
  });

  document.getElementById('tab_blocks').addEventListener('click', function () {
    copy.copyBtn.style.display = 'none';
  });
};

Code.bindHotkey = function (document) {
  Blockly.bindEvent_(document, 'keydown', null, function (e) {
    switch (Code.getHotKey(e)) {
    case Code.HOTKEY.EXEC:
      Code.runJS();
      break;

    default:
      break;
    }
  });
};

Code.getHotKey = function (e) {
  // Ctrl/Cmd + E
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 69) {
    return Code.HOTKEY.EXEC;
  }

  return Code.HOTKEY.UNKNOWN;
};

Code.loadDemoArea = function () {
  var area = document.getElementById('demo-area');
  var btn = document.getElementById('demoButton');
  var select = document.getElementById('demo-select');
  var close = document.querySelector('.close-btn');
  var contentHeight = document.getElementById('content_blocks').offsetHeight;
  var resizeBar = document.getElementById('demo-resize-bar');

  area.style.height = (contentHeight - 110) + 'px';
  area.className = area.className.replace("show", "");

  if (localStorage.demoAreaWidth) {
    area.style.width = localStorage.demoAreaWidth;
  }

  if (localStorage.demoArea == 'open') {
    area.className = area.className + "show";
    btn.className = "notext toolMenu opened";
  }

  if (!localStorage.demoAreaSelect) {
    localStorage.demoAreaSelect = 1;
  }

  select.value = localStorage.demoAreaSelect;
  Code.reloadSandbox();

  window.addEventListener('resize', function () {
    contentHeight = document.getElementById('content_blocks').offsetHeight;
    area.style.height = (contentHeight - 110) + 'px';
  });

  resizeBar.onmousedown = function (e) {
    area.style.opacity = '0.4';
    var frame = document.getElementById('demo-frame');
    frame.style.pointerEvents = 'none';
    var ox = e.pageX;
    var dw = area.offsetWidth;
    area.className += " resize";

    document.onmousemove = function (event) {
      var rx = event.pageX;
      area.style.width = dw - rx + ox - 20 + 'px';
      localStorage.demoAreaWidth = area.style.width;
    };
  };

  document.onmouseup = function () {
    area.style.opacity = '1';
    var frame = document.getElementById('demo-frame');
    frame.style.pointerEvents = 'auto';
    area.className = area.className.replace("resize", "");
    document.onmousemove = null;
  };

  btn.onclick = function () {
    if (localStorage.demoArea == 'open') {
      area.className = area.className.replace("show", "");
      localStorage.demoArea = 'close';
      btn.className = "notext toolMenu";
    } else {
      area.className += " show";
      localStorage.demoArea = 'open';
      btn.className = "notext toolMenu opened";
    }
    Code.reloadSandbox();
  };

  close.onclick = function () {
    area.className = area.className.replace("show", "");
    localStorage.demoArea = 'close';
    btn.className = "notext toolMenu";
  };

  select.onchange = function () {
    ga('send', 'event', 'Webduino-blockly', 'demo select', this.value);
    localStorage.demoAreaSelect = this.value;
    Code.reloadSandbox();
  };
};

Code.loadSample = function () {
  var sampleBtn = document.getElementById('sampleButton'),
    sampleMenu = document.getElementById('smaple-menu'),
    sampleMenuOpen = false,
    sampleBtnOver = false,
    sampleTitle = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="board_ready"',
    sample_x = 10,
    sample_y = 10;

  sampleBtn.onmouseover = function () {
    sampleBtnOver = true;
  };

  sampleBtn.onmouseleave = function () {
    sampleBtnOver = false;
  };

  sampleBtn.onclick = function () {
    if (!sampleMenuOpen) {
      sampleMenuOpen = true;
      sampleMenu.style.display = 'block';
      sampleBtn.className = "notext toolMenu opened";
      sampleMenu.focus();
    } else {
      sampleMenuOpen = false;
      sampleMenu.style.display = 'none';
      sampleBtn.style.color = '#000';
      sampleBtn.className = "notext toolMenu";
    }
  };

  sampleMenu.onblur = function () {
    if (!sampleBtnOver) {
      sampleMenuOpen = false;
      sampleMenu.style.display = 'none';
      sampleBtn.style.color = '#000';
      sampleBtn.className = "notext toolMenu";
    }
  };

  sampleMenu.onclick = function (e) {

    var ele = e.target,
      chap = ele.getAttribute('data-value'),
      className = ele.className;

    var st = function (x, y) {
      return sampleTitle + ' x="' + sample_x + '" y="' + sample_y + '" ';
    }

    if (chap && window.confirm(Blockly.Msg.SAMPLE_COMFIRM_MSG)) {
      Code.workspace.clear();
      sample_x = 10;
      sample_y = 10;
      var xmlText = st(sample_x, sample_y) + smaples(chap),
        xmlDom = Blockly.Xml.textToDom(xmlText);
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
      sampleBtn.click();
    }

    if (className == 'icon-plus') {
      sample_x = sample_x + 30;
      sample_y = sample_y + 30;
      var parentValue = ele.parentElement.getAttribute('data-value'),
        xmlText = st(sample_x, sample_y) + smaples(parentValue),
        xmlDom = Blockly.Xml.textToDom(xmlText);
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }

  };
};

Code.loadSimulator = function () {
  var area = document.getElementById('simulator-area');
  var frame = document.getElementById('simulator-frame');
  var btn = document.getElementById('simulatorButton');
  var closeBtn = document.querySelector('#simulator-area .close-btn');
  var resizeBar = document.getElementById('simulator-resize-bar');
  var updateHeight = function () {
    var contentHeight = document.getElementById('content_blocks').offsetHeight;
    area.style.height = (contentHeight - 110) + 'px';
  };
  var frameReady = function () {
    if (storage.config) {
      frame.contentWindow.blockly.config(storage.config);
    }

    if (storage.opened) {
      area.classList.add('show');
      btn.classList.add('opened');
    }
  };
  var storage = {};

  if (localStorage.simulator) {
    try {
      storage = JSON.parse(localStorage.simulator);
    } catch (e) {
      storage = {};
    }
  }

  if (storage.width) {
    area.style.width = storage.width;
  }

  if (frame.contentWindow.blockly) {
    frameReady();
  } else {
    frame.contentWindow.addEventListener('load', frameReady);
  }

  updateHeight();

  window.addEventListener('resize', updateHeight);

  window.addEventListener('unload', function () {
    storage.config = frame.contentWindow.blockly.config();
    storage.opened = area.classList.contains('show');
    storage.width = area.style.width;
    localStorage.simulator = JSON.stringify(storage);
  });
  
  Code.bindClick('runButton', function () {
    frame.contentWindow.blockly.toggleRunning();
  });

  Code.bindClick(closeBtn, function () {
    area.classList.remove('show');
    btn.classList.remove('opened');
  });

  resizeBar.addEventListener('mousedown', function (e) {
    var cover = document.createElement('div');
    var ox = e.pageX;
    var dw = area.offsetWidth;

    area.style.opacity = '0.4';
    frame.style.pointerEvents = 'none';
    area.classList.add('resize');

    cover.classList.add('simulator-cover');
    document.body.appendChild(cover);

    var move = function (evt) {
      var rx = evt.pageX;
      area.style.width = dw - rx + ox - 20 + 'px';
    }; 

    var up = function () {
      area.style.opacity = '1';
      frame.style.pointerEvents = 'auto';
      area.classList.remove('resize');
      cover.removeEventListener('mousemove', move);
      cover.removeEventListener('mouseup', up);
      cover.remove();
    };

    cover.addEventListener('mousemove', move);
    cover.addEventListener('mouseup', up);
  });

};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

Code.PAGE = Code.getPage();

Code.running = false;

Code.sandboxLoaded = true;

Code.lastRun = 0;

Code.HOTKEY = {
  EXEC: 0,
  UNKNOWN: -1
};

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
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
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

Code.loadGa = function () {
  var ga = function () {
    (window.ga.q = window.ga.q || []).push(arguments);
  };
  ga.l = Date.now();
  window.GoogleAnalyticsObject = 'ga';
  window.ga = ga;
  ga('create', 'UA-62202920-2', 'auto');
  ga('send', 'pageview');
  Code.loadJs('https://www.google-analytics.com/analytics.js');
};

Code.ga = function (blockArea, toolManu, i) {
  blockArea = document.querySelector('.blocklySvg');
  toolManu = document.querySelectorAll('.toolMenu');
  blockArea.addEventListener('mouseup', function () {
    ga('send', 'event', 'Webduino-blockly', 'editing');
  });
  for (i = 0; i < toolManu.length; i++) {
    toolManu[i].addEventListener('click', function () {
      var thisID = this.getAttribute('id');
      ga('send', 'event', 'Webduino-blockly', 'menu click', thisID);
    });
  }
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

Code.filterXML = function (toolboxXML, property, values) {
  var categories = slice.call(toolboxXML.querySelectorAll('category'));
  categories.forEach(function (cate) {
    if (cate.getAttribute(property) !== null) {
      filterTag(cate);
    }
  });

  var blocks = slice.call(toolboxXML.querySelectorAll('block'));
  blocks.forEach(function (block) {
    if (block.getAttribute(property) !== null) {
      filterTag(block);
    }
  });

  function filterTag(node) {
    var vals = node.getAttribute(property).trim().split(/\s*,\s*/);
    vals = vals.filter(function (tag) {
      return values.indexOf('*') !== -1 || values.indexOf(tag) !== -1;
    });
    if (!vals.length) {
      Code.pruneNode(node);
    }
  }

  return toolboxXML;
};

Code.pruneNode = function (node) {
  if (node && node.parentElement) {
    var parent = node.parentElement;
    parent.removeChild(node);
    if (!parent.children.length) {
      Code.pruneNode(parent);
    }
  }
};

Code.getToolBox = function (toolboxXML) {
  var categories = slice.call(toolboxXML.querySelectorAll('category')).map(function (e) {
    return e.id;
  });
  for (var i = 0, cat; cat = categories[i]; i++) {
    toolboxXML.querySelector('#' + cat).setAttribute('name', MSG[cat]);
  }
  return new XMLSerializer().serializeToString(toolboxXML);
};

Code.getUrlParts = function () {
  return (location.protocol + '//' + location.host + location.pathname).split('/');
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function (toolbox) {
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
    //  document.getElementById('tab_blocks').style.minWidth =
    //      (Code.workspace.toolbox_.width - 38) + 'px';
    //      // Account for the 19 pixel margin and on each side.
    //}
  };
  window.addEventListener('resize', onresize, false);

  Code.workspace = Blockly.inject('content_blocks', {
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    media: baseUrl + '/components/blockly-src/media/',
    rtl: rtl,
    toolbox: toolbox,
    zoom: {
      controls: true,
      wheel: false
    }
  });

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  Code.loadBlocks('');

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  Code.bindClick('qrButton', function () {
    var img = document.querySelector('#qrImg'),
      ctx = Code.getContext();

    launcher.loadTemplate('./templates/' + ctx.tpl + '.html', function (data) {
      if (ctx.jsPreprocessor === 'babel') {
        data.js = Code.transform(ctx.data.js);
      } else {
        data.js = ctx.data.js;
      }

      launcher.liveview(storage, data, function (url) {
        url = window.encodeURIComponent(url);
        if (img === null) {
          img = document.createElement('img');
          img.id = 'qrImg';
          img.src = 'http://chart.apis.google.com/chart?cht=qr&chl=' + url + '&chs=300x300';
          document.querySelector('#openModal').children[0].appendChild(img);
        } else {
          img.src = 'http://chart.apis.google.com/chart?cht=qr&chl=' + url + '&chs=300x300';
        }
      });
    });
  });

  Code.bindClick('linkToBin', function () {
    var ctx = Code.getContext(),
      urls = Code.getUrlParts();
    urls.pop();
    ctx.lang = Code.LANG;
    localStorage.setItem(urls.join('/') + '/launcher.html', JSON.stringify(ctx));
  });

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

  Code.loadSimulator();

  Code.bindClick('simulatorButton', function () {
    var area = document.getElementById('simulator-area');
    var btn = document.getElementById('simulatorButton');
    area.classList.toggle('show');
    btn.classList.toggle('opened');
  });

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
};

Code.initHandlebars = function () {
  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });
};

Code.renderPage = function (templateStr) {
  var head = document.head,
    body = document.body,
    template = Handlebars.compile(templateStr);

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
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function () {
  var now = Date.now();

  if (!Code.sandboxLoaded) {
    return;
  }

  if (navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i)) {
    if (now - Code.lastRun < 1000) {
      return;
    }
    Code.lastRun = now;
  }

  Code.toggleRunning();
  Code.reloadSandbox();
};

Code.toggleRunning = function () {
  var runBtn = document.getElementById('runButton');
  var select = document.getElementById('demo-select');
  var demoBtn = document.getElementById('demoButton');
  var demoStopBtn = document.querySelector('.close-btn');

  if (!Code.running) {
    runBtn.style.backgroundColor = "#0a5";
    runBtn.style.borderColor = "#0a5";
    document.querySelector('#runButton i').setAttribute('class', 'icon-stop2');
    document.querySelector('#runButton div').innerHTML = MSG['stopRunTooltip'];
    select.disabled = true;
    demoBtn.disabled = true;
    demoBtn.className = "notext toolMenu running";
    demoBtn.style.pointerEvents = 'none';
    demoStopBtn.style.pointerEvents = 'none';
    demoStopBtn.style.opacity = 0.2;
  } else {
    runBtn.style.backgroundColor = "#dd4b39";
    runBtn.style.borderColor = "#dd4b39";
    document.querySelector('#runButton i').setAttribute('class', 'icon-play3');
    document.querySelector('#runButton div').innerHTML = MSG['runTooltip'];
    select.disabled = false;
    demoBtn.disabled = false;
    if (localStorage.demoArea == 'open') {
      demoBtn.className = "notext toolMenu opened";
    } else {
      demoBtn.className = "notext toolMenu";
    }
    demoBtn.style.pointerEvents = 'auto';
    demoStopBtn.style.pointerEvents = 'auto';
    demoStopBtn.style.opacity = 0.5;
  }

  Code.running = !Code.running;
};

Code.reloadSandbox = function () {
  var container = document.querySelector('.demo-area-content');
  var ctx = Code.getContext();
  Code.sandboxLoaded = false;

  launcher.loadTemplate('./templates/' + ctx.tpl + '.html', function (data) {

    var $body = $('<div/>', {
      html: data.body
    });
    // find if element has translation
    $body.find('[data-translation]').each(function () {
      // Translate string with locale file in /msg
      $(this).html(window.MSG[$(this).data('translation')]).removeAttr('data-translation');
    });
    // covert element to string
    data.body = $body.clone().wrap('<div/>').parent().html();

    if (Code.running) {
      if (ctx.jsPreprocessor === 'babel') {
        data.js = Code.transform(ctx.data.js);
      } else {
        data.js = ctx.data.js;
      }
    }

    var frame = container.querySelector('#demo-frame');
    if (frame) {
      frame.contentWindow.addEventListener('unload', function () {
        createIframe();
      }, false);

      var event = new UIEvent('beforeunload');
      frame.contentWindow.dispatchEvent(event);

      setTimeout(function () {
        Code.unhookEvents(window, frame);
        container.removeChild(frame);
        frame = null;
      }, 50);
    } else {
      createIframe();
    }

    function createIframe() {
      frame = document.createElement('iframe');
      frame.id = 'demo-frame';
      frame.style.display = 'block';
      container.appendChild(frame);
      Code.tabClick('blocks');
      frame.addEventListener('load', function () {
        Code.sandboxLoaded = true;
      });
      launcher.sandbox(frame, data);
      Code.bindHotkey(frame.contentWindow.document);

      if (Code.running) {
        Code.hookEvents(window, frame);
      }
    }
  });
};

Code.hookEvents = function (window, frame) {
  window.keyDispatcher = function (e) {
    if (Code.getHotKey(e) === Code.HOTKEY.EXEC) {
      return;
    }

    var doc = frame.contentWindow.document,
      event = doc.createEvent('Event');

    event.initEvent(e.type, true, true);
    event.key = e.key;
    event.keyCode = e.keyCode;
    doc.body && doc.body.dispatchEvent(event);
  };

  window.msgDispatcher = function (e) {
    var msg = e.data;

    if (msg.jsonrpc && msg.result) {
      frame.contentWindow.postMessage(msg, window.location.origin);
    }
  };

  frame.msgDispatcher = function (e) {
    var msg = e.data;

    if (msg.jsonrpc && msg.method) {
      window.postMessage(msg, window.location.origin);
    }
  };

  window.addEventListener('keydown', window.keyDispatcher, false);
  window.addEventListener('keyup', window.keyDispatcher, false);
  window.addEventListener('message', window.msgDispatcher, false);
  frame.contentWindow.addEventListener('message', frame.msgDispatcher, false);
};

Code.unhookEvents = function (window, frame) {
  if (frame.msgDispatcher) {
    frame.contentWindow.removeEventListener('message', frame.msgDispatcher, false);
    delete frame.msgDispatcher;
  }
  if (window.msgDispatcher) {
    window.removeEventListener('message', window.msgDispatcher, false);
    delete window.msgDispatcher;
  }
  if (window.keyDispatcher) {
    window.removeEventListener('keyup', window.keyDispatcher, false);
    window.removeEventListener('keydown', window.keyDispatcher, false);
    delete window.keyDispatcher;
  }
};

Code.getContext = function () {
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace),
    babelize = code.indexOf('async function') !== -1,
    page = Code.PAGE;

  return {
    tpl: page === 'index' ? Code.getDemoPage() : page,
    modes: 'html,css,js,output',
    data: {
      js: code
    },
    jsPreprocessor: babelize ? 'babel' : ''
  };
};

Code.transform = function (code) {
  try {
    return Babel.transform(code, {
      presets: ['es2015', 'stage-3'],
      plugins: ['transform-strict-mode']
    }).code;
  } catch (e) {
    alert(e);
  }
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function () {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 ||
    window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

Code.debug = function () {
  var space = '';
  for (var i = 0; i < Blockly.JavaScript.depth; i++) {
    space += '  ';
  }
  console.log.apply(console, [space].concat(Array.prototype.slice.apply(arguments)));
};

Code.exportImage = function () {
  Code.workspace.zoomReset(document.createEvent('MouseEvents'));
  saveSvgAsPng(Code.workspace.getCanvas(), 'webduino-blocks.png');
};

Blockly.JavaScript['procedures_defnoreturn'] = function (block) {
  // Define a procedure with a return value.
  var funcName = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    branch = Blockly.JavaScript.prefixLines(
      Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
  }
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
      '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
    Blockly.JavaScript.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x],
      Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
    branch + returnValue + '}';
  code = Blockly.JavaScript.scrub_(block, code);
  if (code.indexOf('await ') !== -1) {
    code = 'async ' + code;
  }
  Blockly.JavaScript.definitions_[funcName] = code;
  return null;
};

Blockly.JavaScript['_procedures_callreturn'] = Blockly.JavaScript['procedures_callreturn'];

Blockly.JavaScript['procedures_callreturn'] = function (block) {
  // Call a procedure with a return value.
  var funcName = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var codes = Blockly.JavaScript['_procedures_callreturn'].call(Blockly.JavaScript, block);
  var defs = Blockly.JavaScript.definitions_;
  if (defs[funcName] && defs[funcName].indexOf('async ') === 0) {
    return ['await ' + codes[0], codes[1]];
  }
  return codes;
};

Blockly.JavaScript['_procedures_callnoreturn'] = Blockly.JavaScript['procedures_callnoreturn'];

Blockly.JavaScript['procedures_callnoreturn'] = function (block) {
  // Call a procedure with no return value.
  var funcName = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var code = Blockly.JavaScript['_procedures_callnoreturn'].call(Blockly.JavaScript, block);
  var defs = Blockly.JavaScript.definitions_;
  if (defs[funcName] && defs[funcName].indexOf('async ') === 0) {
    return 'await ' + code;
  }
  return code;
};

Blockly.JavaScript['_workspaceToCode'] = Blockly.JavaScript['workspaceToCode'];

Blockly.JavaScript['workspaceToCode'] = function (workspace) {
  var code = Blockly.JavaScript['_workspaceToCode'].call(Blockly.JavaScript, workspace);
  if (code.indexOf('await ') === -1) {
    code = code.replace(new RegExp('async function', 'g'), 'function');
  } else {
    code = '(async function () {\n\n' + code + '\n}());';
  }
  return code;
};

Blockly.JavaScript.scrub_ = function (block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    // var comment = block.getCommentText();
    // if (comment) {
    //   commentCode += Blockly.JavaScript.prefixLines(comment, '// ') + '\n';
    // }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          // var comment = Blockly.JavaScript.allNestedComments(childBlock);
          // if (comment) {
          //   commentCode += Blockly.JavaScript.prefixLines(comment, '// ');
          // }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.JavaScript.blockToCode(nextBlock);
  return commentCode + code + nextCode;
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

Blockly.WorkspaceSvg.prototype.showContextMenu_ = function (e) {
  if (this.options.readOnly || this.isFlyout) {
    return;
  }
  var menuOptions = [];
  var topBlocks = this.getTopBlocks(true);
  var eventGroup = Blockly.genUid();

  // Options to undo/redo previous action.
  var undoOption = {};
  undoOption.text = Blockly.Msg.UNDO;
  undoOption.enabled = this.undoStack_.length > 0;
  undoOption.callback = this.undo.bind(this, false);
  menuOptions.push(undoOption);
  var redoOption = {};
  redoOption.text = Blockly.Msg.REDO;
  redoOption.enabled = this.redoStack_.length > 0;
  redoOption.callback = this.undo.bind(this, true);
  menuOptions.push(redoOption);

  // Option to clean up blocks.
  if (this.scrollbar) {
    var cleanOption = {};
    cleanOption.text = Blockly.Msg.CLEAN_UP;
    cleanOption.enabled = topBlocks.length > 1;
    cleanOption.callback = this.cleanUp_.bind(this);
    menuOptions.push(cleanOption);
  }

  // Add download img option
  var imgOption = {};
  imgOption.text = MSG.exportImage;
  imgOption.enabled = topBlocks.length > 0;
  imgOption.callback = Code.exportImage.bind(Code);
  menuOptions.push(imgOption);

  // Add a little animation to collapsing and expanding.
  var DELAY = 10;
  if (this.options.collapse) {
    var hasCollapsedBlocks = false;
    var hasExpandedBlocks = false;
    for (var i = 0; i < topBlocks.length; i++) {
      var block = topBlocks[i];
      while (block) {
        if (block.isCollapsed()) {
          hasCollapsedBlocks = true;
        } else {
          hasExpandedBlocks = true;
        }
        block = block.getNextBlock();
      }
    }

    /*
     * Option to collapse or expand top blocks
     * @param {boolean} shouldCollapse Whether a block should collapse.
     * @private
     */
    var toggleOption = function (shouldCollapse) {
      var ms = 0;
      for (var i = 0; i < topBlocks.length; i++) {
        var block = topBlocks[i];
        while (block) {
          setTimeout(block.setCollapsed.bind(block, shouldCollapse), ms);
          block = block.getNextBlock();
          ms += DELAY;
        }
      }
    };

    // Option to collapse top blocks.
    var collapseOption = {
      enabled: hasExpandedBlocks
    };
    collapseOption.text = Blockly.Msg.COLLAPSE_ALL;
    collapseOption.callback = function () {
      toggleOption(true);
    };
    menuOptions.push(collapseOption);

    // Option to expand top blocks.
    var expandOption = {
      enabled: hasCollapsedBlocks
    };
    expandOption.text = Blockly.Msg.EXPAND_ALL;
    expandOption.callback = function () {
      toggleOption(false);
    };
    menuOptions.push(expandOption);
  }

  // Option to delete all blocks.
  // Count the number of blocks that are deletable.
  var deleteList = [];

  function addDeletableBlocks(block) {
    if (block.isDeletable()) {
      deleteList = deleteList.concat(block.getDescendants());
    } else {
      var children = block.getChildren();
      for (var i = 0; i < children.length; i++) {
        addDeletableBlocks(children[i]);
      }
    }
  }
  for (var i = 0; i < topBlocks.length; i++) {
    addDeletableBlocks(topBlocks[i]);
  }
  var deleteOption = {
    text: deleteList.length == 1 ? Blockly.Msg.DELETE_BLOCK : Blockly.Msg.DELETE_X_BLOCKS.replace('%1', String(deleteList.length)),
    enabled: deleteList.length > 0,
    callback: function () {
      if (deleteList.length < 2 ||
        window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1',
          String(deleteList.length)))) {
        deleteNext();
      }
    }
  };

  function deleteNext() {
    Blockly.Events.setGroup(eventGroup);
    var block = deleteList.shift();
    if (block) {
      if (block.workspace) {
        block.dispose(false, true);
        setTimeout(deleteNext, DELAY);
      } else {
        deleteNext();
      }
    }
    Blockly.Events.setGroup(false);
  }
  menuOptions.push(deleteOption);

  Blockly.ContextMenu.show(e, menuOptions, this.RTL);
};

Blockly.WorkspaceSvg.prototype.preloadAudio_ = function () {};

Blockly.JavaScript.depth = 0;

// Load the Code demo's language strings.
document.write('<script src="' + baseUrl + '/msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="' + baseUrl + '/components/blockly-src/msg/js/' + Code.LANG + '.js"></script>\n');
document.write('<script src="' + baseUrl + '/blocks/msg/' + Code.LANG + '.js"></script>\n');

if (Code.PAGE !== 'index') {
  document.write('<script src="' + baseUrl + '/msg/' + Code.PAGE + '/' + Code.LANG + '.js"></script>\n');
  document.write('<script src="' + baseUrl + '/blocks/' + Code.PAGE.split('/')[0] + '.js"></script>\n');
  document.write('<script src="' + baseUrl + '/generators/' + Code.PAGE.split('/')[0] + '.js"></script>\n');
}

Promise.all([
  Code.loadDoc(baseUrl + '/views/' + Code.PAGE.split('/')[0] + '.handlebars'),
  Code.loadDoc(baseUrl + '/toolbox/' + Code.PAGE + '.xml'),
  new Promise(function (resolve) {
    window.addEventListener('load', function () {
      resolve();
    }, false);
  })
]).then(function (values) {
  Code.initHandlebars();
  Code.renderPage(values[0].body.innerHTML);
  Code.init(Code.getToolBox(Code.filterXML(values[1].body.firstChild, 'tags', Code.getTags())));
  Code.loadDemoArea();
  Code.loadGa();
  Code.ga();
  Code.importPrettify();
  Code.bindHotkey(window.document);
  Promise.all([
    Code.loadJs(baseUrl + '/lib/webduino-base.min.js'),
    Code.loadJs(baseUrl + '/webduino-blockly.js')
  ]).then(function () {
    Code.checkDeviceOnline();
  });
  Code.loadJs(baseUrl + '/webduino-samples.js', function () {
    Code.loadSample();
  });
  Code.loadJs(baseUrl + '/lib/clipboard.js', function () {
    Code.copyCode();
  });
  Code.loadJs(baseUrl + '/lib/babel.min.js');
  Code.loadJs(baseUrl + '/lib/saveSvgAsPng.js');
});
