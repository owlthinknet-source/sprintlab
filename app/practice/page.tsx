import Link from "next/link";
import { PracticeTest } from "@/components/practice-test";
import { SiteHeader } from "@/components/site-header";
import {
  fetchPracticeQuestions,
  type PracticeSection,
  type Question,
} from "@/lib/questions";

export const dynamic = "force-dynamic";

const SECTIONS: { id: PracticeSection; label: string; blurb: string }[] = [
  { id: "QA", label: "QA", blurb: "Quantitative Ability" },
  { id: "VARC", label: "VARC", blurb: "Verbal Ability & Reading Comprehension" },
  { id: "LRDI", label: "LRDI", blurb: "Logical Reasoning & Data Interpretation" },
];

function isPracticeSection(value: string | undefined): value is PracticeSection {
  return value === "QA" || value === "VARC" || value === "LRDI";
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section: rawSection } = await searchParams;
  const section = isPracticeSection(rawSection) ? rawSection : null;

  let questions: Question[] = [];
  let errorMessage = "";

  if (section) {
    try {
      questions = await fetchPracticeQuestions(section, 20);
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "Could not load practice questions.";
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-zinc-950">
      <SiteHeader active="practice" />

      {!section ? (
        <div className="mx-auto w-full max-w-3xl p-6">
          <h1 className="text-2xl font-semibold">20-question practice</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Pick a section to load 20 random free questions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {SECTIONS.map((item) => (
              <Link
                key={item.id}
                href={`/practice?section=${item.id}`}
                className="rounded-2xl border border-zinc-200 p-4 transition-colors hover:border-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-100"
              >
                <p className="text-lg font-semibold">{item.label}</p>
                <p className="mt-1 text-sm text-zinc-500">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : errorMessage ? (
        <p className="m-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {errorMessage}
        </p>
      ) : questions.length === 0 ? (
        <div className="m-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <p>No free 20Q questions were found for {section}.</p>
          <Link href="/practice" className="underline">
            Choose another section
          </Link>
        </div>
      ) : (
        <>
          <div className="px-6 pt-4">
            <Link href="/practice" className="text-sm text-zinc-500 underline">
              Change section
            </Link>
          </div>
          <PracticeTest section={section} questions={questions} />
        </>
      )}
    </div>
  );
}
