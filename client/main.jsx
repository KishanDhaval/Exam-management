import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./src/context/AuthContext.jsx";
import { ExamContextProvider } from "./src/context/ExamContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ExamContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ExamContextProvider>
  </AuthContextProvider>
);
