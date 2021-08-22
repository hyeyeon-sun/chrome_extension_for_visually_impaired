# chrome_extension_for_visually_impaired

### Image To Text, OCR 부분 브랜치입니다

---
2021.08.22 진행상황

getAuthToken을 사용하여 api 활용하는 부분 에러는 안나도록 했는데
console.log 창에 아무것도 뜨지 않는 문제 발생

### 로컬 환경 구축
클라이언트 라이브러리 설치
```
npm install --save @google-cloud/vision
```

CMD에서 서비스 계정 키가 포함된 JSON 파일의 경로 설정
```javascript
//KEY_PATH: 경로
set GOOGLE_APPLICATION_CREDENTIALS=KEY_PATH
```