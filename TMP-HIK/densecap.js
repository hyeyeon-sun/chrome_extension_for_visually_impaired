deepai.setApiKey(private_keys);

// stopwords 리스트
const stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves",  "him", "his", "himself", "her", "hers", "herself", "it", "its", "itself", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];

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
    // 이미지 주소 제대로 불러오기
    let idx = URL_LINK.indexOf(".jpg");
    if(idx == -1){
        idx = URL_LINK.indexOf(".png");
    }

    if (idx+4 != URL_LINK.length){
        URL_LINK = URL_LINK.substring(0, idx+4);
        if(URL_LINK.length == 4){
            return "알 수 없는 값";
        }
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
    let unrelated = "";

    for (let i = 0; i < repeat_time; i++){ 
        let sentence = minor["output"]["captions"][i]["caption"];
        let find = false;
        for (let i = 0; i < standards_length; i++){
            if(sentence.indexOf(standards[i]) != -1){
                find = true;
                break;
            }
        }
        if (find) {
            related += (sentence + ". ");
        }
        else {
            unrelated += (sentence + ". ");
        }
    }

    // 결과 문장으로는 major 문장과 minor 문장을 합친 것을 도출한다.
    const result = dirtyString +" "+ related;
    return result;
};

(async function() {
    async function async_load2() {
        let images = document.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++){
            let sent = densecapAPI(images[i].src);
            sent.then((value) =>{
                //console.log(i);
                images[i].alt = value;
            })
        }
    };
    window.attachEvent ? window.attachEvent('onload', async_load2) : window.addEventListener('load', async_load2, false);
})();