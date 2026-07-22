export type Phase = 'primary' | 'history' | 'vitals';

export const PHASE_LABELS: Record<Phase, string> = {
  primary: 'Phase 1 · Primary Survey',
  history: 'Phase 2 · History',
  vitals: 'Phase 3 · Secondary / Vitals',
};

export interface Finding {
  phase: Phase;
  label: string; // e.g. "Skin", "Lung Sounds", "SAMPLE"
  value: string; // e.g. "Pale, cool, diaphoretic"
}

export interface Interventions {
  airway: string;
  oxygen: string;
  meds: string;
  medIds: string[]; // links into MEDS
  medControl: string;
  positioning?: string;
  other?: string;
}

/**
 * 'treat'     -> shock signs expected; treat with BLOT (lay flat)
 * 'watch'     -> monitor; treat if shock signs develop
 * 'exception' -> looks like it needs shock positioning but must stay upright (CHF trap)
 * 'none'      -> shock not a primary concern
 */
export type ShockRule = 'treat' | 'watch' | 'exception' | 'none';

export interface Condition {
  id: string;
  name: string;
  shortName?: string;
  findings: Finding[];
  keyDiscriminator: string; // the one finding that clinches it
  impression: string;
  interventions: Interventions;
  shock: ShockRule;
  shockNote?: string;
  transport: { code: string; destination: string };
  confusedWith: { conditionId: string; how: string }[];
  examTips?: string[];
}

// ---- Funnel tree (dichotomous key) ----

export type FunnelChild = FunnelNode | FunnelLeaf;

export interface FunnelLeaf {
  kind: 'leaf';
  conditionId: string;
}

export interface FunnelBranch {
  finding: string; // what you observe / are told
  detail?: string;
  child: FunnelChild;
}

export interface FunnelNode {
  kind: 'node';
  question: string; // what you're assessing next
  phase: Phase;
  branches: FunnelBranch[];
}

export interface Funnel {
  id: string;
  cue: string; // the walk-in perception, e.g. "Patient isn't tracking me"
  title: string;
  emoji: string;
  notes?: string[]; // funnel-wide rules ("check BG in EVERY AMS patient")
  root: FunnelNode;
}

// ---- Meds ----

export interface Med {
  id: string;
  name: string;
  brandNote?: string;
  indication: string;
  skinSigns?: string;
  contraindications: string[];
  routeDose: string;
  adminConcerns: string[];
  sideEffects: string;
  earlyAdmin?: string; // "may administer early on strong suspicion of..."
}

// ---- Reference ----

export interface Mnemonic {
  id: string;
  name: string;
  usedFor: string;
  expansion: { letter: string; meaning: string }[];
  /** Extra coaching notes (timing, score ranges, caveats) — used for scales like GCS / APGAR */
  notes?: string[];
}

export interface SkillSheetItem {
  section: string;
  text: string;
  points: number;
}
