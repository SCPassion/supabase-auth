import { useState } from "react";
import Signup from "./components/Signup";
import Signin from "./components/SignIn";

function App() {
  return (
    <>
      <Signup />
      <hr />
      <Signin />
    </>
  );
}

export default App;
