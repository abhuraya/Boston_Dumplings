import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import "./index.css";

import App from "./App.jsx";
import Landing from "./pages/Landing.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import theme from "./theme.js";

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
      {
        path: "order-confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
]);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
