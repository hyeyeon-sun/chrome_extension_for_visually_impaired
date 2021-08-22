function Addtag(){
    //HEAD에 정보 추가
var headID = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = "manifest";

headID.appendChild(link);
link.href = "manifest.json";

//body에 script 태그 추가
var k = document.createElement('script');
k.type = 'text/javascript';//'text/javascript';
k.src = './densecap.js';

var t = document.createElement('script');
t.src = 'https://cdnjs.deepai.org/deepai.min.js';

var x = document.getElementsByTagName('script')[0];

x.parentNode.insertBefore(t, x);
x.parentNode.insertBefore(k, x);
}
Addtag();