import { supabase } from "@/lib/supabase";

export type PracticeSection = "QA" | "VARC" | "LRDI";

export type QuestionOption = {
  key: string;
  text: string;
};

export type Question = {
  id: string;
  section: string | null;
  accessLevel: string | null;
  publishDate: string | null;
  passage: string | null;
  stem: string;
  options: QuestionOption[];
  correctKey: string;
  explanation: string | null;
};

const SECTION_ALIASES: Record<PracticeSection, string[]> = {
  QA: ["QA", "Quant", "QUANT", "Quantitative Ability", "Quantitative"],
  VARC: ["VARC", "RC", "Verbal", "Verbal Ability"],
  LRDI: ["LRDI", "DILR", "LR", "DI", "Logical Reasoning"],
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function firstString(
  row: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function parseOptions(row: Record<string, unknown>): QuestionOption[] {
  const raw = row.options ?? row.choices ?? row.answers;

  if (Array.isArray(raw)) {
    return raw
      .map((item, index) => {
        if (typeof item === "string") {
          return { key: String.fromCharCode(65 + index), text: item };
        }
        const record = asRecord(item);
        if (!record) return null;
        const key =
          firstString(record, ["key", "id", "label", "option"]) ??
          String.fromCharCode(65 + index);
        const text =
          firstString(record, ["text", "value", "content", "label"]) ?? "";
        return text ? { key: key.toUpperCase(), text } : null;
      })
      .filter((option): option is QuestionOption => option !== null);
  }

  const record = asRecord(raw);
  if (record) {
    return Object.entries(record)
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => ({
        key: key.replace(/^option_?/i, "").toUpperCase(),
        text: String(value).trim(),
      }));
  }

  const letters = ["A", "B", "C", "D", "E"] as const;
  return letters
    .map((letter) => {
      const text = firstString(row, [
        `option_${letter.toLowerCase()}`,
        `option_${letter}`,
        `option${letter}`,
        letter.toLowerCase(),
        letter,
      ]);
      return text ? { key: letter, text } : null;
    })
    .filter((option): option is QuestionOption => option !== null);
}

function normalizeCorrectKey(
  raw: string | null,
  options: QuestionOption[],
): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const upper = trimmed.toUpperCase();
  if (options.some((option) => option.key === upper)) {
    return upper;
  }
  const byText = options.find(
    (option) => option.text.trim().toLowerCase() === trimmed.toLowerCase(),
  );
  return byText?.key ?? upper;
}

export function normalizeQuestion(row: Record<string, unknown>): Question {
  const options = parseOptions(row);
  const correctRaw = firstString(row, [
    "correct_answer",
    "correct_option",
    "answer",
    "correct",
    "solution",
  ]);

  return {
    id: String(row.id ?? crypto.randomUUID()),
    section: firstString(row, ["section"]),
    accessLevel: firstString(row, ["access_level"]),
    publishDate: firstString(row, ["publish_date"]),
    passage: firstString(row, ["passage", "passage_text", "rc_passage"]),
    stem:
      firstString(row, [
        "question_text",
        "question",
        "stem",
        "prompt",
        "question_stem",
      ]) ?? "Question text unavailable.",
    options,
    correctKey: normalizeCorrectKey(correctRaw, options),
    explanation: firstString(row, [
      "explanation",
      "solution_text",
      "rationale",
    ]),
  };
}

export function todayInIndia(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function fetchDailyQuestions(): Promise<Question[]> {
  const today = todayInIndia();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("access_level", "free_daily")
    .eq("publish_date", today);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    normalizeQuestion(row as Record<string, unknown>),
  );
}

export async function fetchPracticeQuestions(
  section: PracticeSection,
  count = 20,
): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("access_level", "free_20q")
    .in("section", SECTION_ALIASES[section])
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  return shuffle((data ?? []).map((row) =>
    normalizeQuestion(row as Record<string, unknown>),
  )).slice(0, count);
}
