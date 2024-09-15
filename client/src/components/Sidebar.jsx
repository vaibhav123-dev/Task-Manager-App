import React, { useContext, useState } from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { setOpenSidebar } from "../redux/slices/userSlice";
import { UserContext } from "../context/AuthContext";
import { Toggle } from "rsuite";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);
  const [isDark, setIsDark] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const handleMode = () => {
    setIsDark(!isDark);
    console.log(isDark);
    document.body.classList.toggle("dark");
  };

  return (
    <div className="w-full  h-full flex flex-col gap-6 p-5 bg-white dark:bg-gray-800">
      <h1 className="flex gap-1 items-center">
        <p className="bg-blue-600 p-2 rounded-full">
          <MdOutlineAddTask className="text-white text-2xl font-black" />
        </p>
        <span className="text-2xl font-bold text-black dark:text-white">
          Task Manager
        </span>
      </h1>

      <div className="flex-1 flex flex-col gap-y-5 py-8">
        <Link
          to="/dashboard"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 dark:text-gray-200 text-base hover:bg-[#2564ed2d] dark:hover:bg-[#1e3a8a40]",
            path === "dashboard" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <MdDashboard />
          <span className="hover:text-[#2564ed]">Dashboard</span>
        </Link>

        <Link
          to="/tasks"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 dark:text-gray-200 text-base hover:bg-[#2564ed2d] dark:hover:bg-[#1e3a8a40]",
            path === "tasks" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <FaTasks />
          <span className="hover:text-[#2564ed]">Tasks</span>
        </Link>

        <Link
          to="/completed/completed"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 dark:text-gray-200 text-base hover:bg-[#2564ed2d] dark:hover:bg-[#1e3a8a40]",
            path === "completed" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <MdTaskAlt />
          <span className="hover:text-[#2564ed]">Completed</span>
        </Link>

        <Link
          to="/in progress/in progress"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 dark:text-gray-200 text-base hover:bg-[#2564ed2d] dark:hover:bg-[#1e3a8a40]",
            path === "in-progress" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <MdOutlinePendingActions />
          <span className="hover:text-[#2564ed]">In Progress</span>
        </Link>

        <Link
          to="/todo/todo"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 dark:text-gray-200 text-base hover:bg-[#2564ed2d] dark:hover:bg-[#1e3a8a40]",
            path === "todo" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <MdOutlinePendingActions />
          <span className="hover:text-[#2564ed]">To Do</span>
        </Link>

        {user?.isAdmin && (
          <>
            <Link
              to="/team"
              className={clsx(
                "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 dark:text-gray-200 text-base hover:bg-[#2564ed2d] dark:hover:bg-[#1e3a8a40]",
                path === "team" ? "bg-blue-700 text-neutral-100" : ""
              )}
            >
              <FaUsers />
              <span className="hover:text-[#2564ed]">Team</span>
            </Link>

            <Link
              to="/trashed"
              className={clsx(
                "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 dark:text-gray-200 text-base hover:bg-[#2564ed2d] dark:hover:bg-[#1e3a8a40]",
                path === "trashed" ? "bg-blue-700 text-neutral-100" : ""
              )}
            >
              <FaTrashAlt />
              <span className="hover:text-[#2564ed]">Trash</span>
            </Link>
          </>
        )}
      </div>

      <div className="">
        <button className="w-full flex gap-2 p-2 items-center text-lg">
          <Toggle onClick={handleMode} />
          <span
            className={
              isDark ? "text-white" : "text-gray-800 dark:text-gray-200"
            }
          >
            {isDark ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
