import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { mongoose } from "mongoose";

export const createTask = async (req, res) => {
  try {
    const user = req.user;
    // console.log(req.body, req.files);

    const { title, team, stage, date, priority } = req.body;

    if (!title) {
      throw new ApiError("400", "Title is required");
    }

    if (!date) {
      throw new ApiError("400", "Date is required");
    }

    let fileUrls;

    if (req.files && req.files.length > 0) {
      // Use Promise.all to upload all files concurrently
      const uploadedFiles = await Promise.all(
        req.files.map((file) => uploadOnCloudinary(file.path))
      );

      // Filter out null responses in case any upload failed
      const validUploads = uploadedFiles.filter((file) => file !== null);

      // Collect secure URLs of successfully uploaded files
      fileUrls = validUploads.map((upload) => upload.secure_url);
    }

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text = text + ` and ${team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
        date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "Assigned",
      activity: text,
      by: user._id,
    };

    const teamArray = team.split(",").map((id) => new mongoose.Types.ObjectId(id.trim()));

    const task = await Task.create({
      title,
      team: teamArray,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets: fileUrls,
      activities: activity,
    });

    await Notice.create({
      team: teamArray,
      text,
      task: task._id,
    });

    res.status(200).json(new ApiResponse(201, task, "Task create successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while creating task");
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json(
      new ApiResponse(
        201,
        {
          status: true,
          tasks,
        },
        "Tasks fetch successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while fetching tasks");
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team", // Populating team members
        select: "name title role email", // Selecting fields to display
      })
      .populate({
        path: "activities.by", // Populating the 'by' field in activities
        select: "name", // Selecting the 'name' field from User
      });

    res.status(200).json(
      new ApiResponse(
        201,
        {
          status: true,
          task,
        },
        "Task Fetch Successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while fetching task");
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;

    const { id } = req.params;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res.status(200).json(new ApiResponse(201, task, "Subtask added successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while adding subtask");
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority } = req.body;
    const user = req.user;

    if (!title) {
      throw new ApiError("400", "Title is required");
    }

    if (!date) {
      throw new ApiError("400", "Date is required");
    }

    const task = await Task.findById(id);

    if (!task) {
      throw new ApiError("404", "Task not found");
    }

    // File handling (if files are provided)
    let fileUrls = task.assets || [];

    if (req.files && req.files.length > 0) {
      // Use Promise.all to upload all files concurrently
      const uploadedFiles = await Promise.all(
        req.files.map((file) => uploadOnCloudinary(file.path))
      );

      // Filter out null responses in case any upload failed
      const validUploads = uploadedFiles.filter((file) => file !== null);

      // Collect secure URLs of successfully uploaded files
      fileUrls = validUploads.map((upload) => upload.secure_url);
    }

    // Update the activity
    let text = `Task "${task.title}" has been updated`;
    if (team?.length > 1) {
      text = text + ` and assigned to ${team?.length} members.`;
    }

    text += ` The task priority is updated to ${priority} priority and the new date is ${new Date(
      date
    ).toDateString()}.`;

    const activity = {
      type: "Assigned",
      activity: text,
      by: user._id,
    };

    // Validate and convert `team` into ObjectId array
    let teamArray = [];
    if (team) {
      const teamMembers = team.split(",");
      teamArray = teamMembers.map((id) => {
        if (mongoose.Types.ObjectId.isValid(id.trim())) {
          return new mongoose.Types.ObjectId(id.trim());
        } else {
          throw new ApiError("400", "Invalid team member ID");
        }
      });
    }

    // Update the task fields
    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.stage = stage.toLowerCase();
    task.team = teamArray;
    task.assets = fileUrls;
    task.activities.push(activity); // Add the new activity

    await task.save();

    // Send notice to the team
    await Notice.create({
      team: teamArray,
      text,
      task: task._id,
    });

    res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while updating the task");
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json(new ApiResponse(201, {}, "Task delete successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while deleting the task");
  }
};

export const getTrashedTask = async (req, res) => {
  try {
    const trashedTasks = await Task.find({ isTrashed: true });
    res.status(200).json(new ApiResponse(201, trashedTasks, "Trashed tasks fetch successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while fetching trash task");
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    //alert users of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res.status(200).json(new ApiResponse(201, newTask, "Task duplicated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while duplicating task");
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: _id,
    };

    if (type == "Completed") {
      task.stage = "completed";
    }

    task.activities.push(data);

    await task.save();

    res.status(200).json(new ApiResponse(201, task, "Activity added successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while adding activity");
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [_id] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json(new ApiResponse(200, { ...summary }, "Dashboard data fetch successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while fetching dashboard data");
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;
    console.log(actionType);
    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });
    }

    res.status(200).json(new ApiResponse(200, {}, "Restore and delete operation successful"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while deleting or restoring task"
    );
  }
};
