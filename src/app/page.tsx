import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Link
        href="/admin"
        className="rounded-lg bg-brgy-navy px-5 py-3 font-semibold text-white hover:bg-brgy-navy-mid"
      >
        Open Admin Dashboard
      </Link>
    </div>
  );
}
