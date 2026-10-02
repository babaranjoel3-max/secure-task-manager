export function validateTaskText(text) {
const trimmedText = text.trim();

return {
    valid: trimmedText !== "",
    text: trimmedText
};


}

export function generateTaskId(id) {
return "task-" + id;
}