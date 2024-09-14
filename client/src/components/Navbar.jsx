import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch } from "react-redux";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import { setOpenSidebar } from "../redux/slices/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(setOpenSidebar(true));
  };

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-4 py-3 2xl:py-4 sticky z-10 top-0">
      <div className="flex gap-4">
        <button
          onClick={handleOpen}
          className="text-2xl text-gray-500 dark:text-gray-300 block md:hidden"
        >
          ☰
        </button>

        {/* Uncomment if search is needed */}
        {/* <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6] dark:bg-gray-700">
          <MdOutlineSearch className="text-gray-500 dark:text-gray-300 text-xl" />

          <input
            type="text"
            placeholder="Search...."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-800 dark:text-gray-100"
          />
        </div> */}
      </div>

      <div className="flex gap-2 items-center">
        <NotificationPanel />

        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
