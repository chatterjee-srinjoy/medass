import { useEffect, useMemo, useRef, useState } from 'react';
import ConditionCard from '../components/ConditionCard';
import { CONDITIONS } from '../data/conditions';
import { FUNNELS } from '../data/funnels';
import { allPaths, collectLeaves, type FunnelPath } from '../data/tree';
import { PHASE_LABELS } from '../data/types';

// ---------- 15-minute NREMT timer ----------
function ExamTimer() {
  const TOTAL = 15 * 60;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const danger = secondsLeft <= 120;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`rounded-lg px-3 py-1 font-mono text-lg font-bold ${
          secondsLeft === 0
            ? 'bg-red-600 text-white'
            : danger
              ? 'bg-red-100 text-red-700'
              : 'bg-slate-100 text-slate-700'
        }`}
      >
        {mm}:{ss}
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
      >
        {running ? 'Pause' : secondsLeft === TOTAL ? 'Start 15:00' : 'Resume'}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setSecondsLeft(TOTAL);
        }}
        className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-300"
      >
        Reset
      </button>
      {secondsLeft === 0 && (
        <span className="text-sm font-bold text-red-600">
          TIME — transport not initiated = critical fail
        </span>
      )}
    </div>
  );
}

// ---------- Practice walkthrough ----------
export default function PracticeView() {
  const [funnelId, setFunnelId] = useState<string>('random');
  const [run, setRun] = useState<{ funnelIdx: number; path: FunnelPath } | null>(null);
  const [stepIdx, setStepIdx] = useState(0); // how many findings have been dealt
  const [differentialShown, setDifferentialShown] = useState(false);

  const startRun = () => {
    const pool =
      funnelId === 'random'
        ? FUNNELS
        : FUNNELS.filter((f) => f.id === funnelId);
    const funnel = pool[Math.floor(Math.random() * pool.length)];
    const funnelIdx = FUNNELS.indexOf(funnel);
    const paths = allPaths(funnel);
    const path = paths[Math.floor(Math.random() * paths.length)];
    setRun({ funnelIdx, path });
    setStepIdx(0);
    setDifferentialShown(false);
  };

  const funnel = run ? FUNNELS[run.funnelIdx] : null;
  const totalCandidates = useMemo(
    () => (funnel ? collectLeaves(funnel.root).length : 0),
    [funnel],
  );

  if (!run || !funnel) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="text-3xl">🚑</div>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Practice a scenario</h2>
          <p className="mt-1 text-sm text-slate-500">
            The app deals you findings in NREMT order (Primary → History → Vitals).
            At each step, <span className="font-semibold">say your remaining differential out loud
            before revealing</span>. At the end, recite the field impression, interventions,
            and transport decision before flipping the card.
          </p>
          <div className="mt-4 flex flex-col items-center gap-3">
            <select
              value={funnelId}
              onChange={(e) => setFunnelId(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="random">🎲 Random funnel (exam realistic)</option>
              {FUNNELS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.emoji} {f.title}
                </option>
              ))}
            </select>
            <button
              onClick={startRun}
              className="rounded-lg bg-sky-600 px-6 py-2.5 font-bold text-white hover:bg-sky-500"
            >
              Start scenario
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = run.path.steps;
  const done = stepIdx >= steps.length;
  const current = done ? null : steps[stepIdx];
  const remainingNow = stepIdx === 0 ? collectLeaves(funnel.root) : steps[stepIdx - 1].remaining;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ExamTimer />
        <button
          onClick={startRun}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-300"
        >
          🎲 New scenario
        </button>
      </div>

      {/* Cue */}
      <div className="rounded-xl border-2 border-slate-800 bg-slate-900 p-4 text-white">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          You walk in…
        </div>
        <div className="text-base font-bold">
          {funnel.emoji} "{funnel.cue}"
        </div>
        <div className="mt-1 text-xs text-slate-400">
          {totalCandidates} conditions live in this funnel. Start narrowing.
        </div>
      </div>

      {/* Dealt findings so far */}
      {steps.slice(0, stepIdx).map((s, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {PHASE_LABELS[s.node.phase]} · {s.node.question}
          </div>
          <div className="mt-0.5 text-sm font-semibold text-slate-800">→ {s.branch.finding}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {s.remaining.map((id) => (
              <span
                key={id}
                className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
              >
                {CONDITIONS[id]?.shortName ?? CONDITIONS[id]?.name}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Current step */}
      {current && (
        <div className="rounded-xl border-2 border-sky-400 bg-sky-50 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-sky-600">
            {PHASE_LABELS[current.node.phase]}
          </div>
          <div className="mt-0.5 text-sm text-slate-600">{current.node.question}</div>
          <div className="mt-1 text-base font-bold text-slate-900">
            You find: {current.branch.finding}
            {current.branch.detail && (
              <span className="font-normal italic text-slate-500"> ({current.branch.detail})</span>
            )}
          </div>

          <div className="mt-3 rounded-lg bg-white p-3">
            <p className="text-sm font-semibold text-slate-700">
              🗣️ Out loud: which of the {remainingNow.length} remaining conditions survive this
              finding?
            </p>
            {!differentialShown ? (
              <button
                onClick={() => setDifferentialShown(true)}
                className="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Reveal remaining differential
              </button>
            ) : (
              <>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {current.remaining.map((id) => (
                    <span
                      key={id}
                      className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                    >
                      {CONDITIONS[id]?.shortName ?? CONDITIONS[id]?.name}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setStepIdx((i) => i + 1);
                    setDifferentialShown(false);
                  }}
                  className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500"
                >
                  {stepIdx + 1 >= steps.length ? 'Down to one → state your impression' : 'Next finding →'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Final card */}
      {done && (
        <div className="rounded-xl border-2 border-emerald-400 bg-white p-4 shadow-sm">
          <div className="mb-3 text-sm font-bold text-emerald-700">
            One condition left. Recite: field impression → interventions (airway, O2, meds,
            positioning) → transport code & destination → reassessment (q5 unstable / q15 stable).
          </div>
          <ConditionCard conditionId={run.path.conditionId} drill />
        </div>
      )}
    </div>
  );
}
