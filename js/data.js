"use strict";

let nextTaskId = 1;

const sampleTasks = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
];

export function generateTaskId() {
    const taskId = `task-${nextTaskId}`;

    nextTaskId += 1;

    return taskId;
}

export function getSampleTasks() {
    return [...sampleTasks];
}
