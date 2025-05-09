import { useState } from "react";
import { supabase } from "../supabase-client";
import { type AuthResponse, type PostgrestError } from "@supabase/supabase-js";

export default function Signup() {
  const [error, setError] = useState<Error | null>(null);

  async function signUp(email: string, password: string): Promise<void> {
    const { data, error }: AuthResponse = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error signing up:", error);
      setError(error);
      return;
    }

    if (data.user) {
      console.log("User signed up:", data.user);
      const { user } = data;

      // Insert user data into the sales table
      // Ensure the user is authenticated before inserting
      const { error }: { error: PostgrestError | null } = await supabase
        .from("sales")
        .insert({
          user_id: user.id,
          created_at: new Date().toISOString(),
          email: user.email,
          plan: "free",
          region: "hk",
          revenue: 0,
        });

      if (error) {
        console.error("Error inserting user data:", error);
        setError(error);
        return;
      }
    } else {
      console.log("No user data returned");
    }
  }

  function submitAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError(new Error("Email and password are required"));
      return;
    }
    signUp(email, password);
  }

  return (
    <form action={submitAction}>
      <h2 className="text-2xl font-bold">Sign Up</h2>
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
      <button className="cursor-pointer py-2 px-4 hover:bg-black hover:text-white rounded-full">
        Sign Up Now
      </button>
    </form>
  );
}
