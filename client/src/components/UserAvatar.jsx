import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { postRequest } from "../common/apiRequest";
import { setUser } from "../redux/slices/userSlice";
import { toast } from "sonner";
import { UserContext } from "../context/AuthContext";
import AddUser from "./AddUser";

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(UserContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    const user = await postRequest("/user/logout", {});
    dispatch(setUser({}));
    logout();
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-blue-600 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {user ? getInitials(user?.name) : ""}
                </span>
              )}
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setOpen(true);
                        setIsProfileEdit(true);
                      }}
                      className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <FaUser className="mr-2" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <IoLogOutOutline className="mr-2" aria-hidden="true" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        isProfileEdit={isProfileEdit}
        userData={user}
        key={new Date().getTime().toString()}
      />
    </>
  );
};

export default UserAvatar;
