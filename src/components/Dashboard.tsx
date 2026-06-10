import type { AppData } from '../types';
import { casaSplitFor, formatCurrency, totalsFor } from '../lib/finance';

interface Props {
  data: AppData;
  month: string;
  onIncomeChange: (person: 'barbara' | 'gabriel', value: number) => void;
}

function Card({ title, total, paid, pending, accent }: { title: string; total: number; paid: number; pending: number; accent: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`text-xs font-semibold uppercase tracking-wide ${accent}`}>{title}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-800">{formatCurrency(total)}</div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Pago: {formatCurrency(paid)}</span>
        <span>Pendente: {formatCurrency(pending)}</span>
      </div>
    </div>
  );
}

export function Dashboard({ data, month, onIncomeChange }: Props) {
  const casa = totalsFor(data.entries, 'casa', month);
  const barbaraPersonal = totalsFor(data.entries, 'barbara', month);
  const gabrielPersonal = totalsFor(data.entries, 'gabriel', month);
  const split = casaSplitFor(data.entries, month, data.defaultSplitBarbara);

  const barbaraTotal = {
    total: barbaraPersonal.total + split.barbara.total,
    paid: barbaraPersonal.paid + split.barbara.paid,
    pending: barbaraPersonal.pending + split.barbara.pending,
  };
  const gabrielTotal = {
    total: gabrielPersonal.total + split.gabriel.total,
    paid: gabrielPersonal.paid + split.gabriel.paid,
    pending: gabrielPersonal.pending + split.gabriel.pending,
  };
  const household = {
    total: casa.total + barbaraPersonal.total + gabrielPersonal.total,
    paid: casa.paid + barbaraPersonal.paid + gabrielPersonal.paid,
    pending: casa.pending + barbaraPersonal.pending + gabrielPersonal.pending,
  };

  const barbaraSaldo = data.income.barbara - barbaraTotal.total;
  const gabrielSaldo = data.income.gabriel - gabrielTotal.total;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total da casa" {...household} accent="text-slate-500" />
        <Card title="Contas da casa (compartilhadas)" {...casa} accent="text-amber-600" />
        <Card title="Bárbara (pessoal + parte da casa)" {...barbaraTotal} accent="text-pink-600" />
        <Card title="Gabriel (pessoal + parte da casa)" {...gabrielTotal} accent="text-sky-600" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Como a conta da casa está dividida (padrão {data.defaultSplitBarbara}% Bárbara / {100 - data.defaultSplitBarbara}% Gabriel)
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded border border-pink-100 bg-pink-50 p-3">
            <div className="text-xs font-semibold uppercase text-pink-600">Parte da Bárbara na casa</div>
            <div className="text-lg font-semibold text-slate-800">{formatCurrency(split.barbara.total)}</div>
          </div>
          <div className="rounded border border-sky-100 bg-sky-50 p-3">
            <div className="text-xs font-semibold uppercase text-sky-600">Parte do Gabriel na casa</div>
            <div className="text-lg font-semibold text-slate-800">{formatCurrency(split.gabriel.total)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Saldo do mês (renda - despesas)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded border border-pink-100 bg-pink-50 p-3">
            <div className="text-xs font-semibold uppercase text-pink-600">Bárbara</div>
            <label className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              Renda do mês
              <input
                type="number"
                step="0.01"
                value={data.income.barbara}
                onChange={(ev) => onIncomeChange('barbara', Number(ev.target.value))}
                className="w-28 rounded border border-slate-200 px-2 py-1 text-right"
              />
            </label>
            <div className={`mt-2 text-lg font-semibold ${barbaraSaldo >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {formatCurrency(barbaraSaldo)}
            </div>
          </div>
          <div className="rounded border border-sky-100 bg-sky-50 p-3">
            <div className="text-xs font-semibold uppercase text-sky-600">Gabriel</div>
            <label className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              Renda do mês
              <input
                type="number"
                step="0.01"
                value={data.income.gabriel}
                onChange={(ev) => onIncomeChange('gabriel', Number(ev.target.value))}
                className="w-28 rounded border border-slate-200 px-2 py-1 text-right"
              />
            </label>
            <div className={`mt-2 text-lg font-semibold ${gabrielSaldo >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {formatCurrency(gabrielSaldo)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
