import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="845080890644-0iidd09rul2fi5k4bbf7q0pv0okm1ppu.apps.googleusercontent.com">
      <RecoilRoot>
        <App />
        <Toaster />
      </RecoilRoot>
    </GoogleOAuthProvider>
  </StrictMode>
);
