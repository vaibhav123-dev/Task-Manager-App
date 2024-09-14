import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/routesConfig";
import { Toaster } from "sonner";

const router = createBrowserRouter(routes);

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6] dark:bg-gray-700 text-black dark:text-white ">
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" expand={true} />
    </main>
  );
}

export default App;
