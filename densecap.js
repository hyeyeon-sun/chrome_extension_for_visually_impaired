// INCLUDED deepai.min.js as a script tag in HTML file

// 개인 API
deepai.setApiKey('3bdd09cb-2eab-4218-8719-e46f0a3d4c7d');

// 나중에 url을 받아야 한다면 입력인자로 url 넣고
// image : url 로 수정해야 할 것 같다.
// 참고 : https://developers.google.com/web/fundamentals/primers/async-functions?hl=ko

async function densecapAPI(urllink) { 
    let str = "";
    var resp = await deepai.callStandardApi("densecap", {
            image : urllink
        });
        
    // 분석된 문장을 다 가져와서 알고리즘에 넣을 배열에 넣기
    for (var i = 0; i < 5; i++ ){  // 최상위 5개만 가져오도록 한다.
        let sentence = resp["output"]["captions"][i]["caption"];
        str += (sentence + ". ");
    }

    return str;
}
export { densecapAPI };

for (var i = 0; i < images.length() ; i++){
    images[i].alt = densecapAPI(images[i].source);
}