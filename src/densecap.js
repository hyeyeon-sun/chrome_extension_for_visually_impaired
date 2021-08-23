var deepai = require("deepai");

// https://deepai.org/machine-learning-model/densecap 에서 private key를 발급받아야 함.
const private_keys = {private_keys};
deepai.setApiKey(private_keys);

// stopwords list
// he, she, they 제거.
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
    //로고 판별은 바로 return 하도록 한다.
    if(URL_LINK.includes("logo")){
      return "로고 입니다";
    }
    
    // major 문장 가져오기
    const major = await deepai.callStandardApi("neuraltalk", {
        image: URL_LINK
    });

    // 판별 기준 문장이 된다.   
    const dirtyString = major.output;
    const standards = removeStopWords(dirtyString);

    // 분석된 여러 문장 가져오기
    const minor = await deepai.callStandardApi("densecap", {
        image : URL_LINK
    });

    // 설정
    const standards_length = standards.length;
    const repeat_time = parseInt(minor["output"]["captions"].length/2);

    // 관련 있는 문장과 관련 없는 문장을 구분한다.
    let related = "";
    // 중복된 결과는 포함하지 않는다.
    var sentenceArr=[];

    for (let i = 0; i < repeat_time; i++){ 
        let sentence = minor["output"]["captions"][i]["caption"];
        let find = false;
        let many  = false;
        // 중복된 문장 넣지 않기 위한 프로세스 추가했다.
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

    // 결과 문장으로는 major 문장과 minor 문장을 합친 것을 도출한다.
    const result = dirtyString +" "+ related;
    return result;
};



(async function() {
    async function async_load2() {
        let images = document.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++){
            let ImgCptResult = densecapAPI(images[i].src);
            ImgCptResult
            .then((value) =>{
                images[i].alt = value;
            })
            .then((val) => {
                // 결과 확인용
                console.log(i, images[i].alt);
            })
        }
    };
    // window 창을 열자마자 확인할 수 있도록 함.
    window.attachEvent ? window.attachEvent('onload', async_load2) : window.addEventListener('load', async_load2, false);
})();