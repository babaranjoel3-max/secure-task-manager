import {
taskConfig,
initialState
} from "./data.js";

import {
validateTaskText,
generateTaskId
} from "./utils.js";

import {
createTaskElement,
createEditInput,
createTaskText,
updateCountDisplay
} from "./display.js";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let nextTaskId = initialState.nextTaskId;

export function createTaskElement(taskText, taskId) {
return createTaskElement(taskText, taskId);
}

export function addTask(taskText) {
const result = validateTaskText(taskText);

if (!result.valid) {
    taskMessage.textContent = "Task cannot be empty";
    return;
}

const taskId = generateTaskId(nextTaskId);
nextTaskId += 1;

const taskItem = createTaskElement(result.text, taskId);

taskList.appendChild(taskItem);

taskInput.value = "";
taskMessage.textContent = "";

updateTaskCounts();


}

export function toggleTaskComplete(taskItem) {
const isCompleted = taskItem.classList.toggle("completed");

taskItem.dataset.state = isCompleted
    ? "completed"
    : "pending";

updateTaskCounts();


}

export function beginTaskEdit(taskItem) {
const taskText = taskItem.querySelector(".task-text");
const editButton = taskItem.querySelector(".edit-btn");

if (!taskText || !editButton) {
    return;
}

const editInput = createEditInput(taskText.textContent);

taskText.replaceWith(editInput);
editButton.textContent = taskConfig.labels.save;

editInput.focus();


}

export function saveTaskEdit(taskItem) {
const editInput = taskItem.querySelector(".edit-input");
const editButton = taskItem.querySelector(".edit-btn");

if (!editInput || !editButton) {
    return;
}

const result = validateTaskText(editInput.value);

if (!result.valid) {
    taskMessage.textContent = "Task cannot be empty";
    editInput.focus();
    return;
}

const taskText = createTaskText(result.text);

editInput.replaceWith(taskText);
editButton.textContent = taskConfig.labels.edit;
taskMessage.textContent = "";

updateTaskCounts();


}

export function removeTask(taskItem) {
taskItem.remove();
updateTaskCounts();
}

export function updateTaskCounts() {
const taskItems = taskList.querySelectorAll(".task-item");

let pending = 0;
let completed = 0;

taskItems.forEach((taskItem) => {
    if (taskItem.dataset.state === "pending") {
        pending++;
    } else if (taskItem.dataset.state === "completed") {
        completed++;
    }
});

totalCount.textContent = taskItems.length;
pendingCount.textContent = pending;
completedCount.textContent = completed;


}

export function handleTaskListClick(event) {
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
    if (target.textContent === taskConfig.labels.save) {
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

export function loadSampleTasks() {
const fragment = document.createDocumentFragment();

taskConfig.sampleTasks.forEach((taskText) => {
    const taskId = generateTaskId(nextTaskId);
    nextTaskId += 1;

    const taskItem = createTaskElement(taskText, taskId);

    fragment.appendChild(taskItem);
});

taskList.appendChild(fragment);

taskMessage.textContent = "";

updateTaskCounts();


}

export function initializeTaskManager() {
addTaskBtn.addEventListener("click", () => {
addTask(taskInput.value);
});

loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);

taskList.addEventListener(
    "click",
    handleTaskListClick
);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

updateTaskCounts();


}