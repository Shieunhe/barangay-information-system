import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  HelpCircle,
} from "lucide-react";
import { EventsCarousel } from "@/components/user/EventsCarousel";

export default function UserHomePage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm lg:p-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brgy-gold">
              Resident Portal
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-brgy-navy sm:text-4xl lg:text-5xl">
              Barangay services,
              <br />
              without the long lines.
            </h1>
            <p className="mt-4 max-w-md text-base text-brgy-muted">
              Request clearances, certificates, and permits online, then track
              every submission from your phone or computer.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/user/documents/request"
                className="inline-flex items-center gap-2 rounded-lg bg-brgy-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-brgy-navy-mid"
              >
                <FileText className="h-5 w-5" />
                Request a Document
              </Link>
              <Link
                href="/user/requests"
                className="inline-flex items-center gap-2 rounded-lg border border-brgy-navy/20 px-6 py-3 font-semibold text-brgy-navy transition-colors hover:bg-brgy-navy/5"
              >
                View My Requests
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-black/8 pt-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brgy-gold/20 text-brgy-navy">
                <HelpCircle className="h-5 w-5" />
              </span>
              <p className="text-sm text-brgy-muted">
                Need help? Visit or call the barangay office during business hours.
              </p>
            </div>
          </div>

          <div className="relative mx-auto hidden h-80 w-full max-w-md lg:block">
            <div className="absolute inset-x-6 top-4 h-56 rounded-2xl bg-brgy-navy/5" />

            <div className="absolute left-0 top-6 w-64 -rotate-3 rounded-xl border border-black/8 bg-white p-5 shadow-lg">
              <FileText className="h-6 w-6 text-brgy-navy" />
              <p className="mt-3 text-sm font-semibold text-brgy-navy">
                Barangay Clearance
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-black/8" />
                <div className="h-1.5 w-4/5 rounded-full bg-black/8" />
                <div className="h-1.5 w-3/5 rounded-full bg-black/8" />
              </div>
            </div>

            <div className="absolute right-0 top-28 w-56 rotate-3 rounded-xl border border-black/8 bg-brgy-navy p-5 text-white shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-brgy-gold" />
              <p className="mt-3 text-sm font-semibold">Request approved</p>
              <p className="mt-1 text-xs text-white/70">Ready for pickup</p>
            </div>

            <div className="absolute bottom-2 left-10 flex items-center gap-2 rounded-full bg-brgy-gold px-4 py-2 text-sm font-semibold text-brgy-navy shadow-lg">
              <CalendarDays className="h-4 w-4" />
              3 events this week
            </div>
          </div>
        </div>
      </section>

      <EventsCarousel />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/user/requests"
          className="rounded-xl border border-black/8 bg-white p-5 shadow-sm transition-colors hover:border-brgy-navy/30"
        >
          <FileText className="h-6 w-6 text-brgy-navy" />
          <p className="mt-3 font-semibold text-brgy-navy">My Requests</p>
          <p className="mt-1 text-sm text-brgy-muted">
            Track the status of documents you have requested.
          </p>
        </Link>
        <Link
          href="/user/events"
          className="rounded-xl border border-black/8 bg-white p-5 shadow-sm transition-colors hover:border-brgy-navy/30"
        >
          <CalendarDays className="h-6 w-6 text-brgy-navy" />
          <p className="mt-3 font-semibold text-brgy-navy">Upcoming Events</p>
          <p className="mt-1 text-sm text-brgy-muted">
            See activities and announcements from the barangay.
          </p>
        </Link>
      </div>
    </div>
  );
}
