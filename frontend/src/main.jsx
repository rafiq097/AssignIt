import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
// import TaskPage from "./pages/TaskPage.jsx";
// import TeamPage from "./pages/TeamPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="845080890644-0iidd09rul2fi5k4bbf7q0pv0okm1ppu.apps.googleusercontent.com">
      <RecoilRoot>
        {/* <App /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/home" element={<HomePage />} />
            {/* <Route path="/tasks" element={<TaskPage />} /> */}
            {/* <Route path="/teams" element={<TeamPage />} /> */}
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </RecoilRoot>
    </GoogleOAuthProvider>
  </StrictMode>
);
