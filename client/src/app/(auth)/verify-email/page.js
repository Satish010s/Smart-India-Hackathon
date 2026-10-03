"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthShell from "../../../components/auth/AuthShell";
import AuthFlow from "../../../components/auth/AuthFlow";
import { LuLoaderCircle } from "react-icons/lu";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const unverified = searchParams.get("unverified");

  return (
    <AuthShell badge="Verification required">
      <AuthFlow
        variant="page"
        initialView="verify"
        initialEmail={email}
        notices={{ unverified }}
      />
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
          <LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={30} />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
