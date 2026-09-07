"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

const documentTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Clearance",
] as const;

const requestSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  contactNumber: z
    .string()
    .trim()
    .min(7, "Enter a valid contact number"),
  documentType: z.enum(documentTypes, {
    message: "Select a document type",
  }),
  purpose: z.string().trim().min(3, "Tell us what this document is for"),
  quantity: z.number().int().min(1).max(10),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function RequestDocumentPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      purpose: "",
      quantity: 1,
    },
  });

  async function onSubmit(values: RequestFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Document request submitted", values);
    toast.success("Document request submitted");
    setSubmitted(true);
    reset();
  }

  return (
    <div>
      <Link
        href="/user"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brgy-navy hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-brgy-navy lg:text-3xl">
          Request a Document
        </h1>
        <p className="mt-2 max-w-2xl text-base text-brgy-muted">
          Fill out this form and the barangay office will process your request.
        </p>
      </div>

      {submitted ? (
        <div className="max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="text-lg font-semibold text-emerald-800">Request sent</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-emerald-700">
            We received your request. Visit the barangay office once it has been processed.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-xl space-y-5 rounded-xl border border-black/8 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-brgy-ink">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              {...register("fullName")}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-brgy-navy"
              placeholder="Juan Dela Cruz"
            />
            {errors.fullName ? (
              <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contactNumber" className="mb-1 block text-sm font-medium text-brgy-ink">
              Contact number
            </label>
            <input
              id="contactNumber"
              type="tel"
              {...register("contactNumber")}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-brgy-navy"
              placeholder="09XX XXX XXXX"
            />
            {errors.contactNumber ? (
              <p className="mt-1 text-xs text-rose-600">{errors.contactNumber.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="documentType" className="mb-1 block text-sm font-medium text-brgy-ink">
              Document type
            </label>
            <select
              id="documentType"
              {...register("documentType")}
              defaultValue=""
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-brgy-navy"
            >
              <option value="" disabled>
                Select a document
              </option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.documentType ? (
              <p className="mt-1 text-xs text-rose-600">{errors.documentType.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="purpose" className="mb-1 block text-sm font-medium text-brgy-ink">
              Purpose
            </label>
            <textarea
              id="purpose"
              rows={3}
              {...register("purpose")}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-brgy-navy"
              placeholder="e.g. Job application requirement"
            />
            {errors.purpose ? (
              <p className="mt-1 text-xs text-rose-600">{errors.purpose.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-brgy-ink">
              Number of copies
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={10}
              {...register("quantity", { valueAsNumber: true })}
              className="w-32 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-brgy-navy"
            />
            {errors.quantity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.quantity.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brgy-navy px-5 py-3 font-semibold text-white transition-colors hover:bg-brgy-navy-mid disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit request"}
          </button>
        </form>
      )}
    </div>
  );
}
