import type { Task, Priority, FilterType, SortType } from "../types.js";
export default class TaskView {
    private taskList;
    private input;
    private priority;
    private addBtn;
    private search;
    private filters;
    private sortSelect;
    constructor();
    render(tasks: Task[]): void;
    bindAddTask(handler: (text: string, priority: Priority) => void): void;
    bindEditTask(handler: (id: string, text: string) => void): void;
    bindTaskActions(toggleHandler: (id: string) => void, deleteHandler: (id: string) => void): void;
    bindSearch(handler: (query: string) => void): void;
    bindFilter(handler: (filter: FilterType) => void): void;
    bindSort(handler: (sortBy: SortType) => void): void;
    bindDragAndDrop(reorderHandler: (from: number, to: number) => void): void;
}
//# sourceMappingURL=taskView.d.ts.map