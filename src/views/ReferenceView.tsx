import { useState } from 'react';
import { MED_CONTROL_RULE, MED_LIST, NINE_RIGHTS } from '../data/meds';
import { CRITICAL_CRITERIA, MNEMONICS, RADIO_SCRIPT, RADIO_TIPS, SKILL_SHEET } from '../data/reference';
import type { Med } from '../data/types';

type Tab = 'meds' | 'skillsheet' | 'radio' | 'mnemonics';

function MedCard({ med, drill }: { med: Med; drill: boolean }) {
  const [revealed, setRevealed] = useState(!drill);
  // reset reveal state when drill toggles
  const [lastDrill, setLastDrill] = useState(drill);
  if (drill !== lastDrill) {
    setLastDrill(drill);
    setRevealed(!drill);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-bold text-slate-900">
          💊 {med.name}
          {med.brandNote && (
            <span className="ml-1.5 text-xs font-normal text-slate-400">({med.brandNote})</span>
          )}
        </h3>
      </div>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-2 w-full rounded-lg bg-slate-800 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Recite: indication · contraindications · route/dose · concerns — then reveal
        </button>
      ) : (
        <div className="mt-2 space-y-1.5 text-sm text-slate-700">
          <p><span className="font-semibold">Indication:</span> {med.indication}</p>
          {med.skinSigns && (
            <p><span className="font-semibold">Skin signs:</span> {med.skinSigns}</p>
          )}
          <div>
            <span className="font-semibold text-red-700">Contraindications:</span>
            <ul className="mt-0.5 list-disc pl-5 text-red-800">
              {med.contraindications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <p><span className="font-semibold">Route / Dose:</span> {med.routeDose}</p>
          <div>
            <span className="font-semibold">Admin concerns:</span>
            <ul className="mt-0.5 list-disc pl-5">
              {med.adminConcerns.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <p><span className="font-semibold">Side effects:</span> {med.sideEffects}</p>
          {med.earlyAdmin && (
            <p className="rounded bg-emerald-50 p-2 text-emerald-900">
              <span className="font-semibold">⚡ Early admin:</span> {med.earlyAdmin}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function NineRights({ drill }: { drill: boolean }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  // collapse again whenever drill mode is switched on
  const [lastDrill, setLastDrill] = useState(drill);
  if (drill !== lastDrill) {
    setLastDrill(drill);
    setRevealed(new Set());
  }

  const showAll = !drill;

  return (
    <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3.5">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-bold text-indigo-800">
          The 9 Rights — confirm before ANY medication
        </div>
        {drill && (
          <div className="flex gap-2">
            <button
              onClick={() => setRevealed(new Set(NINE_RIGHTS.map((_, i) => i)))}
              className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Reveal all
            </button>
            <button
              onClick={() => setRevealed(new Set())}
              className="rounded-lg bg-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-300"
            >
              Hide all
            </button>
          </div>
        )}
      </div>
      {drill && (
        <p className="mb-2 text-xs text-indigo-600">
          Recite each right (name + what you verify), then tap to check yourself.
        </p>
      )}
      <ol className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {NINE_RIGHTS.map((r, i) => {
          const isOpen = showAll || revealed.has(i);
          return (
            <li key={r.right}>
              <button
                disabled={showAll}
                onClick={() =>
                  setRevealed((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })
                }
                className={`w-full rounded-lg p-2 text-left text-sm ${
                  isOpen ? 'bg-white/70' : 'bg-indigo-100 hover:bg-indigo-200'
                } ${showAll ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {isOpen ? (
                  <span className="text-indigo-900">
                    <span className="font-semibold">
                      {i + 1}. {r.right}:
                    </span>{' '}
                    <span className="text-indigo-700">{r.question}</span>
                  </span>
                ) : (
                  <span className="font-semibold text-indigo-400">
                    {i + 1}. Right ______ — tap to reveal
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SkillSheetTab() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const total = SKILL_SHEET.reduce((s, i) => s + i.points, 0);
  const earned = SKILL_SHEET.reduce((s, item, i) => s + (checked.has(i) ? item.points : 0), 0);

  let lastSection = '';
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          NREMT Patient Assessment/Management — Medical · 15-minute limit
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
            {earned} / {total}
          </span>
          <button
            onClick={() => setChecked(new Set())}
            className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-300"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="space-y-1">
        {SKILL_SHEET.map((item, i) => {
          const header = item.section !== lastSection ? item.section : null;
          lastSection = item.section;
          return (
            <div key={i}>
              {header && (
                <div className="mt-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {header}
                </div>
              )}
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 text-sm hover:border-sky-300">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={checked.has(i)}
                  onChange={(e) => {
                    const next = new Set(checked);
                    if (e.target.checked) next.add(i);
                    else next.delete(i);
                    setChecked(next);
                  }}
                />
                <span className="flex-1 text-slate-700">{item.text}</span>
                <span className="shrink-0 text-xs font-bold text-slate-400">{item.points} pt</span>
              </label>
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-xl border-2 border-red-300 bg-red-50 p-4">
        <div className="mb-1.5 text-sm font-bold text-red-800">
          ☠️ Critical criteria — any ONE of these fails the station
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-red-900">
          {CRITICAL_CRITERIA.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ReferenceView() {
  const [tab, setTab] = useState<Tab>('meds');
  const [drill, setDrill] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'meds', label: '💊 Med Profiles' },
    { id: 'skillsheet', label: '📋 Skill Sheet' },
    { id: 'radio', label: '📻 Radio Report' },
    { id: 'mnemonics', label: '🔤 Mnemonics & Scales' },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              tab === t.id
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
        {tab === 'meds' && (
          <label className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600">
            <input type="checkbox" checked={drill} onChange={(e) => setDrill(e.target.checked)} />
            Drill mode
          </label>
        )}
      </div>

      {tab === 'meds' && (
        <div>
          <div className="mb-3 rounded-xl border-2 border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-900">
            <span className="font-bold">📞 Med control rule:</span> {MED_CONTROL_RULE}
          </div>
          <NineRights drill={drill} />
          <div className="grid gap-3 md:grid-cols-2">
            {MED_LIST.map((m) => (
              <MedCard key={`${m.id}-${drill}`} med={m} drill={drill} />
            ))}
          </div>
        </div>
      )}

      {tab === 'skillsheet' && <SkillSheetTab />}

      {tab === 'radio' && (
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 font-bold text-slate-900">
            📻 The Radio Ringdown (verbal report to ALS / hospital)
          </h3>
          <p className="mb-3 text-sm text-slate-500">
            An accurate verbal report to the arriving EMS unit is a scored point — and skipping it
            entirely is a critical fail.
          </p>
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-sans text-sm leading-relaxed text-slate-700">
            {RADIO_SCRIPT}
          </pre>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <div className="mb-1 text-sm font-bold text-amber-800">Ringdown coaching notes</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
              {RADIO_TIPS.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'mnemonics' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MNEMONICS.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
                m.notes ? 'sm:col-span-2 lg:col-span-3' : ''
              }`}
            >
              <div className="font-bold text-slate-900">{m.name}</div>
              <div className="mb-2 text-xs text-slate-500">{m.usedFor}</div>
              <div className="space-y-0.5 text-sm">
                {m.expansion.map((e, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="w-5 shrink-0 font-bold text-sky-600">{e.letter}</span>
                    <span className="text-slate-700">{e.meaning}</span>
                  </div>
                ))}
              </div>
              {m.notes && m.notes.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 border-t border-slate-100 pt-3 pl-5 text-sm text-slate-600">
                  {m.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
