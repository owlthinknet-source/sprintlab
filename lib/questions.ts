import { supabase } from './supabase';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  section?: string;
  topic?: string;
  passage_text?: string;
  question_text: string;
  options: QuestionOption[];
  correct_option: number;
  solution_explanation?: string;
  access_level?: string;
  publish_date?: string;
}

export function todayInIndia(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

export function parseOptions(rawOptions: any): QuestionOption[] {
  if (!rawOptions || !Array.isArray(rawOptions)) return [];

  const keys = ['A', 'B', 'C', 'D', 'E'];
  const result: any[] = [];

  for (let i = 0; i < rawOptions.length; i++) {
    const opt = rawOptions[i];
    if (!opt) continue;

    if (typeof opt === 'string') {
      result.push({
        key: keys[i] || String(i + 1),
        text: opt,
      });
    } else if (typeof opt === 'object') {
      result.push({
        key: String(opt.key || keys[i] || i + 1),
        text: String(opt.text || ''),
      });
    }
  }

  return result as QuestionOption[];
}

export async function fetchDailyQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('access_level', 'free_daily');

  if (error || !data) return [];

  return data.map((q: any) => ({
    ...q,
    options: parseOptions(q.options),
  }));
}