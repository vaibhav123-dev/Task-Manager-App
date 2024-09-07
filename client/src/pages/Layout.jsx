import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MobileSidebar } from "../components/MobileSideBar";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/AuthContext.jsx";
import { useDispatch } from "react-redux";
import { setOpenSidebar } from "../redux/slices/userSlice.js";

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // This will be called every time the route changes
    dispatch(setOpenSidebar(false));
  }, [location, dispatch]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div> */}

      <MobileSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* <Navbar /> */}

        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AuthLayout() {
  const { user, loading } = useContext(UserContext);  // Get loading from context

  const dispatch = useDispatch();

  const location = useLocation();

  if (loading) {
    // You can return a loading spinner or just nothing while loading
    return <div>Loading...</div>;
  }

  useEffect(() => {
    // This will be called every time the route changes
    dispatch(setOpenSidebar(false));
  }, [location, dispatch]);

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

export { Layout, AuthLayout };
