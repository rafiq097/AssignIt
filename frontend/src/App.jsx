import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./index.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "./state/userAtom.js";

function App() {
  const [token, setToken] = useState({});
  const [userData, setUserData] = useRecoilState(userAtom);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data.user);
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setUserData(null);
        });
    }
  }, []);

  const loginUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/users/login", {
        email: token.email,
        name: token.given_name,
      });

      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      setUserData(res.data.user);

      toast.success("Login Success");
    } catch (err) {
      console.log(err.message);
      toast.error("Please try again...");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">AssignIt</h1>
        <p className="text-lg text-gray-700 text-center">
          Your one-stop solution to manage both personal and professional tasks.
          Easily create, edit, and organize tasks, and manage teams efficiently.
        </p>
          <p className="text-lg text-gray-700 text-center">Assign tasks to users and streamline your workflow like never before!</p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-blue-500 flex items-center justify-center">
        <div className="text-center">
          {userData ? (
            <UserProfile />
          ) : (
            <>
              <GoogleLogin
                onSuccess={(res) => {
                  console.log(res);
                  let x = jwtDecode(res?.credential);
                  setToken(x);
                  console.log(token);
                  loginUser();
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
              <p className="text-white mt-4">Sign in with Google</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function UserProfile() {
  const userData = useRecoilValue(userAtom);

  return (
    <div>
      <h1 className="text-white mt-4">Welcome, {userData.name}</h1>
      <p className="text-white mt-4">Email: {userData.email}</p>
    </div>
  );
}

export default App;
