import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { userAtom } from "./state/userAtom.js";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Spinner from "./components/Spinner";
import { useState } from "react";

function App() {
  const userData = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen">
      {userData && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={<Navigate to={userData ? "/home" : "/login"} />}
        />
        <Route
          path="/home"
          element={userData ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!userData ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={
            userData?.role === "admin" ? <DashboardPage /> : <Navigate to="/" />
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
