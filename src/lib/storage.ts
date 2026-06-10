import type { AppData } from '../types';
import { buildSeedData } from '../data/seed';

const STORAGE_KEY = 'apartamento25.financas.v1';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeedData();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.templates || !parsed.entries) return buildSeedData();
    return parsed;
  } catch {
    return buildSeedData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData(): AppData {
  const fresh = buildSeedData();
  saveData(fresh);
  return fresh;
}

export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financas-apartamento25-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<AppData> {
  const text = await file.text();
  const parsed = JSON.parse(text) as AppData;
  if (!parsed.templates || !parsed.entries) throw new Error('Arquivo inválido');
  return parsed;
}
