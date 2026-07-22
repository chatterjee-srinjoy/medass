import type { Mnemonic, SkillSheetItem } from './types';

export const MNEMONICS: Mnemonic[] = [
  {
    id: 'enames',
    name: 'ENAMES',
    usedFor: 'Scene size-up',
    expansion: [
      { letter: 'E', meaning: 'Environmental dangers — "BSI, is my scene safe?"' },
      { letter: 'N', meaning: 'Number of patients' },
      { letter: 'A', meaning: 'Additional resources (ALS backup?)' },
      { letter: 'M', meaning: 'Mechanism / Nature of illness (NOI)' },
      { letter: 'E', meaning: 'Extrication needs (stair chair, Reeves, scoop, stretcher)' },
      { letter: 'S', meaning: 'Spinal precautions — consider stabilization' },
    ],
  },
  {
    id: 'avpu',
    name: 'AVPU',
    usedFor: 'Level of consciousness',
    expansion: [
      { letter: 'A', meaning: 'Alert (then check A&Ox4: person, place, time, event)' },
      { letter: 'V', meaning: 'Responds to Verbal stimulus' },
      { letter: 'P', meaning: 'Responds to Painful stimulus' },
      { letter: 'U', meaning: 'Unresponsive' },
    ],
  },
  {
    id: 'aeioutips',
    name: 'AEIOU-TIPS',
    usedFor: 'Causes of altered mental status',
    expansion: [
      { letter: 'A', meaning: 'Alcohol' },
      { letter: 'E', meaning: 'Epilepsy (seizure)' },
      { letter: 'I', meaning: 'Insulin (hypo/hyperglycemia)' },
      { letter: 'O', meaning: 'Opioids / Overdose' },
      { letter: 'U', meaning: 'Uremia / Underdose' },
      { letter: 'T', meaning: 'Trauma' },
      { letter: 'I', meaning: 'Infection' },
      { letter: 'P', meaning: 'Psychosis' },
      { letter: 'S', meaning: 'Stroke' },
    ],
  },
  {
    id: 'opqrst',
    name: 'OPQRST',
    usedFor: 'History of present illness (pain)',
    expansion: [
      { letter: 'O', meaning: 'Onset — what were you doing when it started?' },
      { letter: 'P', meaning: 'Provocation / Palliation — what makes it better or worse?' },
      { letter: 'Q', meaning: 'Quality — describe the pain (crushing? sharp? tearing?)' },
      { letter: 'R', meaning: 'Radiation — does it move anywhere?' },
      { letter: 'S', meaning: 'Severity — 0 to 10' },
      { letter: 'T', meaning: 'Time — how long? constant or intermittent?' },
    ],
  },
  {
    id: 'paste',
    name: 'PASTE',
    usedFor: 'History for respiratory distress',
    expansion: [
      { letter: 'P', meaning: 'Provocation — what triggered it?' },
      { letter: 'A', meaning: 'Associated chest pain' },
      { letter: 'S', meaning: 'Sputum — color? pink and frothy?' },
      { letter: 'T', meaning: 'Talking / Tiredness — full sentences or 1–2 words?' },
      { letter: 'E', meaning: 'Exercise tolerance / exertion provocation' },
    ],
  },
  {
    id: 'sample',
    name: 'SAMPLE',
    usedFor: 'Past medical history',
    expansion: [
      { letter: 'S', meaning: 'Signs & Symptoms' },
      { letter: 'A', meaning: 'Allergies' },
      { letter: 'M', meaning: 'Medications' },
      { letter: 'P', meaning: 'Past pertinent history' },
      { letter: 'L', meaning: 'Last oral intake' },
      { letter: 'E', meaning: 'Events leading up to the illness' },
    ],
  },
  {
    id: 'befast',
    name: 'BE-FAST',
    usedFor: 'Stroke assessment',
    expansion: [
      { letter: 'B', meaning: 'Balance — sudden loss?' },
      { letter: 'E', meaning: 'Eyes — sudden vision change?' },
      { letter: 'F', meaning: 'Facial droop — ask them to smile' },
      { letter: 'A', meaning: 'Arm drift — eyes closed, arms out' },
      { letter: 'S', meaning: 'Slurred speech — "you can\'t teach an old dog new tricks"' },
      { letter: 'T', meaning: 'Time — LAST KNOWN WELL (critical for the stroke center)' },
    ],
  },
  {
    id: 'dumbels',
    name: 'DUMBELS',
    usedFor: 'Cholinergic (organophosphate / nerve agent) toxidrome',
    expansion: [
      { letter: 'D', meaning: 'Defecation' },
      { letter: 'U', meaning: 'Urination' },
      { letter: 'M', meaning: 'Miosis (pinpoint pupils)' },
      { letter: 'B', meaning: 'Bradycardia / Bronchorrhea / Bronchospasm' },
      { letter: 'E', meaning: 'Emesis' },
      { letter: 'L', meaning: 'Lacrimation (tearing)' },
      { letter: 'S', meaning: 'Salivation' },
    ],
  },
  {
    id: 'blot',
    name: 'BLOT',
    usedFor: 'Shock treatment',
    expansion: [
      { letter: 'B', meaning: 'Bleeding control' },
      { letter: 'L', meaning: 'Lay flat (supine) — EXCEPTION: CHF/pulmonary edema stays UPRIGHT' },
      { letter: 'O', meaning: 'Oxygenate (high-flow)' },
      { letter: 'T', meaning: 'Temperature control (keep them warm)' },
    ],
  },
  {
    id: 'perrl',
    name: 'PERRL',
    usedFor: 'Pupil assessment',
    expansion: [
      { letter: 'P', meaning: 'Pupils' },
      { letter: 'E', meaning: 'Equal (unequal/blown → head trauma, stroke, or increased ICP)' },
      { letter: 'R', meaning: 'Round' },
      { letter: 'R', meaning: 'Reactive to Light (pinpoint → opioid/cholinergic; dilated → stimulant/hypoxia)' },
      { letter: 'L', meaning: 'Light' },
    ],
  },
  {
    id: 'cushings',
    name: "Cushing's Triad",
    usedFor: 'Signs of increased intracranial pressure (ICP)',
    expansion: [
      { letter: '↑', meaning: 'Blood pressure — hypertension, often with a wide pulse pressure' },
      { letter: '↓', meaning: 'Heart rate — bradycardia (this is the giveaway vs a plain hypertensive emergency)' },
      { letter: '~', meaning: 'Respirations — irregular or abnormal breathing pattern' },
    ],
    notes: [
      'Often paired with unequal/blown pupil, decreasing LOC, posturing, or projectile vomiting.',
      'Elevate head ~30° if no shock. Do NOT give nitro. Protect airway, Code 3.',
      'High BP here is compensatory — you are not treating the hypertension; you are treating the brain emergency.',
    ],
  },
  {
    id: 'gcs',
    name: 'GCS (Glasgow Coma Scale)',
    usedFor: 'Level of consciousness — trauma & medical AMS (not a mnemonic, but memorize it)',
    expansion: [
      { letter: 'E', meaning: 'Eye opening (max 4) — 4 spontaneous · 3 to speech · 2 to pain · 1 none' },
      { letter: 'V', meaning: 'Verbal response (max 5) — 5 oriented · 4 confused · 3 inappropriate words · 2 incomprehensible sounds · 1 none' },
      { letter: 'M', meaning: 'Motor response (max 6) — 6 obeys commands · 5 localizes pain · 4 withdraws from pain · 3 abnormal flexion (decorticate) · 2 extension (decerebrate) · 1 none' },
    ],
    notes: [
      'Total = E + V + M. Range 3 (worst) to 15 (best / fully awake). Always report the components too (e.g., "GCS 12 = E3 V4 M5"), not just the total.',
      'Severity guide for head injury: 13–15 mild · 9–12 moderate · ≤ 8 severe (think airway — may need ALS / advanced airway).',
      'GCS complements AVPU — AVPU is your quick primary-survey check; GCS is the scored neuro assessment you report and trend.',
    ],
  },
  {
    id: 'apgar',
    name: 'APGAR',
    usedFor: 'Newborn assessment at 1 and 5 minutes after birth',
    expansion: [
      { letter: 'A', meaning: 'Appearance (color) — 0 blue/pale all over · 1 body pink, hands/feet blue (acrocyanosis) · 2 pink all over' },
      { letter: 'P', meaning: 'Pulse (heart rate) — 0 absent · 1 < 100 bpm · 2 > 100 bpm' },
      { letter: 'G', meaning: 'Grimace (reflex irritability) — 0 no response · 1 grimace · 2 cry / cough / sneeze' },
      { letter: 'A', meaning: 'Activity (muscle tone) — 0 flaccid · 1 some flexion of extremities · 2 active motion / well flexed' },
      { letter: 'R', meaning: 'Respiration — 0 absent · 1 slow / irregular / weak cry · 2 good / strong cry' },
    ],
    notes: [
      'Score at 1 minute AND 5 minutes after birth. Each of the 5 categories is 0–2 → total 0–10.',
      '1-minute score: how well the baby tolerated the birthing process. 5-minute score: how well the baby is adapting to life outside the womb (and response to any resuscitation).',
      'Interpretation: 7–10 reassuring / normal · 4–6 moderately abnormal · 0–3 low / severe distress.',
      'If the 5-minute score is < 7, reassess every 5 minutes up to 20 minutes (per Neonatal Resuscitation Program / ACOG–AAP).',
      'NEVER delay resuscitation to get an APGAR. Score while (or after) you support ABCs — the score does not replace care.',
      'A perfect 10 is rare — most newborns lose a point for blue hands/feet at 1 minute. That\'s often normal acrocyanosis.',
    ],
  },
];

