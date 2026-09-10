import type { BillEntry, CategoryKey } from '../types';
import { formatCurrency } from '../lib/finance';

interface Props {
  entries: BillEntry[];
  category: CategoryKey;
  showSplit: boolean;
  defaultSplitBarbara: number;
  onChange: (id: string, patch: Partial<BillEntry>) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

function parseInstallment(label?: string): { cur: number; total: number } | null {
  const m = label?.match(/^(\d+)\s*\/\s*(\d+)$/);
  return m ? { cur: Number(m[1]), total: Number(m[2]) } : null;
}

export function BillTable({ entries, category, showSplit, defaultSplitBarbara, onChange, onDelete, onAdd }: Props) {
  const showInstallmentToggle = category !== 'casa';
  const sorted = [...entries].sort((a, b) => (a.dueDay ?? 99) - (b.dueDay ?? 99));
  const total = entries.reduce((s, e) => s + e.amount, 0);
  const paid = entries.filter((e) => e.paid).reduce((s, e) => s + e.amount, 0);
  const totalCols = 6 + (showSplit ? 2 : 0) + (showInstallmentToggle ? 1 : 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-2 font-medium">Pago</th>
            <th className="px-3 py-2 font-medium">Conta</th>
            <th className="px-3 py-2 font-medium">Valor</th>
            <th className="px-3 py-2 font-medium">Vencimento</th>
            {showSplit && (
              <>
                <th className="px-3 py-2 font-medium">% Bárbara</th>
                <th className="px-3 py-2 font-medium">% Gabriel</th>
              </>
            )}
            {showInstallmentToggle && <th className="px-3 py-2 font-medium">Parcela</th>}
            <th className="px-3 py-2 font-medium">Obs.</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((e) => (
            <tr key={e.id} className={e.paid ? 'bg-emerald-50/40' : ''}>
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={e.paid}
                  onChange={(ev) => onChange(e.id, { paid: ev.target.checked })}
                  className="h-4 w-4 accent-emerald-600"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="text"
                  value={e.name}
                  onChange={(ev) => onChange(e.id, { name: ev.target.value })}
                  className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  step="0.01"
                  value={e.amount}
                  onChange={(ev) => onChange(e.id, { amount: Number(ev.target.value) })}
                  className="w-28 rounded border border-transparent bg-transparent px-1 py-0.5 text-right hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min={1}
                  max={31}
                  placeholder="dia"
                  value={e.dueDay ?? ''}
                  onChange={(ev) =>
                    onChange(e.id, { dueDay: ev.target.value === '' ? undefined : Number(ev.target.value) })
                  }
                  className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                />
              </td>
              {showSplit && (
                <>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={e.splitBarbara ?? defaultSplitBarbara}
                      onChange={(ev) => {
                        const val = Math.min(100, Math.max(0, Number(ev.target.value)));
                        onChange(e.id, { splitBarbara: val });
                      }}
                      className="w-14 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {100 - (e.splitBarbara ?? defaultSplitBarbara)}
                  </td>
                </>
              )}
              {showInstallmentToggle &&
                (() => {
                  const inst = parseInstallment(e.installmentLabel);
                  return (
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={!!inst}
                          onChange={(ev) => {
                            if (ev.target.checked) {
                              onChange(e.id, { installmentLabel: '1/2' });
                            } else {
                              onChange(e.id, { installmentLabel: undefined });
                            }
                          }}
                          className="h-4 w-4 accent-emerald-600"
                          title="Conta parcelada"
                        />
                        {inst ? (
                          <>
                            <input
                              type="number"
                              min={1}
                              value={inst.cur}
                              onChange={(ev) =>
                                onChange(e.id, {
                                  installmentLabel: `${Math.max(1, Number(ev.target.value))}/${inst.total}`,
                                })
                              }
                              className="w-10 rounded border border-slate-200 bg-white px-1 py-0.5 text-xs text-right"
                              title="Parcela atual"
                            />
                            <span className="text-xs text-slate-400">/</span>
                            <input
                              type="number"
                              min={1}
                              value={inst.total}
                              onChange={(ev) =>
                                onChange(e.id, {
                                  installmentLabel: `${inst.cur}/${Math.max(1, Number(ev.target.value))}`,
                                })
                              }
                              className="w-10 rounded border border-slate-200 bg-white px-1 py-0.5 text-xs"
                              title="Total de parcelas"
                            />
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </div>
                    </td>
                  );
                })()}
              <td className="px-3 py-2">
                <input
                  type="text"
                  value={e.notes ?? ''}
                  onChange={(ev) => onChange(e.id, { notes: ev.target.value })}
                  className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-slate-500 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                />
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  onClick={() => onDelete(e.id)}
                  className="text-slate-400 hover:text-red-500"
                  title="Remover"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={totalCols} className="px-3 py-6 text-center text-slate-400">
                Nenhuma conta neste mês ainda.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-200 bg-slate-50 font-medium">
            <td className="px-3 py-2" colSpan={2}>
              Total
            </td>
            <td className="px-3 py-2">{formatCurrency(total)}</td>
            <td className="px-3 py-2 text-xs font-normal text-slate-500" colSpan={totalCols - 4}>
              Pago: {formatCurrency(paid)} · Pendente: {formatCurrency(total - paid)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div className="border-t border-slate-200 p-2">
        <button
          onClick={onAdd}
          className="rounded bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
        >
          + Adicionar conta
        </button>
      </div>
    </div>
  );
}
