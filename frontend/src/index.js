import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// using provider so that component can access the store
import { Provider } from "react-redux";
import store from "./store";

// using react alert
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  // 5000=5s
  timeout: 5000,
  transition: transitions.SCALE,
  position: positions.BOTTOM_CENTER,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>
);
