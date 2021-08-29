# chrome_extension_for_visually_impaired

## Image To Text, OCR 부분 브랜치입니다

### 🎨실행방법
background.js 파일에서 ```YOUR_KEY``` 부분에 google api key를 입력한 후 OCR폴더 전체를 chrome://extensions에 업데이트


### 🎨/OCR 내의 파일 설명
💾 background.js: require를 사용하여 모듈을 쓰기 위해 browserify로 생성된 메인 js파일

명령어: 
```browserify new.js -o background.js ```

💾 new.js: 원본 js 파일

💾 manifest.json: chrome extension의 기본 파일

💾 /src: 사용하지 않게된 소스코드

### 🎨진행상황
---
- 2021.08.22

1. getAuthToken을 사용하여 api 활용하는 부분 에러는 안나도록 했는데
2. console.log 창에 아무것도 뜨지 않는 문제 발생

- 2021.08.25

1. manifest.json에서 background 설정을 해주어 확장프로그램 페이지의 '뷰 검사 백그라운드 페이지'로 console 확인 가능하도록 수정함
2. axios 사용하여 POST 제대로 동작되도록 구현 완료 -> response값 받아올 수 있다!