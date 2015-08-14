var copy = document.getElementById('copyCode');
copy.addEventListener('click',function(e){
  e.target.setAttribute('data-tooltip','Copied !!');
  SelectText('content_javascript');
});
copy.addEventListener('mouseover',function(e){
  e.target.setAttribute('data-tooltip','Copy to clipboard');
});
var client = new ZeroClipboard(copy);
document.getElementById('tab_javascript').addEventListener('click',function(){
  var jsClick = document.querySelectorAll('.jsClick');
  for(var i=0; i<jsClick.length; i++){
    jsClick[i].style.display = 'table-cell';
  }
});
document.getElementById('tab_blocks').addEventListener('click',function(){
  var jsClick = document.querySelectorAll('.jsClick');
  for(var i=0; i<jsClick.length; i++){
    jsClick[i].style.display = 'none';
  }
});

function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}