
'use strict';

// Create a namespace.
var BlocklySimStorage = {};

BlocklySimStorage.STORAGE_URL = 'https://glowing-fire-4998.firebaseio.com';

BlocklySimStorage.LOCALSTORAGE_KEY = 'simulator';

BlocklySimStorage.isLinkUrl = function () {
  var op = ['openModal', 'close'];
  return window.location.hash.length > 1 && op.indexOf(window.location.hash.substring(1)) === -1;
};

/**
 * Backup simulator config to localStorage.
 * @param  {Element} area  - Dom Element
 * @param  {Element} frame - Dom Element
 * @private
 */
BlocklySimStorage.backupBlocks_ = function (area, frame) {
  if ('localStorage' in window) {
    var storage = BlocklySimStorage.getConfig_(area, frame);
    window.localStorage.setItem(BlocklySimStorage.LOCALSTORAGE_KEY, JSON.stringify(storage));
  }
};

/**
 * Get simulator config
 * @param  {element} area      - DOM element
 * @param  {element} frame     - DOM Element
 * @return {object} storage    - Simulator config
 * @private
 */
BlocklySimStorage.getConfig_ = function (area, frame) {
  var storage = {};
  storage.config = frame.contentWindow.blockly.getConfig();
  storage.opened = area.classList.contains('show');
  storage.isFull = area.classList.contains('full');
  storage.width = area.dataset.width;
  storage.height = area.dataset.height;
  return storage;
};

/**
 * Save simulator config to localStorage when window unloaded.
 * @param  {element} area      - DOM element
 * @param  {element} frame     - DOM Element
 */
BlocklySimStorage.backupOnUnload = function (area, frame) {
  window.addEventListener('unload',
    function () {
      if (!BlocklySimStorage.isLinkUrl()) {
        BlocklySimStorage.backupBlocks_(area, frame);
      }
    }, false);
};

/**
 * Set config to frame
 * @param  {element} area      - DOM element
 * @param  {element} frame     - DOM Element
 * @param  {element} toggleBtn - DOM element
 * @param  {object} storage    - Simulator config
 * @param  {function} cb       - callback function
 * @private
 */
BlocklySimStorage.setConfig_ = function (area, frame, toggleBtn, storage, cb) {

  cb = cb || function() {};

  if (!frame.contentWindow.blockly) {
    BlocklySimStorage.loadHandler_ = function () {
      frame.contentWindow.removeEventListener('load', BlocklySimStorage.loadHandler_);
      BlocklySimStorage.loadHandler_ = null;
      BlocklySimStorage.setConfig_(area, frame, toggleBtn, storage, cb);
    };
    frame.contentWindow.addEventListener('load', BlocklySimStorage.loadHandler_);
    return;
  }

  var api = frame.contentWindow.blockly;

  // 寬、高值儲存在元素屬性上，全畫面放大／縮小的依據
  storage.width && (area.dataset.width = storage.width);
  storage.height && (area.dataset.height = storage.height);

  // 依 blockly 目前的語系
  api.lang(Code.getLang());

  // 之前存檔的回復
  // 這是該方法最後的結束點
  if (storage.config) {
    api.setConfig(storage.config, cb);
  } else {
    setTimeout(cb, 0);
  }

  if (storage.isFull) {
    area.classList.add('full');
  } else {
    storage.width && (area.style.width = storage.width);
    storage.height && (area.style.height = storage.height);
  }

  if (storage.opened) {
    area.classList.add('show');
    toggleBtn.classList.add('opened');
  }
};

/**
 * Restore simulator config from localStorage
 * @param  {Element} area      - DOM Element
 * @param  {Element} frame     - DOM Element
 * @param  {Element} toggleBtn - DOM Element
 */
BlocklySimStorage.restoreBlocks = function (area, frame, toggleBtn) {
  if ('localStorage' in window && window.localStorage[BlocklySimStorage.LOCALSTORAGE_KEY]) {
    var storage = JSON.parse(window.localStorage[BlocklySimStorage.LOCALSTORAGE_KEY]);
    BlocklySimStorage.setConfig_(area, frame, toggleBtn, storage);
  }
};

/**
 * Save simulator config to database
 * @param  {Element} area      - DOM element
 * @param  {element} frame     - DOM Element
 * @param  {element} toggleBtn - DOM element
 */
