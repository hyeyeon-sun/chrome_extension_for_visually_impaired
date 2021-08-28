var request = require('request');

const ocr_headers = {
  'Content-Type': 'multipart/form-data',
  'Authorization': 'KakaoAK ddd979325e29ad84a8465a05b69cffb1'
};


var OCR = async function () {
  var ocr_options = {
    url: 'https://dapi.kakao.com/v2/vision/text/ocr',
    method: 'POST',
    headers: ocr_headers,
    files : 'card.jpg'
  };

  function ocr_callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
    else {
      console.log(response , error , body);
    }
  };

  request(ocr_options, ocr_callback);
};

OCR();
