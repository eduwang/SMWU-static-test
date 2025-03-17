document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("todo-input");
    const addButton = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");

    // 🟢 로컬 저장소에서 저장된 할 일 불러오기
    const loadTodos = () => {
        const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
        savedTodos.forEach(todo => addTodo(todo.text, todo.completed));
    };

    // 🟢 할 일 추가 함수
    const addTodo = (text, completed = false) => {
        if (!text.trim()) return;

        const li = document.createElement("li");
        li.classList.add("todo-item");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.addEventListener("change", () => {
            saveTodos();
            li.classList.toggle("completed", checkbox.checked);
        });

        const span = document.createElement("span");
        span.textContent = text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);

        saveTodos();
    };

    // 🟢 할 일 저장 함수 (로컬 저장소)
    const saveTodos = () => {
        const todos = [];
        document.querySelectorAll(".todo-item").forEach(li => {
            todos.push({
                text: li.querySelector("span").textContent,
                completed: li.querySelector("input").checked
            });
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    // 🟢 추가 버튼 클릭 시 할 일 추가
    addButton.addEventListener("click", () => {
        addTodo(inputField.value);
        inputField.value = "";
    });

    // 🟢 Enter 키 입력 시 할 일 추가
    inputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTodo(inputField.value);
            inputField.value = "";
        }
    });

    // 🟢 페이지 로드 시 저장된 할 일 불러오기
    loadTodos();
});

document.addEventListener("DOMContentLoaded", () => {
    const calendarEl = document.getElementById("calendar");

    const renderCalendar = (year, month) => {
        calendarEl.innerHTML = ""; // 기존 달력 초기화

        const currentDate = new Date(year, month, 1);
        const monthName = currentDate.toLocaleString("ko-KR", { month: "long" });
        const firstDay = currentDate.getDay(); // 0(일) ~ 6(토)
        const lastDate = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜
        
        // 헤더 추가
        const header = document.createElement("div");
        header.classList.add("calendar-header");
        header.innerHTML = `<span>${year}년 ${monthName}</span>`;
        calendarEl.appendChild(header);

        // 요일 추가
        const daysContainer = document.createElement("div");
        daysContainer.classList.add("calendar-days");
        ["일", "월", "화", "수", "목", "금", "토"].forEach(day => {
            const dayEl = document.createElement("div");
            dayEl.textContent = day;
            daysContainer.appendChild(dayEl);
        });
        calendarEl.appendChild(daysContainer);

        // 날짜 추가
        const gridContainer = document.createElement("div");
        gridContainer.classList.add("calendar-grid");

        // 빈칸 추가 (첫 요일 맞추기)
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("empty");
            gridContainer.appendChild(emptyCell);
        }

        // 날짜 채우기
        for (let day = 1; day <= lastDate; day++) {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            gridContainer.appendChild(dayCell);
        }

        calendarEl.appendChild(gridContainer);
    };

    // 현재 날짜 기준으로 달력 생성
    const today = new Date();
    renderCalendar(today.getFullYear(), today.getMonth());
});
