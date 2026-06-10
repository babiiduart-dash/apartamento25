import type { AppData, BillEntry, RecurringTemplate } from '../types';

// --- Recurring templates ----------------------------------------------------
// "casa" templates are based on the household budget spreadsheet (Orçamento
// Doméstico). They repeat every month from 2026-07 onward and are split
// between Bárbara and Gabriel according to `splitBarbara` (% paid by Bárbara).
// "barbara" templates are based on the recurring items from the 2026 agenda
// (Cartão Nubank, Claro, Plano de Saúde, TV). They take over from 2026-07
// onward, since Jan-Jun 2026 were already recorded as historical entries.
export const seedTemplates: RecurringTemplate[] = [
  // --- Contas da casa (compartilhadas) ---
  {
    id: 'casa-condominio',
    category: 'casa',
    name: 'Condomínio',
    amount: 533.45,
    dueDay: 5,
    frequency: 'monthly',
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },
  {
    id: 'casa-financiamento',
    category: 'casa',
    name: 'Financiamento da casa',
    amount: 1560.0,
    dueDay: 10,
    frequency: 'monthly',
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },
  {
    id: 'casa-diarista',
    category: 'casa',
    name: 'Diarista / Mensalista',
    amount: 400.0,
    dueDay: 1,
    frequency: 'monthly',
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },
  {
    id: 'casa-luz',
    category: 'casa',
    name: 'Luz',
    amount: 180.0,
    dueDay: 15,
    frequency: 'monthly',
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },
  {
    id: 'casa-agua',
    category: 'casa',
    name: 'Água',
    amount: 0,
    dueDay: 15,
    frequency: 'monthly',
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },
  {
    id: 'casa-gas',
    category: 'casa',
    name: 'Gás',
    amount: 0,
    dueDay: 15,
    frequency: 'monthly',
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },
  {
    id: 'casa-internet',
    category: 'casa',
    name: 'Internet / TV',
    amount: 129.31,
    dueDay: 12,
    frequency: 'monthly',
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },
  {
    id: 'casa-iptu',
    category: 'casa',
    name: 'IPTU',
    amount: 80.8,
    dueDay: 10,
    frequency: 'yearly',
    yearlyMonth: 1,
    splitBarbara: 50,
    active: true,
    startMonth: '2026-06',
  },

  // --- Contas pessoais da Bárbara (recorrentes a partir de Jul/2026) ---
  {
    id: 'barbara-nubank',
    category: 'barbara',
    name: 'Cartão Nubank',
    amount: 3800.0,
    dueDay: 10,
    frequency: 'monthly',
    active: true,
    startMonth: '2026-07',
    notes: 'Valor da fatura varia mês a mês - ajuste ao lançar.',
  },
  {
    id: 'barbara-claro',
    category: 'barbara',
    name: 'Claro',
    amount: 220.0,
    dueDay: 20,
    frequency: 'monthly',
    active: true,
    startMonth: '2026-07',
  },
  {
    id: 'barbara-plano-saude',
    category: 'barbara',
    name: 'Plano de Saúde',
    amount: 420.0,
    dueDay: 5,
    frequency: 'monthly',
    active: true,
    startMonth: '2026-07',
  },
  {
    id: 'barbara-mei',
    category: 'barbara',
    name: 'MEI',
    amount: 329.0,
    dueDay: 20,
    frequency: 'monthly',
    active: false,
    startMonth: '2026-07',
    notes: 'Ative se o pagamento do MEI passar a ser mensal.',
  },
];

