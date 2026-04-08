import TaskController from "./controllers/taskController.js";
import TaskModel from "./models/taskModel.js";
import TaskView from "./views/taskView.js";
// Bootstrap the application
new TaskController(new TaskModel(), new TaskView());
//# sourceMappingURL=app.js.map