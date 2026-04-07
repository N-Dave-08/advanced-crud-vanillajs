import type { Task, Priority, FilterType, SortType } from "../types";
export default class TaskModel {
    private state;
    constructor();
    private _save;
    addTask(text: string, priority: Priority): void;
    updateTask(id: string, newText: string): void;
    deleteTask(id: string): void;
    toggleTask(id: string): void;
    reorder(fromIndex: number, toIndex: number): void;
    setFilter(filter: FilterType): void;
    setSort(sortBy: SortType): void;
    setSearch(query: string): void;
    getProcessedTasks(): Task[];
}
//# sourceMappingURL=taskModel.d.ts.map