BlocklySimStorage.link = function (area, frame, toggleBtn) {
  window.addEventListener('hashchange', hashChange, false);

  function hashChange() {
    window.removeEventListener('hashchange', hashChange);

    var key = window.location.hash.substring(1);
    var data = JSON.stringify(BlocklySimStorage.getConfig_(area, frame));
    var workInfo = {
      area: area,
      frame: frame,
      toggleBtn: toggleBtn,
      key: key
    };
    BlocklySimStorage.makeRequest_('/blockly', 'simulator', data, workInfo);
  }
};

/**
 * Retrieve Simulator text from database using given key.
 * @param  {string} key        - Key to Simulator
 * @param  {Element} area      - DOM element
 * @param  {element} frame     - DOM Element
 * @param  {element} toggleBtn - DOM element
 */
BlocklySimStorage.retrieveXml = function (key, area, frame, toggleBtn) {
  var workInfo = {
    area: area,
    frame: frame,
    toggleBtn: toggleBtn
  };
  BlocklySimStorage.makeRequest_('/blockly', 'key', key, workInfo);
};

/**
 * Global reference to current AJAX request.
 * @type {XMLHttpRequest}
 * @private
 */
BlocklySimStorage.httpRequest_ = null;

/**
 * Fire a new AJAX request.
 * @param {string} url      - URL to fetch.
 * @param {string} name     - Name of parameter.
 * @param {string} content  - Content of parameter.
 * @param {object} workInfo - {area, frame, toggleBtn}
 * @private
 */
BlocklySimStorage.makeRequest_ = function (url, name, content, workInfo) {
  BlocklySimStorage.httpRequest_ = new XMLHttpRequest();
  BlocklySimStorage.httpRequest_.name = name;
  BlocklySimStorage.httpRequest_.onreadystatechange =
    BlocklySimStorage.handleRequest_;
  switch (name) {
  case 'simulator':
    BlocklySimStorage.httpRequest_.open('PATCH',
      BlocklySimStorage.STORAGE_URL + url + '/' + workInfo.key + '.json');
    BlocklySimStorage.httpRequest_.setRequestHeader('Content-Type',
      'application/x-www-form-urlencoded');
    BlocklySimStorage.httpRequest_.send(JSON.stringify({
      simulator: content
    }));
    break;
  case 'key':
    BlocklySimStorage.httpRequest_.open('GET',
      BlocklySimStorage.STORAGE_URL + url + '/' + content + '.json');
    BlocklySimStorage.httpRequest_.send();
    break;
  }
  BlocklySimStorage.httpRequest_.workInfo = workInfo;
};

/**
 * Callback function for AJAX call.
 * @private
 */
BlocklySimStorage.handleRequest_ = function () {
  if (BlocklySimStorage.httpRequest_.readyState == 4) {
    if (BlocklySimStorage.httpRequest_.status != 200) {
      BlocklySimStorage.alert(BlocklySimStorage.HTTPREQUEST_ERROR + '\n' +
        'httpRequest_.status: ' + BlocklySimStorage.httpRequest_.status);
    } else {
      var data = BlocklySimStorage.httpRequest_.responseText.trim();
      var workInfo = BlocklySimStorage.httpRequest_.workInfo;
      var area = workInfo.area;
      var frame = workInfo.frame;
      var toggleBtn = workInfo.toggleBtn;
      var storage;

      if (BlocklySimStorage.httpRequest_.name == 'key') {
        if (!data.length) return;

        data = JSON.parse(data).simulator;
        
        // 相容舊的情況
        if (data) {
          storage = JSON.parse(data);
          BlocklySimStorage.setConfig_(area, frame, toggleBtn, storage, function () {
            BlocklySimStorage.monitorChanges_(workInfo);
          });
        }
      }
    }

    BlocklySimStorage.httpRequest_ = null;
  }
};

/**
 * Start monitoring the iframe.  If a change is made that changes the iframe,
 * clear the key from the URL.  Stop monitoring the iframe once such a
 * change is detected.
 * @param {object} workInfo - {area, frame, toggleBtn}
 * @private
 */
BlocklySimStorage.monitorChanges_ = function (workInfo) {
  var frame = workInfo.frame;
  var win = frame.contentWindow;
  var MutationObserver = win.MutationObserver
    || win.WebKitMutationObserver
    || win.MozMutationObserver;

  var observeMutationSupport = !!MutationObserver;

  if (!observeMutationSupport) {
    console.warn('No support MutationObserver!');
    return;
  }

  function change() {
    observer.disconnect();
    observer = null;
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }

  var observer = new MutationObserver(change);

  var option = {
    'childList': true,
    'attributes': true,
    'characterData': true,
    'subtree': true
  };

  observer.observe(win.document.body, option);
};
