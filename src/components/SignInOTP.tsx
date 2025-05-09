import React from "react";
import { supabase } from "../supabase-client";
import {
  type AuthResponse,
  type User,
  type AuthError,
} from "@supabase/supabase-js";

export default function SignInOTP() {
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const session = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        console.log("User signed in:", session.user);
      }
    });

    return () => {
      session.data.subscription.unsubscribe();
    };
  }, []);

  async function signOut(): Promise<void> {
    const { error }: { error: AuthError | null } =
      await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      setError(error);
      return;
    }
    setUser(null);
    console.log("User signed out");
  }

  async function signInWithOTP(email: string) {
    const { data, error }: AuthResponse = await supabase.auth.signInWithOtp({
      email,
    });

    console.log("Data from signInWithOtp:", data);
    if (error) {
      console.error("Error signing in with OTP:", error);
      setError(error);
      return;
    }
    if (data.user) {
      console.log("User signed in with OTP:", data.user);
      setUser(data.user);
    } else {
      console.log("No user data returned");
    }
  }

  function submitAction(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
      setError(new Error("Email is required"));
      return;
    }

    signInWithOTP(email);
  }
  return (
    <>
      {user ? (
        <>
          <p className="text-green-500">Welcome back, {user.email}!</p>
          <button
            onClick={signOut}
            className="cursor-pointer py-2 px-4 hover:bg-black hover:text-white rounded-full"
          >
            Sign Out Now
          </button>
        </>
      ) : (
        <form action={submitAction}>
          <h2 className="text-2xl font-bold">Sign In With Magic Link</h2>
          <input
            type="email"
            placeholder="Email"
            name="email"
            aria-label="email"
            required
          />
          {error && <p className="text-red-500">{error.message}</p>}

          <button className="cursor-pointer py-2 px-4 hover:bg-black hover:text-white rounded-full">
            Sign In Now
          </button>
        </form>
      )}
    </>
  );
}
