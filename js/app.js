"use strict";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";

const taskConfig = {
    completeLabel: "Complete",
    editLabel: "Edit",
    saveLabel: "Save",
    removeLabel: "Remove",
    sampleTasks: [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ]
};

let nextTaskId = 1;

function generateTaskId() {
    const taskId = `task-${nextTaskId}`;
    nextTaskId += 1;
    return taskId;
}

function createButton(className, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(className);
    button.textContent = label;
    return button;
}

function createTaskElement(taskText, taskId) {
    const { completeLabel, editLabel, removeLabel } = taskConfig;

    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const taskTextSpan = document.createElement("span");
    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = taskText;

    taskItem.append(
        taskTextSpan,
        createButton("complete-btn", completeLabel),
        createButton("edit-btn", editLabel),
        createButton("remove-btn", removeLabel)
    );

    return taskItem;
}

function addTask(taskText) {
    const text = taskText.trim();

    if (text === "") {
        taskMessage.textContent = EMPTY_MESSAGE;
        return;
    }

    taskList.appendChild(createTaskElement(text, generateTaskId()));

    taskInput.value = "";
    taskMessage.textContent = "";
    updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");
    taskItem.dataset.state = isCompleted ? "completed" : "pending";
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
    editButton.textContent = taskConfig.saveLabel;
    taskMessage.textContent = "";
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
        taskMessage.textContent = EMPTY_MESSAGE;
        editInput.focus();
        return;
    }

    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.textContent = text;

    editInput.replaceWith(taskText);
    editButton.textContent = taskConfig.editLabel;
    taskMessage.textContent = "";
}

function removeTask(taskItem) {
    taskItem.remove();
    taskMessage.textContent = "";
    updateTaskCounts();
}

function updateTaskCounts() {
    const taskItems = Array.from(taskList.querySelectorAll(".task-item"));

    const pending = taskItems.filter(
        (item) => item.dataset.state === "pending"
    ).length;
    const completed = taskItems.filter(
        (item) => item.dataset.state === "completed"
    ).length;

    totalCount.textContent = taskItems.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

function handleTaskListClick(event) {
    const target = event.target;
    const taskItem = target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (target.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
    } else if (target.matches(".edit-btn")) {
        // The presence of the edit input is the real "mode", not the label.
        if (taskItem.querySelector(".edit-input")) {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }
    } else if (target.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}

function loadSampleTasks() {
    const fragment = document.createDocumentFragment();

    taskConfig.sampleTasks.forEach((taskText) => {
        fragment.appendChild(createTaskElement(taskText, generateTaskId()));
    });

    taskList.appendChild(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

updateTaskCounts();