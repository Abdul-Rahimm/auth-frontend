"use client";

import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

type AuthMode = "login" | "signup";

export function AuthContainer() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setShowSuccess(false);
  };

  const handleSignupSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setMode("login");
      setShowSuccess(false);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Account Created!
            </h2>
            <p className="text-green-600">
              Your account has been successfully created. Redirecting to
              login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === "login" ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignupForm
            onToggleMode={toggleMode}
            onSignupSuccess={handleSignupSuccess}
          />
        )}
      </div>
    </div>
  );
}
