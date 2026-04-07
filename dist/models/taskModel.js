export default class TaskModel {
    state;
    constructor() {
        this.state = {
            tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
            filter: "all",
            sortBy: "newest",
            searchQuery: "",
        };
    }
    _save() {
        localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }
    addTask(text, priority) {
        const newTask = {
            id: crypto.randomUUID(),
            text,
            priority,
            completed: false,
            createdAt: Date.now(),
        };
        this.state.tasks.unshift(newTask);
        this._save();
    }
    updateTask(id, newText) {
        const task = this.state.tasks.find((t) => t.id === id);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this._save();
        }
    }
    deleteTask(id) {
        this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
        this._save();
    }
    toggleTask(id) {
        const task = this.state.tasks.find((t) => t.id === id);
        if (task)
            task.completed = !task.completed;
        this._save();
    }
    reorder(fromIndex, toIndex) {
        const [movedItem] = this.state.tasks.splice(fromIndex, 1);
        if (movedItem) {
            this.state.tasks.splice(toIndex, 0, movedItem);
            this._save();
        }
    }
    setFilter(filter) {
        this.state.filter = filter;
    }
    setSort(sortBy) {
        this.state.sortBy = sortBy;
    }
    setSearch(query) {
        this.state.searchQuery = query.toLowerCase();
    }
    getProcessedTasks() {
        let filtered = [...this.state.tasks];
        if (this.state.filter === "active")
            filtered = filtered.filter((t) => !t.completed);
        if (this.state.filter === "completed")
            filtered = filtered.filter((t) => t.completed);
        if (this.state.searchQuery) {
            filtered = filtered.filter((t) => t.text.toLowerCase().includes(this.state.searchQuery));
        }
        if (this.state.sortBy === "priority") {
            const weights = { high: 3, medium: 2, low: 1 };
            filtered.sort((a, b) => weights[b.priority] - weights[a.priority]);
        }
        else {
            filtered.sort((a, b) => b.createdAt - a.createdAt);
        }
        return filtered;
    }
}
//# sourceMappingURL=taskModel.js.map