import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import SelectList from "./SelectList";
import { postRequest, putRequest } from "../common/apiRequest";
import { toast } from "sonner";
import { BiImages } from "react-icons/bi";
import { UserContext } from "../context/AuthContext";
import { setUser } from "../redux/slices/userSlice";

const isAdmin = ["Yes", "No"];

const AddUser = ({ open, setOpen, userData, isAdd, isProfileEdit }) => {
  const { user } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState(isAdmin[1]);
  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loadUser } = useContext(UserContext);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  const handleSelect = (e) => {
    setAvatar(e.target.files);
  };

  const validateUserDetails = (data) => {
    if (data?.email === "" || data?.password === "") {
      return toast.warning("Please fill in the required fields");
    }
    if (data?.email && !validateEmail(formData?.email)) {
      return toast.error("Invalid Email Address");
    }
  };

  const handleOnSubmit = async (data) => {
    setIsLoading(true); // Set loading state to true

    validateUserDetails();

    if (admin == "Yes") data.isAdmin = true;
    else data.isAdmin = false;

    try {
      if (isAdd) {
        const user = await postRequest("/user/register", data);
        if (!user) toast.error("Something went wrong");
        toast.success(`User Added Successfully  ${user?.data?.user?.name}`);
        setOpen(false);
        loadUser(true);
      } else if (isProfileEdit) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("title", data.title);
        formData.append("role", data.role);
        formData.append("password", data.password);
        // Add avatar if selected
        if (avatar.length > 0) {
          formData.append("avatar", avatar[0]); // Append the avatar file
        }
        const user = await putRequest(
          `/user/profile/${userData?._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (!user) toast.error("Something went wrong");
        toast.success(`Profile Update Successfully  ${user?.data?.user?.name}`);
        dispatch(setUser(user?.data?.user));
        setOpen(false);
      } else {
        const user = await putRequest(
          `/user/updateUser/${userData?._id}`,
          data
        );
        if (!user) toast.error("Something went wrong");
        toast.success(`User Update Successfully  ${user?.data?.user?.name}`);
        setOpen(false);
        loadUser(true);
      }
    } catch (error) {
      toast.error("Request failed!");
    } finally {
      setIsLoading(false); // Set loading state to false when request completes
    }
  };

  useEffect(() => {
    if (!isAdd || isProfileEdit) {
      setValue("name", userData?.name);
      setValue("email", userData?.email);
      setValue("title", userData?.title);
      setValue("role", userData?.role);
      setValue("isActive", userData?.isActive);
      if (userData?.isAdmin) {
        setAdmin(isAdmin[0]);
      }
    }
  }, [userData]);

  return (
    <>
      {/* Loader with blue overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-75">
          <Loading />
        </div>
      )}

      <ModalWrapper open={open} setOpen={setOpen}>
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className={`${isLoading ? "pointer-events-none opacity-50" : ""}`} // Disable form interaction and fade it during loading
        >
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />
            <Textbox
              placeholder="Password"
              type="password"
              name="password"
              label="Password"
              className="w-full rounded"
              register={register("password", {
                ...(isAdd && { required: "Password is required!" }),
              })}
              error={errors.password ? errors.password.message : ""}
            />
            <div className="flex gap-4">
              <Textbox
                placeholder="Title"
                type="text"
                name="title"
                label="Title"
                className="w-full rounded"
                register={register("title", {
                  required: "Title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />

              <Textbox
                placeholder="Role"
                type="text"
                name="role"
                label="Role"
                className="w-full rounded"
                register={register("role", {
                  required: "User role is required!",
                })}
                error={errors.role ? errors.role.message : ""}
              />
            </div>
            {!isProfileEdit ? (
              <div className="flex gap-4 mt-6">
                <Textbox
                  placeholder="Is Active"
                  type="checkbox"
                  name="isActive"
                  label="Is Active"
                  className="w-rounded"
                  register={register("isActive")}
                />

                <SelectList
                  label="Is Admin"
                  lists={isAdmin}
                  selected={admin}
                  setSelected={setAdmin}
                />
              </div>
            ) : (
              <div className="w-full flex items-center justify-center mt-4 border border-gray-300 rounded-md">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg"
                    multiple={false}
                  />
                  <BiImages />
                  <span>Upload Image</span>
                </label>
              </div>
            )}
          </div>

          <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              label="Submit"
              disabled={isLoading} // Disable button during loading
            />
            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
              disabled={isLoading} // Disable button during loading
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
