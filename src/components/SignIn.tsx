import React from "react";
import { supabase } from "../supabase-client";
import {
  type AuthResponse,
  type User,
  type AuthError,
} from "@supabase/supabase-js";

export default function Signin() {
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  async function signIn(email: string, password: string): Promise<void> {
    const { data, error }: AuthResponse =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("Error signing in:", error);
      setError(error);
      return;
    }

    if (data.user) {
      console.log("User signed in:", data.user);
      setUser(data.user);
    } else {
      console.log("No user data returned");
    }
  }

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

  function submitAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError(new Error("Email and password are required"));
      return;
    }

    signIn(email, password);
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
          <h2 className="text-2xl font-bold">Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            name="email"
            aria-label="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            aria-label="password"
            required
          />
          {error && <p className="text-red-500">{error.message}</p>}

          <button
            className="cursor-pointer py-2 px-4 hover:bg-black hover:text-white rounded-full"
            rounded-full
          >
            Sign In Now
          </button>
        </form>
      )}
    </>
  );
}