export const SKILL_SHEET: SkillSheetItem[] = [
  { section: 'Start', text: 'Takes or verbalizes appropriate PPE precautions', points: 1 },
  { section: 'Scene Size-Up', text: 'Determines the scene/situation is safe', points: 1 },
  { section: 'Scene Size-Up', text: 'Determines the mechanism of injury / nature of illness', points: 1 },
  { section: 'Scene Size-Up', text: 'Determines the number of patients', points: 1 },
  { section: 'Scene Size-Up', text: 'Requests additional EMS assistance if necessary', points: 1 },
  { section: 'Scene Size-Up', text: 'Considers stabilization of the spine', points: 1 },
  { section: 'Primary Survey', text: 'Verbalizes the general impression of the patient', points: 1 },
  { section: 'Primary Survey', text: 'Determines responsiveness / level of consciousness (AVPU)', points: 1 },
  { section: 'Primary Survey', text: 'Determines chief complaint / apparent life-threats', points: 1 },
  { section: 'Primary Survey', text: 'Airway & breathing: assessment · assures adequate ventilation · initiates appropriate oxygen therapy', points: 3 },
  { section: 'Primary Survey', text: 'Circulation: assesses/controls major bleeding · checks pulse · assesses skin (color, temp, or condition)', points: 3 },
  { section: 'Primary Survey', text: 'Identifies patient priority and makes treatment/transport decision', points: 1 },
  { section: 'History Taking', text: 'OPQRST: Onset · Provocation · Quality · Radiation · Severity · Time (+2 for clarifying questions)', points: 8 },
  { section: 'History Taking', text: 'SAMPLE: Allergies · Medications · Past history · Last oral intake · Events', points: 5 },
  { section: 'Secondary Assessment', text: 'Assesses affected body part/system (cardiovascular, pulmonary, neuro, musculoskeletal, integumentary, GI/GU, reproductive, psych/social)', points: 5 },
  { section: 'Vital Signs', text: 'Blood pressure · Pulse · Respiratory rate and quality', points: 4 },
  { section: 'Field Impression', text: 'States field impression of patient', points: 1 },
  { section: 'Field Impression', text: 'Interventions: verbalizes proper interventions/treatment', points: 1 },
  { section: 'Reassessment', text: 'Demonstrates how and when to reassess (unstable q5 min · stable q15 min)', points: 1 },
  { section: 'Reassessment', text: 'Provides accurate verbal report to arriving EMS unit', points: 1 },
];

