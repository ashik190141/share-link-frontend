import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import FromUpload from "./pages/FromUpload/FromUpload";
import LogIn from "./pages/Authentication/SignIn/LogIn";
import SignUpA from "./pages/Authentication/SignUp/SignUpA";
import Main from "./Layout/Main";
import GetFiles from "./pages/Files/GetFiles";
import ShowFiles from "./pages/Files/ShowFiles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <FromUpload />,
      },
      {
        path: "login",
        element: <LogIn />,
      },
      {
        path: "register",
        element: <SignUpA />,
      },
      {
        path: "files",
        element: <GetFiles />
      },
      {
        path: "file/share/:id",
        element: <ShowFiles />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
