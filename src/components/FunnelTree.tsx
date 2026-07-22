import { useState } from 'react';
import { CONDITIONS } from '../data/conditions';
import type { Funnel, FunnelChild, FunnelNode } from '../data/types';

const PHASE_BADGE: Record<string, string> = {
  primary: 'bg-rose-100 text-rose-700',
  history: 'bg-amber-100 text-amber-700',
  vitals: 'bg-sky-100 text-sky-700',
};

const PHASE_SHORT: Record<string, string> = {
  primary: 'Primary Survey',
  history: 'History',
  vitals: 'Secondary / Vitals',
};

interface Props {
  funnel: Funnel;
  onSelectCondition: (id: string) => void;
}

export default function FunnelTree({ funnel, onSelectCondition }: Props) {
  // selected path = list of branch indices from the root
  const [path, setPath] = useState<number[]>([]);

  const handleBranchClick = (branchPath: number[]) => {
    // toggle: clicking the same branch collapses back one level
    setPath((prev) =>
      prev.length === branchPath.length && branchPath.every((v, i) => prev[i] === v)
        ? branchPath.slice(0, -1)
        : branchPath,
    );
  };

  const isOnPath = (branchPath: number[]) =>
    branchPath.every((v, i) => path[i] === v);

  const isDimmed = (branchPath: number[]) => {
    // dim a branch if a sibling (or ancestor's sibling) has been chosen instead
    for (let i = 0; i < branchPath.length; i++) {
      if (path.length > i && path[i] !== branchPath[i]) return true;
      if (path.length <= i) return false;
    }
    return false;
  };

  const renderChild = (child: FunnelChild, branchPath: number[]): React.ReactNode => {
    if (child.kind === 'leaf') {
      const c = CONDITIONS[child.conditionId];
      return (
        <button
          onClick={() => onSelectCondition(child.conditionId)}
          className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border-2 border-emerald-400 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-800 shadow-sm hover:bg-emerald-100"
        >
          🎯 {c?.shortName ?? c?.name ?? child.conditionId}
        </button>
      );
    }
    return renderNode(child, branchPath);
  };

  const renderNode = (node: FunnelNode, nodePath: number[]) => (
    <div className="mt-2">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PHASE_BADGE[node.phase]}`}>
          {PHASE_SHORT[node.phase]}
        </span>
        <span className="text-sm font-semibold text-slate-800">{node.question}</span>
      </div>
      <div className="ml-2 space-y-1.5 border-l-2 border-slate-200 pl-3">
        {node.branches.map((branch, i) => {
          const branchPath = [...nodePath, i];
          const dimmed = isDimmed(branchPath);
          const onPath = isOnPath(branchPath) && path.length >= branchPath.length;
          return (
            <div
              key={i}
              className={`transition-opacity ${dimmed ? 'opacity-30' : 'opacity-100'}`}
            >
              <button
                onClick={() => handleBranchClick(branchPath)}
                className={`rounded-lg border px-2.5 py-1.5 text-left text-sm transition-colors ${
                  onPath
                    ? 'border-sky-400 bg-sky-50 font-semibold text-sky-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                }`}
              >
                {branch.finding}
                {branch.detail && (
                  <span className="ml-1 text-xs font-normal italic text-slate-400">
                    — {branch.detail}
                  </span>
                )}
              </button>
              <div className="ml-4">{renderChild(branch.child, branchPath)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {path.length > 0 && (
        <button
          onClick={() => setPath([])}
          className="mb-2 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-300"
        >
          ✕ Clear highlighted path
        </button>
      )}
      {renderNode(funnel.root, [])}
    </div>
  );
}
