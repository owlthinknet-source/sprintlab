"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleHelp } from "lucide-react";
import { QuestionOptions } from "@/components/question-options";
import type { Question } from "@/lib/questions";

export function DailyRcQuiz({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const passages = useMemo(() => {
    const unique: string[] = [];
    for (const question of questions) {
      const passage = question.passage?.trim();
      if (passage && !unique.includes(passage)) {
        unique.push(passage);
      }
    }
    return unique;
  }, [questions]);

  const score = questions.filter(
    (question) => answers[question.id] === question.correctKey,
  ).length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === questions.length && questions.length > 0;

  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <article className="overflow-y-auto border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r dark:border-zinc-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Passage
        </p>
        {passages.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No passage was stored with today&apos;s questions.
          </p>
        ) : (
          passages.map((passage) => (
            <div
              key={passage.slice(0, 40)}
              className="mb-8 whitespace-pre-wrap font-serif text-[17px] leading-8 text-zinc-800 last:mb-0 dark:text-zinc-200"
            >
              {passage}
            </div>
          ))
        )}
      </article>

      <aside className="flex min-h-0 flex-col overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">Daily RC</h1>
          <p className="text-sm text-zinc-500">
            {answered}/{questions.length} answered
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          {questions.map((question, index) => (
            <section key={question.id} className="space-y-3">
              <h2 className="text-sm font-medium leading-6">
                <span className="mr-2 text-zinc-400">{index + 1}.</span>
                {question.stem}
              </h2>
              <QuestionOptions
                question={question}
                name={`daily-${question.id}`}
                selected={answers[question.id]}
                submitted={submitted}
                onSelect={(key) =>
                  setAnswers((current) => ({ ...current, [question.id]: key }))
                }
              />
              {submitted && question.explanation && (
                <p className="rounded-xl bg-zinc-50 p-3 text-sm leading-6 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  <span className="mr-1 font-semibold">Explanation:</span>
                  {question.explanation}
                </p>
              )}
            </section>
          ))}

          <div className="sticky bottom-0 space-y-3 bg-white/90 py-3 backdrop-blur dark:bg-zinc-950/90">
            {submitted ? (
              <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                <CheckCircle2 className="size-4" />
                Score: {score}/{questions.length} (
                {questions.length
                  ? Math.round((score / questions.length) * 100)
                  : 0}
                %)
              </p>
            ) : (
              <p className="flex items-center gap-2 text-xs text-zinc-500">
                <CircleHelp className="size-3.5" />
                Submit to see your score and explanations.
              </p>
            )}
            <button
              type="submit"
              disabled={!allAnswered || submitted}
              className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {submitted ? "Submitted" : "Submit answers"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
