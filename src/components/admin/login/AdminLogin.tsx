"use client";

import { Building, Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const closeModal = () => {
    setIsForgotPasswordOpen(false);
    setIsSubmitted(false);
    setResetEmail('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin" && password === "admin") {
      router.push("/admin/dashboard");
    } else {
      alert("User Login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f8f4] flex items-center justify-center p-8 sm:p-16 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

        {/* ================= LEFT SIDE: TITLE & DESCRIPTION ================= */}
        <div className="md:col-span-7 space-y-6 pr-0 md:pr-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#62c088] leading-tight tracking-tight">
            Barangay<br />
            Management<br />
            Information<br />
            System
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-md leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* ================= RIGHT SIDE: LOGIN CARD ================= */}
        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 sm:p-10 text-center">

            {/* Logo Header */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Building className="w-15 h-15" color="#42b672 " />
              <div className="text-left leading-none">

                <span className="block font-bold text-slate-800 text-lg">
                  Barangay Management Information System</span>
              </div>
            </div>

            {/* Login Title */}
            <h2 className="text-lg font-bold text-slate-800 tracking-wide uppercase">LOG IN</h2>
            <p className="text-[11px] text-slate-400 mt-1 mb-8"></p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Username Input */}
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                />
              </div>

              {/* Password Input */}
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                {/* Lock Icon */}
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                />

                {/* Show / Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <button
                onClick={() => setIsForgotPasswordOpen(true)}
                className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {/* <span>&rarr;</span> */}
                <span>Forgot Password</span>
              </button>


              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#42b672] hover:bg-[#389e62] active:bg-[#2f8854] text-white font-medium py-2.5 rounded-md text-md transition-colors shadow-sm"
                >
                  Log In
                </button>
              </div>
            </form>

           
            {/* <div className="mt-6 text-right">
              <a
                href="/login_page/signupPage.tsx"
                className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Sign Up</span>
              </a>
            </div> */}

          </div>
        </div>
        {/* ================= FORGOT PASSWORD POP-UP MODAL ================= */}
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center mt-2 mb-6">
                <h3 className="text-lg font-bold text-[#1E293B]">Reset Password</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your email address and we will send you a link to reset your password.
                </p>
              </div>

              {/* Modal Body */}
              {!isSubmitted ? (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3" />
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3EB370]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#3EB370] hover:bg-[#349B61] text-white font-medium py-2.5 rounded-xl transition duration-200 text-sm mt-2"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-green-100 text-[#3EB370] rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    Reset link sent!
                  </p>
                  <p className="text-xs text-gray-500">
                    Please check your inbox at <span className="font-semibold">{resetEmail}</span>
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 rounded-xl transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
