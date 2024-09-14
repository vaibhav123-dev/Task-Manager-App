import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import UserInfo from "../components/UserInfo";
import { getRequest } from "./../common/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../redux/slices/dashboardSlice";
import { GoSortAsc, GoSortDesc } from "react-icons/go";

const TaskTable = ({ tasks = [] }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    normal: <MdKeyboardArrowDown />,
  };

  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });
  const [sortedTasks, setSortedTasks] = useState([...tasks]);

  useEffect(() => {
    let sortedData = [...tasks];

    if (sortConfig.key === "title") {
      sortedData.sort((a, b) => {
        return sortConfig.direction === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
    } else if (sortConfig.key === "date") {
      sortedData.sort((a, b) => {
        return sortConfig.direction === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (sortConfig.key === "priority") {
      sortedData.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, normal: 1 };
        return sortConfig.direction === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }

    setSortedTasks(sortedData);
  }, [tasks, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className="text-black dark:text-gray-300 text-left">
        <th
          className="py-2 max-w-xs cursor-pointer"
          onClick={() => requestSort("title")}
        >
          <div className="flex">
            Task Title
            {sortConfig.key === "title" &&
              (sortConfig.direction === "asc" ? (
                <GoSortAsc className="ml-1 mt-1" />
              ) : (
                <GoSortDesc className="ml-1 mt-1" />
              ))}
          </div>
        </th>
        <th
          className="py-2 cursor-pointer"
          onClick={() => requestSort("priority")}
        >
          <div className="flex">
            Priority
            {sortConfig.key === "priority" &&
              (sortConfig.direction === "asc" ? (
                <GoSortAsc className="ml-1 mt-1" />
              ) : (
                <GoSortDesc className="ml-1 mt-1" />
              ))}
          </div>
        </th>
        <th className="py-2">Team</th>
        <th
          className="py-2 hidden md:block cursor-pointer"
          onClick={() => requestSort("date")}
        >
          <div className="flex">
            Date
            {sortConfig.key === "date" &&
              (sortConfig.direction === "asc" ? (
                <GoSortAsc className="ml-1 mt-1" />
              ) : (
                <GoSortDesc className="ml-1 mt-1" />
              ))}
          </div>
        </th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300/10 dark:hover:bg-gray-700/10">
      <td className="py-3 max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="text-base text-black dark:text-gray-300">
            {task.title}
          </p>
        </div>
      </td>
      <td className="py-3">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize">{task.priority}</span>
        </div>
      </td>
      <td className="py-3">
        <div className="flex">
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className="py-3 hidden md:block">
        <span className="text-base text-gray-600 dark:text-gray-400">
          {moment(task?.createdAt).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {sortedTasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { dashboard } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: dashboard?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: dashboard?.tasks["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS ",
      total: dashboard?.tasks["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: dashboard?.tasks["todo"],
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]" || 0,
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className="w-full h-32 bg-white dark:bg-gray-800 p-5 shadow-md rounded-md flex items-center justify-between">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600 dark:text-gray-300">{label}</p>
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {count}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500"></span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };

  const getDashboardData = async () => {
    const dashboardData = await getRequest("/task/dashboard");
    if (dashboardData?.data) {
      dispatch(setData(dashboardData?.data));
    }
  };

  useEffect(() => {
    getDashboardData();
    console.log("hi");
  }, []);

  return (
    <div className="h-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className="w-full bg-white dark:bg-gray-800 my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 dark:text-gray-300 font-semibold mb-2">
          Chart by Priority
        </h4>
        <Chart chartData={dashboard?.graphData} />
      </div>

      <div className="w-full py-8">
        {/* /left */}

        <TaskTable tasks={dashboard?.last10Task} />
      </div>
    </div>
  );
};

export default Dashboard;
