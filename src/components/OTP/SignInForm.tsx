type SignInFormProps = {
  submitAction: (formData: FormData) => void;
};
export default function SignInForm({ submitAction }: SignInFormProps) {
  return (
    <form action={submitAction}>
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
    </form>
  );
}
