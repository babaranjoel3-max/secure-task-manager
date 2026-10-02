const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 1;

function updateTaskCounts() {
  const total = taskList.querySelectorAll(".task-item").length;
  const pending = taskList.querySelectorAll('.task-item[data-state="pending"]').length;
  const completed = taskList.querySelectorAll('.task-item[data-state="completed"]').length;

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);

  return li;
}

function addTask(taskText) {
  const trimmedText = taskText.trim();

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";
  const taskId = `task-${taskCounter++}`;
  const taskElement = createTaskElement(trimmedText, taskId);

  taskList.appendChild(taskElement);
  taskInput.value = "";
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  const isCompleted = taskItem.classList.contains("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");

  if (!textSpan) return;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = textSpan.textContent;

  taskItem.replaceChild(input, textSpan);
  editBtn.textContent = "Save";
  taskMessage.textContent = "";
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");

  if (!editInput) return;

  const updatedText = editInput.value.trim();

  if (updatedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";
  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = updatedText;

  taskItem.replaceChild(textSpan, editInput);
  editBtn.textContent = "Edit";
}

function removeTask(taskItem) {
  taskItem.remove();
  taskMessage.textContent = "";
  updateTaskCounts();
}

function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");

  if (!taskItem) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (target.textContent === "Edit") {
      beginTaskEdit(taskItem);
    } else if (target.textContent === "Save") {
      saveTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const samples = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();

  samples.forEach((sampleText) => {
    const taskId = `task-${taskCounter++}`;
    const taskElement = createTaskElement(sampleText, taskId);
    fragment.appendChild(taskElement);
  });

  taskList.appendChild(fragment);
  taskMessage.textContent = "";
  updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => addTask(taskInput.value));

taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskList.addEventListener("click", handleTaskListClick);