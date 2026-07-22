import type { Funnel, FunnelBranch, FunnelChild, FunnelNode } from './types';

/** All condition ids reachable below a node/leaf. */
export function collectLeaves(child: FunnelChild): string[] {
  if (child.kind === 'leaf') return [child.conditionId];
  return child.branches.flatMap((b) => collectLeaves(b.child));
}

export interface PathStep {
  node: FunnelNode;
  branch: FunnelBranch;
  /** conditions still in play AFTER taking this branch */
  remaining: string[];
}

export interface FunnelPath {
  conditionId: string;
  steps: PathStep[];
}

/** Every root-to-leaf path in a funnel (used by the practice walkthrough). */
export function allPaths(funnel: Funnel): FunnelPath[] {
  const paths: FunnelPath[] = [];
  const walk = (node: FunnelNode, steps: PathStep[]) => {
    for (const branch of node.branches) {
      const remaining = collectLeaves(branch.child);
      const nextSteps = [...steps, { node, branch, remaining }];
      if (branch.child.kind === 'leaf') {
        paths.push({ conditionId: branch.child.conditionId, steps: nextSteps });
      } else {
        walk(branch.child, nextSteps);
      }
    }
  };
  walk(funnel.root, []);
  return paths;
}
