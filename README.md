# 대학생 시간표 웹페이지 🎓

코딩 경험이 없는 초보자용으로 만든 대학생 시간표 관리 웹페이지입니다.

## 🌟 주요 기능

### 📚 시간표 관리
- **1교시(09:00) ~ 8교시(16:00)**: 1시간 단위 표시
- **30분 단위 입력**: 정확한 시간 설정 가능
- **강의 정보 입력**: 강의명, 강의실, 수업시간 입력 폼
- **자동 저장**: 브라우저 로컬 저장소에 자동 저장

### ✅ TO-DO LIST
- 일일 할 일 관리
- 완료 여부 체크 가능
- 전체/완료 통계 표시

### 📅 캘린더 & 일정 관리
- 월간 캘린더 보기
- 날짜 클릭으로 일정 추가
- 이번주 일정 자동 표시
- 일정 삭제 기능

## 🚀 실행 방법

1. 브라우저에서 `index.html` 파일을 열면 됩니다.
   - 경로: `c:\Users\samsung\새 폴더\my_card\index.html`

2. 또는 `http://localhost:8000`에서 로컬 서버로 실행:
   ```
   cd c:\Users\samsung\새 폴더\my_card
   python -m http.server 8000
   ```

## 🎨 기술 스택

- **HTML5**: 구조
- **CSS3**: 다크모드 스타일 (밝은 네이비 + 진한 녹색 포인트)
- **Vanilla JavaScript**: 기능 구현
- **LocalStorage**: 데이터 저장

## 📝 수정 포인트 3가지

### 1️⃣ 강의 폼 기본 상태 변경
`script.js`에서 페이지 로드 시 강의 폼을 기본으로 접어둔 상태로 시작:
```javascript
lectureFormSection.classList.add('collapsed');
toggleLectureFormBtn.textContent = '펼치기';
```

### 2️⃣ 색상 커스터마이징
`style.css`의 `:root` 섹션에서 CSS 변수 수정:
```css
:root {
    --green-dark: #1f4d2a;      /* 진한 녹색 */
    --green-accent: #2d7a3f;    /* 강조 녹색 */
    --navy: #2c3e55;            /* 네이비 */
}
```

### 3️⃣ 개인 정보 입력 안내
- `index.html` 강의 추가 폼: 플레이스홀더 텍스트 커스터마이징
- 캘린더 오늘 표시: `script.js`의 `renderCalendar()` 함수에서 날짜 비교 로직 확인

## 🔧 기본 기능 요약

| 기능 | 설명 |
|------|------|
| 강의 추가 | 강의명, 강의실, 요일, 시간, 지속시간 입력 후 추가 |
| 강의 삭제 | 시간표 셀에 호버하면 삭제 버튼 표시 |
| 할 일 추가 | 입력 필드에 작성 후 + 추가 클릭 |
| 할 일 완료 | 체크박스 클릭으로 완료 표시 |
| 일정 추가 | 캘린더 날짜 클릭 후 일정 내용 입력 |
| 일정 삭제 | 이번주 일정 목록에서 × 버튼 클릭 |

## 📦 파일 구조

```
my_card/
├── index.html       # HTML 구조
├── style.css        # 스타일 (다크모드)
├── script.js        # JavaScript 기능
├── README.md        # 이 파일
└── .gitignore       # Git 제외 파일
```

## 💾 데이터 저장

모든 데이터는 브라우저의 **LocalStorage**에 저장됩니다:
- `lectures`: 강의 정보
- `todos`: 할 일 목록
- `schedules`: 캘린더 일정

개발자 도구 → Application → LocalStorage에서 확인 가능합니다.

---

**만든이**: 코딩 초보자를 위한 프로젝트  
**마지막 수정**: 2026년 1월 29일
