import TaskModel from "../models/taskModel.js";
import TaskView from "../views/taskView.js";
import type { Priority, FilterType, SortType } from "../types.js";

export default class TaskController {
  constructor(
    private model: TaskModel,
    private view: TaskView,
  ) {
    this.view.bindAddTask(this.handleAddTask);
    this.view.bindTaskActions(this.handleToggleTask, this.handleDeleteTask);
    this.view.bindSearch(this.handleSearch);
    this.view.bindFilter(this.handleFilter);
    this.view.bindDragAndDrop(this.handleReorder);
    this.view.bindEditTask(this.handleEditTask);
    this.view.bindSort(this.handleSort);

    this._refresh();
  }

  private _refresh = (): void => {
    const tasks = this.model.getProcessedTasks();
    this.view.render(tasks);
  };

  handleAddTask = (text: string, priority: Priority): void => {
    this.model.addTask(text, priority);
    this._refresh();
  };

  handleEditTask = (id: string, newText: string): void => {
    this.model.updateTask(id, newText);
    this._refresh();
  };

  handleDeleteTask = (id: string): void => {
    this.model.deleteTask(id);
    this._refresh();
  };

  handleToggleTask = (id: string): void => {
    this.model.toggleTask(id);
    this._refresh();
  };

  handleFilter = (filter: FilterType): void => {
    this.model.setFilter(filter);
    this._refresh();
  };

  handleSort = (sortBy: SortType): void => {
    this.model.setSort(sortBy);
    this._refresh();
  };

  handleSearch = (query: string): void => {
    this.model.setSearch(query);
    this._refresh();
  };

  handleReorder = (from: number, to: number): void => {
    this.model.reorder(from, to);
    this._refresh();
  };
}
