+(function () {

  window.addEventListener('load', function () {

    // 當點選關卡而非解答時，清空內容
    restoreBlocks();

    // 當點選關卡而非解答時，清空內容
    restoreSimulator();

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

})();
