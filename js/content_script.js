async function quickstart(link) {
    // Imports the Google Cloud client libraries
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
    // const fileName = 'Path to file within bucket, e.g. path/to/image.png';

    // Performs text detection on the gcs file
    //입력받은 이미지 링크로부터 OCR 실행
    const [result] = await client.textDetection(link)
    
    const detections = result.textAnnotations;    
    return detections[0]['description'];
    //detections.forEach(text => console.log(text));
}


var images = document.getElementsByTagName('img');
for(var i=0;i<images.length;i++){
    //images[i].src = 'http://placekitten.com/' + images[i].width + '/' + images[i].height;
    images[i].alt = quickstart(images[i].src);
    //print(images[i].src)
}