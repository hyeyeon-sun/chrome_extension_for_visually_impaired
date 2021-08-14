//HEAD에 정보 추가
var headID = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = "manifest";

headID.appendChild(link);
link.href = "manifest.json";

//body에 script 태그 추가
var s = document.createElement('script');
s.type = 'text/javascript';
s.async = true;
s.src = './densecap.js';
var x = document.getElementsByTagName('script')[0];
x.parentNode.insertBefore(s, x);

var t = document.createElement('script');
t.src = 'https://cdnjs.deepai.org/deepai.min.js';
x.parentNode.insertBefore(t, x);


//densecapAPI 불러와서 적용
import { densecapAPI } from "./densecap.js";

var images = document.getElementsByTagName('img');

for (var i = 0; i < images.length() ; i++){
    images[i].alt = await densecapAPI(images[i].source);
}

