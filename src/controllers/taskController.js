/**
 * CONTROLLER: Orchestrates the Model and View.
 */
export default class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // 1. Bind View events to Controller methods
    this.view.bindAddTask(this.handleAddTask);
    this.view.bindTaskActions(this.handleToggleTask, this.handleDeleteTask);
    this.view.bindSearch(this.handleSearch);
    this.view.bindFilter(this.handleFilter);
    this.view.bindDragAndDrop(this.handleReorder);
    this.view.bindEditTask(this.handleEditTask);
    this.view.bindSort(this.handleSort);

    // 2. Initial Render
    this._refresh();
  }

  _refresh = () => {
    const tasks = this.model.getProcessedTasks();
    this.view.render(tasks);
  };

  handleAddTask = (text, priority) => {
    this.model.addTask(text, priority);
    this._refresh();
  };

  handleEditTask = (id, newText) => {
    this.model.updateTask(id, newText);
    this._refresh();
  };

  handleDeleteTask = (id) => {
    this.model.deleteTask(id);
    this._refresh();
  };

  handleToggleTask = (id) => {
    this.model.toggleTask(id);
    this._refresh();
  };

  handleFilter = (filter) => {
    this.model.setFilter(filter);
    this._refresh();
  };

  handleSort = (sortBy) => {
    this.model.setSort(sortBy);
    this._refresh();
  };

  handleSearch = (query) => {
    this.model.setSearch(query);
    this._refresh();
  };

  handleReorder = (from, to) => {
    this.model.reorder(from, to);
    this._refresh();
  };
}
