"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { QuestionOptions } from "@/components/question-options";
import type { Question } from "@/lib/questions";

export function PracticeTest({
  section,
  questions,
}: {
  section: string;
  questions: Question[];
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const question = questions[index];

  const score = useMemo(
    () =>
      questions.filter((item) => answers[item.id] === item.correctKey).length,
    [answers, questions],
  );

  if (!question) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {section} · 20Q Practice
          </p>
          <h1 className="text-xl font-semibold">
            Question {index + 1} of {questions.length}
          </h1>
        </div>
        <p className="text-sm text-zinc-500">
          {Object.keys(answers).length}/{questions.length} answered
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((item, itemIndex) => {
          const selected = answers[item.id];
          let className = "bg-zinc-100 text-zinc-500 dark:bg-zinc-800";
          if (submitted && selected === item.correctKey) {
            className = "bg-emerald-600 text-white";
          } else if (submitted && selected && selected !== item.correctKey) {
            className = "bg-rose-600 text-white";
          } else if (itemIndex === index) {
            className = "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900";
          } else if (selected) {
            className = "bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:text-white";
          }
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`size-8 rounded-md text-xs font-medium ${className}`}
            >
              {itemIndex + 1}
            </button>
          );
        })}
      </div>

      {question.passage && (
        <article className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 font-serif text-[15px] leading-7 dark:border-zinc-800 dark:bg-zinc-900">
          {question.passage}
        </article>
      )}

      <section className="space-y-4">
        <h2 className="text-base font-medium leading-7">{question.stem}</h2>
        <QuestionOptions
          question={question}
          name={`practice-${question.id}`}
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

      <div className="mt-auto flex flex-col gap-3">
        {submitted && (
          <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            <CheckCircle2 className="size-4" />
            Accuracy: {score}/{questions.length} (
            {questions.length ? Math.round((score / questions.length) * 100) : 0}
            %)
          </p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-zinc-700"
          >
            <ChevronLeft className="size-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={() =>
              setIndex((value) => Math.min(questions.length - 1, value + 1))
            }
            disabled={index === questions.length - 1}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-zinc-700"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            disabled={submitted || Object.keys(answers).length !== questions.length}
            onClick={() => setSubmitted(true)}
            className="ml-auto rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {submitted ? "Results ready" : "Submit test"}
          </button>
        </div>
      </div>
    </div>
  );
}
