import React, { useContext } from "react";
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

const Sidebar = () => {
  const { user } = useContext(UserContext);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <div className="w-full  h-full flex flex-col gap-6 p-5">
      <h1 className="flex gap-1 items-center">
        <p className="bg-blue-600 p-2 rounded-full">
          <MdOutlineAddTask className="text-white text-2xl font-black" />
        </p>
        <span className="text-2xl font-bold text-black">TaskMe</span>
      </h1>

      <div className="flex-1 flex flex-col gap-y-5 py-8">
        <Link
          to="/dashboard"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
            path === "dashboard" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <MdDashboard />
          <span className="hover:text-[#2564ed]">Dashboard</span>
        </Link>

        <Link
          to="/tasks"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
            path === "tasks" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <FaTasks />
          <span className="hover:text-[#2564ed]">Tasks</span>
        </Link>

        <Link
          to="/completed/completed"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
            path === "completed" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <MdTaskAlt />
          <span className="hover:text-[#2564ed]">Completed</span>
        </Link>

        <Link
          to="/in progress/in progress"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
            path === "in-progress" ? "bg-blue-700 text-neutral-100" : ""
          )}
        >
          <MdOutlinePendingActions />
          <span className="hover:text-[#2564ed]">In Progress</span>
        </Link>

        <Link
          to="/todo/todo"
          className={clsx(
            "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
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
                "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
                path === "team" ? "bg-blue-700 text-neutral-100" : ""
              )}
            >
              <FaUsers />
              <span className="hover:text-[#2564ed]">Team</span>
            </Link>

            <Link
              to="/trashed"
              className={clsx(
                "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
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
        <button className="w-full flex gap-2 p-2 items-center text-lg text-gray-800">
          <MdSettings />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
