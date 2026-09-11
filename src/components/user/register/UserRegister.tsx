"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  Lock,
  Calendar,
  ArrowLeft,
  Eye,
  EyeOff,
  Building,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import { puroks } from "@/common/admin/userOptions";
import { formatPhMobile, isPhMobile } from "@/common/phMobile";
import { firebaseAuthMessage, useRegisterResident } from "@/services/auth";

const civilStatuses = ["Single", "Married", "Widowed", "Widower"] as const;
const sexes = ["Male", "Female"] as const;
const steps = [
  { id: 1, label: "Information" },
  { id: 2, label: "Account" },
  { id: 3, label: "Verification" },
] as const;

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#3EB370] focus:bg-white focus:ring-4 focus:ring-[#3EB370]/15";

function ageFromBirthDate(value: string) {
  if (!value) {
    return "";
  }

  const birth = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return String(Math.max(0, age));
}

export function UserRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const registerMutation = useRegisterResident();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    status: "",
    purok: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormError("");
    setFormData((prev) => ({
      ...prev,
      [name]: name === "contactNumber" ? formatPhMobile(value) : value,
      ...(name === "dateOfBirth" ? { age: ageFromBirthDate(value) } : {}),
    }));
  };

  const goToAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhMobile(formData.contactNumber)) {
      setFormError("Contact number must be 11 digits and start with 09.");
      return;
    }

    setStep(2);
  };

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    registerMutation.mutate(formData, {
      onSuccess: () => setStep(3),
    });
  };

  const continueToLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/user/login");
  };

  const stepError = formError || (step === 2 && registerMutation.isError ? firebaseAuthMessage(registerMutation.error) : "");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef8f2] font-sans">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#62c088]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-[#3EB370]/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10 sm:px-10">
        <div className="w-full rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,60,40,0.12)] backdrop-blur sm:p-9">
          <div className="mb-6 flex items-start justify-between gap-4">
            <Link href="/user/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#3EB370]">
                <Building className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Resident sign up</p>
                <p className="text-xs text-slate-500">Barangay Information System</p>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-2">
            {steps.map((item) => {
              const active = step === item.id;
              const done = step > item.id;

              return (
                <div key={item.id} className="min-w-0">
                  <div className={`h-1.5 rounded-full ${active || done ? "bg-[#3EB370]" : "bg-slate-200"}`} />
                  <p className={`mt-2 text-xs font-semibold ${active ? "text-[#2f8854]" : "text-slate-400"}`}>
                    Step {item.id}
                  </p>
                  <p className={`truncate text-sm font-medium ${active ? "text-slate-800" : "text-slate-500"}`}>
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          {stepError ? (
            <p className="mb-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{stepError}</span>
            </p>
          ) : null}

          {step === 1 ? (
            <form onSubmit={goToAccount} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Personal information</h1>
                <p className="mt-1 text-sm text-slate-500">Tell us who you are so the barangay can review your registration.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">First name</span>
                  <input name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Juan" className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Middle name</span>
                  <input name="middleName" required value={formData.middleName} onChange={handleChange} placeholder="Santos" className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Last name</span>
                  <input name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Dela Cruz" className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Suffix (optional)</span>
                  <input name="suffix" value={formData.suffix} onChange={handleChange} placeholder="Jr, III" className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Date of birth</span>
                  <span className="relative block">
                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className={`${fieldClass} pl-10`} />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Age</span>
                  <input type="number" name="age" required min={0} value={formData.age} onChange={handleChange} placeholder="25" className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Civil status</span>
                  <select name="status" required value={formData.status} onChange={handleChange} className={fieldClass}>
                    <option value="">Select civil status</option>
                    {civilStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Gender</span>
                  <select name="gender" required value={formData.gender} onChange={handleChange} className={fieldClass}>
                    <option value="">Select gender</option>
                    {sexes.map((sex) => (
                      <option key={sex} value={sex}>
                        {sex}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Purok</span>
                  <select name="purok" required value={formData.purok} onChange={handleChange} className={fieldClass}>
                    <option value="">Select purok</option>
                    {puroks.map((purok) => (
                      <option key={purok} value={purok}>
                        {purok}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Contact number</span>
                  <span className="relative block">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="contactNumber"
                      inputMode="numeric"
                      required
                      minLength={11}
                      maxLength={11}
                      pattern="09[0-9]{9}"
                      title="Contact number must be 11 digits and start with 09"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="09123456789"
                      className={`${fieldClass} pl-10`}
                    />
                  </span>
                </label>
              </div>

              <button type="submit" className="mt-2 w-full rounded-2xl bg-[#3EB370] py-3 text-sm font-semibold text-white transition hover:bg-[#349B61]">
                Next
              </button>
            </form>
          ) : null}

          {step === 2 ? (
            <form onSubmit={createAccount} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Account creation</h1>
                <p className="mt-1 text-sm text-slate-500">Create the email and password you will use to log in.</p>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your.email@example.com" className={`${fieldClass} pl-10`} />
                </span>
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
                  <span className="relative block">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className={`${fieldClass} pl-10 pr-11`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</span>
                  <span className="relative block">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      minLength={6}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className={`${fieldClass} pl-10 pr-11`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Back
                </button>
                <button type="submit" disabled={registerMutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3EB370] py-3 text-sm font-semibold text-white transition hover:bg-[#349B61] disabled:opacity-60">
                  {registerMutation.isPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            </form>
          ) : null}

          {step === 3 ? (
            <form onSubmit={continueToLogin} className="mx-auto max-w-md space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f8ef] text-[#3EB370]">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Account verification</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Email verification is not required yet. You can continue to log in.
                </p>
              </div>

              <label className="block text-left">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Verification code</span>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setFormError("");
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  }}
                  placeholder="000000"
                  className={`${fieldClass} text-center text-2xl tracking-[0.5em]`}
                />
              </label>

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3EB370] py-3 text-sm font-semibold text-white transition hover:bg-[#349B61]">
                Continue to login
              </button>

              <button
                type="button"
                disabled
                className="text-sm font-medium text-slate-400"
              >
                Resend code
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
