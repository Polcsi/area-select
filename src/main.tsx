import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "react-tooltip/dist/react-tooltip.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App cols={12} rows={8} />
  </React.StrictMode>
);
