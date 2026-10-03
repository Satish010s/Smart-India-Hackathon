"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthShell from "../../../components/auth/AuthShell";
import AuthFlow from "../../../components/auth/AuthFlow";
import { LuLoaderCircle } from "react-icons/lu";

function LoginContent() {
  const searchParams = useSearchParams();
  return (
    <AuthShell badge="Quantum engine online">
      <AuthFlow
        variant="page"
        initialView="login"
        autoRedirectIfAuthed
        returnUrl={searchParams.get("returnUrl") || ""}
        notices={{
          verified: searchParams.get("verified"),
          reset: searchParams.get("reset"),
          unverified: searchParams.get("unverified"),
        }}
      />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
          <LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={30} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
