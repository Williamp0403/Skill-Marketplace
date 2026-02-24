import { SignUp } from "@clerk/clerk-react";

export function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <SignUp />
    </div>
  );
}
