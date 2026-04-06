/**
 * VIEW: Manages the DOM and User Interface.
 */
export default class TaskView {
  constructor() {
    this.taskList = document.getElementById("task-list");
    this.input = document.getElementById("task-input");
    this.priority = document.getElementById("priority-input");
    this.addBtn = document.getElementById("add-btn");
    this.search = document.getElementById("search-task");
    this.filters = document.querySelector(".filters");
    this.sortSelect = document.getElementById("sort-select");
  }

  escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  render(tasks) {
    this.taskList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.dataset.id = task.id;
      li.dataset.index = index;
      li.draggable = true;
      li.innerHTML = `
        <div class="drag-handle">⁝⁝</div>
        <input type="checkbox" ${task.completed ? "checked" : ""} class="toggle-check">
        <span class="task-text">${this.escapeHTML(task.text)}</span>
        <span class="priority-badge ${task.priority}">${task.priority}</span>
        <div class="actions">
          <button class="edit-btn">edit</button>
          <button class="delete-btn">remove</button>
        </div>
      `;
      fragment.appendChild(li);
    });
    this.taskList.appendChild(fragment);
  }

  // BINDERS: Connect UI events to Controller logic
  bindAddTask(handler) {
    this.addBtn.addEventListener("click", () => {
      if (this.input.value.trim()) {
        handler(this.input.value.trim(), this.priority.value);
        this.input.value = "";
      }
    });
  }

  bindEditTask(handler) {
    this.taskList.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const li = e.target.closest(".task-item");
        const id = li.dataset.id;
        const span = li.querySelector(".task-text");
        const btn = e.target;

        if (btn.textContent === "edit") {
          const input = document.createElement("input");
          input.type = "text";
          input.className = "edit-input";
          input.value = span.textContent;

          li.replaceChild(input, span);
          btn.textContent = "save";
          input.focus();
        } else {
          const input = li.querySelector(".edit-input");
          handler(id, input.value);
          btn.textContent = "edit";
        }
      }
    });
  }

  bindTaskActions(toggleHandler, deleteHandler) {
    this.taskList.addEventListener("click", (e) => {
      const id = e.target.closest(".task-item")?.dataset.id;
      if (e.target.classList.contains("delete-btn")) deleteHandler(id);
      if (e.target.classList.contains("toggle-check")) toggleHandler(id);
    });
  }

  bindSearch(handler) {
    this.search.addEventListener("input", (e) => handler(e.target.value));
  }

  bindFilter(handler) {
    this.filters.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        document
          .querySelectorAll(".filters button")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        handler(e.target.dataset.filter);
      }
    });
  }

  bindSort(handler) {
    this.sortSelect.addEventListener("change", (e) => {
      handler(e.target.value);
    });
  }

  bindDragAndDrop(reorderHandler) {
    let draggedIndex = null;
    this.taskList.addEventListener("dragstart", (e) => {
      draggedIndex = parseInt(e.target.closest(".task-item").dataset.index);
    });
    this.taskList.addEventListener("dragover", (e) => e.preventDefault());
    this.taskList.addEventListener("drop", (e) => {
      const dropIndex = parseInt(e.target.closest(".task-item")?.dataset.index);
      if (draggedIndex !== null && dropIndex !== null)
        reorderHandler(draggedIndex, dropIndex);
    });
  }
}
