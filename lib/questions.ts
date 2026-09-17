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
  if (!rawOptions) return [];
  
  const keys = ['A', 'B', 'C', 'D', 'E'];

  if (Array.isArray(rawOptions)) {
    return rawOptions
      .map((opt, idx) => {
        if (!opt) return null;
        if (typeof opt === 'string') {
          return { key: keys[idx] || `${idx + 1}`, text: opt };
        }
        if (typeof opt === 'object' && opt.text) {
          return { key: String(opt.key || keys[idx] || idx + 1), text: String(opt.text) };
        }
        return null;
      })
      .filter((item): item is QuestionOption => item !== null);
  }

  return [];
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