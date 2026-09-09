// Store all tasks
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {

    const title = document.getElementById("taskTitle").value;
    const subject = document.getElementById("taskSubject").value;
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;

    // Check required fields
    if (title === "" || subject === "" || date === "") {
        alert("Please fill all fields!");
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        title: title,
        subject: subject,
        date: date,
        priority: priority,
        completed: false
    };

    // Add task to array
    tasks.push(task);
    saveTasks();

    // Clear form
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskSubject").value = "";
    document.getElementById("taskDate").value = "";

    // Display tasks
    displayTasks();
}


// Display tasks
function displayTasks() {

    const taskList = document.getElementById("taskList");

    const searchText =
        document.getElementById("searchTask").value.toLowerCase();

    const filter =
        document.getElementById("filterTask").value;

    taskList.innerHTML = "";

    // Filter tasks
    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            task.subject.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "All" ||
            (filter === "Pending" && !task.completed) ||
            (filter === "Completed" && task.completed);

        return matchesSearch && matchesFilter;
    });


    // Show message if no tasks
    if (filteredTasks.length === 0) {

        taskList.innerHTML = "<p>No tasks found.</p>";

        updateStats();
        return;
    }


    // Create task cards
    filteredTasks.forEach(function(task) {

        const taskCard = document.createElement("div");

        taskCard.className =
            task.completed ? "task-card completed" : "task-card";


        taskCard.innerHTML = `
            <h3>${task.title}</h3>

            <p>📚 Subject: ${task.subject}</p>

            <p>📅 Due Date: ${task.date}</p>

            <p>🔥 Priority: ${task.priority}</p>

            <p>
                Status:
                ${task.completed ? "✅ Completed" : "⏳ Pending"}
            </p>

            <button onclick="completeTask(${task.id})">
                ${task.completed ? "Undo" : "Complete"}
            </button>

            <button onclick="editTask(${task.id})">
                Edit
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(taskCard);
    });


    updateStats();
}


// Complete / Undo task
function completeTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
        task.completed = !task.completed;
    }
    saveTasks();
    displayTasks();
}


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    saveTasks();
    displayTasks();
}


// Edit task
function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const newTitle = prompt("Enter new task title:", task.title);

    if (newTitle !== null && newTitle.trim() !== "") {
        task.title = newTitle;
    }
    saveTasks();
    displayTasks();
}


// Update statistics
function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(function(task) {
            return task.completed;
        }).length;

    const pending = total - completed;


    document.getElementById("totalTasks").textContent = total;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;
}


// Display tasks when page loads
displayTasks();