import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import SelectList from "./SelectList";
import { postRequest } from "../common/apiRequest";
import { toast } from "sonner";

const isAdmin = ["Yes", "No"];

const AddUser = ({ open, setOpen, userData, isAdd }) => {
  const { user } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState(isAdmin[1]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  const validateUserDetails = (data) => {
    if (data?.email === "" || data?.password === "") {
      return toast.warning("Please fill in the required fields");
    }
    if (data?.email && !validateEmail(formData?.email)) {
      return toast.error("Invalid Email Address");
    }
  };

  const handleOnSubmit = async (data) => {
    validateUserDetails();

    if (admin == "Yes") data.isAdmin = true;
    else data.isAdmin = false;

    if (isAdd) {
      const user = await postRequest("/user/register", data);
      if (!user) toast.error("Something went wrong");

      toast.success(`User Added Successfully  ${user?.data?.user?.name}`);
      setOpen(false);
    } else {
      //do it tommorow
    }
  };

  useEffect(() => {
    if (!isAdd) {
      setValue("name", userData?.name);
      setValue("email", userData?.email);
      setValue("title", userData?.title);
      setValue("role", userData?.role);
      setValue("isActive", userData?.isActive);
      setValue("isAdmin", userData?.isAdmin);
    }
  }, [userData]);

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
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
          </div>

          {false ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
