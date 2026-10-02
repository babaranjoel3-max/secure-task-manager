"use strict";

import {
    sampleTasks,
    generateTaskId
} from "./data.js";

import {
    isValidTaskText
} from "./utils.js";

import {
    createTaskElement,
    updateTaskCounts
} from "./display.js";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

function refreshCounts() {
    updateTaskCounts(
        taskList,
        totalCount,
        pendingCount,
        completedCount
    );
}

function addTask(taskText) {
    if (!isValidTaskText(taskText)) {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const taskId = generateTaskId();
    const taskItem = createTaskElement(taskText, taskId);

    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskMessage.textContent = "";

    refreshCounts();
}

function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");

    taskItem.dataset.state = isCompleted
        ? "completed"
        : "pending";

    refreshCounts();
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

    if (!isValidTaskText(editInput.value)) {
        taskMessage.textContent = "Task cannot be empty";
        editInput.focus();
        return;
    }

    const taskText = document.createElement("span");

    taskText.classList.add("task-text");
    taskText.textContent = editInput.value;

    editInput.replaceWith(taskText);
    editButton.textContent = "Edit";
    taskMessage.textContent = "";
}

function removeTask(taskItem) {
    taskItem.remove();
    refreshCounts();
}

function handleTaskListClick(event) {
    const target = event.target;

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
    const fragment = document.createDocumentFragment();

    sampleTasks.forEach((taskText) => {
        const taskId = generateTaskId();
        const taskItem = createTaskElement(taskText, taskId);

        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);

    taskMessage.textContent = "";

    refreshCounts();
}

addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskList.addEventListener("click", handleTaskListClick);

refreshCounts();
