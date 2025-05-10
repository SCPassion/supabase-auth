import React from "react";
import { supabase } from "../../supabase-client";
import {
  type AuthResponse,
  type User,
  type AuthError,
  type PostgrestError,
} from "@supabase/supabase-js";

import LogOutButton from "./LogOutButton";
import SignInForm from "./SignInForm";

export default function SignInOTP() {
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const session = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in:", session.user);
        setUser(session.user);
        createUserRowInTable(session.user);
      }
    });

    return () => {
      session.data.subscription.unsubscribe();
    };
  }, []);

  async function createUserRowInTable(user: User) {
    // check if the user already existed in the table
    console.log("Checking if user exists in table:", user.email);
    const {
      data,
      error,
    }: { data: { email: string }[] | null; error: PostgrestError | null } =
      await supabase.from("sales").select("email").eq("email", user.email);

    console.log(data);
    if (error) {
      console.error("Error checking user in table:", error);
      setError(error);
      return;
    }

    if (data && data.length > 0) {
      console.log("User already exists in table:", data);
      return;
    }

    //Insert user data into the sale table, store the error to a new variable called insertError
    const { error: insertError }: { error: PostgrestError | null } =
      await supabase.from("sales").insert({
        user_id: user.id,
        created_at: new Date().toISOString(),
        email: user.email,
        plan: "free",
        region: "hk",
        revenue: 0,
      });

    if (insertError) {
      console.error("Error inserting user data:", insertError);
      setError(insertError);
      return;
    }

    console.log("User data inserted into table:", user.email);
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
          <LogOutButton signOut={signOut} />
        </>
      ) : (
        <>
          {/* <form action={submitAction}>
            <h2 className="text-2xl font-bold">Sign In With Magic Link</h2>
            <input
              type="email"
              placeholder="Email"
              name="email"
              aria-label="email"
              required
            />

            <button className="cursor-pointer py-2 px-4 hover:bg-black hover:text-white rounded-full">
              Sign In Now
            </button>
          </form> */}
          <SignInForm submitAction={submitAction} />
          {error && <p className="text-red-500">{error.message}</p>}
        </>
      )}
    </>
  );
}
