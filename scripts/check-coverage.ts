import { CONDITIONS } from '../src/data/conditions';
import { FUNNELS } from '../src/data/funnels';
import { collectLeaves, allPaths } from '../src/data/tree';
import { MEDS } from '../src/data/meds';

const reachable = new Set<string>();
for (const f of FUNNELS) collectLeaves(f.root).forEach((id) => reachable.add(id));

const allIds = Object.keys(CONDITIONS);
const unreachable = allIds.filter((id) => !reachable.has(id));
const unknownLeaves = [...reachable].filter((id) => !CONDITIONS[id]);

let badRefs: string[] = [];
for (const c of Object.values(CONDITIONS)) {
  for (const cw of c.confusedWith) if (!CONDITIONS[cw.conditionId]) badRefs.push(`${c.id} -> ${cw.conditionId}`);
  for (const m of c.interventions.medIds) if (!MEDS[m]) badRefs.push(`${c.id} -> med ${m}`);
}

console.log('Total conditions:', allIds.length);
console.log('Reachable via funnels:', reachable.size);
console.log('Unreachable conditions:', unreachable.length ? unreachable : 'none');
console.log('Leaves pointing at unknown conditions:', unknownLeaves.length ? unknownLeaves : 'none');
console.log('Bad references:', badRefs.length ? badRefs : 'none');
for (const f of FUNNELS) console.log(`Funnel "${f.id}": ${allPaths(f).length} paths, ${new Set(collectLeaves(f.root)).size} unique conditions`);
