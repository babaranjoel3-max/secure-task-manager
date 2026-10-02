import { taskConfig } from "./data.js";

export function createTaskElement(taskText, taskId) {
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
completeButton.textContent = taskConfig.labels.complete;

const editButton = document.createElement("button");
editButton.type = "button";
editButton.classList.add("edit-btn");
editButton.textContent = taskConfig.labels.edit;

const removeButton = document.createElement("button");
removeButton.type = "button";
removeButton.classList.add("remove-btn");
removeButton.textContent = taskConfig.labels.remove;

taskItem.append(
    taskTextSpan,
    completeButton,
    editButton,
    removeButton
);

return taskItem;


}

export function createEditInput(currentText) {
const editInput = document.createElement("input");

editInput.type = "text";
editInput.classList.add("edit-input");
editInput.value = currentText;

return editInput;


}

export function createTaskText(text) {
const taskText = document.createElement("span");

taskText.classList.add("task-text");
taskText.textContent = text;

return taskText;


}

export function updateCountDisplay(
totalElement,
pendingElement,
completedElement,
counts
) {
const {
total,
pending,
completed
} = counts;

totalElement.textContent = total;
pendingElement.textContent = pending;
completedElement.textContent = completed;


}