// 분석한 문장 가져오기
// 이 부분 실행하려면 densecap.js 수정해야 한다.
import { densecapAPI } from "./densecap.js";
const query = await densecapAPI();
console.log(query);


var express = require('express');
var app = express();
var client_id = "3WvS7UX94yDQBUtLWtja"; //'YOUR_CLIENT_ID';
var client_secret = '0Wagq7KbQf'; //YOUR_CLIENT_SECRET';


app.get('/translate', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var request = require('request');
  var options = {
      url: api_url,
      form: {'source':'en', 'target':'ko', 'text':query},
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
      
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

app.listen(3000, function () {
  console.log('http://127.0.0.1:3000/translate app listening on port 3000!');
});