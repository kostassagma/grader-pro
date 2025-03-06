import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages";
import App from "./pages/app";
import SubmitPage from "./pages/submit";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="app" element={<App />} />
      <Route path="app/:id" element={<SubmitPage />} />
    </Routes>
  </BrowserRouter>
);
