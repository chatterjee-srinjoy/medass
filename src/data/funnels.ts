import type { Funnel, FunnelLeaf } from './types';

const leaf = (conditionId: string): FunnelLeaf => ({ kind: 'leaf', conditionId });

/**
 * Funnels are keyed by the WALK-IN PERCEPTION (general impression + chief
 * complaint), not by body system. Discriminators are ordered the way the
 * information actually arrives on the NREMT medical station:
 *   Primary Survey → History → Secondary/Vitals.
 * A condition can appear in multiple funnels.
 */
export const FUNNELS: Funnel[] = [
  // ==========================================================
  {
    id: 'altered',
    emoji: '😵',
    cue: 'Patient isn\'t tracking me as I approach — altered or unresponsive (AVPU)',
    title: 'The Altered / Unresponsive Patient',
    notes: [
      'Check blood glucose on EVERY altered patient — hypoglycemia mimics almost everything in this funnel.',
      'Run AEIOUTIPS mentally: Alcohol, Epilepsy, Insulin, Opioids, Uremia/Underdose, Trauma, Infection, Psychosis, Stroke.',
      'Unresponsive = OPA/NPA + suction standby, always.',
      "Cushing's triad (↑ BP + ↓ HR + irregular respirations) ± blown pupil = increased ICP — elevate head ~30° if no shock, Code 3.",
    ],
    root: {
      kind: 'node',
      phase: 'primary',
      question: 'Primary survey — what do breathing and skin tell you first?',
      branches: [
        {
          finding: 'Slow / shallow breathing, cyanotic or "sleeping"',
          detail: 'CNS depressant picture',
          child: {
            kind: 'node',
            phase: 'vitals',
            question: 'Check the pupils (PERRL) and look around the scene',
            branches: [
              { finding: 'PINPOINT pupils + needles / drug report', child: leaf('opioid-od') },
              { finding: 'Normal or sluggish pupils + sedative pill bottles', detail: 'benzos, barbiturates, sleep aids', child: leaf('sedative-od') },
              { finding: 'Odor of alcohol, ataxic when roused', detail: 'still check BG!', child: leaf('alcohol-intoxication') },
            ],
          },
        },
        {
          finding: 'Deep AND rapid breathing (Kussmaul)',
          detail: 'body blowing off acid',
          child: {
            kind: 'node',
            phase: 'history',
            question: 'History and glucose',
            branches: [
              { finding: 'Diabetic, days of thirst/urination, fruity breath, BG very high', child: leaf('hyperglycemia-dka') },
            ],
          },
        },
        {
          finding: 'Pale, cool, diaphoretic',
          detail: 'looks like shock',
          child: {
            kind: 'node',
            phase: 'vitals',
            question: 'Blood glucose?',
            branches: [
              { finding: 'BG < 70 mg/dL, diabetic, rapid onset', child: leaf('hypoglycemia') },
              { finding: 'BG normal → this may be real shock', detail: 'hunt for the bleed / cardiac cause — see chest pain & abdominal funnels', child: leaf('ami') },
            ],
          },
        },
        {
          finding: 'Hot / sweaty / flushed + agitated or combative',
          child: {
            kind: 'node',
            phase: 'vitals',
            question: 'Pupils and degree of agitation?',
            branches: [
              { finding: 'DILATED pupils, tachycardic, paranoid', child: leaf('sympathomimetic-od') },
              { finding: 'Extreme hyperthermia, incoherent, "superhuman strength"', child: leaf('excited-delirium') },
            ],
          },
        },
        {
          finding: 'Skin normal / variable, breathing adequate',
          detail: 'the subtle ones — history is everything',
          child: {
            kind: 'node',
            phase: 'history',
            question: 'What do bystanders / SAMPLE tell you?',
            branches: [
              { finding: 'Actively convulsing right now (or seizing > 5 min)', child: leaf('seizure-active') },
              { finding: '"They were just convulsing" — now slowly waking', child: leaf('postictal') },
              {
                finding: 'No convulsions reported — check BEFAST + glucose',
                child: {
                  kind: 'node',
                  phase: 'vitals',
                  question: 'BEFAST exam and glucose',
                  branches: [
                    { finding: 'Facial droop / arm drift / slurred speech, BG NORMAL', detail: 'establish Time Last Known Well', child: leaf('stroke') },
                    { finding: "Cushing's triad (↑ BP + ↓ HR + irregular resp) ± blown pupil", detail: 'increased ICP — elevate head ~30°, Code 3', child: leaf('increased-icp') },
                    { finding: 'Multiple people sick in the same building, heater running', child: leaf('co-poisoning') },
                    { finding: 'BG < 70', detail: 'the mimic strikes again', child: leaf('hypoglycemia') },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },

  // ==========================================================
  {
    id: 'respiratory',
    emoji: '😮‍💨',
    cue: 'Tripod position, accessory muscles, 1–2 word sentences — or grasping their neck complaining of SOB',
    title: 'The Respiratory Distress Patient',
    notes: [
      'Use PASTE for the history: Provocation, Associated chest pain, Sputum, Talking/Tiredness, Exercise tolerance.',
      'Lung sounds are the fork in the road: dry wheeze / wet crackles / stridor / clear / diminished one side.',
      'Never withhold O2 from a patient who needs it. Pick the device by severity: NC → NRB → BVM.',
      'Actual choking (FBAO)? That\'s not a funnel — abdominal thrusts now.',
    ],
    root: {
      kind: 'node',
      phase: 'primary',
      question: 'Primary survey — any striking skin signs or an obviously pediatric patient?',
      branches: [
        {
          finding: 'Hives, flushing, facial/lip swelling',
          detail: 'allergic until proven otherwise',
          child: {
            kind: 'node',
            phase: 'vitals',
            question: 'How many body systems are involved?',
            branches: [
              { finding: 'Wheeze/stridor OR hypotension + hives', detail: '2+ systems', child: leaf('anaphylaxis') },
              { finding: 'Hives ONLY — breathing fine, BP fine', child: leaf('allergic-mild') },
            ],
          },
        },
        {
          finding: 'Pediatric with STRIDOR',
          child: {
            kind: 'node',
            phase: 'history',
            question: 'Onset and character?',
            branches: [
              { finding: 'SUDDEN, high fever, drooling, won\'t swallow', child: leaf('epiglottitis') },
              { finding: 'GRADUAL over days, seal-bark cough, low fever, worse at night', child: leaf('croup') },
            ],
          },
        },
        {
          finding: 'Coughing FITS ending in a whooping gasp, vomits after fits',
          detail: 'mask up — contagious',
          child: leaf('pertussis'),
        },
        {
          finding: 'No striking skin signs — go to lung sounds',
          child: {
            kind: 'node',
            phase: 'vitals',
            question: 'What do you hear when you auscultate?',
            branches: [
              {
                finding: 'WHEEZING (dry)',
                child: {
                  kind: 'node',
                  phase: 'history',
                  question: 'PASTE / SAMPLE — who is this patient?',
                  branches: [
                    { finding: 'Known asthmatic, trigger (exercise/allergen), has inhaler', child: leaf('asthma') },
                    { finding: 'Older chronic smoker, barrel chest, pursed lips, chronic course', child: leaf('copd') },
                  ],
                },
              },
              {
                finding: 'CRACKLES / RALES (wet)',
                child: {
                  kind: 'node',
                  phase: 'history',
                  question: 'Sputum and story?',
                  branches: [
                    { finding: 'PINK FROTHY sputum, orthopnea, pedal edema, woke up gasping', child: leaf('chf') },
                    { finding: 'Fever + colored sputum, sick for days, sounds localized', child: leaf('pneumonia') },
                    { finding: 'Renal patient who missed dialysis', child: leaf('dialysis') },
                    { finding: 'Young known-CF patient drowning in thick mucus', child: leaf('cystic-fibrosis') },
                  ],
                },
              },
              {
                finding: 'CLEAR lungs (but patient is still in distress)',
                child: {
                  kind: 'node',
                  phase: 'history',
                  question: 'Onset and risk factors?',
                  branches: [
                    { finding: 'Sudden sharp pleuritic pain + surgery/travel/immobility/OCP', child: leaf('pe') },
                    { finding: 'Anxiety, tingling fingers/lips, carpopedal spasm', detail: 'diagnosis of exclusion!', child: leaf('hyperventilation') },
                  ],
                },
              },
              {
                finding: 'DIMINISHED / ABSENT on one side',
                child: {
                  kind: 'node',
                  phase: 'history',
                  question: 'Who and how did it start?',
                  branches: [
                    { finding: 'Sudden one-sided sharp pain — tall thin young male, or COPD pt', child: leaf('pneumothorax-spont') },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },

  // ==========================================================
  {
    id: 'chest-pain',
    emoji: '💔',
    cue: 'Clutching their chest (Levine\'s sign) — or found collapsed',
    title: 'The Chest Pain / Cardiovascular Patient',
    notes: [
      'First branch is the pulse check. No pulse = CPR + AED, everything else waits.',
      'Take BP in BOTH arms — a significant difference flips you to dissection and flips the meds to NONE.',
      'Before nitro: systolic > 100? ED meds in the last 24–48 hr? Head injury? Their own prescription?',
    ],
    root: {
      kind: 'node',
      phase: 'primary',
      question: 'Responsiveness, breathing, and pulse (simultaneously, ≤ 10 sec)?',
      branches: [
        { finding: 'Unresponsive, PULSELESS, apneic/agonal', child: leaf('cardiac-arrest') },
        {
          finding: 'Responsive — complaining of chest pain/pressure',
          child: {
            kind: 'node',
            phase: 'history',
            question: 'OPQRST — quality, trigger, and does it resolve?',
            branches: [
              { finding: 'Crushing, came on with EXERTION, eases with rest / their nitro', child: leaf('angina') },
              { finding: 'Crushing, radiates to jaw/arm, does NOT resolve, nausea + doom', child: leaf('ami') },
              {
                finding: 'Sudden TEARING pain radiating to the BACK',
                child: {
                  kind: 'node',
                  phase: 'vitals',
                  question: 'BP in both arms?',
                  branches: [
                    { finding: 'Significant left/right difference or unequal pulses', child: leaf('dissection') },
                  ],
                },
              },
              { finding: 'Sharp, pleuritic, mostly short of breath', detail: 'think lungs, not heart', child: leaf('pe') },
              {
                finding: 'More headache/vision trouble than chest pain',
                child: {
                  kind: 'node',
                  phase: 'vitals',
                  question: 'Blood pressure and neuro exam?',
                  branches: [
                    { finding: 'Severely elevated (≥ 180 systolic) with symptoms', child: leaf('htn-emergency') },
                    { finding: "Cushing's triad (↑ BP + bradycardia + irregular respirations) or thunderclap + AMS", child: leaf('increased-icp') },
                    { finding: 'BP okay, BEFAST negative, history of similar headaches', child: leaf('headache') },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },

  // ==========================================================
  {
    id: 'abdominal',
    emoji: '🤢',
    cue: 'Fetal position, guarding their stomach, or actively vomiting',
    title: 'The Abdominal Pain Patient',
    notes: [
      'First question: is this patient in SHOCK? Pale/cool/diaphoretic + weak rapid pulse = BLOT + load and go, then figure out why.',
      'Behavior on the stretcher is a clue: writhing = kidney stone; frozen still = peritonitis.',
      'Female of childbearing age + lower abd pain: ask about last period. Ectopic until proven otherwise.',
      'Nothing by mouth for any abdominal patient.',
    ],
    root: {
      kind: 'node',
      phase: 'primary',
      question: 'Primary survey — shock signs? (pale/cool/diaphoretic + rapid weak pulse)',
      branches: [
        {
          finding: 'YES — this patient is shocky',
          detail: 'BLOT now, then find the source',
          child: {
            kind: 'node',
            phase: 'history',
            question: 'Where is the blood going? (SAMPLE/OPQRST)',
            branches: [
              { finding: 'Coffee-ground emesis or black tarry stool; NSAID use', child: leaf('ugib-ulcer') },
              { finding: 'Vomiting BRIGHT RED blood; heavy alcohol / liver disease', child: leaf('ugib-varices') },
              { finding: 'Female, missed period, vaginal bleeding, one-sided pain', child: leaf('ectopic') },
              { finding: 'Rigid board-like abdomen, fever, lies motionless', child: leaf('peritonitis') },
              { finding: 'On blood thinners / hemophilia — bleeding out of proportion', child: leaf('clotting-disorder') },
            ],
          },
        },
        {
          finding: 'NO — perfusing okay, work the pain',
          child: {
            kind: 'node',
            phase: 'history',
            question: 'OPQRST — where is the pain and how did it start?',
            branches: [
              { finding: 'Dull around navel → sharp RLQ; fever, no appetite', child: leaf('appendicitis') },
              { finding: 'RUQ after a fatty meal → right shoulder', child: leaf('cholecystitis') },
              { finding: 'FLANK → groin, colicky waves, can\'t hold still', child: leaf('kidney-stone') },
              { finding: 'Female: gradual bilateral lower pain, fever, discharge, shuffle', child: leaf('pid') },
              { finding: 'Bright red blood per rectum, stable vitals', child: leaf('lgib') },
              { finding: 'Known sickle cell disease, diffuse severe pain', child: leaf('sickle-cell') },
              { finding: 'Dialysis patient — missed session or fistula problem', child: leaf('dialysis') },
              { finding: 'Disclosed or suspected sexual assault', detail: 'treat injuries, preserve evidence, support', child: leaf('sexual-assault') },
            ],
          },
        },
      ],
    },
  },

  // ==========================================================
  {
    id: 'poisoning',
    emoji: '☠️',
    cue: 'Poisoning / exposure scene — bottles, odors, chemicals, multiple patients down',
    title: 'The Poisoned / Exposed Patient',
    notes: [
      'SCENE SAFETY FIRST. If the scene made them sick, it can make you sick. Stage / decon before contact when indicated.',
      'Identify: WHAT, HOW MUCH, WHEN. Bring containers. Poison Control: 1-800-222-1222.',
      'Route of exposure drives the branch: ingested / inhaled / absorbed / injected.',
    ],
    root: {
      kind: 'node',
      phase: 'primary',
      question: 'Route of exposure?',
      branches: [
        {
          finding: 'INGESTED — pill bottles, containers, plants',
          child: {
            kind: 'node',
            phase: 'vitals',
            question: 'Which toxidrome fits? (LOC, resp, pupils)',
            branches: [
              { finding: 'Slow breathing + PINPOINT pupils + opioid evidence', child: leaf('opioid-od') },
              { finding: 'Drowsy, pupils normal/sluggish, sedative bottles', child: leaf('sedative-od') },
              { finding: 'Agitated, tachy, DILATED pupils, hot sweaty', child: leaf('sympathomimetic-od') },
              { finding: 'ETOH odor, ataxia', child: leaf('alcohol-intoxication') },
              { finding: 'Something else / unknown oral poison', detail: 'poison control + consider charcoal per med control', child: leaf('ingested-poison') },
            ],
          },
        },
        {
          finding: 'INHALED — enclosed space, heater/generator, multiple patients',
          child: leaf('co-poisoning'),
        },
        {
          finding: 'ABSORBED — chemical on skin/clothing',
          child: leaf('absorbed-poison'),
        },
        {
          finding: 'Pesticide / nerve agent — patient LEAKING from everywhere',
          detail: 'DUMBELS toxidrome',
          child: leaf('organophosphate'),
        },
        {
          finding: 'INJECTED — sting with hives/swelling',
          child: leaf('anaphylaxis'),
        },
      ],
    },
  },

  // ==========================================================
  {
    id: 'behavioral',
    emoji: '🧠',
    cue: 'Erratic, agitated, or concerning behavior — possible danger to self or others',
    title: 'The Behavioral Emergency',
    notes: [
      'SCENE SAFETY: stage for police if any violence risk. Keep your exit clear. One calm voice.',
      'Rule out medical mimics BEFORE calling it psychiatric: glucose, hypoxia, drugs, head injury.',
      'Suicidal patients can become homicidal. Never leave them alone.',
    ],
    root: {
      kind: 'node',
      phase: 'primary',
      question: 'After staging/scene safety — what does the behavior look like?',
      branches: [
        {
          finding: 'Confused/bizarre + medical red flags',
          detail: 'sweaty, diabetic, hypoxic…',
          child: {
            kind: 'node',
            phase: 'vitals',
            question: 'Check glucose, pupils, skin',
            branches: [
              { finding: 'Diabetic, diaphoretic, BG < 70', detail: 'not a psych patient!', child: leaf('hypoglycemia') },
              { finding: 'Dilated pupils, tachycardic, stimulant use', child: leaf('sympathomimetic-od') },
            ],
          },
        },
        { finding: 'EXTREME agitation, hyperthermic, incoherent, violent strength', child: leaf('excited-delirium') },
        {
          finding: 'Hallucinations / delusions, psych history, off meds',
          detail: 'medical causes ruled out',
          child: leaf('psychosis'),
        },
        { finding: 'Talking about wanting to die / self-harm', detail: 'ask directly about plan + means', child: leaf('suicide-risk') },
      ],
    },
  },
];

export const FUNNEL_MAP = Object.fromEntries(FUNNELS.map((f) => [f.id, f]));
