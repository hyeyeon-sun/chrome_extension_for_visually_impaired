const axios = require('axios');

//const ocr = async function (link) {
function ocr(link){
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

  //request_json.requests[0].image.source.imageUri = "https://d2v80xjmx68n4w.cloudfront.net/gigs/DTX401601042005.jpg";
  console.log(request_json.requests[0]);

  const apiCall='https://vision.googleapis.com/v1/images:annotate?key=YOUR_KEY';

  axios.post(apiCall, request_json).then((response) => {
    console.log(JSON.stringify(response.data.responses[0].fullTextAnnotation.text));
    return response.data.responses[0].fullTextAnnotation.text;
  }).catch((e) => {
    console.log(e.response);
  });
}

(async function() {
  async function async_load2() {
      let images = document.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++){
        //console.log(images[i].src);
        let sent = ocr(images[i].src);
        if (!sent){ //alt값이 없다면 출력
          console.log('undefined response');
        }
        else{
          images[i].alt = sent;
          console.log('alt값:',images[i].alt);
        }
      }
  };
  window.attachEvent ? window.attachEvent('onload', async_load2) : window.addEventListener('load', async_load2, false);
})();

// (async function() {
//   async function async_load2() {
//       let images = document.getElementsByTagName('img');
//       for (let i = 0; i < images.length; i++){
//         console.log(images[i].src);
//       }
//   };
//   window.attachEvent ? window.attachEvent('onload', async_load2) : window.addEventListener('load', async_load2, false);
// })();