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

function createTaskElement(taskText, taskId) {
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
completeButton.textContent = "Complete";

const editButton = document.createElement("button");
editButton.type = "button";
editButton.classList.add("edit-btn");
editButton.textContent = "Edit";

const removeButton = document.createElement("button");
removeButton.type = "button";
removeButton.classList.add("remove-btn");
removeButton.textContent = "Remove";

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

const taskId = `task-${nextTaskId}`;
nextTaskId++;

const taskItem = createTaskElement(text, taskId);

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

function updateTaskCounts() {
const taskItems = taskList.querySelectorAll(".task-item");

const counts = {
    total: taskItems.length,
    pending: 0,
    completed: 0
};

taskItems.forEach((taskItem) => {
    const { state } = taskItem.dataset;

    if (state === "completed") {
        counts.completed++;
    } else if (state === "pending") {
        counts.pending++;
    }
});

totalCount.textContent = counts.total;
pendingCount.textContent = counts.pending;
completedCount.textContent = counts.completed;


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
const sampleTasks = [
{ text: "Review DOM selectors" },
{ text: "Practice createElement" },
{ text: "Study event delegation" }
];

const fragment = document.createDocumentFragment();

sampleTasks.forEach(({ text }) => {
    const taskId = `task-${nextTaskId}`;
    nextTaskId++;

    const taskItem = createTaskElement(text, taskId);

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