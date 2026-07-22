import { useMemo, useState } from 'react';
import ConditionCard, { ShockBadge } from '../components/ConditionCard';
import Modal from '../components/Modal';
import { CONDITION_LIST, CONDITIONS } from '../data/conditions';
import { FUNNELS } from '../data/funnels';
import { collectLeaves } from '../data/tree';

export default function ConditionsView() {
  const [query, setQuery] = useState('');
  const [funnelFilter, setFunnelFilter] = useState('all');
  const [drill, setDrill] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const funnelMembership = useMemo(() => {
    const m: Record<string, string[]> = {};
    for (const f of FUNNELS) {
      for (const id of collectLeaves(f.root)) {
        (m[id] ??= []).push(f.id);
      }
    }
    return m;
  }, []);

  const filtered = CONDITION_LIST.filter((c) => {
    if (funnelFilter !== 'all' && !(funnelMembership[c.id] ?? []).includes(funnelFilter)) {
      return false;
    }
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.impression.toLowerCase().includes(q) ||
      c.keyDiscriminator.toLowerCase().includes(q) ||
      c.findings.some((f) => f.value.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conditions, findings ('pinpoint', 'tearing', 'frothy')…"
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={funnelFilter}
          onChange={(e) => setFunnelFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All funnels</option>
          {FUNNELS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.emoji} {f.title}
            </option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={drill}
            onChange={(e) => setDrill(e.target.checked)}
          />
          Drill mode (hide answers)
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpen(c.id)}
            className="rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-colors hover:border-sky-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-slate-900">{c.name}</div>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              <span className="font-semibold">Clincher:</span> {c.keyDiscriminator}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(funnelMembership[c.id] ?? []).map((fid) => {
                const f = FUNNELS.find((x) => x.id === fid)!;
                return (
                  <span key={fid} title={f.title} className="text-sm">
                    {f.emoji}
                  </span>
                );
              })}
              <ShockBadge condition={c} />
            </div>
          </button>
        ))}
      </div>

      {open && (
        <Modal title={CONDITIONS[open]?.name ?? open} onClose={() => setOpen(null)}>
          <ConditionCard conditionId={open} drill={drill} onNavigate={setOpen} />
        </Modal>
      )}
    </div>
  );
}
