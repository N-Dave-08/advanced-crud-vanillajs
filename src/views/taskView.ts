import type { Task, Priority, FilterType, SortType } from "../types";
import { escapeHTML } from "../utils/helpers";

export default class TaskView {
  private taskList: HTMLElement;
  private input: HTMLInputElement;
  private priority: HTMLSelectElement;
  private addBtn: HTMLButtonElement;
  private search: HTMLInputElement;
  private filters: HTMLElement;
  private sortSelect: HTMLSelectElement;

  constructor() {
    this.taskList = document.getElementById("task-list") as HTMLElement;
    this.input = document.getElementById("task-input") as HTMLInputElement;
    this.priority = document.getElementById(
      "priority-input",
    ) as HTMLSelectElement;
    this.addBtn = document.getElementById("add-btn") as HTMLButtonElement;
    this.search = document.getElementById("search-task") as HTMLInputElement;
    this.filters = document.querySelector(".filters") as HTMLElement;
    this.sortSelect = document.getElementById(
      "sort-select",
    ) as HTMLSelectElement;
  }

  render(tasks: Task[]): void {
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

  bindAddTask(handler: (text: string, priority: Priority) => void): void {
    this.addBtn.addEventListener("click", () => {
      if (this.input.value.trim()) {
        handler(this.input.value.trim(), this.priority.value as Priority);
        this.input.value = "";
      }
    });
  }

  bindEditTask(handler: (id: string, text: string) => void): void {
    this.taskList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("edit-btn")) {
        const li = target.closest(".task-item") as HTMLElement;
        const id = li.dataset.id!;
        const span = li.querySelector(".task-text") as HTMLElement;
        const btn = target as HTMLButtonElement;

        if (btn.textContent === "edit") {
          const input = document.createElement("input");
          input.type = "text";
          input.className = "edit-input";
          input.value = span.textContent || "";
          li.replaceChild(input, span);
          btn.textContent = "save";
          input.focus();
        } else {
          const input = li.querySelector(".edit-input") as HTMLInputElement;
          handler(id, input.value);
          btn.textContent = "edit";
        }
      }
    });
  }

  bindTaskActions(
    toggleHandler: (id: string) => void,
    deleteHandler: (id: string) => void,
  ): void {
    this.taskList.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const id = (target.closest(".task-item") as HTMLElement)?.dataset.id;
      if (!id) return;

      if (target.classList.contains("delete-btn")) deleteHandler(id);
      if (target.classList.contains("toggle-check")) toggleHandler(id);
    });
  }

  bindSearch(handler: (query: string) => void): void {
    this.search.addEventListener("input", (e) =>
      handler((e.target as HTMLInputElement).value),
    );
  }

  bindFilter(handler: (filter: FilterType) => void): void {
    this.filters.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        this.filters
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("active"));
        target.classList.add("active");
        handler(target.dataset.filter as FilterType);
      }
    });
  }

  bindSort(handler: (sortBy: SortType) => void): void {
    this.sortSelect.addEventListener("change", (e) => {
      handler((e.target as HTMLSelectElement).value as SortType);
    });
  }

  bindDragAndDrop(reorderHandler: (from: number, to: number) => void): void {
    let draggedIndex: number | null = null;
    this.taskList.addEventListener("dragstart", (e) => {
      const target = e.target as HTMLElement;
      const item = target.closest(".task-item") as HTMLElement;
      draggedIndex = parseInt(item.dataset.index!);
    });
    this.taskList.addEventListener("dragover", (e) => e.preventDefault());
    this.taskList.addEventListener("drop", (e) => {
      const target = e.target as HTMLElement;
      const dropItem = target.closest(".task-item") as HTMLElement;
      const dropIndex = parseInt(dropItem?.dataset.index || "");
      if (draggedIndex !== null && !isNaN(dropIndex))
        reorderHandler(draggedIndex, dropIndex);
    });
  }
}
