import { useState } from "react";

export default function Conditional() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {loggedIn ? (
        <>
          <h1>Welcome Guest</h1>
          <button onClick={() => setLoggedIn(false)}>Logout</button>
        </>
      ) : (
        <>
          <h1>PLEASE LOGIN TO CONTINUE..</h1>
          <button onClick={() => setLoggedIn(true)}>Login</button>
        </>
      )}
    </>
  );
}
