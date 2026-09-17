"use client";

import type { Question } from "@/lib/questions";

export function QuestionOptions({
  question,
  name,
  selected,
  submitted,
  onSelect,
}: {
  question: Question;
  name: string;
  selected: string | undefined;
  submitted: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">Options</legend>
      {question.options.map((option) => {
        const isSelected = selected === option.key;
        const isCorrect = option.key === question.correctKey;
        let stateClass =
          "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700";
        if (submitted && isCorrect) {
          stateClass =
            "border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40";
        } else if (submitted && isSelected && !isCorrect) {
          stateClass =
            "border-rose-600 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/40";
        } else if (isSelected) {
          stateClass = "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900";
        }

        return (
          <label
            key={option.key}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm ${stateClass}`}
          >
            <input
              type="radio"
              className="mt-1"
              name={name}
              value={option.key}
              checked={isSelected}
              disabled={submitted}
              onChange={() => onSelect(option.key)}
            />
            <span>
              <span className="mr-2 font-semibold">{option.key}.</span>
              {option.text}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
