
window.addEventListener('load', function () {

  // 修正 demoArea 高度
  var container = document.getElementById('content_area');
  var bbox = Code.getBBox_(container);
  var demoArea = document.getElementById('demoArea');
  demoArea.style.height = bbox.height + 'px';

  // 修正按鈕位置
  var linkToBin = document.getElementById('linkToBin');
  var runButton = document.getElementById('runButton');
  var marginBottom = parseInt(window.getComputedStyle(runButton).marginBottom);
  bbox = Code.getBBox_(linkToBin);
  linkToBin.style.top = '-' + (bbox.height + marginBottom) + 'px';

});