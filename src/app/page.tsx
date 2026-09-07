import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center gap-4 p-8">
      <Link
        href="/user"
        className="rounded-lg bg-brgy-navy px-5 py-3 font-semibold text-white hover:bg-brgy-navy-mid"
      >
        Resident Portal
      </Link>
      <Link
        href="/admin"
        className="rounded-lg border border-brgy-navy px-5 py-3 font-semibold text-brgy-navy hover:bg-brgy-navy/5"
      >
        Open Admin Dashboard
      </Link>
    </div>
  );
}
