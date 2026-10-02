"use strict";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let nextTaskId = 1;

const taskConfig = {
completeLabel: "Complete",
editLabel: "Edit",
removeLabel: "Remove",
sampleTasks: [
"Review DOM selectors",
"Practice createElement",
"Study event delegation"
]
};

function createTaskElement(taskText, taskId) {
const {
completeLabel,
editLabel,
removeLabel
} = taskConfig;

const taskItem = document.createElement("li");
taskItem.classList.add("task-item");
taskItem.dataset.taskId = taskId;
taskItem.dataset.state = "pending";

const taskTextSpan = document.createElement("span");
taskTextSpan.classList.add("task-text");
taskTextSpan.textContent = taskText;

const completeButton = document.createElement("button");
completeButton.type = "button";
completeButton.classList.add("complete-btn");
completeButton.textContent = completeLabel;

const editButton = document.createElement("button");
editButton.type = "button";
editButton.classList.add("edit-btn");
editButton.textContent = editLabel;

const removeButton = document.createElement("button");
removeButton.type = "button";
removeButton.classList.add("remove-btn");
removeButton.textContent = removeLabel;

taskItem.append(
    taskTextSpan,
    completeButton,
    editButton,
    removeButton
);

return taskItem;


}

function addTask(taskText) {
const text = taskText.trim();

if (text === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
}

const task = {
    id: `task-${nextTaskId}`,
    text,
    state: "pending"
};

nextTaskId += 1;

const {
    id: taskId,
    text: safeTaskText,
    state
} = task;

const taskItem = createTaskElement(safeTaskText, taskId);
taskItem.dataset.state = state;

taskList.appendChild(taskItem);

taskInput.value = "";
taskMessage.textContent = "";

updateTaskCounts();


}

function toggleTaskComplete(taskItem) {
const isCompleted = taskItem.classList.toggle("completed");

taskItem.dataset.state = isCompleted
    ? "completed"
    : "pending";

updateTaskCounts();


}

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

editInput.focus();


}

function saveTaskEdit(taskItem) {
const editInput = taskItem.querySelector(".edit-input");
const editButton = taskItem.querySelector(".edit-btn");

if (!editInput || !editButton) {
    return;
}

const text = editInput.value.trim();

if (text === "") {
    taskMessage.textContent = "Task cannot be empty";
    editInput.focus();
    return;
}

const taskText = document.createElement("span");

taskText.classList.add("task-text");
taskText.textContent = text;

editInput.replaceWith(taskText);
editButton.textContent = "Edit";
taskMessage.textContent = "";


}

function removeTask(taskItem) {
taskItem.remove();
updateTaskCounts();
}

function getTaskItems() {
return Array.from(
taskList.querySelectorAll(".task-item")
);
}

function updateTaskCounts() {
const taskItems = getTaskItems();

const pendingTasks = taskItems.filter(
    ({ dataset }) => dataset.state === "pending"
);

const completedTasks = taskItems.filter(
    ({ dataset }) => dataset.state === "completed"
);

const counts = {
    total: taskItems.length,
    pending: pendingTasks.length,
    completed: completedTasks.length
};

const {
    total,
    pending,
    completed
} = counts;

totalCount.textContent = total;
pendingCount.textContent = pending;
completedCount.textContent = completed;


}

function handleTaskListClick(event) {
const target = event.target;

if (!(target instanceof Element)) {
    return;
}

const taskItem = target.closest(".task-item");

if (!taskItem) {
    return;
}

if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
    return;
}

if (target.matches(".edit-btn")) {
    if (target.textContent === "Save") {
        saveTaskEdit(taskItem);
    } else {
        beginTaskEdit(taskItem);
    }

    return;
}

if (target.matches(".remove-btn")) {
    removeTask(taskItem);
}


}

function loadSampleTasks() {
const {
sampleTasks
} = taskConfig;

const fragment = document.createDocumentFragment();

sampleTasks.forEach((taskText) => {
    const taskId = `task-${nextTaskId}`;
    nextTaskId += 1;

    const taskItem = createTaskElement(
        taskText,
        taskId
    );

    fragment.appendChild(taskItem);
});

taskList.appendChild(fragment);

taskMessage.textContent = "";

updateTaskCounts();


}

addTaskBtn.addEventListener("click", () => {
addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskList.addEventListener("click", handleTaskListClick);

taskInput.addEventListener("keydown", (event) => {
if (event.key === "Enter") {
addTask(taskInput.value);
}
});

updateTaskCounts();