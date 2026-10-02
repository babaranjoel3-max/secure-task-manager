const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskIdCounter = 0;


/* --------------------------------
   CREATE TASK ELEMENT
-------------------------------- */

function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");

    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = taskText;

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.type = "button";
    completeBtn.textContent = "Complete";

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.type = "button";
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";

    taskItem.appendChild(textSpan);
    taskItem.appendChild(completeBtn);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(removeBtn);

    return taskItem;
}


/* --------------------------------
   ADD TASK
-------------------------------- */

function addTask(taskText) {
    const trimmedText = taskText.trim();

    if (trimmedText === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    taskIdCounter++;

    const taskId = `task-${taskIdCounter}`;

    const taskItem = createTaskElement(trimmedText, taskId);

    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskMessage.textContent = "";

    updateTaskCounts();
}


/* --------------------------------
   TOGGLE COMPLETE
-------------------------------- */

function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");

    if (taskItem.dataset.state === "pending") {
        taskItem.dataset.state = "completed";
    } else {
        taskItem.dataset.state = "pending";
    }

    updateTaskCounts();
}


/* --------------------------------
   BEGIN EDIT
-------------------------------- */

function beginTaskEdit(taskItem) {
    const taskText = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!taskText || !editButton) {
        return;
    }

    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = taskText.textContent;

    taskText.replaceWith(editInput);

    editButton.textContent = "Save";
}


/* --------------------------------
   SAVE EDIT
-------------------------------- */

function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!editInput || !editButton) {
        return;
    }

    const updatedText = editInput.value.trim();

    if (updatedText === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const newTextSpan = document.createElement("span");

    newTextSpan.classList.add("task-text");
    newTextSpan.textContent = updatedText;

    editInput.replaceWith(newTextSpan);

    editButton.textContent = "Edit";

    taskMessage.textContent = "";
}


/* --------------------------------
   REMOVE TASK
-------------------------------- */

function removeTask(taskItem) {
    taskItem.remove();

    updateTaskCounts();
}


/* --------------------------------
   UPDATE COUNTS
-------------------------------- */

function updateTaskCounts() {
    const tasks = taskList.querySelectorAll(".task-item");

    let pending = 0;
    let completed = 0;

    tasks.forEach(function (taskItem) {
        if (taskItem.dataset.state === "completed") {
            completed++;
        } else {
            pending++;
        }
    });

    totalCount.textContent = tasks.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}


/* --------------------------------
   EVENT DELEGATION
-------------------------------- */

function handleTaskListClick(event) {
    const clickedButton = event.target;

    if (
        !clickedButton.matches(".complete-btn") &&
        !clickedButton.matches(".edit-btn") &&
        !clickedButton.matches(".remove-btn")
    ) {
        return;
    }

    const taskItem = clickedButton.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (clickedButton.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
        return;
    }

    if (clickedButton.matches(".edit-btn")) {
        if (clickedButton.textContent === "Edit") {
            beginTaskEdit(taskItem);
        } else {
            saveTaskEdit(taskItem);
        }

        return;
    }

    if (clickedButton.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}


/* --------------------------------
   LOAD SAMPLE TASKS
-------------------------------- */

function loadSampleTasks() {
    const fragment = document.createDocumentFragment();

    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    sampleTasks.forEach(function (taskText) {
        taskIdCounter++;

        const taskId = `task-${taskIdCounter}`;

        const taskItem = createTaskElement(taskText, taskId);

        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);

    taskMessage.textContent = "";

    updateTaskCounts();
}


/* --------------------------------
   EVENT LISTENERS
-------------------------------- */

addTaskBtn.addEventListener("click", function () {
    addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", function () {
    loadSampleTasks();
});

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});


/*
   Exactly ONE delegated click
   listener for task actions.
*/

taskList.addEventListener("click", handleTaskListClick);


/* --------------------------------
   INITIAL STATE
-------------------------------- */

updateTaskCounts();