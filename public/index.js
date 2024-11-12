// 1. DOM Elements
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskNameInput = document.getElementById("task-name");
const pomodoroGoalInput = document.getElementById("pomodoro-goal");

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const progressContainer = document.querySelector('.progress-container');  // Select the progress container

// State Variables
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];  // Array to store tasks
let currentTaskId = null;  // ID of the task currently being worked on
let timerInterval = null;  // Timer interval ID
let timeRemaining = 1500;  // Default 25 minutes in seconds (25*60)

// Circle Progress
const progressCircle = document.querySelector('.progress-ring__circle');
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

// Function to set the progress on the circle
function setProgress(timeFraction) {
    const offset = circumference * (1 - timeFraction);
    progressCircle.style.strokeDashoffset = offset;
}

// 2. Initialize the App
function init() {
    renderTasks();
    renderTimer();
    updateTimerDisplay(); // Initial display update based on currentTaskId
}
init();

// 3. Task Management Functions

// Add a new task and store it in local storage
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskName = taskNameInput.value.trim();
    const pomodoroGoal = parseInt(pomodoroGoalInput.value, 10);
    
    if (!taskName || pomodoroGoal < 1) {
        alert("Please enter a valid task name and goal.");
        return;
    }

    const newTask = {
        id: Date.now(),
        name: taskName,
        pomodoroGoal: pomodoroGoal,
        completedPomodoros: 0
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
});

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks in the task list
function renderTasks() {
    taskList.innerHTML = "";  // Clear the current list of tasks

    tasks.forEach(task => {
        const taskItem = document.createElement("li");

        // Display task name and progress
        const taskContent = document.createElement("span");
        taskContent.textContent = `${task.name}, ${task.completedPomodoros}/${task.pomodoroGoal}`;
        taskItem.appendChild(taskContent);

        // Apply a selected style if the task is currently selected
        if (task.id === currentTaskId) {
            taskItem.classList.add("selected-task");  // Add the CSS class for selection
        }

        // Button container
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent selecting the task when editing
            editTask(task.id);
        });
        buttonContainer.appendChild(editButton);

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent selecting the task when deleting
            deleteTask(task.id);
        });
        buttonContainer.appendChild(deleteButton);

        taskItem.appendChild(buttonContainer); // Add buttons to task item

        // Add click event listener to select the task
        taskItem.addEventListener("click", () => selectTask(task.id));

        taskList.appendChild(taskItem);  // Add the task to the list
    });
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Prompt user for new task name and goal
    const newName = prompt("Edit task name:", task.name);
    const newGoal = parseInt(prompt("Edit Pomodoro goal:", task.pomodoroGoal), 10);

    if (newName && newGoal > 0) {
        task.name = newName;
        task.pomodoroGoal = newGoal;
        saveTasks(); // Save updated task to local storage
        renderTasks(); // Re-render the task list
    } else {
        alert("Invalid task name or goal.");
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();  // Save updated task list to local storage
    renderTasks(); // Re-render the task list
}

// Select a task to work on
function selectTask(taskId) {
    // Toggle task selection
    if (currentTaskId === taskId) {
        currentTaskId = null;  // Unselect the task
    } else {
        currentTaskId = taskId;  // Select the new task
    }

    resetTimer();  // Optionally reset the timer when switching/unselecting tasks
    updateTimerDisplay(); // Update the timer display visibility
    renderTasks(); // Re-render the task list to reflect the selection state
}


// Update the timer display based on task selection
function updateTimerDisplay() {
    if (currentTaskId !== null) {
        progressContainer.classList.add('active');
        timerDisplay.classList.add('active');
    } else {
        progressContainer.classList.remove('active');
        timerDisplay.classList.remove('active');
    }
}

// 4. Timer Management Functions

// Start the timer
startBtn.addEventListener("click", () => {
    if (!currentTaskId) {
        alert("Please select a task to start the timer.");
        return;
    }
    if (!timerInterval) {
        timerInterval = setInterval(countdown, 1000);
    }
});

// Pause the timer
pauseBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// Reset the timer
resetBtn.addEventListener("click", resetTimer);

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = 1500;  // Reset to 25 minutes
    renderTimer();
    setProgress(1);  // Reset circle progress to full
}

// Countdown function to update the timer display
function countdown() {
    if (timeRemaining > 0) {
        timeRemaining--;
        renderTimer();

        // Update the circle progress
        const timeFraction = timeRemaining / 1500;
        setProgress(timeFraction);
    } else {
        completePomodoro();
        resetTimer();
    }
}

// Render the timer display
function renderTimer() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// 5. Pomodoro Completion Logic

function completePomodoro() {
    if (currentTaskId !== null) {
        const currentTask = tasks.find(task => task.id === currentTaskId);

        if (currentTask && currentTask.completedPomodoros < currentTask.pomodoroGoal) {
            currentTask.completedPomodoros++;
            saveTasks();
            renderTasks();

            // Check if task goal is met
            if (currentTask.completedPomodoros === currentTask.pomodoroGoal) {
                alert(`Task "${currentTask.name}" completed!`);
                currentTaskId = null;  // Deselect the task after completion
                resetTimer();  // Reset timer after task completion
                updateTimerDisplay(); // Update timer visibility after task completion
            }
        }
    }
}
