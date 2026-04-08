import TaskModel from "../models/taskModel.js";
import TaskView from "../views/taskView.js";
import type { Priority, FilterType, SortType } from "../types.js";
export default class TaskController {
    private model;
    private view;
    constructor(model: TaskModel, view: TaskView);
    private _refresh;
    handleAddTask: (text: string, priority: Priority) => void;
    handleEditTask: (id: string, newText: string) => void;
    handleDeleteTask: (id: string) => void;
    handleToggleTask: (id: string) => void;
    handleFilter: (filter: FilterType) => void;
    handleSort: (sortBy: SortType) => void;
    handleSearch: (query: string) => void;
    handleReorder: (from: number, to: number) => void;
}
//# sourceMappingURL=taskController.d.ts.map