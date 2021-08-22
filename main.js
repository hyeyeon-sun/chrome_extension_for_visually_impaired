const ocr = async function (link) {
    //토큰 가져와서 google api 사용할 수 있도록 함
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        // Use the token.
        console.log(token);
    });

    // Imports the Google Cloud client libraries
    const vision = require('@google-cloud/vision');
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    //입력받은 이미지 링크로부터 OCR 실행
    const [result] = await client.textDetection(link);
    //결과를 detections에 저장(list형식)
    const detections = result.textAnnotations;
    //return detections[0];

    console.log(detections.length)
    
    if (detections.length == 0){
        // detections(리스트 형식)에 값이 없으면 이미지 링크로부터 텍스트 가져오는 것 실패한 것
        console.log("can't access to the image");
        return 'no description';
    }
    else{
        //정상적으로 가져와졌다면 텍스트를 반환
        console.log(detections[0]['description']);
        return detections[0]['description'];
    }
}

text= ocr('https://d2v80xjmx68n4w.cloudfront.net/gigs/DTX401601042005.jpg');

console.log(text)

//이 아래부터는 모든 이미지 가져와서 변환하는 코드(아직 안돌아감)
// var images = document.getElementsByTagName('img');

// for(var i=0;i<images.length;i++){
//     console.log(i);
//     images[i].alt = ocr(images[i].src);    
//     //console.log(images[i].alt);
//     //print(images[i].src)
// }