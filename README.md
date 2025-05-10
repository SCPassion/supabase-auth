# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## Features Implemented

### 1. Supabase Authentication with Email and Password

- **Sign Up**: Users can sign up with their email and password.
- **Sign In**: Users can log in using their email and password.

#### Code Example:

```tsx
async function signUp(email: string, password: string): Promise<void> {
  const { data, error }: AuthResponse = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error signing up:", error);
    return;
  }

  console.log("User signed up:", data.user);
}

async function signIn(email: string, password: string): Promise<void> {
  const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error signing in:", error);
    return;
  }

  console.log("User signed in:", data.user);
}
```

### 2. Supabase Authentication with OTP

- Users can log in using a magic link sent to their email.

#### Code Example:

```tsx
async function signInWithOTP(email: string): Promise<void> {
  const { error }: AuthResponse = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    console.error("Error signing in with OTP:", error);
    return;
  }

  console.log("OTP sent to email:", email);
}
```

### 3. Shadcn Exercise

- Implemented UI components using Shadcn, including tabs and switches.

#### Code Example:

```tsx
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] mx-auto",
        className
      )}
      {...props}
    />
  );
}
```

### 4. Dark Mode with Shadcn Switch

- Added dark mode functionality using a toggle switch from Shadcn.
- The dark mode state is synchronized with the `dark` class on the `<html>` element.

#### Code Example:

```tsx
function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDarkMode]);

  return <Switch toggleDarkMode={setIsDarkMode} />;
}

function Switch({
  toggleDarkMode,
}: {
  toggleDarkMode: (isOn: boolean) => void;
}) {
  return (
    <SwitchPrimitive.Root
      onCheckedChange={(checked) => toggleDarkMode(checked)}
      className="peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input ..."
    >
      <SwitchPrimitive.Thumb className="bg-background dark:bg-foreground ..." />
    </SwitchPrimitive.Root>
  );
}
```

### 5. Adding a New User Row to Supabase Table on Sign In

- Automatically adds a new user row to the `sales` table in Supabase when a user signs in.
- Ensures no duplicate rows are created by checking for existing entries.

#### Code Example:

```tsx
async function createUserRowInTable(user: User) {
  console.log("Checking if user exists in table:", user.email);

  // Check if the user already exists in the table
  const { data, error } = await supabase
    .from("sales")
    .select("email")
    .eq("email", user.email);

  if (error) {
    console.error("Error checking user in table:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("User already exists in table:", data);
    return;
  }

  // Insert user data into the sales table
  const { error: insertError } = await supabase.from("sales").insert({
    user_id: user.id,
    created_at: new Date().toISOString(),
    email: user.email,
    plan: "free",
    region: "hk",
    revenue: 0,
  });

  if (insertError) {
    console.error("Error inserting user data:", insertError);
    return;
  }

  console.log("User data inserted into table:", user.email);
}
```

### 6. Handling Login State with React `useEffect`

- Used the `useEffect` hook to listen for authentication state changes and update the user state accordingly.
- Ensures that the app reacts to events like `INITIAL_SESSION`, `SIGNED_IN`, and `SIGNED_OUT`.

#### Code Example:

```tsx
React.useEffect(() => {
  console.log("Listening for auth changes...");
  const { data: subscription } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log("Auth event:", event);
      if (event === "INITIAL_SESSION" && session?.user) {
        console.log("Restoring session for user:", session.user);
        setUser(session.user);
      } else if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in:", session.user);
        setUser(session.user);
        createUserRowInTable(session.user);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setUser(null);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

#### Explanation:

1. **`INITIAL_SESSION` Event:**

   - Triggered when the listener is first initialized.
   - Restores the user's session if they are already signed in.

2. **`SIGNED_IN` Event:**

   - Triggered when a user successfully signs in.
   - Updates the user state and performs actions like adding a new user row to the database.

3. **`SIGNED_OUT` Event:**

   - Triggered when a user logs out.
   - Clears the user state and performs any necessary cleanup.

4. **Cleanup Function:**
   - Ensures the listener is unsubscribed when the component unmounts to avoid memory leaks.

This approach ensures that the app dynamically reacts to authentication state changes and maintains the correct user state.
