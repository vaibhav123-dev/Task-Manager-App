import React, { useContext, useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import { postRequest, putRequest } from "../../common/apiRequest";
import { toast } from "sonner";
import { UserContext } from "../../context/AuthContext";
import Loading from "../Loader";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ task, open, setOpen, isEdit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const { loadTask } = useContext(UserContext);

  const submitHandler = async (data) => {
    setIsLoading(true); // Show loader on form submission

    const formData = new FormData();
    formData.append("stage", stage);
    formData.append("title", data?.title);
    formData.append("priority", priority);
    formData.append("team", team);
    formData.append("date", data?.date);

    const assetArray = Array.from(assets);
    if (assetArray && assetArray?.length > 0) {
      assetArray.forEach((file) => {
        formData.append("assets", file);
      });
    }

    if (isEdit && task?._id) {
      const updateTask = await putRequest(
        `/task/update_task/${task._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (updateTask) {
        setOpen(false);
        toast.success("Task updated successfully");
      }
    } else {
      const newTask = await postRequest("/task/create_task", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (newTask) {
        setOpen(false);
        toast.success("Task created successfully");
      }
    }

    loadTask(true);
    setIsLoading(false); // Hide loader after request completion
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("date", task.date?.split("T")[0]);
      setPriority(task.priority?.toUpperCase());
      setStage(task.stage?.toUpperCase());
      setAssets(task.assets || []);
    } else {
      reset();
    }
  }, [task, setValue, reset]);

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        {/* Loader on top with blue background */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <Loading />
          </div>
        )}

        <form
          onSubmit={handleSubmit(submitHandler)}
          className={`${isLoading ? "pointer-events-none opacity-50" : ""}`}
        >
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {isEdit ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg, .pdf"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Submit"
                type="submit"
                className={`bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto ${
                  isLoading && "opacity-50 pointer-events-none"
                }`}
                disabled={isLoading}
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
