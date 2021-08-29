const axios = require('axios');

//참고: OCR함수를 async함수로 설정하면 post부분에서 에러나서 일반 함수로 설정함


//OCR 함수의 역할: image[i].src 입력받아서 -> request.json 반환
function ocr(link){
  //link를 활용하여 request보내기 위해 json 담을 변수 생성
  if (link.split(';')[0]=='data:image/jpeg'){ //base64형식으로 받아와진다면
    var request_json = {
      "requests": [
        {
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ],
          "image": {
            "content": link.split(',')[1]
          }
        }
      ]
    };
  }
  else if (link.split(':')[0]=='http' || link.split(':')[0]=='https'){
    var request_json = {
      "requests": [
        {
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ],
          "image": {
            "source": {
              "imageUri": link
            }
          }
        }
      ]
    };
  }
  if (request_json) //request_json 파일이 제대로 생성되었다면
    return request_json;
  else //request파일이 생성되지 않았다면 링크가 잘못된 것
    return 'wrong_link';
}

//ocr 함수 실행되는 부분
(async function() {
  async function async_load2() {
    //image 링크들 받아오기 위해 모든 이미지 태그 가진 데이터 저장
      let images = document.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++){
        image_link = images[i].src;

        //image_link를 사용할 수 있을 경우에만 (배너아니고, 링크 주소 있고, http나 jpeg 포함일때)
        if (!image_link.includes('banner') && image_link != "" && (image_link.includes('http') || image_link.includes('jpeg'))){
          console.log(image_link);
          //링크를 활용해 request_json 파일 생성
          let request_json = ocr(image_link);
          if (request_json == 'wrong_link')
            continue;
          else{
            //POST보내는 부분 시작
            const apiCall='https://vision.googleapis.com/v1/images:annotate?key=YOUR_KEY';
            const res = await axios.post(apiCall, request_json);
            //POST한 결과 result에 저장
            let result = res.data.responses[0].fullTextAnnotation;
            if(!result){
              //result에 값이 없다면 정상적이지 않은 것
              if (!images[i].alt){ //기존의 alt값이 없다면 아래 문구로 대체
                images[i].alt = '글씨가 없거나 확인할 수 없는 이미지입니다';
              }
              //기존의 alt가 있는 경우 변경X, 추후 image captioning 부분과 합치기
            }
            else{
              //result에 값이 있다면 정상적으로 받아온 것!
              images[i].alt = result.text;
            }
            //console.log('alt값:', images[i].alt);
          }
        }
      }
  };
  window.attachEvent ? window.attachEvent('onload', async_load2) : window.addEventListener('load', async_load2, false);
})();