export const CRITICAL_CRITERIA: string[] = [
  'Failure to initiate or call for transport of the patient within the 15-minute time limit',
  'Failure to take or verbalize appropriate PPE precautions',
  'Failure to determine scene safety before approaching patient',
  'Failure to voice and ultimately provide appropriate oxygen therapy',
  'Failure to assess/provide adequate ventilation',
  'Failure to find or appropriately manage problems associated with airway, breathing, hemorrhage, or shock',
  'Failure to differentiate patient\'s need for immediate transportation versus continued assessment or treatment at the scene',
  'Performs secondary examination before assessing and treating threats to airway, breathing, and circulation',
  'Orders a dangerous or inappropriate intervention',
  'Failure to provide accurate report to arriving EMS unit',
  'Failure to manage the patient as a competent EMT',
  'Exhibits unacceptable affect with patient or other personnel',
];

export const RADIO_SCRIPT = `"Medic 1, this is EMT [Your Name]. We are currently [ETA in minutes] minutes out, bringing you a [Age]-year-old [Biological Sex] whose chief complaint is [Chief Complaint].

Mental status: the patient is [Alert / responsive to Verbal / responsive to Pain / Unresponsive] — and if Alert: "A&O times [1–4]."

Their airway is [Clear / Maintained with OPA/NPA / Requiring suction], breathing is [Rate & Quality, e.g., 24 and labored, with wheezing], and circulation is [Pulse rate & quality, Skin color/temp/condition].

My field impression is [Field Impression].

Pertinent history: [SAMPLE highlights, e.g., history of angina, takes blood thinners, last ate at noon].

We have administered [Interventions/Medications with dose & route, e.g., 324 mg Aspirin PO and O2 at 15 L via NRB], which resulted in [Patient's response — improved / unchanged / worsening].

Latest vitals: BP [X], Heart Rate [X], Respiratory Rate [X], SpO2 [X][, Blood Glucose / Lung sounds if relevant].

Do you have any questions or require further information?"`;

export const RADIO_TIPS: string[] = [
  'Mental status: give the AVPU level. ONLY if they are Alert do you add "A&O×[1–4]" — a patient who responds to Voice or Pain, or is Unresponsive, has no A&O score.',
  'Say your field impression out loud — it tells the receiving crew what you\'re treating and why.',
  'Report meds with dose AND route ("324 mg aspirin PO"), then what happened after ("pain 8/10 down to 4/10").',
  'If you have two sets of vitals, give the trend ("BP was 88 systolic, now 102 after positioning").',
  'Keep it under ~60 seconds. The skeleton order: who you are → ETA → patient demographics + chief complaint → mental status → ABCs → impression → history → treatment + response → vitals → questions.',
  'Skipping or botching this report is an NREMT critical fail ("failure to provide accurate report to arriving EMS unit").',
];
