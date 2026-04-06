import TaskModel from "./models/taskModel.js";
import TaskView from "./views/taskView.js";
import TaskController from "./controllers/taskController.js";

const app = new TaskController(new TaskModel(), new TaskView());
