/**
 * Google Apps Script - 대학생 시간표 웹 앱
 * 
 * 사용 방법:
 * 1. script.gs 파일을 Google Apps Script 편집기에 붙여넣기
 * 2. HTML.gs 파일을 만들고 HTML 코드 붙여넣기
 * 3. 배포 → 새 배포 → 유형: 웹 앱
 * 4. 실행: 나 (새 버전)
 * 5. 배포를 클릭하여 URL 얻기
 */

function doGet() {
  return HtmlService.createHtmlOutput(getHtmlContent())
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>대학생 시간표</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-dark: #1a1f2e;
            --bg-darker: #0f1319;
            --text-light: #d4d4d8;
            --text-lighter: #a1a1a5;
            --navy-light: #3a4a68;
            --navy: #2c3e55;
            --green-dark: #1f4d2a;
            --green-accent: #2d7a3f;
            --green-light: #4ca75f;
            --border-color: #454d5a;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-darker) 100%);
            color: var(--text-light);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 30px;
        }

        .main-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .section-title {
            font-size: 24px;
            color: var(--green-accent);
            border-bottom: 2px solid var(--green-accent);
            padding-bottom: 10px;
        }

        /* ===== 백업 섹션 ===== */
        .backup-section {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .btn-backup {
            padding: 10px 16px;
            background-color: var(--green-dark);
            color: var(--text-light);
            border: 1px solid var(--green-accent);
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-backup:hover {
            background-color: var(--green-accent);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(45, 122, 63, 0.3);
        }

        /* ===== 입력 폼 ===== */
        @keyframes slideDown {
            from {
                opacity: 0;
                max-height: 0;
                overflow: hidden;
            }
            to {
                opacity: 1;
                max-height: 1000px;
                overflow: visible;
            }
        }

        .form-section {
            animation: slideDown 0.3s ease-out;
            background: var(--navy);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .form-section h3 {
            color: var(--green-light);
            font-size: 16px;
            margin-bottom: 15px;
            border-bottom: 1px solid var(--green-dark);
            padding-bottom: 10px;
        }

        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
            margin-bottom: 12px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            margin-bottom: 6px;
            color: var(--text-lighter);
            font-size: 13px;
            font-weight: 500;
        }

        .form-group input,
        .form-group select {
            padding: 8px;
            background: var(--bg-dark);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-light);
            font-size: 13px;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--green-accent);
        }

        .btn-add {
            padding: 10px 16px;
            background: var(--green-accent);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-add:hover {
            background: var(--green-light);
            transform: translateY(-2px);
        }

        /* ===== 시간표 ===== */
        .timetable-wrapper {
            overflow-x: auto;
        }

        .timetable {
            width: 100%;
            border-collapse: collapse;
            background: var(--navy);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }

        .timetable thead {
            background: var(--navy-light);
        }

        .timetable th {
            padding: 12px;
            color: var(--green-accent);
            text-align: center;
            border: 1px solid var(--border-color);
            font-weight: 600;
        }

        .timetable td {
            border: 1px solid var(--border-color);
            padding: 8px;
            text-align: center;
        }

        .time-cell {
            background: var(--navy-light);
            color: var(--green-light);
            font-weight: 600;
            min-width: 80px;
        }

        .lecture-cell {
            background: var(--bg-dark);
            height: 60px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }

        .lecture-cell:hover {
            background: rgba(45, 122, 63, 0.2);
        }

        .lecture-cell.has-lecture {
            background: linear-gradient(135deg, rgba(45, 122, 63, 0.3) 0%, rgba(45, 122, 63, 0.1) 100%);
        }

        .lecture-info {
            padding: 8px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .lecture-name {
            color: var(--green-light);
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 2px;
        }

        .lecture-room {
            color: var(--text-lighter);
            font-size: 11px;
        }

        .lecture-delete {
            position: absolute;
            top: 2px;
            right: 2px;
            background: rgba(255, 0, 0, 0.6);
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s;
        }

        .lecture-cell:hover .lecture-delete {
            opacity: 1;
        }

        /* ===== 우측 패널 ===== */
        .side-panel {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .panel-section {
            background: var(--navy);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .panel-title {
            font-size: 14px;
            color: var(--green-accent);
            font-weight: 600;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--green-dark);
            padding-bottom: 8px;
        }

        /* 반응형 */
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
            }

            .timetable {
                font-size: 12px;
            }

            .timetable th,
            .timetable td {
                padding: 6px;
            }

            .form-row {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-section">
            <h2 class="section-title">📚 나의 시간표</h2>
            
            <!-- 백업/내보내기 버튼 -->
            <div class="backup-section">
                <button type="button" id="exportBtn" class="btn-backup">💾 JSON으로 백업</button>
                <button type="button" id="importBtn" class="btn-backup">📂 파일에서 복원</button>
                <button type="button" id="toggleLectureFormBtn" class="btn-backup">➕ 강의 추가</button>
                <input type="file" id="importFile" style="display:none;" accept=".json">
            </div>
            
            <!-- 강의 입력 폼 -->
            <div class="form-section" id="lectureFormSection" style="display:none;">
                <h3>강의 추가하기</h3>
                <div class="form-body">
                <form id="lectureForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="lectureName">강의명</label>
                            <input type="text" id="lectureName" placeholder="예: 웹 개발 기초" required>
                        </div>
                        <div class="form-group">
                            <label for="lectureRoom">강의실</label>
                            <input type="text" id="lectureRoom" placeholder="예: 공학관 101호" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="lectureDay">요일</label>
                            <select id="lectureDay" required>
                                <option value="">선택하기</option>
                                <option value="월">월</option>
                                <option value="화">화</option>
                                <option value="수">수</option>
                                <option value="목">목</option>
                                <option value="금">금</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="lectureTime">시간</label>
                            <select id="lectureTime" required>
                                <option value="">선택하기</option>
                                <option value="09:00">1교시 (09:00)</option>
                                <option value="09:30">09:30</option>
                                <option value="10:00">2교시 (10:00)</option>
                                <option value="10:30">10:30</option>
                                <option value="11:00">3교시 (11:00)</option>
                                <option value="11:30">11:30</option>
                                <option value="12:00">4교시 (12:00)</option>
                                <option value="12:30">12:30</option>
                                <option value="13:00">5교시 (13:00)</option>
                                <option value="13:30">13:30</option>
                                <option value="14:00">6교시 (14:00)</option>
                                <option value="14:30">14:30</option>
                                <option value="15:00">7교시 (15:00)</option>
                                <option value="15:30">15:30</option>
                                <option value="16:00">8교시 (16:00)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="lectureDuration">수업시간</label>
                            <select id="lectureDuration" required>
                                <option value="">선택하기</option>
                                <option value="30">30분</option>
                                <option value="60">1시간</option>
                                <option value="90">1시간 30분</option>
                                <option value="120">2시간</option>
                                <option value="150">2시간 30분</option>
                                <option value="180">3시간</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-add">+ 강의 추가</button>
                </form>
                </div>
            </div>

            <!-- 시간표 -->
            <div class="timetable-wrapper">
                <table class="timetable">
                    <thead>
                        <tr>
                            <th class="time-col">시간</th>
                            <th>월</th>
                            <th>화</th>
                            <th>수</th>
                            <th>목</th>
                            <th>금</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr data-time="09:00">
                            <td class="time-cell">1교시<br>09:00</td>
                            <td class="lecture-cell" data-day="월" data-time="09:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="09:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="09:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="09:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="09:00"></td>
                        </tr>
                        <tr data-time="09:30">
                            <td class="time-cell">09:30</td>
                            <td class="lecture-cell" data-day="월" data-time="09:30"></td>
                            <td class="lecture-cell" data-day="화" data-time="09:30"></td>
                            <td class="lecture-cell" data-day="수" data-time="09:30"></td>
                            <td class="lecture-cell" data-day="목" data-time="09:30"></td>
                            <td class="lecture-cell" data-day="금" data-time="09:30"></td>
                        </tr>
                        <tr data-time="10:00">
                            <td class="time-cell">2교시<br>10:00</td>
                            <td class="lecture-cell" data-day="월" data-time="10:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="10:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="10:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="10:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="10:00"></td>
                        </tr>
                        <tr data-time="10:30">
                            <td class="time-cell">10:30</td>
                            <td class="lecture-cell" data-day="월" data-time="10:30"></td>
                            <td class="lecture-cell" data-day="화" data-time="10:30"></td>
                            <td class="lecture-cell" data-day="수" data-time="10:30"></td>
                            <td class="lecture-cell" data-day="목" data-time="10:30"></td>
                            <td class="lecture-cell" data-day="금" data-time="10:30"></td>
                        </tr>
                        <tr data-time="11:00">
                            <td class="time-cell">3교시<br>11:00</td>
                            <td class="lecture-cell" data-day="월" data-time="11:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="11:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="11:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="11:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="11:00"></td>
                        </tr>
                        <tr data-time="11:30">
                            <td class="time-cell">11:30</td>
                            <td class="lecture-cell" data-day="월" data-time="11:30"></td>
                            <td class="lecture-cell" data-day="화" data-time="11:30"></td>
                            <td class="lecture-cell" data-day="수" data-time="11:30"></td>
                            <td class="lecture-cell" data-day="목" data-time="11:30"></td>
                            <td class="lecture-cell" data-day="금" data-time="11:30"></td>
                        </tr>
                        <tr data-time="12:00">
                            <td class="time-cell">4교시<br>12:00</td>
                            <td class="lecture-cell" data-day="월" data-time="12:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="12:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="12:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="12:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="12:00"></td>
                        </tr>
                        <tr data-time="12:30">
                            <td class="time-cell">12:30</td>
                            <td class="lecture-cell" data-day="월" data-time="12:30"></td>
                            <td class="lecture-cell" data-day="화" data-time="12:30"></td>
                            <td class="lecture-cell" data-day="수" data-time="12:30"></td>
                            <td class="lecture-cell" data-day="목" data-time="12:30"></td>
                            <td class="lecture-cell" data-day="금" data-time="12:30"></td>
                        </tr>
                        <tr data-time="13:00">
                            <td class="time-cell">5교시<br>13:00</td>
                            <td class="lecture-cell" data-day="월" data-time="13:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="13:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="13:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="13:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="13:00"></td>
                        </tr>
                        <tr data-time="13:30">
                            <td class="time-cell">13:30</td>
                            <td class="lecture-cell" data-day="월" data-time="13:30"></td>
                            <td class="lecture-cell" data-day="화" data-time="13:30"></td>
                            <td class="lecture-cell" data-day="수" data-time="13:30"></td>
                            <td class="lecture-cell" data-day="목" data-time="13:30"></td>
                            <td class="lecture-cell" data-day="금" data-time="13:30"></td>
                        </tr>
                        <tr data-time="14:00">
                            <td class="time-cell">6교시<br>14:00</td>
                            <td class="lecture-cell" data-day="월" data-time="14:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="14:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="14:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="14:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="14:00"></td>
                        </tr>
                        <tr data-time="14:30">
                            <td class="time-cell">14:30</td>
                            <td class="lecture-cell" data-day="월" data-time="14:30"></td>
                            <td class="lecture-cell" data-day="화" data-time="14:30"></td>
                            <td class="lecture-cell" data-day="수" data-time="14:30"></td>
                            <td class="lecture-cell" data-day="목" data-time="14:30"></td>
                            <td class="lecture-cell" data-day="금" data-time="14:30"></td>
                        </tr>
                        <tr data-time="15:00">
                            <td class="time-cell">7교시<br>15:00</td>
                            <td class="lecture-cell" data-day="월" data-time="15:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="15:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="15:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="15:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="15:00"></td>
                        </tr>
                        <tr data-time="15:30">
                            <td class="time-cell">15:30</td>
                            <td class="lecture-cell" data-day="월" data-time="15:30"></td>
                            <td class="lecture-cell" data-day="화" data-time="15:30"></td>
                            <td class="lecture-cell" data-day="수" data-time="15:30"></td>
                            <td class="lecture-cell" data-day="목" data-time="15:30"></td>
                            <td class="lecture-cell" data-day="금" data-time="15:30"></td>
                        </tr>
                        <tr data-time="16:00">
                            <td class="time-cell">8교시<br>16:00</td>
                            <td class="lecture-cell" data-day="월" data-time="16:00"></td>
                            <td class="lecture-cell" data-day="화" data-time="16:00"></td>
                            <td class="lecture-cell" data-day="수" data-time="16:00"></td>
                            <td class="lecture-cell" data-day="목" data-time="16:00"></td>
                            <td class="lecture-cell" data-day="금" data-time="16:00"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 우측 패널 -->
        <div class="side-panel">
            <!-- TO-DO LIST -->
            <div class="panel-section">
                <div class="panel-title">✅ TODAY'S TO-DO</div>
                <div class="input-group">
                    <input type="text" id="todoInput" placeholder="할 일을 입력하세요" style="width: 100%; padding: 8px; background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-light); margin-bottom: 8px;">
                    <button id="todoAddBtn" class="btn-add" style="width: 100%;">추가</button>
                </div>
                <ul id="todoList" style="list-style: none; margin-top: 12px;"></ul>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 12px; color: var(--text-lighter);">
                    <div>전체: <span id="totalCount">0</span></div>
                    <div>완료: <span id="completeCount">0</span></div>
                </div>
            </div>

            <!-- 캘린더 -->
            <div class="panel-section">
                <div class="panel-title">📅 CALENDAR</div>
                <div id="calendarContainer"></div>
            </div>

            <!-- 주간 일정 -->
            <div class="panel-section">
                <div class="panel-title">📆 이번주 일정</div>
                <div id="weeklySchedules" style="font-size: 12px;"></div>
            </div>
        </div>
    </div>

    <script>
        // TO-DO LIST 구현
        let todos = JSON.parse(sessionStorage.getItem('todos')) || [];
        
        function addTodo(text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };
            todos.push(todo);
            saveTodos();
            renderTodos();
            document.getElementById('todoInput').value = '';
        }

        function toggleTodo(id) {
            todos = todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            saveTodos();
            renderTodos();
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }

        function renderTodos() {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = '';
            
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.style.cssText = 'padding: 8px; background: var(--bg-dark); border-radius: 4px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; font-size: 12px;';
                li.innerHTML = \`
                    <input type="checkbox" \${todo.completed ? 'checked' : ''} onchange="toggleTodo(\${todo.id})" style="cursor: pointer;">
                    <span style="flex: 1; text-decoration: \${todo.completed ? 'line-through' : 'none'}; color: \${todo.completed ? 'var(--text-lighter)' : 'var(--text-light)'}">\${todo.text}</span>
                    <button onclick="deleteTodo(\${todo.id})" style="background: none; border: none; color: #ff6b6b; cursor: pointer;">×</button>
                \`;
                todoList.appendChild(li);
            });

            updateStats();
        }

        function updateStats() {
            document.getElementById('totalCount').textContent = todos.length;
            document.getElementById('completeCount').textContent = todos.filter(t => t.completed).length;
        }

        function saveTodos() {
            sessionStorage.setItem('todos', JSON.stringify(todos));
        }

        document.getElementById('todoAddBtn').addEventListener('click', () => {
            const input = document.getElementById('todoInput');
            if (input.value.trim()) {
                addTodo(input.value.trim());
            }
        });

        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                addTodo(e.target.value.trim());
            }
        });

        renderTodos();

        // 시간표 관리
        let lectures = JSON.parse(sessionStorage.getItem('lectures')) || [];

        document.getElementById('lectureForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('lectureName').value.trim();
            const room = document.getElementById('lectureRoom').value.trim();
            const day = document.getElementById('lectureDay').value;
            const time = document.getElementById('lectureTime').value;
            const duration = parseInt(document.getElementById('lectureDuration').value);

            if (!name || !room || !day || !time || !duration) {
                alert('모든 정보를 입력해주세요!');
                return;
            }

            const lecture = {
                id: Date.now(),
                name: name,
                room: room,
                day: day,
                time: time,
                duration: duration
            };

            lectures.push(lecture);
            sessionStorage.setItem('lectures', JSON.stringify(lectures));
            renderLectures();
            
            this.reset();
            alert(\`✅ "\${name}" 강의가 추가되었습니다!\`);
        });

        function renderLectures() {
            document.querySelectorAll('.lecture-cell').forEach(cell => {
                cell.innerHTML = '';
                cell.classList.remove('has-lecture');
                cell.style.height = '60px';
            });

            lectures.forEach(lecture => {
                const selector = \`.lecture-cell[data-day="\${lecture.day}"][data-time="\${lecture.time}"]\`;
                const cell = document.querySelector(selector);

                if (cell) {
                    cell.classList.add('has-lecture');
                    const rowHeight = (lecture.duration / 30) * 60;
                    cell.style.height = rowHeight + 'px';

                    cell.innerHTML = \`
                        <div class="lecture-info">
                            <div class="lecture-name">\${lecture.name}</div>
                            <div class="lecture-room">\${lecture.room}</div>
                        </div>
                        <div class="lecture-delete" onclick="deleteLecture(\${lecture.id})">×</div>
                    \`;
                }
            });
        }

        window.deleteLecture = function(id) {
            if (confirm('이 강의를 삭제하시겠습니까?')) {
                lectures = lectures.filter(lecture => lecture.id !== id);
                sessionStorage.setItem('lectures', JSON.stringify(lectures));
                renderLectures();
                alert('❌ 강의가 삭제되었습니다!');
            }
        };

        // 강의 폼 토글
        const toggleBtn = document.getElementById('toggleLectureFormBtn');
        const formSection = document.getElementById('lectureFormSection');
        
        toggleBtn.addEventListener('click', () => {
            const isHidden = formSection.style.display === 'none';
            formSection.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '❌ 닫기' : '➕ 강의 추가';
        });

        // 백업/복원
        document.getElementById('exportBtn').addEventListener('click', function() {
            const data = {
                lectures: lectures,
                todos: todos,
                exportDate: new Date().toLocaleString('ko-KR')
            };
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`시간표_백업_\${new Date().toISOString().split('T')[0]}.json\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('✅ 시간표가 JSON 파일로 다운로드되었습니다!');
        });

        document.getElementById('importBtn').addEventListener('click', function() {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (!data.lectures || !data.todos) {
                        alert('❌ 올바른 시간표 백업 파일이 아닙니다!');
                        return;
                    }

                    if (confirm('⚠️ 기존 데이터를 모두 덮어쓰시겠습니까?')) {
                        lectures = data.lectures;
                        todos = data.todos;
                        sessionStorage.setItem('lectures', JSON.stringify(lectures));
                        sessionStorage.setItem('todos', JSON.stringify(todos));
                        renderLectures();
                        renderTodos();
                        alert('✅ 데이터가 복원되었습니다!');
                    }
                } catch (error) {
                    alert('❌ 파일을 읽을 수 없습니다.');
                }
            };
            reader.readAsText(file);
        });

        renderLectures();
    </script>
</body>
</html>`;
}
