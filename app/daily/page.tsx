import { DailyRcQuiz } from "@/components/daily-rc-quiz";
import { SiteHeader } from "@/components/site-header";
import {
  fetchDailyQuestions,
  todayInIndia,
  type Question,
} from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  let questions: Question[] = [];
  let errorMessage = "";

  try {
    questions = await fetchDailyQuestions();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Could not load today's RC set.";
  }

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-zinc-950">
      <SiteHeader active="daily" />
      {errorMessage ? (
        <p className="m-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {errorMessage}
        </p>
      ) : questions.length === 0 ? (
        <p className="m-6 text-sm text-zinc-600 dark:text-zinc-300">
          No free daily RC is published for {todayInIndia()}.
        </p>
      ) : (
        <DailyRcQuiz questions={questions} />
      )}
    </div>
  );
}
