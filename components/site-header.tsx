import Link from "next/link";

export function SiteHeader({ active }: { active: "daily" | "practice" }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <Link href="/" className="text-sm font-semibold tracking-tight">
        SprintLab
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        <Link
          href="/daily"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
            active === "daily"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          Daily RC
        </Link>
        <Link
          href="/practice"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
            active === "practice"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          20Q Practice
        </Link>
      </nav>
    </header>
  );
}
