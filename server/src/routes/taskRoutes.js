import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/taskController.js";
import { isAdminRoute, verifyJWT } from "../middlewares/authMiddlewave.js";

const router = express.Router();

router.route("/create").post(verifyJWT, isAdminRoute, createTask);
router.route("/duplicate/:id").post(verifyJWT, isAdminRoute, duplicateTask);
router.route("/activity/:id").post(verifyJWT, postTaskActivity);

router.route("/dashboard").get(verifyJWT, dashboardStatistics);
router.route("/").get(verifyJWT, getTasks);
router.route("/:id").get(verifyJWT, getTask);

router.route("/create-subtask/:id").put(verifyJWT, isAdminRoute, createSubTask);
router.route("/update/:id").put(verifyJWT, isAdminRoute, updateTask);
router.route("/:id").put(verifyJWT, isAdminRoute, trashTask);

router.route("/delete-restore/:id?").delete(verifyJWT, isAdminRoute, deleteRestoreTask);

export default router;
