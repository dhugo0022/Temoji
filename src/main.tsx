import { createRoot } from "react-dom/client";
import React from 'react';
import { Provider } from "react-redux";
import ReactModal from "react-modal";

import "./style.css";
import App from "./windows/App/App";
import { store } from "./store";

// Modal
ReactModal.setAppElement("#root");

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
