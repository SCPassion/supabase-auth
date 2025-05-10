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

  //Purpose: Listens for authentication state changes (e.g., login, logout).
  //Steps:
  //When a user logs in (SIGNED_IN event), it sets the user in the user state
  //and calls createUserRowInTable to ensure the user's data is stored in the database.
  //The listener is cleaned up when the component unmounts to avoid memory leaks.
  React.useEffect(() => {
    console.log("Listening for auth changes...");
    const session = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth session:", session?.user, event);
      console.log("Auth event:", event);
      if (session?.user) {
        console.log("User signed in:", session.user);
        setUser(session.user);
        createUserRowInTable(session.user);
        console.log("User:", session.user);
      }
    });

    return () => {
      session.data.subscription.unsubscribe();
    };
  }, []);

  // Purpose: Ensures that the user's data (e.g., email, role, etc.) is stored in the sales table.
  //Steps:
  //Checks if the user already exists in the sales table by querying with their email.
  //If the user exists, it logs a message and exits.
  //If the user does not exist, it inserts a new row with the user's data (e.g., user_id, email, plan, etc.).
  //Haandles errors during both the query and insertion phases.

  // make sure to add this SQL policy to the sales table
  // ALTER TABLE sales ADD CONSTRAINT unique_user UNIQUE (user_id);
  // to ensure that the user_id is unique in the sales table
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

  // Purpose: This function sends a magic link to the user's email for OTP-based login.
  // Steps:
  // Calls supabase.auth.signInWithOtp with the user's email.
  // If there's an error (e.g., invalid email), it logs the error and sets it in the error state.
  // If successful, Supabase will handle the session creation and trigger the onAuthStateChange listener.
  async function signInWithOTP(email: string) {
    const { error }: AuthResponse = await supabase.auth.signInWithOtp({
      email,
    });

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
          <SignInForm submitAction={submitAction} />
          {error && <p className="text-red-500">{error.message}</p>}
        </>
      )}
    </>
  );
}
