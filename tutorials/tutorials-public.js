document.querySelector('head').innerHTML += '<link rel="icon" href="../../favicon.ico" type="image/x-icon">\n'+
  '<link rel="stylesheet" href="../../style.css">\n'+
  '<link rel="stylesheet" href="../tutorials.css">\n';

var importChapter;
var chapter = document.getElementById('tutorialsBody').getAttribute('chapter');

if(chapter=='LED01'||chapter=='LED02'||chapter=='LED03'||chapter=='LED04'){
	importChapter = '<script src="led-code.js"></script>\n';
}
if(chapter=='RGBLED01'||chapter=='RGBLED02'||chapter=='RGBLED03'||chapter=='RGBLED04'){
	importChapter = '<script src="rgbled-code.js"></script>\n';
}

document.write('<script src="../../storage.js"></script>\n'+
  '<script src="../../components/blockly/blockly_compressed.js"></script>\n'+
  '<script src="../../components/blockly/blocks_compressed.js"></script>\n'+
  '<script src="../../components/blockly/javascript_compressed.js"></script>\n'+
  importChapter+
  '<script src="../../webduino.js"></script>\n'+
  '<script src="../../blocks/webduino.js"></script>\n'+
  '<script src="../../generators/webduino.js"></script>\n'+
  '<script src="../../blocks/tutorials.js"></script>\n'+
  '<script src="../../generators/tutorials.js"></script>\n'+
  '<Script src="https://webduino.io/components/webduino-js/dist/webduino-all.min.js"></script>');
