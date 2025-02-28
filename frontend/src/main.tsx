import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages";
import App from "./pages/app";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
    <Routes>
      <Route path="/app" element={<App />} />
    </Routes>
  </BrowserRouter>
);
