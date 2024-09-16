import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./index.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "./state/userAtom.js";
import { useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

function App() {
  const [loginData, setLoginData] = useState({});
  const [userData, setUserData] = useRecoilState(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data.user);
          navigate("/home");
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setUserData(null);
        });
    }
  }, [setUserData, navigate]);

  const loginUser = async () => {
    try {
      console.log("login called");
      const res = await axios.post("http://localhost:5000/users/login", {
        email: loginData.email,
        name: loginData.given_name,
      });

      console.log(res);
      localStorage.setItem("token", res.data.token);
      await setUserData(res.data.user);
      
      toast.success("Login Success");
      navigate("/home");
    } catch (err) {
      console.log(err.message);
      console.log(err);
      toast.error("Please try again...");
    }
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-4">
            AssignIt
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-2">
            Your one-stop solution to manage both personal and professional
            tasks. Easily create, edit, and organize tasks, and manage teams
            efficiently.
          </p>
          <p className="text-base md:text-lg text-gray-700">
            Assign tasks to users and streamline your workflow like never
            before!
          </p>
        </div>

        <div className="w-full md:w-1/2 bg-blue-500 flex items-center justify-center p-8">
          <div className="text-center">
            {userData ? (
              <UserProfile />
            ) : (
              <>
                <GoogleLogin
                  onSuccess={(res) => {
                    console.log("called");
                    let x = jwtDecode(res?.credential);
                    setLoginData(x);
                    loginUser();
                  }}
                  onError={(err) => {
                    console.log(err, "Login Failed");
                  }}
                />
                <p className="text-white mt-4">Sign in with Google</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function UserProfile() {
  const userData = useRecoilValue(userAtom);

  return (
    <div>
      <h1 className="text-white text-2xl mb-2">Welcome, {userData.name}</h1>
      <p className="text-white text-lg">Email: {userData.email}</p>
    </div>
  );
}

export default App;
