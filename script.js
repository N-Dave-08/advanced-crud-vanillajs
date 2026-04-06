/**
 * --- INITIAL STATE ---
 * Single source of truth for the entire application.
 */

let state = {
  tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  filter: "all", // 'all' | 'active' | 'completed'
  sortBy: "manual",
  searchQuery: "",
};
let draggedItemIndex = null;
const taskList = document.getElementById("task-list");

// --- PERSISTENCE ---
const saveToDisk = () => {
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
};

// sanitize HTML to prevent XSS
const escapeHTML = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

/**
 * --- CORE LOGIC (CRUD) ---
 * These functions mutate the state and trigger a re-render.
 */
const addTask = (text, priority) => {
  const newTask = {
    id: crypto.randomUUID(),
    text,
    priority,
    completed: false,
    createdAt: Date.now(),
  };

  state.tasks.unshift(newTask);
  saveToDisk();
  render();
};

const deleteTask = (id) => {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  saveToDisk();
  render();
};

const toggleTask = (id) => {
  const task = state.tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  saveToDisk();
  render();
};

const reorderTasks = (fromIndex, toIndex) => {
  const [movedItem] = state.tasks.splice(fromIndex, 1);
  state.tasks.splice(toIndex, 0, movedItem);
  saveToDisk();
  render();
};

/**
 * --- DATA TRANSFORMATION ---
 * This creates a "view" of our data without changing the original array.
 */
const getProcessedTasks = () => {
  let filtered = [...state.tasks];

  // 1. Filter by Status
  if (state.filter === "active")
    filtered = filtered.filter((t) => !t.completed);
  if (state.filter === "completed")
    filtered = filtered.filter((t) => t.completed);

  // 2. Filter by Search
  if (state.searchQuery) {
    filtered = filtered.filter((t) =>
      t.text.toLowerCase().includes(state.searchQuery),
    );
  }

  // 3. Sort Logic
  if (state.sortBy === "priority") {
    const weights = { high: 3, medium: 2, low: 1 };
    filtered.sort((a, b) => weights[b.priority] - weights[a.priority]);
  } else if (state.sortBy === "createdAt") {
    filtered.sort((a, b) => b.createdAt - a.createdAt);
  }

  return filtered;
};

/**
 * --- RENDER ENGINE ---
 * Optimized using DocumentFragment to avoid layout thrashing.
 */
const render = () => {
  const taskList = document.getElementById("task-list");

  const fragment = document.createDocumentFragment();
  const tasksToShow = getProcessedTasks();

  taskList.innerHTML = "";

  tasksToShow.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.id = task.id;
    li.dataset.index = index;
    li.draggable = true;

    li.innerHTML = `
    <div class="drag-handle">⁝⁝</div>
      <input type="checkbox" ${task.completed ? "checked" : ""} class="toggle-check">
      <span class="task-text">${escapeHTML(task.text)}</span>
      <span class="priority-badge ${task.priority}">${task.priority}</span>
      <button class="delete-btn">remove</button>
    `;

    fragment.appendChild(li);
  });

  taskList.appendChild(fragment);
};

/**
 * --- EVENT LISTENERS & DELEGATION ---
 */

// Add Task Trigger
document.getElementById("add-btn").addEventListener("click", () => {
  const input = document.getElementById("task-input");
  const priority = document.getElementById("priority-input");

  if (input.value.trim()) {
    addTask(input.value.trim(), priority.value);
    input.value = "";
    input.focus();
  }
});

// Task List Delegation (Delete & Toggle)
document.getElementById("task-list").addEventListener("click", (e) => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    deleteTask(id);
  } else if (e.target.classList.contains("toggle-check")) {
    toggleTask(id);
  }
});

// Drag & Drop
taskList.addEventListener("dragstart", (e) => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  draggedItemIndex = parseInt(item.dataset.index);
  setTimeout(() => item.classList.add("dragging"), 0);
});

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const overItem = e.target.closest(".task-item");
  if (overItem) overItem.classList.add("drag-over");
});

taskList.addEventListener("dragleave", (e) => {
  const overItem = e.target.closest(".task-item");
  if (overItem) overItem.classList.remove("drag-over");
});

taskList.addEventListener("drop", (e) => {
  e.preventDefault();
  const dropItem = e.target.closest(".task-item");
  if (!dropItem) return;
  reorderTasks(draggedItemIndex, parseInt(dropItem.dataset.index));
});

taskList.addEventListener("dragend", (e) => {
  const item = e.target.closest(".task-item");
  if (item) item.classList.remove("dragging");
  document
    .querySelectorAll(".task-item")
    .forEach((el) => el.classList.remove("drag-over"));
});

// Filter Navigation
document.querySelector(".filters").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    state.filter = e.target.dataset.filter;

    // UI Update for active button
    document
      .querySelectorAll(".filters button")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    render();
  }
});

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme", !isDark);
  localStorage.setItem("theme", isDark ? "dark-theme" : "light-theme");
});

// Search with Debounce
const debounce = (func, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const handleSearch = debounce((query) => {
  state.searchQuery = query.toLowerCase();
  render();
});

document.getElementById("search-task").addEventListener("input", (e) => {
  handleSearch(e.target.value);
});

// Initial Render on Load
render();
