
const private_keys = 'bd06d8eb-777b-4434-afd3-fa45a152bc5b';

deepai.setApiKey(private_keys);


async function densecapAPI(URL_LINK) {
    // 분석된 한 문장 가져오기
    //const URL_LINK = "https://i.pinimg.com/originals/d7/7c/a6/d77ca6b45687b0ec4eb6e4dfccb4f933.jpg";
    const resp1 = await deepai.callStandardApi("neuraltalk", {
        image: URL_LINK
    });
    // 분석된 여러 문장 가져오기
    const resp2 = await deepai.callStandardApi("densecap", {
        image : URL_LINK
    });

    
    // 판별 기준 문장이 된다.
    var base = resp1["output"].slice(0,-1).split(" ");

    base = base.filter((element) => element !== 'a');
    base = base.filter((element) => element !== 'the');
    base = base.filter((element) => element !== 'is');
    base = base.filter((element) => element !== 'on');
    base = base.filter((element) => element !== 'in');
    base = base.filter((element) => element !== 'of');
    base = base.filter((element) => element !== 'by');

    const base_length = base.length;
    const repeat = parseInt(resp2["output"]["captions"].length / 2);

    // 관련 있는 문장과 관련 없는 문장을 구분한다.
    let related = "";
    let unrelated = "";

    for (let i = 0; i < repeat; i++){ 
        let sentence = resp2["output"]["captions"][i]["caption"];
        let find = false;
        for (let i = 0; i < base_length; i++){
            if(sentence.indexOf(base[i]) != -1){
                find = true;
                break;
            }
        }
        if (find) {
            related += (sentence + ". ");
        } else {
            unrelated += (sentence + ". ");
        }
    }
    //console.log("기준 문장 : ", resp1["output"]);
    //console.log("related : ", related);
    //console.log("unrelated : ", unrelated);
    const result =  "주 : " + resp1["output"] + " 부 : " + related;
    document.write(result);
    return result;
}

densecapAPI("http://www.mediatoday.co.kr/news/photo/202108/214969_341417_4759.jpg");
/*
var images = document.getElementsByTagName('img');
for (var i = 0; i < images.length() ; i++){
    images[i].alt = await densecapAPI(images[i].source);
    console.log(images[i].alt);
}

*/
