import { useState } from 'react';
import { CONDITIONS } from '../data/conditions';
import { MEDS } from '../data/meds';
import { PHASE_LABELS, type Condition, type Phase } from '../data/types';

const PHASES: Phase[] = ['primary', 'history', 'vitals'];

const SHOCK_STYLES: Record<string, { badge: string; cls: string }> = {
  treat: { badge: 'TREAT FOR SHOCK — BLOT', cls: 'bg-red-100 text-red-800 border-red-300' },
  watch: { badge: 'WATCH FOR SHOCK', cls: 'bg-amber-100 text-amber-800 border-amber-300' },
  exception: { badge: 'SHOCK POSITIONING EXCEPTION', cls: 'bg-purple-100 text-purple-800 border-purple-300' },
};

export function ShockBadge({ condition }: { condition: Condition }) {
  const s = SHOCK_STYLES[condition.shock];
  if (!s) return null;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${s.cls}`}>
      {s.badge}
    </span>
  );
}

interface Props {
  conditionId: string;
  /** quiz mode: hide impression/interventions behind a reveal button */
  drill?: boolean;
  onNavigate?: (conditionId: string) => void;
}

export default function ConditionCard({ conditionId, drill = false, onNavigate }: Props) {
  const c = CONDITIONS[conditionId];
  const [revealed, setRevealed] = useState(!drill);
  if (!c) return null;

  return (
    <div className="space-y-4">
      {/* Findings — always visible (these are the "question") */}
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Distinguishing findings
        </h3>
        <div className="space-y-2">
          {PHASES.map((phase) => {
            const rows = c.findings.filter((f) => f.phase === phase);
            if (rows.length === 0) return null;
            return (
              <div key={phase} className="rounded-lg bg-slate-50 p-3">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {PHASE_LABELS[phase]}
                </div>
                {rows.map((f, i) => (
                  <div key={i} className="text-sm text-slate-700">
                    <span className="font-semibold">{f.label}:</span> {f.value}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="mt-2 rounded-lg border border-sky-200 bg-sky-50 p-2.5 text-sm text-sky-900">
          <span className="font-bold">Clincher:</span> {c.keyDiscriminator}
        </div>
      </div>

      {drill && !revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full rounded-lg bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Recite the impression, interventions & transport — then reveal
        </button>
      )}

      {revealed && (
        <>
          {/* Impression */}
          <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
              Field impression
            </div>
            <div className="text-lg font-bold text-emerald-900">{c.impression}</div>
          </div>

          {/* Shock */}
          {c.shock !== 'none' && (
            <div className="flex flex-col gap-1.5">
              <ShockBadge condition={c} />
              {c.shockNote && <p className="text-sm text-slate-600">{c.shockNote}</p>}
            </div>
          )}

          {/* Interventions */}
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Interventions
            </h3>
            <div className="space-y-1.5 text-sm text-slate-700">
              <p><span className="font-semibold">Airway / Suction:</span> {c.interventions.airway}</p>
              <p><span className="font-semibold">Oxygen:</span> {c.interventions.oxygen}</p>
              <p><span className="font-semibold">Meds:</span> {c.interventions.meds}</p>
              {c.interventions.positioning && (
                <p><span className="font-semibold">Positioning:</span> {c.interventions.positioning}</p>
              )}
              <p><span className="font-semibold">Med control:</span> {c.interventions.medControl}</p>
              {c.interventions.other && (
                <p className="rounded bg-amber-50 p-2 text-amber-900">{c.interventions.other}</p>
              )}
            </div>
            {c.interventions.medIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.interventions.medIds.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700"
                  >
                    💊 {MEDS[id]?.name ?? id}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Transport */}
          <div className="rounded-lg bg-slate-100 p-3 text-sm">
            <span className="font-semibold">Transport:</span> {c.transport.code} ·{' '}
            <span className="font-semibold">Destination:</span> {c.transport.destination}
          </div>

          {/* Confused with */}
          {c.confusedWith.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Commonly confused with
              </h3>
              <div className="space-y-1.5">
                {c.confusedWith.map((cw) => (
                  <button
                    key={cw.conditionId}
                    onClick={() => onNavigate?.(cw.conditionId)}
                    className="block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left text-sm hover:border-sky-300 hover:bg-sky-50"
                  >
                    <span className="font-semibold text-sky-700">
                      {CONDITIONS[cw.conditionId]?.name ?? cw.conditionId}
                    </span>
                    <span className="text-slate-600"> — {cw.how}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exam tips */}
          {c.examTips && c.examTips.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                Exam tips
              </div>
              <ul className="list-disc space-y-1 pl-4 text-sm text-amber-900">
                {c.examTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
