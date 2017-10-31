+(function () {

  var FILMS = {
    'stages/01': 'https://youtu.be/o9NPI3BtNoA',
    'stages/02': 'https://youtu.be/VN4sKngbiGI',
    'stages/03': 'https://youtu.be/mXCnzUzcNSk',
    'stages/05': 'https://youtu.be/UmMJG2zInWU',
    'stages/10': 'https://youtu.be/NA2kjjwoWNA'
  };

  var STAGE_SECTION_PASSED = {
    'stages/01': {
      block: 6,
      simulator: {
        line: 2,
        component: 2
      }
    },
    'stages/02': {
      block: 28,
      simulator: {
        line: 4,
        component: 2
      }
    },
    'stages/03': {
      block: 34,
      simulator: {
        line: 4,
        component: 2
      }
    },
    'stages/04': {
      block: 30,
      simulator: {
        line: 3,
        component: 2
      }
    },
    'stages/05': {
      block: 7,
      simulator: {
        line: 3,
        component: 2
      }
    },
    'stages/06': {
      block: 49,
      simulator: {
        line: 6,
        component: 3
      }
    },
    'stages/07': {
      block: 60,
      simulator: {
        line: 13,
        component: 5
      }
    },
    'stages/08': {
      block: 42,
      simulator: {
        line: 4,
        component: 2
      }
    },
    'stages/09': {
      block: 15,
      simulator: {
        line: 5,
        component: 2
      }
    },
    'stages/10': {
      block: 14,
      simulator: {
        line: 2,
        component: 2
      }
    },
    'stages/11': {
      block: 31,
      simulator: {
        line: 10,
        component: 4
      }
    },
    'stages/12': {
      block: 47,
      simulator: {
        line: 12,
        component: 4
      }
    },
    'stages/13': {
      block: 25,
      simulator: {
        line: 10,
        component: 4
      }
    },
    'stages/14': {
      block: 25,
      simulator: {
        line: 6,
        component: 3
      }
    },
    'stages/15': {
      block: 13,
      simulator: {
        line: 9,
        component: 3
      }
    }
  };

  window.addEventListener('load', function () {

    // 當點選關卡而非解答時，清空內容
    restoreBlocks();

    // 當點選關卡而非解答時，清空內容
    restoreSimulator();

    // 決定影片按鈕的行為
    watchFilm();

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
            line: config.data.paths.length,
            component: config.data.components.length
          }
        };
      },
      getSectionValuesByStage: function (stageInt) {
        var stageName = Code.getStringParamFromUrl('page');
        var wk = Code.workspace;
        var xml = Blockly.Xml.workspaceToDom(wk);
        var config = getSimulatorConfig();
        return {
          user: {
            block: xml.querySelectorAll('block').length,
            simulator: {
              line: config.data.paths.length,
              component: config.data.components.length
            }
          },
          solution: STAGE_SECTION_PASSED[stageName]
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

  function watchFilm() {
    var stageName = Code.getStringParamFromUrl('page');
    var url = FILMS[stageName];
    var watchFilm = document.getElementById('watchFilm');

    if (!url) {
      watchFilm.style.display = "none";
      return;
    }

    Code.bindClick(watchFilm,
      function () {
        window.open(url);
      });
  }

})();
