import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '14px' },
      }}
    />
  </AuthProvider>
);
