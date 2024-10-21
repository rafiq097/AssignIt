  import { useEffect } from "react";
  import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
  import { Toaster } from "react-hot-toast";
  import toast from "react-hot-toast";
  import axios from "axios";
  import { useRecoilState } from "recoil";
  import { userAtom } from "./state/userAtom.js";
  import Navbar from "./components/NavBar";
  import HomePage from "./pages/HomePage";
  import LoginPage from "./pages/LoginPage";
  import DashboardPage from "./pages/DashboardPage";
  import Spinner from "./components/Spinner";
  import { useState } from "react";
  import EditTask from "./pages/EditTask.jsx";
  import EditSubTask from "./pages/EditSubTask.jsx";
  import ViewTask from "./pages/ViewTask.jsx";
  import AddTask from "./pages/AddTask.jsx";

  function App() {
    const [ userData, setUserData ] = useRecoilState(userAtom);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const verify = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get("/verify", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUserData(res.data.user);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            localStorage.removeItem("token");
            setUserData(null);
            setLoading(false);
            navigate("/login");
          });
      } else {
        setLoading(false);
        toast.error("Please login to continue");
        navigate("/login");
      }
    };

    useEffect(() => {
      verify();
    }, []);

    if (loading) return <Spinner />;

    return (
      <div className="flex flex-col min-h-screen">
        {userData && <Navbar />}
        <Routes>
          <Route
            path="/"
            // element={userData ? <HomePage /> : <Navigate to="/login" />}
            element={<HomePage />}
          />
          <Route
            path="/login"
            element={!userData ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={
              userData?.role !== "user" ? <DashboardPage /> : <Navigate to="/" />
            }
          />
          <Route path="/task/:id" element={<EditTask />} />
          <Route path="/task/:parentId/:subTaskId" element={<EditSubTask />} />
          <Route path="/viewtask/:id" element={<ViewTask />} />
          <Route path="/addtask" element={<AddTask />} />
        </Routes>
        <Toaster />
      </div>
    );
  }

  export default App;
