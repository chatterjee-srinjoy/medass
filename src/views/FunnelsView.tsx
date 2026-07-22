import { useState } from 'react';
import ConditionCard from '../components/ConditionCard';
import FunnelTree from '../components/FunnelTree';
import Modal from '../components/Modal';
import { CONDITIONS } from '../data/conditions';
import { FUNNELS } from '../data/funnels';

export default function FunnelsView() {
  const [funnelId, setFunnelId] = useState(FUNNELS[0].id);
  const [openCondition, setOpenCondition] = useState<string | null>(null);

  const funnel = FUNNELS.find((f) => f.id === funnelId)!;

  return (
    <div>
      {/* Funnel picker: the walk-in cue IS the button */}
      <p className="mb-3 text-sm text-slate-500">
        Pick the funnel by what you perceive when you walk in — then follow the findings from
        most obvious to least obvious until one field impression remains.
      </p>
      <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FUNNELS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFunnelId(f.id)}
            className={`rounded-xl border-2 p-3 text-left transition-colors ${
              f.id === funnelId
                ? 'border-sky-500 bg-sky-50'
                : 'border-slate-200 bg-white hover:border-sky-300'
            }`}
          >
            <div className="text-lg">{f.emoji}</div>
            <div className="text-sm font-bold text-slate-800">{f.title}</div>
            <div className="mt-0.5 text-xs italic text-slate-500">"{f.cue}"</div>
          </button>
        ))}
      </div>

      {/* Funnel-wide rules */}
      {funnel.notes && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-600">
            Rules for this funnel
          </div>
          <ul className="list-disc space-y-0.5 pl-4 text-sm text-amber-900">
            {funnel.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* The key itself */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          You walk in…
        </div>
        <div className="mb-2 text-base font-bold text-slate-800">
          {funnel.emoji} "{funnel.cue}"
        </div>
        <FunnelTree funnel={funnel} onSelectCondition={setOpenCondition} />
      </div>

      {openCondition && (
        <Modal
          title={CONDITIONS[openCondition]?.name ?? openCondition}
          onClose={() => setOpenCondition(null)}
        >
          <ConditionCard conditionId={openCondition} onNavigate={setOpenCondition} />
        </Modal>
      )}
    </div>
  );
}
