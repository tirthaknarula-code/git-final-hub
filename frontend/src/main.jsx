import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "aos/dist/aos.css";
import AOS from "aos";
import { GoogleOAuthProvider } from "@react-oauth/google";

AOS.init();

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="905524913416-3bf5m72ugdgu43of4vqvnudfillq95qk.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
);
