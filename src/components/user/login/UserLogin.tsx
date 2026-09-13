"use client";

import { Building, Mail, Lock, X, ArrowRight, Eye, EyeOff, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { firebaseAuthMessage, useSendResidentPasswordReset, useSignInResident } from "@/services/auth";

function loginStatusMessage(status: string) {
  if (status === "account verification") {
    return "Logged in. Your account is under verification.";
  }

  if (status === "pending") {
    return "Logged in. Your registration is pending approval.";
  }

  if (status === "not registered") {
    return "Logged in. Your registration was not approved.";
  }

  return "Logged in.";
}

export function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loginMutation = useSignInResident();
  const resetMutation = useSendResidentPasswordReset();

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMutation.mutate(resetEmail, {
      onSuccess: () => setIsSubmitted(true),
    });
  };

  const closeModal = () => {
    setIsForgotPasswordOpen(false);
    setIsSubmitted(false);
    setResetEmail("");
    resetMutation.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const clearLoginStatus = () => {
    if (loginMutation.isError || loginMutation.isSuccess) {
      loginMutation.reset();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef8f2] font-sans">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#62c088]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-[#3EB370]/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="mb-5 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-[#2f8854] shadow-sm">
              Resident portal
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#2c3e50] sm:text-5xl lg:text-[3.4rem]">
              Barangay Management
              <span className="mt-1 block text-[#3EB370]">Information System</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              Sign in to view your registration, request documents, and stay updated on barangay announcements.
            </p>
          </div>

          <div className="lg:col-span-6 lg:flex lg:justify-end">
            <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/95 p-7 shadow-[0_24px_60px_rgba(15,60,40,0.12)] backdrop-blur sm:p-9">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#3EB370]">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
                  <p className="text-sm text-slate-500">Log in with your resident account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {loginMutation.isError ? (
                  <p className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{firebaseAuthMessage(loginMutation.error)}</span>
                  </p>
                ) : null}
                {loginMutation.isSuccess ? (
                  <p className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{loginStatusMessage(loginMutation.data.user.status)}</span>
                  </p>
                ) : null}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearLoginStatus();
                      }}
                      placeholder="your.email@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#3EB370] focus:bg-white focus:ring-4 focus:ring-[#3EB370]/15"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
                  <span className="relative block">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearLoginStatus();
                      }}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#3EB370] focus:bg-white focus:ring-4 focus:ring-[#3EB370]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-sm font-medium text-[#2f8854] transition-colors hover:text-[#246b42]"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3EB370] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#349B61] active:bg-[#2f8854] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loginMutation.isPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/user/register" className="inline-flex items-center gap-1 font-semibold text-[#2f8854] hover:text-[#246b42]">
                  Sign up
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {isForgotPasswordOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 pr-6">
              <h3 className="text-lg font-bold text-slate-800">Reset password</h3>
              <p className="mt-1 text-sm text-slate-500">
                Enter your email and we will send a link to reset your password.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                {resetMutation.isError ? (
                  <p className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{firebaseAuthMessage(resetMutation.error)}</span>
                  </p>
                ) : null}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email address
                  </span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        if (resetMutation.isError) {
                          resetMutation.reset();
                        }
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#3EB370] focus:bg-white focus:ring-4 focus:ring-[#3EB370]/15"
                      required
                    />
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3EB370] py-3 text-sm font-semibold text-white transition hover:bg-[#349B61] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resetMutation.isPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-3 py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#3EB370]">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-800">Reset link sent</p>
                <p className="text-xs text-slate-500">
                  Please check your inbox at <span className="font-semibold">{resetEmail}</span>
                </p>
                <button
                  onClick={closeModal}
                  className="mt-2 w-full rounded-2xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
