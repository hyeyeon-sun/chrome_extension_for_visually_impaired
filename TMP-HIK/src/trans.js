var request = require('request');

//https://developers.naver.com/docs/papago/papago-nmt-api-reference.md 참고
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Naver-Client-Id': '{ID}}',
    'X-Naver-Client-Secret': '{Secret}'
};

var sentence = "Hold my hand while you cut me down. It had only just begun but now it's over now."
var dataString = `source=en&target=ko&text=${sentence}`;

var options = {
    url: 'https://openapi.naver.com/v1/papago/n2mt',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        let result = JSON.parse(body);
        console.log(result['message']['result']['translatedText']);  
    }
}

request(options, callback);