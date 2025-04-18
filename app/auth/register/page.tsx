import { RegisterForm } from "@/components/auth/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Forum",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-73px)]">
      <RegisterForm />
    </div>
  );
}