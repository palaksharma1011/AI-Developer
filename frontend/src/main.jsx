import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";
import { ErrorBoundary } from "react-error-boundary";

import ErrorPage from "./pages/ErrorHandling/ErrorPage.jsx";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <ErrorBoundary fallback={<ErrorPage />}>
      <App />
    </ErrorBoundary>
  // {/* </StrictMode>, */}
);
