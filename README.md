# express-seq

## Skills

- express
- mysql
- sequelize

## Challenges

- 관계형 db 스키마 설계
  - 너무 많이 정규화시키는 것이 오히려 별로라는 피드백
- sequelize 문법
  - mongodb와 비슷해서 수월
- 1:n 관계에서 crud
  - delete는 cascade 이용해서 쉽게 하였으나, update가 관계를 추적해 table들을 바꾸는 과정이 구현은 완료했지만 이렇게 안할꺼 같은 느낌..
- 이미지 db저장 or 이미지 서버 저장
  - db에 저장할 때는 Blob형태로 저장하였음. 이렇게 긴 string이 하나라도 틀리면 이미지가 불러오지 않을텐데 괜찮나..라는 걱정이 앞섬
  - 서버에 저장할 때는 static 폴더에 이미지가 계속 추가되어 즉시 이미지 볼수있고, img 형태로 저장되어 안심
