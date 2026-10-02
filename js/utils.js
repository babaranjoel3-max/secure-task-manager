"use strict";

export function isBlankText(text) {
    return text.trim() === "";
}

export function getTaskState(taskItem) {
    return taskItem.dataset.state;
}

export function countTaskStates(taskItems) {
    const states = [...taskItems].map(
        (taskItem) => taskItem.dataset.state
    );

    const completed = states.filter(
        (state) => state === "completed"
    ).length;

    const pending = states.filter(
        (state) => state === "pending"
    ).length;

    return {
        total: taskItems.length,
        pending,
        completed
    };
}
