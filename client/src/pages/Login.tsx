import { SignIn } from "@clerk/clerk-react";

export function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <SignIn />
    </div>
  );
}
