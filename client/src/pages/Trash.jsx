import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { deleteRequest, getRequest } from "../common/apiRequest";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [trashTaskList, setTrashTaskList] = useState([]);
  const [isDeleteOrRestore, setIsDeleteOrRestore] = useState(false);

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    const deletedData = await deleteRequest(
      `/task/delete-restore/${selected}?actionType=${type}`
    );
    if (deletedData) {
      setIsDeleteOrRestore(true);
      setOpenDialog(false);
      toast.success("Task deleted successfully");
    }
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className="text-black dark:text-white text-left hover:bg-gray-200 dark:hover:bg-gray-700">
        <th scope="col" className="py-2">
          Task Title
        </th>
        <th scope="col" className="py-2">
          Priority
        </th>
        <th scope="col" className="py-2">
          Stage
        </th>
        <th scope="col" className="py-2 line-clamp-1">
          Modified On
        </th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
      <td className="py-2 max-w-xs">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className="w-full line-clamp-2 text-base text-black dark:text-gray-200">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className="dark:text-gray-200">{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 capitalize text-center md:text-start dark:text-gray-300">
        {item?.stage}
      </td>

      <td className="py-2 text-sm dark:text-gray-300">
        {new Date(item?.date).toDateString()}
      </td>

      <td className="py-2 flex gap-1 justify-end">
        <Button
          aria-label="Restore Task"
          icon={
            <MdOutlineRestore className="text-xl text-gray-500 dark:text-white" />
          }
          onClick={() => restoreClick(item._id)}
        />
        <Button
          aria-label="Delete Task"
          icon={<MdDelete className="text-xl text-red-600 dark:text-red-500" />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  const getTrashedTask = async () => {
    const trashedTasks = await getRequest("/task/get_trash");
    if (trashedTasks) {
      setTrashTaskList(trashedTasks?.data);
    }
  };

  useEffect(() => {
    getTrashedTask();
  }, [isDeleteOrRestore]);

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />

          {trashTaskList.length > 0 && (
            <div className="flex gap-2 md:gap-4 items-center">
              <Button
                label="Restore All"
                icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
                className="flex flex-row-reverse gap-1 items-center text-black dark:text-white text-sm md:text-base rounded-md 2xl:py-2.5"
                onClick={restoreAllClick}
              />
              <Button
                label="Delete All"
                icon={<MdDelete className="text-lg hidden md:flex" />}
                className="flex flex-row-reverse gap-1 items-center text-red-600 dark:text-red-500 text-sm md:text-base rounded-md 2xl:py-2.5"
                onClick={deleteAllClick}
              />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 px-2 md:px-6 py-4 shadow-md rounded">
          {trashTaskList.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-5">
              No task found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mb-5">
                <TableHeader />
                <tbody>
                  {trashTaskList?.map((tk, id) => (
                    <TableRow key={id} item={tk} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
