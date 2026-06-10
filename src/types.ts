export type CategoryKey = 'casa' | 'barbara' | 'gabriel';

export type Frequency = 'monthly' | 'yearly';

export interface InstallmentInfo {
  total: number;
  firstMonth: string; // "YYYY-MM" - month of installment 1/total
}

export interface RecurringTemplate {
  id: string;
  category: CategoryKey;
  name: string;
  amount: number;
  dueDay?: number;
  frequency: Frequency;
  /** For yearly templates, the month (1-12) it falls in */
  yearlyMonth?: number;
  /** Only used for "casa" category: % of the bill that Bárbara pays (0-100) */
  splitBarbara?: number;
  installments?: InstallmentInfo;
  active: boolean;
  /** First month (YYYY-MM, inclusive) this template should start generating entries */
  startMonth: string;
  notes?: string;
}

export interface BillEntry {
  id: string;
  templateId?: string;
  category: CategoryKey;
  month: string; // "YYYY-MM"
  name: string;
  amount: number;
  paid: boolean;
  dueDay?: number;
  installmentLabel?: string;
  notes?: string;
  /** Only used for "casa" entries: % of the bill that Bárbara pays (0-100) */
  splitBarbara?: number;
}

export interface PersonIncome {
  barbara: number;
  gabriel: number;
}

export interface AppData {
  templates: RecurringTemplate[];
  entries: BillEntry[];
  income: PersonIncome;
  /** Default split (% Bárbara) used when creating new "casa" templates */
  defaultSplitBarbara: number;
}
