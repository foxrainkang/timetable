# 초기 프롬프트

[무엇을] 코딩 경험이 없는 초보자용으로, '대학생 시간표' 웹페이지를 만들어줘.
[조건] 파일은 index.html 과 style.css, script.js로 나눠줘. 외부 라이브러리는 쓰지 말아줘.
[스타일] 색깔은 다크모드에 어울리는데 보다 밝은 회색? 밝은 네이비 색상에 가깝게 만들어줘. 포인트 컬러로는 진한 녹색을 중간중간에 섞어서 만들어줘
[확인] 브라우저에서 index.html을 열면 바로 보이게 해줘.
[범위] my_card 폴더 안의 새 파일만 만들어/수정해줘.
[마무리] 실행 방법(어떤 파일을 열면 되는지)과 수정 포인트 3가지를 알려줘.

[카드 내용]
- 이름: 홍길동
- 전공: 컴퓨터공학
- 한 줄 소개: "AI로 더 빨리 만들고 더 많이 실험합니다."
- 관심분야: 웹, 로봇, 데이터
- 버튼: "연락처 보기" (눌렀을 때 이메일 / 깃허브가 나타나기)

[시간표 내용]
 - 1교시는 오전9시이고 1시간 단위로 8교시까지 만들어줘
 - 30분 단위로 입력, 시간표 표시도 되게 해줘.
 - 시간표 옆에 강의명, 강의실, 수업시간 등을 입력하는 폼도 만들어줘.

[to-do list]
시간표 오른편에 today's to-do list를 생성할거야
to-do list 아래에 캘린더를 작은 크기로 넣어주고 날짜를 클릭하면 일정 추가가 가능해지고 캘린더 아래에 이번주 일정을 일/요일/내용 순서로 표기할 수 있게 해줘. 일정 삭제는 캘린더 아래 일정 목록에서 오른쪽에 x자를 클릭하면 삭제되게끔

---

# 기능 추가/개선 프롬프트

## 1. GitHub 저장소 업로드
**목표:** 시간표 프로젝트를 GitHub에 자동으로 업로드하고 관리

**프롬프트:**
이 시간표를 만든걸 내 깃허브 repositories에 있는 timetable에 자동으로 업로드해줄 수 있어?

**결과:**
- timetable GitHub 저장소 생성 및 초기화
- Git 커밋/푸시를 통한 버전 관리
- 로컬 변경사항 자동 동기화

---

## 2. GitHub Pages로 공개 공유
**목표:** 시간표를 웹 주소(foxrainkang.github.io)로 공개 공유

**프롬프트:**
시간표를 foxrainkang.github.io 주소로 남들에게 공유하려면?

**결과:**
- foxrainkang.github.io GitHub 저장소 생성
- GitHub Pages 자동 배포 설정
- 누구나 접근 가능한 공개 시간표 웹사이트
- https://foxrainkang.github.io 에서 접근 가능

---

## 3. JSON 백업/복원 기능
**목표:** 시간표 데이터를 파일로 백업하고 복원

**프롬프트:**
저장한 시간표를 저장할 수 있었으면 하는데 어떤 방식이 좋을까?
(선택지 제시 후) 옵션1로 일단 진행해보자

**결과:**
-  JSON으로 백업: 현재 시간표/TO-DO/일정을 JSON 파일로 다운로드
-  파일에서 복원: 이전 백업 파일을 업로드하여 데이터 복원
- 자동 날짜 포함 (시간표_백업_YYYY-MM-DD.json)
- 백업 항목: 강의 목록, TO-DO 리스트, 캘린더 일정

---

## 4. 강의 추가 폼 UI 개선
**목표:** 강의 추가 폼을 더 간단하고 깔끔하게 표시

**프롬프트:**
강의 추가하기 버튼도 접고 펼치기 방식에서 파일 저장하기/불러오기 버튼처럼 작게 만들어줘

**결과:**
-  강의 추가 버튼을 백업 버튼들과 같은 라인에 배치
- 기본 상태에서 폼 숨김 (display: none)
- 클릭 시 부드러운 슬라이드 애니메이션으로 펼쳐짐
-  닫기 버튼으로 다시 숨길 수 있음
- UI 일관성 및 공간 활용도 개선

---

## 5. Google Apps Script로 웹 앱 배포
**목표:** HTML/CSS/JavaScript로 만든 시간표를 Google Apps Script를 통해 웹 앱으로 배포

**프롬프트:**

너는 웹 개발자야. 다음 HTML/CSS/JavaScript 코드를 Google Apps Script로 변환하고 싶어.

[코드 전문]
아래는 현재 작동하는 시간표 웹페이지의 index.html, style.css, script.js 파일이야:

### index.html
(index.html 전체 코드 붙여넣기)

### style.css
(style.css 전체 코드 붙여넣기)

### script.js
(script.js 전체 코드 붙여넣기)

[요구사항]
이 코드를 Google Apps Script로 변환해줘. 다음 사항을 고려해줘:

1. HTML, CSS, JavaScript를 하나의 .gs 파일로 통합
2. doGet() 함수를 메인 진입점으로 사용
3. HtmlService를 사용해서 HTML 컨텐츠 제공
4. 외부 라이브러리는 사용하지 않기 (Vanilla JavaScript만 사용)
5. 데이터는 sessionStorage 사용 (또는 Google Sheets와 연동하기)
6. 모든 스타일과 기능은 유지하기

[변환 방법]
- doGet() 함수: 웹 앱의 진입점
- getHtmlContent() 함수: HTML 전체를 템플릿 리터럴로 반환
- CSS: <style> 태그에 그대로 포함
- JavaScript: <script> 태그에 그대로 포함

[배포 가이드]
변환 후 다음 과정을 설명해줘:
1. Google Apps Script 프로젝트 생성 방법
2. 코드 붙여넣는 방법
3. 배포 설정 방법
4. 웹 앱 URL 얻는 방법

[예상 결과]
변환된 GoogleAppsScript.gs 파일과 배포 가이드 문서를 만들어줘.

**결과:**
- GoogleAppsScript.gs: 완전히 작동하는 웹 앱 코드
- 모든 기능 유지: 시간표, TO-DO, 캘린더, 백업/복원
- sessionStorage를 사용한 데이터 관리
- Google Apps Script 배포 가이드 문서
- 단계별 배포 방법 설명

---

## 이 프롬프트를 Gemini에서 사용하는 방법:

1. [Google Gemini](https://gemini.google.com) 접속
2. 위의 **프롬프트**를 복사
3. [코드 전문] 부분에 다음 파일들의 전체 코드 붙여넣기:
   - index.html
   - style.css
   - script.js
4. 프롬프트 제출
5. Gemini가 생성한 GoogleAppsScript.gs 코드 복사
6. [Google Apps Script](https://script.google.com)에 붙여넣기
7. 배포 진행

**주의사항:**
- 프롬프트는 한국어로 작성되어 있으니, 영어로 변환해서 사용해도 됩니다
- Gemini가 생성한 코드는 검토 후 테스트 권장
- sessionStorage vs Google Sheets 저장소는 필요에 따라 선택 가능
