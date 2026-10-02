"use strict";

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

export function updateTaskCounts(taskList, totalCount, pendingCount, completedCount) {
    const taskItems = taskList.querySelectorAll(".task-item");

    let pending = 0;
    let completed = 0;

    taskItems.forEach((taskItem) => {
        if (taskItem.dataset.state === "pending") {
            pending++;
        }

        if (taskItem.dataset.state === "completed") {
            completed++;
        }
    });

    totalCount.textContent = taskItems.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}
