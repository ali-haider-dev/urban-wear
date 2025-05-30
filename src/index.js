import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import App from "./App";
import { GlobalProvider } from "./context/GlobalState";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>
);


  