import { useState } from 'react'
import './App.css'
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function App() {

  return (
    <>
      <GoogleLogin 
        onSuccess={(res) => {
          console.log(res);
          const token = jwtDecode(res?.credential);
          console.log(token);
          //email && given_name
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  )
}

export default App
