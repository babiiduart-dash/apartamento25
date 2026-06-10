import type { CategoryKey, Frequency, RecurringTemplate } from '../types';
import { CATEGORY_LABELS, formatCurrency } from '../lib/finance';

interface Props {
  templates: RecurringTemplate[];
  category: CategoryKey;
  defaultSplitBarbara: number;
  onChange: (id: string, patch: Partial<RecurringTemplate>) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function TemplatesPanel({ templates, category, defaultSplitBarbara, onChange, onDelete, onAdd }: Props) {
  const showSplit = category === 'casa';

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Contas recorrentes de <strong>{CATEGORY_LABELS[category]}</strong>. Elas são lançadas automaticamente todo mês
        (a partir do mês de início configurado), com o valor padrão abaixo - você pode ajustar o valor de cada mês na
        aba correspondente.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Ativa</th>
              <th className="px-3 py-2 font-medium">Conta</th>
              <th className="px-3 py-2 font-medium">Valor padrão</th>
              <th className="px-3 py-2 font-medium">Vencimento</th>
              <th className="px-3 py-2 font-medium">Frequência</th>
              {showSplit && <th className="px-3 py-2 font-medium">% Bárbara</th>}
              <th className="px-3 py-2 font-medium">A partir de</th>
              <th className="px-3 py-2 font-medium">Obs.</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {templates.map((t) => (
              <tr key={t.id} className={t.active ? '' : 'opacity-50'}>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={t.active}
                    onChange={(ev) => onChange(t.id, { active: ev.target.checked })}
                    className="h-4 w-4 accent-emerald-600"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={t.name}
                    onChange={(ev) => onChange(t.id, { name: ev.target.value })}
                    className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={t.amount}
                    onChange={(ev) => onChange(t.id, { amount: Number(ev.target.value) })}
                    className="w-28 rounded border border-transparent bg-transparent px-1 py-0.5 text-right hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    max={31}
                    placeholder="dia"
                    value={t.dueDay ?? ''}
                    onChange={(ev) =>
                      onChange(t.id, { dueDay: ev.target.value === '' ? undefined : Number(ev.target.value) })
                    }
                    className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={t.frequency}
                    onChange={(ev) => onChange(t.id, { frequency: ev.target.value as Frequency })}
                    className="rounded border border-slate-200 bg-white px-1 py-0.5"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                  {t.frequency === 'yearly' && (
                    <select
                      value={t.yearlyMonth ?? 1}
                      onChange={(ev) => onChange(t.id, { yearlyMonth: Number(ev.target.value) })}
                      className="ml-1 rounded border border-slate-200 bg-white px-1 py-0.5"
                    >
                      {MONTHS.map((m, idx) => (
                        <option key={m} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                {showSplit && (
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={t.splitBarbara ?? defaultSplitBarbara}
                      onChange={(ev) => onChange(t.id, { splitBarbara: Number(ev.target.value) })}
                      className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                    />
                  </td>
                )}
                <td className="px-3 py-2">
                  <input
                    type="month"
                    value={t.startMonth}
                    onChange={(ev) => onChange(t.id, { startMonth: ev.target.value })}
                    className="rounded border border-slate-200 bg-white px-1 py-0.5 text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={t.notes ?? ''}
                    onChange={(ev) => onChange(t.id, { notes: ev.target.value })}
                    className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-slate-500 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-red-500" title="Remover">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={showSplit ? 9 : 8} className="px-3 py-6 text-center text-slate-400">
                  Nenhuma conta recorrente cadastrada.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
              <td colSpan={showSplit ? 9 : 8} className="px-3 py-2">
                Total mensal recorrente:{' '}
                {formatCurrency(
                  templates.filter((t) => t.active && t.frequency === 'monthly').reduce((s, t) => s + t.amount, 0)
                )}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="border-t border-slate-200 p-2">
          <button onClick={onAdd} className="rounded bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200">
            + Adicionar conta recorrente
          </button>
        </div>
      </div>
    </div>
  );
}
