import Tab from "./components/Tab";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import SignInOTP from "./components/OTP/SignInOTP";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode(isOn: boolean) {
    setIsDarkMode(isOn);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }
  return (
    <div className="flex flex-col items-center min-h-screengap-4 py-5 gap-4">
      <h1 className="text-2xl font-bold">Welcome to Supabase Auth</h1>
      <p className="text-gray-500">
        This is a simple authentication example using Supabase.
      </p>
      <div className="flex gap-4">
        <p>DarkMode: </p>
        <Switch toggleDarkMode={toggleDarkMode} />
      </div>
      <Tab />

      <SignInOTP />
    </div>
  );
}

export default App;
