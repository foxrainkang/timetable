document.addEventListener('DOMContentLoaded', function() {
    // ===== TO-DO LIST 관리 =====
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const todoInput = document.getElementById('todoInput');
    const todoAddBtn = document.getElementById('todoAddBtn');
    const todoList = document.getElementById('todoList');
    const totalCount = document.getElementById('totalCount');
    const completeCount = document.getElementById('completeCount');

    // ===== TO-DO 추가 =====
    function addTodo(text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todos.push(todo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
        todoInput.focus();
    }

    // ===== TO-DO 완료 토글 =====
    function toggleTodo(id) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }

    // ===== TO-DO 삭제 =====
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    // ===== TO-DO 렌더링 =====
    function renderTodos() {
        todoList.innerHTML = '';
        
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text" onclick="toggleTodo(${todo.id})">${todo.text}</span>
                <button class="todo-delete" onclick="deleteTodo(${todo.id})">×</button>
            `;
            
            todoList.appendChild(li);
        });

        updateStats();
    }

    // ===== 통계 업데이트 =====
    function updateStats() {
        totalCount.textContent = todos.length;
        completeCount.textContent = todos.filter(t => t.completed).length;
    }

    // ===== 저장 =====
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // ===== 이벤트 리스너 =====
    todoAddBtn.addEventListener('click', () => {
        if (todoInput.value.trim()) {
            addTodo(todoInput.value.trim());
        }
    });

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim()) {
            addTodo(todoInput.value.trim());
        }
    });

    // 전역 함수로 만들기
    window.toggleTodo = toggleTodo;
    window.deleteTodo = deleteTodo;

    // 초기 렌더링
    renderTodos();

    // ===== 시간표 데이터 관리 =====
    let lectures = JSON.parse(localStorage.getItem('lectures')) || [];

    // ===== 강의 추가 =====
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

        // 강의 객체 생성
        const lecture = {
            id: Date.now(),
            name: name,
            room: room,
            day: day,
            time: time,
            duration: duration
        };

        // 저장 및 렌더링
        lectures.push(lecture);
        localStorage.setItem('lectures', JSON.stringify(lectures));
        renderLectures();
        
        this.reset();
        alert(`✅ "${name}" 강의가 추가되었습니다!`);
    });

    // ===== 시간표 렌더링 =====
    function renderLectures() {
        // 모든 셀 초기화
        document.querySelectorAll('.lecture-cell').forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('has-lecture');
            cell.style.height = '60px';
        });

        // 강의 표시
        lectures.forEach(lecture => {
            displayLecture(lecture);
        });
    }

    // ===== 강의 표시 =====
    function displayLecture(lecture) {
        const { id, name, room, day, time, duration } = lecture;
        const selector = `.lecture-cell[data-day="${day}"][data-time="${time}"]`;
        const cell = document.querySelector(selector);

        if (cell) {
            cell.classList.add('has-lecture');
            
            // 높이 설정 (30분 = 60px)
            const rowHeight = (duration / 30) * 60;
            cell.style.height = rowHeight + 'px';

            cell.innerHTML = `
                <div class="lecture-info">
                    <div class="lecture-name">${name}</div>
                    <div class="lecture-room">${room}</div>
                </div>
                <div class="lecture-delete" onclick="deleteLecture(${id})">삭제</div>
            `;
        }
    }

    // ===== 강의 삭제 =====
    window.deleteLecture = function(id) {
        if (confirm('이 강의를 삭제하시겠습니까?')) {
            lectures = lectures.filter(lecture => lecture.id !== id);
            localStorage.setItem('lectures', JSON.stringify(lectures));
            renderLectures();
            alert('❌ 강의가 삭제되었습니다!');
        }
    };

    // ===== 초기 렌더링 =====
    renderLectures();

    // ===== 강의 폼 접기/펼치기 기능 =====
    const toggleLectureFormBtn = document.getElementById('toggleLectureFormBtn');
    const lectureFormSection = document.getElementById('lectureFormSection');
    if (toggleLectureFormBtn && lectureFormSection) {
        toggleLectureFormBtn.addEventListener('click', () => {
            const isCollapsed = lectureFormSection.classList.toggle('collapsed');
            toggleLectureFormBtn.textContent = isCollapsed ? '펼치기' : '접기';
        });
    }

    // ===== 캘린더 관리 =====
    let currentDate = new Date();
    let schedules = JSON.parse(localStorage.getItem('schedules')) || {};
    let selectedDate = null;

    // ===== 캘린더 렌더링 =====
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // 제목 업데이트
        document.getElementById('calendarTitle').textContent = `${year}년 ${month + 1}월`;
        
        // 첫날과 마지막날 구하기
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        
        const firstDayOfWeek = firstDay.getDay();
        const lastDateOfMonth = lastDay.getDate();
        const lastDateOfPrevMonth = prevLastDay.getDate();
        
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        
        // 이전 달 날짜
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = lastDateOfPrevMonth - i;
            calendarDays.appendChild(day);
        }
        
        // 현재 달 날짜
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const today = new Date();
            const isToday = dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            if (isToday) {
                day.classList.add('today');
            }
            
            if (schedules[dateStr]) {
                day.classList.add('has-schedule');
            }
            
            day.textContent = i;
            day.dataset.date = dateStr;
            day.addEventListener('click', function(e) {
                e.preventDefault();
                openScheduleModal(this.dataset.date);
            });
            
            calendarDays.appendChild(day);
        }
        
        // 다음 달 날짜
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6주 * 7일
        for (let i = 1; i <= remainingCells; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }

    // ===== 일정 모달 열기 =====
    window.openScheduleModal = function(dateStr) {
        selectedDate = dateStr;
        const date = new Date(dateStr);
        const dateDisplay = `${date.getMonth() + 1}월 ${date.getDate()}일`;
        document.getElementById('modalDateTitle').textContent = `${dateDisplay} 일정 추가`;
        document.getElementById('scheduleContent').value = '';
        document.getElementById('scheduleModal').classList.remove('hidden');
    };

    // ===== 일정 모달 닫기 =====
    window.closeScheduleModal = function() {
        document.getElementById('scheduleModal').classList.add('hidden');
        selectedDate = null;
    };

    // ===== 일정 추가 =====
    document.getElementById('scheduleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const content = document.getElementById('scheduleContent').value.trim();
        
        if (!content || !selectedDate) {
            alert('일정 내용을 입력해주세요!');
            return;
        }
        
        if (!schedules[selectedDate]) {
            schedules[selectedDate] = [];
        }
        
        schedules[selectedDate].push({
            id: Date.now(),
            content: content
        });
        
        localStorage.setItem('schedules', JSON.stringify(schedules));
        renderCalendar();
        renderWeeklySchedules();
        closeScheduleModal();
        alert('✅ 일정이 추가되었습니다!');
    });

    // ===== 일정 삭제 =====
    window.deleteSchedule = function(dateStr, id) {
        if (confirm('이 일정을 삭제하시겠습니까?')) {
            if (schedules[dateStr]) {
                schedules[dateStr] = schedules[dateStr].filter(s => s.id !== id);
                if (schedules[dateStr].length === 0) {
                    delete schedules[dateStr];
                }
            }
            localStorage.setItem('schedules', JSON.stringify(schedules));
            renderCalendar();
            renderWeeklySchedules();
        }
    };

    // ===== 이번주 일정 렌더링 =====
    function renderWeeklySchedules() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const weeklyList = document.getElementById('weeklyScheduleList');
        weeklyList.innerHTML = '';
        
        const scheduleItems = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
            
            if (schedules[dateStr]) {
                schedules[dateStr].forEach(schedule => {
                    scheduleItems.push({
                        dateStr: dateStr,
                        date: date.getDate(),
                        day: dayName,
                        content: schedule.content,
                        id: schedule.id
                    });
                });
            }
        }
        
        scheduleItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'schedule-item';
            li.innerHTML = `
                <span class="schedule-date">${item.date}</span>
                <span class="schedule-day">(${item.day})</span>
                <span class="schedule-content">${item.content}</span>
                <button class="schedule-delete" onclick="deleteSchedule('${item.dateStr}', ${item.id})">×</button>
            `;
            weeklyList.appendChild(li);
        });
        
        if (scheduleItems.length === 0) {
            weeklyList.innerHTML = '<li style="text-align: center; padding: 15px; color: var(--text-lighter); font-size: 12px;">이번주 일정이 없습니다.</li>';
        }
    }

    // ===== 캘린더 네비게이션 =====
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // 모달 외부 클릭 시 닫기
    document.getElementById('scheduleModal').addEventListener('click', (e) => {
        if (e.target.id === 'scheduleModal') {
            closeScheduleModal();
        }
    });

    // ===== 초기 렌더링 =====
    renderCalendar();
    renderWeeklySchedules();

});


