import { escapeHTML } from "../utils/helpers";
export default class TaskView {
    taskList;
    input;
    priority;
    addBtn;
    search;
    filters;
    sortSelect;
    constructor() {
        this.taskList = document.getElementById("task-list");
        this.input = document.getElementById("task-input");
        this.priority = document.getElementById("priority-input");
        this.addBtn = document.getElementById("add-btn");
        this.search = document.getElementById("search-task");
        this.filters = document.querySelector(".filters");
        this.sortSelect = document.getElementById("sort-select");
    }
    render(tasks) {
        this.taskList.innerHTML = "";
        const fragment = document.createDocumentFragment();
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;
            li.dataset.id = task.id;
            li.dataset.index = index.toString();
            li.draggable = true;
            li.innerHTML = `
        <div class="drag-handle">⁝⁝</div>
        <input type="checkbox" ${task.completed ? "checked" : ""} class="toggle-check">
        <span class="task-text">${escapeHTML(task.text)}</span>
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
            const target = e.target;
            if (target.classList.contains("edit-btn")) {
                const li = target.closest(".task-item");
                const id = li.dataset.id;
                const span = li.querySelector(".task-text");
                const btn = target;
                if (btn.textContent === "edit") {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "edit-input";
                    input.value = span.textContent || "";
                    li.replaceChild(input, span);
                    btn.textContent = "save";
                    input.focus();
                }
                else {
                    const input = li.querySelector(".edit-input");
                    handler(id, input.value);
                    btn.textContent = "edit";
                }
            }
        });
    }
    bindTaskActions(toggleHandler, deleteHandler) {
        this.taskList.addEventListener("click", (e) => {
            const target = e.target;
            const id = target.closest(".task-item")?.dataset.id;
            if (!id)
                return;
            if (target.classList.contains("delete-btn"))
                deleteHandler(id);
            if (target.classList.contains("toggle-check"))
                toggleHandler(id);
        });
    }
    bindSearch(handler) {
        this.search.addEventListener("input", (e) => handler(e.target.value));
    }
    bindFilter(handler) {
        this.filters.addEventListener("click", (e) => {
            const target = e.target;
            if (target.tagName === "BUTTON") {
                this.filters
                    .querySelectorAll("button")
                    .forEach((b) => b.classList.remove("active"));
                target.classList.add("active");
                handler(target.dataset.filter);
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
            const target = e.target;
            const item = target.closest(".task-item");
            draggedIndex = parseInt(item.dataset.index);
        });
        this.taskList.addEventListener("dragover", (e) => e.preventDefault());
        this.taskList.addEventListener("drop", (e) => {
            const target = e.target;
            const dropItem = target.closest(".task-item");
            const dropIndex = parseInt(dropItem?.dataset.index || "");
            if (draggedIndex !== null && !isNaN(dropIndex))
                reorderHandler(draggedIndex, dropIndex);
        });
    }
}
//# sourceMappingURL=taskView.js.map