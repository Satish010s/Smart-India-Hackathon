"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuX } from "react-icons/lu";
import { useAuthModalStore } from "../../store/useAuthModalStore";
import AuthFlow from "./AuthFlow";

/**
 * AuthModal — popup authentication experience (sign in / sign up / password reset).
 * Mounted once on the landing page; triggered from anywhere via useAuthModalStore.
 */
export default function AuthModal() {
  const { isOpen, mode, closeAuthModal } = useAuthModalStore();

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeAuthModal();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeAuthModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6" role="presentation">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Account authentication"
            className="relative w-full max-w-[440px] max-h-[92vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.55)]"
          >
            {/* Subtle top accent line */}
            <div
              className="absolute top-0 inset-x-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-primary) 60%, transparent), transparent)",
              }}
              aria-hidden="true"
            />

            {/* Close */}
            <button
              type="button"
              onClick={closeAuthModal}
              aria-label="Close authentication dialog"
              className="absolute top-4 right-4 z-10 w-8 h-8 inline-flex items-center justify-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
            >
              <LuX size={17} />
            </button>

            <div className="p-6 sm:p-8">
              {isOpen && (
                <AuthFlow
                  key={mode}
                  variant="modal"
                  initialView={mode}
                  onComplete={closeAuthModal}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
