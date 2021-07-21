var images = document.getElementsByTagName('img');
for (var i = 0; i < images.length ; i++){
    images[i].src = 'http://placekitten.com/' + images[i].width + '/' + images[i].height;
    images[i].alt = "귀여운 고양이 입니다"
}
