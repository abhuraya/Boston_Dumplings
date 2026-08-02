import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App.jsx";
import Landing from "./pages/Landing.jsx";
import Checkout from "./pages/Checkout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },
]);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);