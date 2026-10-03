"use client";

import React, { Suspense } from "react";
import AuthShell from "../../../components/auth/AuthShell";
import AuthFlow from "../../../components/auth/AuthFlow";
import { LuLoaderCircle } from "react-icons/lu";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
          <LuLoaderCircle className="animate-spin text-[var(--color-primary)]" size={30} />
        </div>
      }
    >
      <AuthShell badge="Secure authentication">
        <AuthFlow variant="page" initialView="forgot" />
      </AuthShell>
    </Suspense>
  );
}
