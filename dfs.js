(async function() {
  async function async_load() {
    (function() {
      return new Promise(function(resolve, reject) {
        let HTMLdictionary = {};
        let images = document.getElementsByTagName('img');

        // 일차적으로 프로필 사진과 로고는 함수를 통해 돌리지 않는다.
        for (let j = 0; j < images.length; j++) {
          // 
          if ((images[j].alt === "") || (images[j].alt === null) || (images[j].alt === undefined)) {
            HTMLdictionary[j] = unescape(images[j].src);
            console.log(j, HTMLdictionary[j]);
          } else if (images[j].alt.includes("profile")) {
            images[j].alt = "프로필 사진입니다.";
          } else if (images[j].alt.includes("logo")) {
            images[j].alt = "로고 사진입니다.";
          } else if (images[j].alt.includes("thumbnail")) {
            images[j].alt = "썸네일 사진입니다.";
          }
        }
        console.log("변환 과정이 필요한 것들 :", HTMLdictionary);
        console.log(Object.keys(HTMLdictionary).length);

        for (var i in HTMLdictionary) {
          console.log(i);
          let ImgCptResult = densecapAPI(images[i].src);

          ImgCptResult
          //1 then
          .then((value) => {
            images[i].alt = value;
            dataString = `source=en&target=ko&text=${value}`;
          })
          //2 then
          .then((val) => {
            var options = {
              // After 5 redirects, redirects are not followed any more. The redirect response is sent back
              // to the browser, which can choose to follow the redirect (handled automatically by the browser).
              url: 'https://cors-max-5.herokuapp.com/https://openapi.naver.com/v1/papago/n2mt',
              method: 'POST',
              headers: headers,
              body: dataString
            };

            images[i].alt = request(options, async function callback(error, response, body) {
              if (!error && response.statusCode == 200) {
                let result = JSON.parse(body);
                images[i].alt = result['message']['result']['translatedText'];
              }
            })
          })
          // 3 then
          .then(() => {
            delete HTMLdictionary[i];
            console.log(i, images[i].alt);
          }); // then 끝

        } // dictionary for 닫기
      }); // return Promise 닫기
    })(); // (function(){})(); 닫기
  } // async_load 선언 닫기
  window.attachEvent ? window.attachEvent('onload', async_load) : window.addEventListener('load', async_load, false);
})();
