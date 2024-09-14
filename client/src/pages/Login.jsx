import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../services/common";
import { toast } from "sonner";
import { postRequest } from "../common/apiRequest";
import { setUser } from "../redux/slices/userSlice";
import { UserContext } from "../context/AuthContext.jsx";
import Loading from "./../components/Loader";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(UserContext);
  const { user } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateUserDetails = (data) => {
    if (data?.email === "" || data?.password === "") {
      return toast.warning("Please fill in the required fields");
    }
    if (data?.email && !validateEmail(data?.email)) {
      return toast.error("Invalid Email Address");
    }
  };

  const submitHandler = async (data) => {
    validateUserDetails();

    setIsLoading(true); // Start loading

    const user = await postRequest("/user/login", data);

    if (!user) {
      toast.error("Something went wrong");
      setIsLoading(false); // Stop loading
      return;
    }

    navigate("/dashboard");

    toast.success(`Welcome ${user?.data?.user?.name}`);

    dispatch(setUser(user?.data?.user));

    login(user?.data?.user);

    localStorage.setItem("token", user?.data?.token);

    setIsLoading(false); // Stop loading
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* Left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your tasks in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Cloud-Based</span>
              <span>Task Manager</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome back!
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <Button
                type="submit"
                label={isLoading ? "Submitting..." : "Submit"}
                className="w-full h-10 bg-blue-700 text-white rounded-full"
                disabled={isLoading}
              />

              {/* Optional: Loader overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                  <Loading />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
