+(function () {

  window.addEventListener('load', function () {

    // 當點選關卡而非解答時，清空內容
    restoreBlocks();

    // 當點選關卡而非解答時，清空內容
    restoreSimulator();

    // 計算闖關時間
    window.stage = {
      startTime: Date.now(),
      getGameTime: function () {
        return Date.now() - this.startTime;
      },
      getCode: function () {
        var obj = {
          blockly: getBlocklyCode(),
          simulator: getSimulatorConfig()
        };
        return JSON.stringify(obj);
      },
      getSectionValues: function () {
        var wk = Code.workspace;
        var xml = Blockly.Xml.workspaceToDom(wk);
        var config = getSimulatorConfig();
        return {
          block: xml.querySelectorAll('block').length,
          simulator: {
            line: config.data.components.length,
            component: config.data.paths.length
          }
        };
      },
      getBlockXml: function () {
        var wk = Code.workspace;
        var xml = Blockly.Xml.workspaceToDom(wk);
        return xml;
      }
    };

  });

  function restoreBlocks() {
    var hash = window.location.hash.substring(1);
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);

    if (!hash) {
      xml = Blockly.Xml.textToDom('<xml xmlns="http://www.w3.org/1999/xhtml"></xml>');
      Blockly.Xml.domToWorkspace(xml, Code.workspace);
      BlocklyStorage.backupBlocks_(Code.workspace);
      BlocklyStorage.restoreBlocks();
    }
  }

  function restoreSimulator() {
    var hash = window.location.hash.substring(1);
    var area = document.getElementById('simulator-area');
    var frame = document.getElementById('simulator-frame'); 
    var btn = document.getElementById('simulatorButton'); 

    if (!hash) {
      localStorage.simulator = '{}';
      BlocklySimStorage.restoreBlocks(area, frame, btn);
    }
  }

  function getBlocklyCode() {
    var wk = Code.workspace;
    var xml = Blockly.Xml.workspaceToDom(wk);
    var text = Blockly.Xml.domToText(xml);
    return text;
  }

  function getSimulatorConfig() {
    var frame = document.querySelector('#simulator-frame');
    return frame.contentWindow.blockly.getConfig();
  }

})();
