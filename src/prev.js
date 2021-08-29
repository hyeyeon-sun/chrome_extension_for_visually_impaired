//dldzm
var request = require('request');
var deepai = require("deepai");
const private_keys = 'bd06d8eb-777b-4434-afd3-fa45a152bc5b';
deepai.setApiKey(private_keys);

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Naver-Client-Id': '3WvS7UX94yDQBUtLWtja',
  'X-Naver-Client-Secret': '0Wagq7KbQf'
};

const ocr_headers = {
  'Content-Type': 'multipart/form-data',
  'Authorization': 'KakaoAK ddd979325e29ad84a8465a05b69cffb1'
};


const stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "him", "his", "himself", "her", "hers", "herself", "it", "its", "itself", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];

function removeStopWords(str) {
    str += " ";
    var res = [];
    var words = str.split(' ');
    for(let i = 0 ; i < words.length;i++){
        let word_clean = words[i].split(".").join("");
        if(!stopwords.includes(word_clean)) {
            res.push(word_clean);
        }
    }
    return res;
};

const densecapAPI = async function (URL_LINK){
    if(URL_LINK.includes("logo")){
      return "로고 입니다";
    }
    
    const major = await deepai.callStandardApi("neuraltalk", {
        image: URL_LINK
    });

    const dirtyString = major.output;
    const standards = removeStopWords(dirtyString);

    const minor = await deepai.callStandardApi("densecap", {
        image : URL_LINK
    });

    const standards_length = standards.length;
    const repeat_time = parseInt(minor["output"]["captions"].length/2);

    let related = "";

    var sentenceArr=[];

    for (let i = 0; i < repeat_time; i++){ 
        let sentence = minor["output"]["captions"][i]["caption"];
        let find = false;
        let many  = false;
        for (let j = 0; j < standards_length; j++){
            if(sentence.includes(standards[j]) && !sentence.includes("<unk>")){
              for(k = 0 ; k < sentenceArr.length; k++){
                if (sentence == sentenceArr[k]){
                  many = true;
                  break;
                }
              }
              find = true;
              break;
            }
        }
        if (find && !many) {
            related += (sentence + ". ");
            sentenceArr.push(sentence);
        }
    }
    delete sentenceArr;

    const result = dirtyString +" "+ related;
    return result;
};

// 동기함수를 만들 것.
// densecapAPI가 가져오는 동시에 ocr이 돌아가길 바람
// densecapAPI 옆에 await 함수로 시작할 예정

var OCR = async function (imgSrc) {
  var ocr_options = {
    url: 'https://cors-anywhere.herokuapp.com/https://dapi.kakao.com/v2/vision/text/ocr',
    method: 'POST',
    headers: ocr_headers,
    files : imgSrc
  };

  function ocr_callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
    else {
      console.log(error);
    }
  };

  request(ocr_options, ocr_callback);

};
  
(async function() {
    async function async_load2() {
        let images = document.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++){
            let ImgCptResult =  densecapAPI(images[i].src);

            await OCR(images[i].src);

            ImgCptResult
            .then((value) =>{
                images[i].alt = value;
                dataString = `source=en&target=ko&text=${value}`;
            })
            .then(() => {
                var options = {
                    url : 'https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/papago/n2mt',
                    method : 'POST',
                    headers : headers,
                    body : dataString
                };

                images[i].alt = request(options, async function callback(error, response, body) {
                  if (!error && response.statusCode == 200) {
                      let result = JSON.parse(body);
                      images[i].alt = result['message']['result']['translatedText'];
                  }
                  else {
                    images[i].alt = "알 수 없는 이미지입니다.";
                  }
              });
            })
            .then(() => {
              console.log(i, images[i].alt);
            })
        }
    };
    window.attachEvent ? window.attachEvent('onload', async_load2) : window.addEventListener('load', async_load2, false);
})();