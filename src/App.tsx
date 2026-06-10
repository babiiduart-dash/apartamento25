import { useEffect, useRef, useState } from 'react';
import type { AppData, BillEntry, CategoryKey, RecurringTemplate } from './types';
import { loadData, saveData, exportData, importData, resetData } from './lib/storage';
import { ensureMonthGenerated, monthLabel, shiftMonth, currentMonth } from './lib/finance';
import { Dashboard } from './components/Dashboard';
import { BillTable } from './components/BillTable';
import { TemplatesPanel } from './components/TemplatesPanel';

type Tab = 'dashboard' | 'casa' | 'barbara' | 'gabriel' | 'recorrentes';

const TABS: { key: Tab; label: string }[] = [
  { key: 'dashboard', label: 'Visão geral' },
  { key: 'casa', label: 'Contas da Casa' },
  { key: 'barbara', label: 'Bárbara' },
  { key: 'gabriel', label: 'Gabriel' },
  { key: 'recorrentes', label: 'Contas recorrentes' },
];

function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [month, setMonth] = useState<string>(() => currentMonth());
  const [tab, setTab] = useState<Tab>('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate recurring entries for the selected month if needed
  useEffect(() => {
    setData((prev) => {
      const newEntries = ensureMonthGenerated(prev, month);
      if (newEntries === prev.entries) return prev;
      return { ...prev, entries: newEntries };
    });
  }, [month]);

  // Persist to localStorage on every change
  useEffect(() => {
    saveData(data);
  }, [data]);

  function updateEntry(id: string, patch: Partial<BillEntry>) {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }

  function deleteEntry(id: string) {
    setData((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.id !== id) }));
  }

  function addEntry(category: CategoryKey) {
    const entry: BillEntry = {
      id: crypto.randomUUID(),
      category,
      month,
      name: 'Nova conta',
      amount: 0,
      paid: false,
      ...(category === 'casa' ? { splitBarbara: data.defaultSplitBarbara } : {}),
    };
    setData((prev) => ({ ...prev, entries: [...prev.entries, entry] }));
  }

  function updateTemplate(id: string, patch: Partial<RecurringTemplate>) {
    setData((prev) => ({
      ...prev,
      templates: prev.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }

  function deleteTemplate(id: string) {
    setData((prev) => ({ ...prev, templates: prev.templates.filter((t) => t.id !== id) }));
  }

  function addTemplate(category: CategoryKey) {
    const template: RecurringTemplate = {
      id: crypto.randomUUID(),
      category,
      name: 'Nova conta recorrente',
      amount: 0,
      frequency: 'monthly',
      active: true,
      startMonth: shiftMonth(month, 1),
      ...(category === 'casa' ? { splitBarbara: data.defaultSplitBarbara } : {}),
    };
    setData((prev) => ({ ...prev, templates: [...prev.templates, template] }));
  }

  function handleIncomeChange(person: 'barbara' | 'gabriel', value: number) {
    setData((prev) => ({ ...prev, income: { ...prev.income, [person]: value } }));
  }

  function handleImport(file: File) {
    importData(file)
      .then((d) => setData(d))
      .catch(() => alert('Não foi possível importar o arquivo. Verifique se é um JSON exportado deste app.'));
  }

  function handleReset() {
    if (confirm('Isso vai apagar todos os dados salvos e voltar para os dados iniciais. Continuar?')) {
      setData(resetData());
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Finanças do Apartamento 25</h1>
              <p className="text-sm text-slate-500">Organize as contas da casa e as contas pessoais de Bárbara e Gabriel.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData(data)}
                className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Exportar dados
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Importar dados
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(ev) => {
                  const file = ev.target.files?.[0];
                  if (file) handleImport(file);
                  ev.target.value = '';
                }}
              />
              <button
                onClick={handleReset}
                className="rounded border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                Restaurar padrão
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    tab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            {tab !== 'recorrentes' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMonth((m) => shiftMonth(m, -1))}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-500 hover:bg-slate-50"
                >
                  ←
                </button>
                <span className="min-w-[160px] text-center text-sm font-medium capitalize text-slate-700">
                  {monthLabel(month)}
                </span>
                <button
                  onClick={() => setMonth((m) => shiftMonth(m, 1))}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-500 hover:bg-slate-50"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && <Dashboard data={data} month={month} onIncomeChange={handleIncomeChange} />}

        {(tab === 'casa' || tab === 'barbara' || tab === 'gabriel') && (
          <BillTable
            entries={data.entries.filter((e) => e.category === tab && e.month === month)}
            category={tab}
            showSplit={tab === 'casa'}
            defaultSplitBarbara={data.defaultSplitBarbara}
            onChange={updateEntry}
            onDelete={deleteEntry}
            onAdd={() => addEntry(tab)}
          />
        )}

        {tab === 'recorrentes' && (
          <div className="space-y-8">
            {(['casa', 'barbara', 'gabriel'] as CategoryKey[]).map((cat) => (
              <section key={cat}>
                <h2 className="mb-2 text-lg font-semibold text-slate-700">
                  {cat === 'casa' ? 'Contas da Casa' : cat === 'barbara' ? 'Bárbara' : 'Gabriel'}
                </h2>
                <TemplatesPanel
                  templates={data.templates.filter((t) => t.category === cat)}
                  category={cat}
                  defaultSplitBarbara={data.defaultSplitBarbara}
                  onChange={updateTemplate}
                  onDelete={deleteTemplate}
                  onAdd={() => addTemplate(cat)}
                />
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
