import Dashboard from "./../pages/dashboard";
import Login from "./../pages/Login";
import Tasks from "./../pages/Tasks";
import TaskDetails from "./../pages/TaskDetails";
import { Layout } from "../pages/Layout.jsx";
import { AuthLayout } from "../pages/Layout.jsx";
import Users from "./../pages/Users";
import Trash from "./../pages/Trash";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/completed/:status",
        element: <Tasks />,
      },
      {
        path: "/todo/:status",
        element: <Tasks />,
      },
      {
        path: "/trashed",
        element: <Trash />,
      },
      {
        path: "/in progress/:status",
        element: <Tasks />,
      },
      {
        path: "/task/:id",
        element: <TaskDetails />,
      },
      {
        path: "/team",
        element: <Users />,
      },
    ],
  },
];

export { routes };
