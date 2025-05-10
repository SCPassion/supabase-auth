type LogOutButtonProps = {
  signOut: () => Promise<void>;
};

export default function LogOutButton({ signOut }: LogOutButtonProps) {
  return (
    <button
      onClick={signOut}
      className="cursor-pointer py-2 px-4 hover:bg-black hover:text-white rounded-full"
    >
      Sign Out Now
    </button>
  );
}
