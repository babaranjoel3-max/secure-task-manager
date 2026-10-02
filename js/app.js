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

const taskData = {
labels: {
complete: "Complete",
edit: "Edit",
save: "Save",
remove: "Remove"
},
samples: [
"Review DOM selectors",
"Practice createElement",
"Study event delegation"
]
};

function createTaskElement(taskText, taskId) {
const {
labels: {
complete,
edit,
remove
}
} = taskData;

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
completeButton.textContent = complete;

const editButton = document.createElement("button");
editButton.type = "button";
editButton.classList.add("edit-btn");
editButton.textContent = edit;

const removeButton = document.createElement("button");
removeButton.type = "button";
removeButton.classList.add("remove-btn");
removeButton.textContent = remove;

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

if (!text) {
    taskMessage.textContent = "Task cannot be empty";
    return;
}

const taskId = `task-${nextTaskId++}`;
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
editButton.textContent = taskData.labels.save;

editInput.focus();


}

function saveTaskEdit(taskItem) {
const editInput = taskItem.querySelector(".edit-input");
const editButton = taskItem.querySelector(".edit-btn");

if (!editInput || !editButton) {
    return;
}

const text = editInput.value.trim();

if (!text) {
    taskMessage.textContent = "Task cannot be empty";
    editInput.focus();
    return;
}

const taskText = document.createElement("span");

taskText.classList.add("task-text");
taskText.textContent = text;

editInput.replaceWith(taskText);
editButton.textContent = taskData.labels.edit;
taskMessage.textContent = "";

updateTaskCounts();


}

function removeTask(taskItem) {
taskItem.remove();
updateTaskCounts();
}

function updateTaskCounts() {
const taskItems = Array.from(
taskList.querySelectorAll(".task-item")
);

const states = taskItems.map(
    ({ dataset }) => dataset.state
);

const pending = states.filter(
    (state) => state === "pending"
).length;

const completed = states.filter(
    (state) => state === "completed"
).length;

const counts = {
    total: taskItems.length,
    pending,
    completed
};

const {
    total,
    pending: pendingCountValue,
    completed: completedCountValue
} = counts;

totalCount.textContent = total;
pendingCount.textContent = pendingCountValue;
completedCount.textContent = completedCountValue;


}

function handleTaskListClick(event) {
const target = event.target;

if (!(target instanceof Element)) {
    return;
}

if (
    !target.matches(".complete-btn") &&
    !target.matches(".edit-btn") &&
    !target.matches(".remove-btn")
) {
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
    if (target.textContent === taskData.labels.save) {
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
samples
} = taskData;

const fragment = document.createDocumentFragment();

samples.forEach((taskText) => {
    const taskId = `task-${nextTaskId++}`;
    const taskItem = createTaskElement(taskText, taskId);

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