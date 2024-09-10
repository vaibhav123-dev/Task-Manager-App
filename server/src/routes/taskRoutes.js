import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  getTrashedTask,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/taskController.js";
import { isAdminRoute, verifyJWT } from "../middlewares/authMiddlewave.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.route("/dashboard").get(verifyJWT, dashboardStatistics);
router.route("/get_trash").get(verifyJWT, isAdminRoute, getTrashedTask);
router.route("/").get(verifyJWT, getTasks);
router.route("/:id").get(verifyJWT, getTask);
router.route("/create_task").post(verifyJWT, isAdminRoute, upload.array("assets"), createTask);
router.route("/create-subtask/:id").put(verifyJWT, isAdminRoute, createSubTask);
router.route("/update_task/:id").put(verifyJWT, isAdminRoute, upload.array("assets"), updateTask);
router.route("/:id").put(verifyJWT, isAdminRoute, trashTask);
router.route("/duplicate/:id").post(verifyJWT, isAdminRoute, duplicateTask);
router.route("/activity/:id").post(verifyJWT, postTaskActivity);
router.route("/delete-restore/:id?").delete(verifyJWT, isAdminRoute, deleteRestoreTask);

export default router;
