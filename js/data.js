"use strict";

let nextTaskId = 1;

export const sampleTasks = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
];

export function generateTaskId() {
    const taskId = `task-${nextTaskId}`;
    nextTaskId++;
    return taskId;
}
