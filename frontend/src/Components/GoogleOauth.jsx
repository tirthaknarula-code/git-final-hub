import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";

export default function GoogleOauth({ onLogin, user, onLogout }) {
  const [error, setError] = useState("");

  const getProfile = (tokenResponse) => {
    if (!tokenResponse?.access_token) {
      setError("Google sign-in could not start.");
      return;
    }

    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        setError("");
        onLogin(res.data);
      })
      .catch(() => {
        setError(
          "Google profile could not be loaded. Please use localhost:5173.",
        );
      });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => getProfile(codeResponse),
    onError: () => setError("Login Failed"),
    scope: "openid profile email",
    prompt: "select_account",
  });

  const logout = () => {
    googleLogout();
    onLogout();
  };

  return (
    <div className="google-area">
      {user ? (
        <>
          {user.picture && <img src={user.picture} alt={user.name} />}
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login()}>Sign in with Google</button>
      )}
      {error && <small>{error}</small>}
    </div>
  );
}
