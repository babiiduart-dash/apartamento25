import type { AppData, BillEntry, RecurringTemplate, CategoryKey } from '../types';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} de ${y}`;
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const total = y * 12 + (m - 1) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, '0')}`;
}

export function monthsDiff(from: string, to: string): number {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  return (ty * 12 + (tm - 1)) - (fy * 12 + (fm - 1));
}

export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Returns the installment label (e.g. "6/10") for a given month, or null if outside range / not applicable */
export function installmentLabelFor(template: RecurringTemplate, month: string): string | null {
  if (!template.installments) return null;
  const { total, firstMonth } = template.installments;
  const idx = monthsDiff(firstMonth, month) + 1;
  if (idx < 1 || idx > total) return null;
  return `${idx}/${total}`;
}

function templateAppliesToMonth(template: RecurringTemplate, month: string): boolean {
  if (!template.active) return false;
  if (monthsDiff(template.startMonth, month) < 0) return false;

  if (template.frequency === 'yearly') {
    const [, m] = month.split('-').map(Number);
    if (m !== template.yearlyMonth) return false;
  }

  if (template.installments) {
    const label = installmentLabelFor(template, month);
    if (!label) return false;
  }

  return true;
}

/**
 * Ensures all active recurring templates have a generated entry for the given month.
 * Returns a new entries array (does not mutate input).
 */
export function ensureMonthGenerated(data: AppData, month: string): BillEntry[] {
  const existingTemplateIds = new Set(
    data.entries.filter((e) => e.month === month && e.templateId).map((e) => e.templateId)
  );

  const newEntries: BillEntry[] = [];
  for (const template of data.templates) {
    if (existingTemplateIds.has(template.id)) continue;
    if (!templateAppliesToMonth(template, month)) continue;

    newEntries.push({
      id: crypto.randomUUID(),
      templateId: template.id,
      category: template.category,
      month,
      name: template.name,
      amount: template.amount,
      paid: false,
      dueDay: template.dueDay,
      installmentLabel: installmentLabelFor(template, month) ?? undefined,
      notes: template.notes,
      splitBarbara: template.category === 'casa' ? template.splitBarbara : undefined,
    });
  }

  if (newEntries.length === 0) return data.entries;
  return [...data.entries, ...newEntries];
}

export interface MonthTotals {
  total: number;
  paid: number;
  pending: number;
}

export function totalsFor(entries: BillEntry[], category: CategoryKey, month: string): MonthTotals {
  const filtered = entries.filter((e) => e.category === category && e.month === month);
  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const paid = filtered.filter((e) => e.paid).reduce((s, e) => s + e.amount, 0);
  return { total, paid, pending: total - paid };
}

/** Splits the "casa" totals between Bárbara and Gabriel based on each entry's split (from its template) */
export function casaSplitFor(
  entries: BillEntry[],
  month: string,
  defaultSplitBarbara: number
): { barbara: MonthTotals; gabriel: MonthTotals } {
  const casaEntries = entries.filter((e) => e.category === 'casa' && e.month === month);
  const result = {
    barbara: { total: 0, paid: 0, pending: 0 },
    gabriel: { total: 0, paid: 0, pending: 0 },
  };
  for (const e of casaEntries) {
    const splitB = (e.splitBarbara ?? defaultSplitBarbara) / 100;
    const splitG = 1 - splitB;
    result.barbara.total += e.amount * splitB;
    result.gabriel.total += e.amount * splitG;
    if (e.paid) {
      result.barbara.paid += e.amount * splitB;
      result.gabriel.paid += e.amount * splitG;
    }
  }
  result.barbara.pending = result.barbara.total - result.barbara.paid;
  result.gabriel.pending = result.gabriel.total - result.gabriel.paid;
  return result;
}

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  casa: 'Contas da Casa',
  barbara: 'Bárbara',
  gabriel: 'Gabriel',
};
