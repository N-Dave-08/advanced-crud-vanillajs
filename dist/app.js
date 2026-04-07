import TaskController from "./controllers/taskController";
import TaskModel from "./models/taskModel";
import TaskView from "./views/taskView";
// Bootstrap the application
new TaskController(new TaskModel(), new TaskView());
//# sourceMappingURL=app.js.map