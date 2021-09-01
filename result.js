//dldzm
const axios = require('axios');
const deepai = require("deepai");
const qs = require('querystring');
/*
const deepai_private_key = {};
const ocr_private_key  = {};

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Naver-Client-Id': {},
  'X-Naver-Client-Secret': {}
};
*/

const deepai_private_key = '6aa937f0-8dac-4d67-932e-c386b82e2496';
const ocr_private_key         = "AIzaSyBNFFPAv1TXPnmN3h3uPB7Ly9Om1V4nT7E";

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Naver-Client-Id': '4pm_Dglz7FSTRb4lb6h1',
  'X-Naver-Client-Secret': 'k924EkJE2q'
};

deepai.setApiKey(deepai_private_key);
const stopwords               = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "him", "his", "himself", "her", "hers", "herself", "it", "its", "itself", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];
const imgs_extension          = ['gif', 'jpg', 'jpeg', 'png', 'bmp' ,'ico', 'apng', 'psd', 'pdd', 'raw', 'svg'];

var removeStopWords = function(str) {
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

var isImgLink = async function(URL_LINK) {
  if (URL_LINK === undefined){
    return false;
  }
  var ext = URL_LINK.substring(URL_LINK.lastIndexOf('.') + 1);
  if (!ext){
    return false;
  }
  else if(URL_LINK.includes("banner")){
    return false;
  }
  var bool = false;
  ext = ext.toLocaleLowerCase();
  imgs_extension.forEach( function(element) {
    if (ext.includes(element)){
      bool = true;
    }
  });
  return bool;
}

var selectImg = async function(images) {
  let tempDictionary = {};
  for (let key = 0; key < 5; key++) { /////////////////여기서 key < images.length로 바꿔야 함
    // alt값이 비어있는 경우만 분석함
    if (images[key].alt === "") {
      let link = images[key].src;
      isImgLink(link)
      .then(function(result) {
        //이미지가 맞다면 dictionary에 추가함
        if (result) {
          tempDictionary[key] = unescape(link);
        }
        //이미지가 아니라면 링크를 분석해 
        else{
          var firstDot = link.indexOf(".");
          if (link.slice(firstDot-3, firstDot) === "www"){ // https://www.youtube.com/ 이런 형식일 경우
            link = link.slice(firstDot+1);
            var lastDot = link.indexOf(".");
            link = link.slice(0, lastDot);  
          }
          else{ //https://velog.io/ 이런 형식일 경우
            link = link.slice(0, firstDot);
            var lastSlash = link.lastIndexOf('/');
            link = link.slice(lastSlash+1, firstDot);
          }
          images[key].alt = `${link} 의 로고입니다. 클릭하면 ${link} 사이트로 연결됩니다.`;
        }
      })
      .catch((err) => {
        console.log(key, err, tempDictionary[key])
      })
    } // if
    //alt값이 비어있지 않다면 link를 분석해 alt값을 분석 결과로 바꾼다
    else if (images[key].src.includes("profile"))   { images[key].alt = "프로필 사진입니다."; } 
    else if (images[key].src.includes("logo"))      { images[key].alt = "로고 사진입니다.";   } 
    else if (images[key].src.includes("thumbnail")) { images[key].alt = "썸네일 사진입니다."; }
  }
  return tempDictionary;
};
  
var densecapAPI = async function(URL_LINK){
  const major = await deepai.callStandardApi("neuraltalk", {
    image: URL_LINK
  })//.catch((err)=> {console.log(err);return "알 수 없는 이미지 입니다."} );
  const minor = await deepai.callStandardApi("densecap", {
    image : URL_LINK
  })//.catch((err)=> {console.log(err);return "알 수 없는 이미지 입니다."} );

  const dirtyString = major.output;
  const standards = removeStopWords(dirtyString);
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

var ocrAPI = function(URL_LINK){
  if (URL_LINK.split(';')[0]=='data:image/jpeg'){
    var request_json = {
      "requests": [{
          "features": [{
              "type": "TEXT_DETECTION"  }],
          "image": { "content": URL_LINK.split(',')[1] }   
        }]
    };
  }
  else if (URL_LINK.split(':')[0]=='http' || URL_LINK.split(':')[0]=='https'){
    var request_json = {
      "requests": [ {
         "features": [ {"type": "TEXT_DETECTION"}],
          "image": {  "source": {"imageUri": URL_LINK  } } 
        } ]
    };
  }
  if (request_json)
    return request_json;
  else 
    return 'wrong_link';
};



const TRANSLATE_METHODS = {
    nmt: 'nmt',
    smt: 'smt',
};

class Papago {
    constructor() {};

    async lookup(term, { method }) {
        if (term == null) {
            throw new Error('Search term should be provided as lookup arguments');
        }
        const url = method === TRANSLATE_METHODS.smt ?
            'language/translate' : 'papago/n2mt';
        const params = qs.stringify({
            source: 'en',
            target: 'ko',
            text: term,
        });

        const config = {
            baseURL: 'https://openapi.naver.com/v1/',
            headers: headers
        };
        const response = await axios.post(url, params, config);
        return response.data.message.result.translatedText;
    };
};


async function main(term) {
  const papago = new Papago();

  const nmtResult = await papago.lookup(term, { method: 'nmt' });
  console.log('결과', nmtResult);
  return nmtResult;
}


(async function() {
  async function async_load() {
    var images = document.getElementsByTagName('img');
    let ImgDict = {};
    
    selectImg(images)
    .then((res) => { 
      ImgDict = res;
      console.log("변환 과정이 필요한 것들 :", ImgDict);
    })
    .then(function(){
      for(let i in ImgDict){
        image_link = images[i].src;
        if (!image_link.includes('banner') && image_link != "" && (image_link.includes('http') || image_link.includes('jpeg') )){
          console.log(image_link);

          let request_json = ocrAPI(image_link);
          if (request_json == 'wrong_link')
            continue;
          else{
            const apiCall=`https://cors-max-5.herokuapp.com/https://vision.googleapis.com/v1/images:annotate?key=${ocr_private_key}`;
            axios.post(apiCall, request_json)
            .then((res)=>{
              let result = res.data.responses[0].fullTextAnnotation;
              if(!result && !images[i].alt){
                console.log("deepai로 돌려야 할 것 : ", i);
              }
              else{
                images[i].alt = result.text;
                console.log("ocr 결과 : ", i, images[i].alt);
                delete ImgDict[i];
              }; // else
            })// post
            .catch((err) => {
              console.log(err);
            });
          }; // else
        }; // if
      }; // for
    });

    setTimeout(function(){
      for(let j in ImgDict){
        console.log(j);
        let ImgCptResult = densecapAPI(images[j].src);
        ImgCptResult
        .then(function(dairesult){
          images[j] = main(dairesult);
        })
        //1 then
        // .then((value) => {
        //   images[j].alt = value;
        //   var options = {
        //     method: 'POST',
        //     headers: headers,
        //     body:  `source=en&target=ko&text=${value}`
        //   };
        //   return options;
        // })
        // .then((option_json) => {
        //   const PapiCAll ='https://cors-max-5.herokuapp.com/https://openapi.naver.com/v1/papago/n2mt';
        //   axios.post(PapiCAll, option_json)
        //   .then((error, response, body) =>{
        //     if (!error && response.statusCode == 200) {
        //       let result = JSON.parse(body);
        //       images[j].alt = result['message']['result']['translatedText'];
        //     }
        //     else{
        //       console.log(error);
        //     }
        //   })
        //   .catch((err) => console.log(err));
        // })
        .then(() => {
          delete ImgDict[j];
          console.log("caption 결과 : ", j, images[j].alt);
        });
      }
    },3000);
  }; // async_load
  window.attachEvent ? window.attachEvent('onload', async_load) : window.addEventListener('load', async_load, false);
})();
