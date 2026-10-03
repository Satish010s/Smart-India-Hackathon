"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthShell from "../../../components/auth/AuthShell";
import AuthFlow from "../../../components/auth/AuthFlow";
import { LuLoaderCircle } from "react-icons/lu";

function ResetContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <AuthShell badge="Security protocol">
      <AuthFlow
        variant="page"
        initialView="forgot"
        startAtReset={Boolean(email)}
        initialEmail={email}
        notices={{ reset: searchParams.get("reset") }}
      />
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
          <LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={30} />
        </div>
      }
    >
      <ResetContent />
    </Suspense>
  );
}
