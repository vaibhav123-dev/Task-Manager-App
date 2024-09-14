import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import { deleteRequest, getRequest } from "../common/apiRequest";
import { useDispatch } from "react-redux";
import { setUsers } from "../redux/slices/teamSlice";
import { toast } from "sonner";
import { UserContext } from "../context/AuthContext";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [team, setTeam] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const { fetchUser, loadUser } = useContext(UserContext);
  const dispatch = useDispatch();

  const deleteHandler = async () => {
    if (selected) {
      await deleteRequest(`user/${selected}`);
      loadUser(true);
      toast.success("User deleted successfully");
      setOpenDialog(false);
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const getTeam = async () => {
    setIsLoading(true); // Start loading
    const users = await getRequest("/user/get-team");
    setTeam(users?.data);
    dispatch(setUsers(users?.data));
    setIsLoading(false); // End loading
  };

  useEffect(() => {
    getTeam();
  }, [fetchUser]);

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className="text-black dark:text-white text-center">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
        <th className="py-2">Actions</th> {/* Added Actions header */}
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-600">
      <td className="p-2 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
          <span className="text-xs md:text-sm text-center">
            {getInitials(user.name)}
          </span>
        </div>
        {user.name}
      </td>
      <td className="p-2">{user.title}</td>
      <td className="p-2">{user.email || "user.email.com"}</td>
      <td className="p-2">{user.role}</td>
      <td>
        <button
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive
              ? "bg-blue-200 dark:bg-blue-600 text-black"
              : "bg-yellow-100 dark:bg-yellow-500 text-black"
          )}
        >
          {user?.isActive ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => {
            editClick(user);
            setIsAdd(false);
          }}
        />
        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => {
              setOpen(true);
              setIsAdd(true);
            }}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded dark:bg-gray-800">
          <div className="overflow-x-auto">
            {isLoading ? ( // Loading state
              <div className="flex justify-center py-4">Loading...</div>
            ) : (
              <table className="w-full mb-5">
                <TableHeader />
                <tbody>
                  {team?.map((user) => (
                    <TableRow key={user._id} user={user} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        isAdd={isAdd}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction open={openAction} setOpen={setOpenAction} />
    </>
  );
};

export default Users;
