import { useState } from 'react';
import ConditionsView from './views/ConditionsView';
import FunnelsView from './views/FunnelsView';
import PracticeView from './views/PracticeView';
import ReferenceView from './views/ReferenceView';

type View = 'funnels' | 'practice' | 'conditions' | 'reference';

const NAV: { id: View; label: string }[] = [
  { id: 'funnels', label: '🔀 Funnels' },
  { id: 'practice', label: '🎯 Practice' },
  { id: 'conditions', label: '🩺 Conditions' },
  { id: 'reference', label: '📚 Reference' },
];

export default function App() {
  const [view, setView] = useState<View>('funnels');

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            🚑 EMT Field Impression Funnels
          </h1>
          <nav className="flex flex-wrap gap-1.5">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  view === n.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {view === 'funnels' && <FunnelsView />}
        {view === 'practice' && <PracticeView />}
        {view === 'conditions' && <ConditionsView />}
        {view === 'reference' && <ReferenceView />}
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-slate-400">
        built with 🫀 from EMT-253AL · Bay Area Training Academy (BATA)
      </footer>
    </div>
  );
}
