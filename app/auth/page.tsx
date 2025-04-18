import { LogInForm } from "@/components/auth/login";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Log In | Forum",
  description: "Log in to your account",
};

export default function LogInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container flex items-center justify-center min-h-[calc(100vh-73px)]">
        <LogInForm />
      </div>
    </Suspense>
  );
}