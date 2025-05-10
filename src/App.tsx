import { useState } from "react";
import Signup from "./components/Signup";
import Signin from "./components/SignIn";
import SignInOTP from "./components/OTP/SignInOTP";
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4 text-center">
      <div className="space-y-4">
        <hr />
        <Signup />
        <Signin />
      </div>
      <div className="space-y-4">
        <hr />
        <SignInOTP />
      </div>
    </div>
  );
}

export default App;
