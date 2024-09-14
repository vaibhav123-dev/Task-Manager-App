import React, { useContext, useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import { putRequest } from "../../common/apiRequest";
import { UserContext } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const { loadTask } = useContext(UserContext);
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClicks = (task) => {
    s;
  };

  const deleteHandler = async () => {
    if (selected) {
      const deletedTask = await putRequest(`task/${selected}`, {});
      if (deletedTask) {
        toast.success("Task deleted successfully");
      }
      loadTask(true);
      setOpenDialog(false);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300 dark:border-gray-700">
      {" "}
      {/* Adjusted border color for dark mode */}
      <tr className="w-full text-black dark:text-gray-100 text-left">
        <th className="py-2 w-1/3">Task Title</th>
        <th className="py-2 w-1/6">Priority</th>
        <th className="py-2 w-1/6">Date</th>
        <th className="py-2 w-1/6">Assets</th>
        <th className="py-2 w-1/6">Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300/10 dark:hover:bg-gray-600">
      {" "}
      {/* Adjusted colors for dark mode */}
      <td className="py-2 max-w-xs truncate">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p
            className="w-full text-base text-black dark:text-gray-100 truncate"
            title={task?.title}
          >
            {task?.title}
          </p>
        </div>
      </td>
      <td className="py-2">
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize line-clamp-1">{task?.priority}</span>
        </div>
      </td>
      <td className="py-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(new Date(task?.date))}
        </span>
      </td>
      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
            <FaList />
            <span>0/{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>
      <td className="py-2">
        <div className="flex">
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      {user?.isAdmin ? (
        <td className="py-2 flex gap-2 md:gap-4 justify-end">
          <Button
            className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
            label="Delete"
            type="button"
            onClick={() => deleteClicks(task._id)}
          />
        </td>
      ) : (
        <td>
          <Button
            className="ml-2 text-blue-600 hover:text-blue-600 sm:px-0 text-sm md:text-base"
            label="Open"
            type="button"
            onClick={() => {
              navigate(`/task/${task._id}`);
            }}
          />
        </td>
      )}
    </tr>
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        {" "}
        {/* Added dark mode background */}
        <div className="overflow-x-auto h-screen">
          <table className="w-full ">
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Table;
