/** Answer helpers for the quiz result page (legacy quiz-result.blade.php:112-140). */

type Option = { key?: string; value?: string; text?: string };

/** A stored answer is a list, but older rows hold `{"selected_option_ids": [...]}` or a bare string. */
export function givenAnswers(answer: unknown): string[] {
  if (Array.isArray(answer)) return answer.map(String);
  if (answer && typeof answer === 'object') {
    const ids = (answer as { selected_option_ids?: unknown }).selected_option_ids;
    return Array.isArray(ids) ? ids.map(String) : [];
  }
  if (typeof answer === 'string' || typeof answer === 'number') return [String(answer)];
  return [];
}

/** The option's key (`key`, else `value`, else `text`) and display text. */
export function optionParts(opt: Option): { key: string; text: string } {
  const key = String(opt.key ?? opt.value ?? opt.text ?? '');
  return { key, text: String(opt.text ?? key) };
}

/** Keys of an answer list rendered as option text when the question has options. */
export function answerText(keys: string[], options: Option[] | null | undefined): string {
  if (!keys.length) return '—';
  if (!options?.length) return keys.join(', ');
  const byKey = new Map(options.map((o) => optionParts(o)).map((o) => [o.key, o.text]));
  return keys.map((k) => byKey.get(k) ?? k).join(', ');
}
