"use strict";

export function isValidTaskText(text) {
    return text.trim() !== "";
}

export function getTaskStateCounts(taskItems) {
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

    return {
        total: taskItems.length,
        pending,
        completed
    };
}
