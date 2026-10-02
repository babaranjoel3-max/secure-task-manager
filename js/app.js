"use strict";

import {
    generateTaskId,
    getSampleTasks
} from "./data.js";

import {
    isBlankText,
    countTaskStates
} from "./utils.js";

import {
    createTaskElement as createTaskElementDisplay,
    updateCountsDisplay
} from "./display.js";


// --------------------------------------------------
// DOM SELECTORS
// --------------------------------------------------

const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");

const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");


// --------------------------------------------------
// CREATE TASK ELEMENT
// --------------------------------------------------

function createTaskElement(taskText, taskId) {
    return createTaskElementDisplay(taskText, taskId);
}


// --------------------------------------------------
// ADD TASK
// --------------------------------------------------

function addTask(taskText) {
    const trimmedText = taskText.trim();

    if (isBlankText(trimmedText)) {
        taskMessage.textContent = "Task cannot be empty";
        taskInput.focus();

        return;
    }

    const taskId = generateTaskId();

    const taskItem = createTaskElement(
        trimmedText,
        taskId
    );

    taskList.append(taskItem);

    taskInput.value = "";
    taskMessage.textContent = "";

    updateTaskCounts();

    taskInput.focus();
}


// --------------------------------------------------
// TOGGLE TASK COMPLETE
// --------------------------------------------------

function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");

    taskItem.dataset.state = isCompleted
        ? "completed"
        : "pending";

    updateTaskCounts();
}


// --------------------------------------------------
// BEGIN TASK EDIT
// --------------------------------------------------

function beginTaskEdit(taskItem) {
    const taskTextSpan = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!taskTextSpan || !editButton) {
        return;
    }

    const currentText = taskTextSpan.textContent;

    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = currentText;

    taskTextSpan.replaceWith(editInput);

    editButton.textContent = "Save";

    taskMessage.textContent = "";

    editInput.focus();
    editInput.select();
}


// --------------------------------------------------
// SAVE TASK EDIT
// --------------------------------------------------

function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!editInput || !editButton) {
        return;
    }

    const editedText = editInput.value.trim();

    if (isBlankText(editedText)) {
        taskMessage.textContent = "Task cannot be empty";
        editInput.focus();

        return;
    }

    const taskTextSpan = document.createElement("span");

    taskTextSpan.classList.add("task-text");

    taskTextSpan.textContent = editedText;

    editInput.replaceWith(taskTextSpan);

    editButton.textContent = "Edit";

    taskMessage.textContent = "";
}


// --------------------------------------------------
// REMOVE TASK
// --------------------------------------------------

function removeTask(taskItem) {
    taskItem.remove();

    updateTaskCounts();
}


// --------------------------------------------------
// UPDATE TASK COUNTS
// --------------------------------------------------

function updateTaskCounts() {
    const taskItems = taskList.querySelectorAll(".task-item");

    const counts = countTaskStates(taskItems);

    updateCountsDisplay(
        totalCount,
        pendingCount,
        completedCount,
        counts
    );
}


// --------------------------------------------------
// EVENT DELEGATION
// --------------------------------------------------

function handleTaskListClick(event) {
    const clickedButton = event.target;

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


// --------------------------------------------------
// LOAD SAMPLE TASKS
// --------------------------------------------------

function loadSampleTasks() {
    const samples = getSampleTasks();

    const fragment = document.createDocumentFragment();

    samples.forEach((taskText) => {
        const taskId = generateTaskId();

        const taskItem = createTaskElement(
            taskText,
            taskId
        );

        fragment.append(taskItem);
    });

    // The fragment is appended exactly once.
    taskList.append(fragment);

    taskMessage.textContent = "";

    updateTaskCounts();
}


// --------------------------------------------------
// EVENT LISTENERS
// --------------------------------------------------

addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
});

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);


// Exactly ONE delegated task-list click listener.
taskList.addEventListener(
    "click",
    handleTaskListClick
);


// --------------------------------------------------
// INITIAL APPLICATION STATE
// --------------------------------------------------

updateTaskCounts();