// --- Lançamentos históricos (Jan-Jun 2026), transcritos do AGENDA E
// FINANCEIRO 2026 da Bárbara ---------------------------------------------
export const seedEntries: BillEntry[] = [
  // JANEIRO
  { id: 'b-2026-01-nubank', category: 'barbara', month: '2026-01', name: 'Cartão Nubank', amount: 4238.7, paid: true },
  { id: 'b-2026-01-claro', category: 'barbara', month: '2026-01', name: 'Claro', amount: 280.0, paid: true },
  { id: 'b-2026-01-plano', category: 'barbara', month: '2026-01', name: 'Plano de Saúde', amount: 370.0, paid: true },
  { id: 'b-2026-01-caixinha', category: 'barbara', month: '2026-01', name: 'Caixinha', amount: 1000.0, paid: true },
  { id: 'b-2026-01-casa', category: 'barbara', month: '2026-01', name: 'Contas da Casa', amount: 1000.0, paid: true },
  { id: 'b-2026-01-tv', category: 'barbara', month: '2026-01', name: 'TV', amount: 270.0, paid: true, installmentLabel: '6/10' },

  // FEVEREIRO
  { id: 'b-2026-02-nubank', category: 'barbara', month: '2026-02', name: 'Cartão Nubank', amount: 2353.0, paid: true },
  { id: 'b-2026-02-plano', category: 'barbara', month: '2026-02', name: 'Plano de Saúde', amount: 370.0, paid: true },
  { id: 'b-2026-02-casa', category: 'barbara', month: '2026-02', name: 'Contas da Casa', amount: 1600.0, paid: true },
  { id: 'b-2026-02-vovo', category: 'barbara', month: '2026-02', name: 'Vovó', amount: 1000.0, paid: true, dueDay: 7, notes: '7/11' },
  { id: 'b-2026-02-mei', category: 'barbara', month: '2026-02', name: 'MEI', amount: 329.0, paid: true },
  { id: 'b-2026-02-claro', category: 'barbara', month: '2026-02', name: 'Claro', amount: 280.0, paid: true },
  { id: 'b-2026-02-tv', category: 'barbara', month: '2026-02', name: 'TV', amount: 270.0, paid: true, installmentLabel: '7/10' },
  { id: 'b-2026-02-riachuelo', category: 'barbara', month: '2026-02', name: 'Riachuelo', amount: 245.0, paid: true },

  // MARÇO
  { id: 'b-2026-03-nubank', category: 'barbara', month: '2026-03', name: 'Cartão Nubank', amount: 2800.0, paid: true },
  { id: 'b-2026-03-claro', category: 'barbara', month: '2026-03', name: 'Claro', amount: 220.0, paid: true },
  { id: 'b-2026-03-plano', category: 'barbara', month: '2026-03', name: 'Plano de Saúde', amount: 420.0, paid: true },
  { id: 'b-2026-03-casa', category: 'barbara', month: '2026-03', name: 'Contas da Casa', amount: 1000.0, paid: true },
  { id: 'b-2026-03-tv', category: 'barbara', month: '2026-03', name: 'TV', amount: 270.0, paid: true, installmentLabel: '8/10' },
  { id: 'b-2026-03-riachuelo', category: 'barbara', month: '2026-03', name: 'Riachuelo', amount: 245.0, paid: true },
  { id: 'b-2026-03-vovo', category: 'barbara', month: '2026-03', name: 'Vovó', amount: 4000.0, paid: false },

  // ABRIL
  { id: 'b-2026-04-nubank', category: 'barbara', month: '2026-04', name: 'Cartão Nubank', amount: 3000.0, paid: true },
  { id: 'b-2026-04-claro', category: 'barbara', month: '2026-04', name: 'Claro', amount: 220.0, paid: true },
  { id: 'b-2026-04-plano', category: 'barbara', month: '2026-04', name: 'Plano de Saúde', amount: 420.0, paid: true },
  { id: 'b-2026-04-casa', category: 'barbara', month: '2026-04', name: 'Contas da Casa', amount: 1000.0, paid: true },
  { id: 'b-2026-04-tv', category: 'barbara', month: '2026-04', name: 'TV', amount: 270.0, paid: true, installmentLabel: '9/10' },

  // MAIO
  { id: 'b-2026-05-nubank', category: 'barbara', month: '2026-05', name: 'Cartão Nubank', amount: 3000.0, paid: true },
  { id: 'b-2026-05-claro', category: 'barbara', month: '2026-05', name: 'Claro', amount: 220.0, paid: false, dueDay: 20 },
  { id: 'b-2026-05-plano', category: 'barbara', month: '2026-05', name: 'Plano de Saúde', amount: 420.0, paid: true },
  { id: 'b-2026-05-casa', category: 'barbara', month: '2026-05', name: 'Contas da Casa', amount: 1000.0, paid: false, dueDay: 20 },
  { id: 'b-2026-05-tv', category: 'barbara', month: '2026-05', name: 'TV', amount: 270.0, paid: true, installmentLabel: '10/10' },
  { id: 'b-2026-05-bradesco', category: 'barbara', month: '2026-05', name: 'Bradesco', amount: 600.0, paid: true },
  { id: 'b-2026-05-mei-ir', category: 'barbara', month: '2026-05', name: 'MEI / Imposto de Renda', amount: 486.0, paid: true },

  // JUNHO
  { id: 'b-2026-06-nubank', category: 'barbara', month: '2026-06', name: 'Cartão Nubank', amount: 3800.0, paid: true },
  { id: 'b-2026-06-claro', category: 'barbara', month: '2026-06', name: 'Claro', amount: 220.0, paid: false, dueDay: 20 },
  { id: 'b-2026-06-plano', category: 'barbara', month: '2026-06', name: 'Plano de Saúde', amount: 420.0, paid: true },
  { id: 'b-2026-06-casa', category: 'barbara', month: '2026-06', name: 'Contas da Casa', amount: 1000.0, paid: false, dueDay: 20 },
  { id: 'b-2026-06-ir', category: 'barbara', month: '2026-06', name: 'Imposto de Renda', amount: 450.0, paid: false, dueDay: 11 },
  { id: 'b-2026-06-contadora', category: 'barbara', month: '2026-06', name: 'Contadora', amount: 250.0, paid: true },
];

export function buildSeedData(): AppData {
  return {
    templates: seedTemplates,
    entries: seedEntries,
    income: { barbara: 0, gabriel: 0 },
    defaultSplitBarbara: 50,
  };
}
