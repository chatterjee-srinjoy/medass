import type { Condition } from './types';

/**
 * Flat pool of conditions. Funnels reference these by id, and a condition
 * can appear in multiple funnels (matching how the same patient presentation
 * can be reached from different first impressions).
 *
 * O2 policy (per instructor): NEVER withhold O2 from a patient who needs it.
 * Choose the delivery device by severity, not by an SpO2 number:
 *   NC 1-6 LPM (mild) · NRB 10-15 LPM (severe) · BVM 15 LPM (apneic or
 *   hypoventilating) · humidified blow-by (peds upper airway).
 */
export const CONDITIONS: Record<string, Condition> = {
  // ============================================================
  // ALTERED MENTAL STATUS / NEURO / ENDOCRINE
  // ============================================================
  hypoglycemia: {
    id: 'hypoglycemia',
    name: 'Hypoglycemia',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Pale, cool, diaphoretic' },
      { phase: 'primary', label: 'LOC', value: 'Altered → unresponsive; can be combative or appear intoxicated. RAPID onset (minutes)' },
      { phase: 'history', label: 'SAMPLE', value: 'History of diabetes; took insulin but missed a meal, or over-exerted' },
      { phase: 'vitals', label: 'Blood Glucose', value: '< 70 mg/dL (normal 70–120)' },
    ],
    keyDiscriminator: 'Diabetic + BG < 70 mg/dL + rapid onset',
    impression: 'Hypoglycemia (insulin shock)',
    interventions: {
      airway: 'OPA/NPA if unresponsive; suction standby',
      oxygen: 'NC 1–6 LPM or NRB 10–15 LPM by severity; BVM 15 LPM if hypoventilating',
      meds: 'Oral Glucose 15 g PO — ONLY if awake and able to protect their own airway',
      medIds: ['oral-glucose'],
      medControl: 'Not required for oral glucose (O2 and glucose are the exceptions — calling anyway is safe)',
      other: 'May administer glucose early on strong suspicion (known diabetic, altered, able to swallow)',
    },
    shock: 'watch',
    shockNote: 'Skin looks exactly like shock (pale/cool/diaphoretic) — the glucometer is what separates them.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'stroke', how: 'Hypoglycemia can mimic stroke (slurred speech, weakness). ALWAYS check BG before calling a stroke.' },
      { conditionId: 'alcohol-intoxication', how: 'Both can look "drunk." Never assume intoxication — check BG.' },
      { conditionId: 'hyperglycemia-dka', how: 'Opposite problem: DKA is SLOW onset (days), Kussmaul resps, fruity breath, BG very high.' },
    ],
    examTips: ['Check BG on EVERY altered patient.', 'If they can\'t swallow / protect airway: NO oral glucose — transport and support ABCs.'],
  },

  'hyperglycemia-dka': {
    id: 'hyperglycemia-dka',
    name: 'Hyperglycemia / DKA',
    shortName: 'DKA',
    findings: [
      { phase: 'primary', label: 'Resp RRQ', value: 'Deep AND rapid (Kussmaul respirations)' },
      { phase: 'primary', label: 'Skin', value: 'Warm, dry; signs of dehydration. SLOW onset (hours–days)' },
      { phase: 'history', label: 'SAMPLE', value: 'History of diabetes; fruity/acetone breath odor; polyuria, polydipsia; recent illness or missed insulin' },
      { phase: 'vitals', label: 'Blood Glucose', value: 'Very high (> 250–400 mg/dL or reads "HIGH")' },
    ],
    keyDiscriminator: 'Kussmaul respirations + fruity breath + BG very high',
    impression: 'Hyperglycemia / Diabetic Ketoacidosis',
    interventions: {
      airway: 'OPA/NPA if unconscious; suction standby',
      oxygen: 'NRB 10–15 LPM; BVM if inadequate ventilation',
      meds: 'None at EMT level (needs IV fluids + insulin in hospital)',
      medIds: [],
      medControl: 'No',
    },
    shock: 'watch',
    shockNote: 'Severe dehydration can produce hypovolemic shock — if pale/cool + weak rapid pulse + hypotension, treat with BLOT.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'hypoglycemia', how: 'Both diabetic emergencies. DKA = slow onset, dry skin, Kussmaul, high BG. Hypoglycemia = fast onset, sweaty, low BG.' },
      { conditionId: 'hyperventilation', how: 'Kussmaul breathing can look like anxiety hyperventilation — the diabetes history and glucometer separate them.' },
    ],
    examTips: ['HHS (older type 2 diabetic, extremely high BG, profound dehydration, NO fruity breath or Kussmaul) is managed the same at EMT level: ABCs + transport.'],
  },

  'opioid-od': {
    id: 'opioid-od',
    name: 'Opioid Overdose',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Cyanotic, pale' },
      { phase: 'primary', label: 'Resp RRQ', value: 'Slow / shallow (hypoventilation) or apneic' },
      { phase: 'history', label: 'SAMPLE', value: 'Bystanders report drug use; needles/paraphernalia present' },
      { phase: 'vitals', label: 'Pupils (PERRL)', value: 'PINPOINT (miosis)' },
    ],
    keyDiscriminator: 'Pinpoint pupils + slow/shallow respirations + drug evidence',
    impression: 'Opioid overdose',
    interventions: {
      airway: 'OPA/NPA; suction READY (vomiting risk when naloxone hits)',
      oxygen: 'BVM 15 LPM — ventilate FIRST; hypoxia kills before anything else',
      meds: 'Naloxone (Narcan) 2–4 mg IN',
      medIds: ['naloxone', 'oxygen'],
      medControl: 'Yes — call med control for naloxone',
      other: 'May administer naloxone early on strong suspicion. Patient may wake combative with projectile vomiting — be ready.',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'sedative-od', how: 'Both: decreased LOC + slow breathing. Sedative-hypnotic pupils are NORMAL or sluggish — NOT pinpoint. Naloxone won\'t fix a benzo OD.' },
      { conditionId: 'stroke', how: 'Unresponsive + abnormal pupils can suggest stroke — stroke pupils are typically UNEQUAL, not bilateral pinpoint.' },
    ],
    examTips: ['Ventilation before naloxone: fix the breathing, then reverse the drug.'],
  },

  'sedative-od': {
    id: 'sedative-od',
    name: 'Sedative-Hypnotic Overdose',
    shortName: 'Sedative OD',
    findings: [
      { phase: 'primary', label: 'LOC', value: 'Drowsy, peaceful, appears "intoxicated"' },
      { phase: 'primary', label: 'Resp RRQ', value: 'Slow / shallow' },
      { phase: 'history', label: 'SAMPLE', value: 'Empty pill bottles: benzodiazepines, barbiturates, sleep aids' },
      { phase: 'vitals', label: 'Pupils (PERRL)', value: 'Normal or sluggish — NOT pinpoint' },
    ],
    keyDiscriminator: 'Sedative bottles + slow breathing + pupils NOT pinpoint',
    impression: 'Sedative-hypnotic overdose',
    interventions: {
      airway: 'OPA/NPA if unconscious; suction standby',
      oxygen: 'BVM 15 LPM if hypoventilating; otherwise NC/NRB by severity',
      meds: 'None at EMT level (no reversal agent in the field) — monitor ABCs closely',
      medIds: ['oxygen'],
      medControl: 'No',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'opioid-od', how: 'The pupil check is THE differentiator: opioid = pinpoint, sedative = normal/sluggish.' },
      { conditionId: 'alcohol-intoxication', how: 'Both look "drunk" — look for bottles/history; alcohol has the odor.' },
    ],
  },

  'sympathomimetic-od': {
    id: 'sympathomimetic-od',
    name: 'Sympathomimetic (Stimulant) OD',
    shortName: 'Stimulant OD',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Sweaty, flushed, HOT' },
      { phase: 'primary', label: 'Pulse RRQ', value: 'Tachycardic; possibly hypertensive' },
      { phase: 'history', label: 'SAMPLE', value: 'Erratic, paranoid, or combative behavior; cocaine / meth / amphetamine use' },
      { phase: 'vitals', label: 'Pupils (PERRL)', value: 'DILATED (mydriasis)' },
    ],
    keyDiscriminator: 'Agitation + tachycardia + dilated pupils + hot sweaty skin',
    impression: 'Sympathomimetic overdose',
    interventions: {
      airway: 'Maintain normally; suction standby',
      oxygen: 'NC or NRB only if hypoxic',
      meds: 'None at EMT level',
      medIds: [],
      medControl: 'No — but CALL POLICE for scene safety',
      other: 'Calm, low-stimulation environment; do not escalate',
    },
    shock: 'none',
    transport: { code: 'Code 3, or non-emergent if stable (avoid escalating the patient)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'excited-delirium', how: 'Overlapping presentations (often the same drug). Excited delirium = extreme hyperthermia + incoherence + "superhuman strength" — high mortality, needs ALS.' },
      { conditionId: 'psychosis', how: 'Paranoia can look psychiatric — dilated pupils, tachycardia, and sweating point to a drug cause.' },
    ],
  },

  stroke: {
    id: 'stroke',
    name: 'CVA (Stroke) / TIA',
    shortName: 'Stroke',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Normal or variable' },
      { phase: 'primary', label: 'LOC', value: 'Altered, confused, or focal deficit; may have unequal pupils' },
      { phase: 'history', label: 'SAMPLE', value: '"Time Last Known Well" established — CRITICAL for the stroke center' },
      { phase: 'vitals', label: 'BEFAST', value: 'Balance loss, Eyes (vision loss), Facial droop, Arm drift, Slurred speech, Time' },
      { phase: 'vitals', label: 'Blood Glucose', value: 'NORMAL (this is how you rule out the mimic)' },
    ],
    keyDiscriminator: 'BEFAST positive + normal glucose + time last known well',
    impression: 'CVA (stroke) / TIA',
    interventions: {
      airway: 'OPA/NPA if unconscious; suction READY (impaired swallowing)',
      oxygen: 'NC or NRB by severity — give O2 if they need it',
      meds: 'None. NOTHING by mouth (aspiration risk)',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Elevate head ~30° if no shock; affected side protected',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'STROKE CENTER (not just closest ED)' },
    confusedWith: [
      { conditionId: 'hypoglycemia', how: 'The classic mimic — check BG before calling a stroke.' },
      { conditionId: 'postictal', how: 'Postictal patients can have temporary one-sided weakness (Todd\'s paralysis); they IMPROVE over minutes, stroke doesn\'t.' },
      { conditionId: 'increased-icp', how: 'A bad stroke (esp. bleed) can RAISE ICP — Cushing\'s triad + blown pupil means the brain is herniating. Same destination urgency, escalate airway/ALS.' },
    ],
    examTips: [
      'TIA symptoms resolve on their own — transport anyway, it\'s a stroke warning shot.',
      'Destination choice (stroke center) is a scored decision.',
      'Watch for signs of increased ICP (Cushing\'s triad, unequal/blown pupil, posturing) — elevating the head ~30° helps; do NOT lay them flat.',
    ],
  },

  'increased-icp': {
    id: 'increased-icp',
    name: 'Increased ICP (Intracranial Pressure)',
    shortName: '↑ ICP',
    findings: [
      { phase: 'primary', label: 'LOC', value: 'Decreasing LOC → unresponsive; may have abnormal posturing (decorticate / decerebrate)' },
      { phase: 'primary', label: 'Pupils', value: 'Unequal or blown (fixed & dilated) on one side — late and scary' },
      { phase: 'history', label: 'Context', value: 'Often after head trauma, hemorrhagic stroke, or "worst headache of my life" (thunderclap). May have projectile vomiting' },
      { phase: 'vitals', label: "Cushing's triad", value: '↑ BP (wide pulse pressure) + ↓ HR (bradycardia) + irregular / abnormal respirations' },
    ],
    keyDiscriminator: "Cushing's triad (high BP + low HR + weird breathing) ± unequal/blown pupil",
    impression: 'Signs of increased intracranial pressure (intracranial emergency)',
    interventions: {
      airway: 'Protect early — OPA/NPA if needed; suction READY (vomiting). Request ALS if airway is failing',
      oxygen: 'High-flow O2 / BVM 15 LPM if inadequate ventilation — never withhold if they need it',
      meds: 'None. NO nitro (they already have high BP for a reason). Nothing by mouth',
      medIds: ['oxygen'],
      medControl: 'No meds to give',
      positioning: 'Elevate head of bed ~30° if NO shock — lowers ICP. Do NOT lay flat unless they are hypotensive',
      other: 'This is a FINDING / life-threat pattern, not a standalone NOI. The underlying cause is usually stroke, head trauma, or intracranial bleed — still Code 3',
    },
    shock: 'none',
    shockNote: 'Do not confuse Cushing\'s hypertension with "treat the BP." High BP here is compensatory — you protect the airway and transport, you do not drop their pressure with nitro.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED / trauma or stroke center per MOI and protocol' },
    confusedWith: [
      { conditionId: 'stroke', how: 'Stroke can CAUSE increased ICP. BEFAST may still be positive — Cushing\'s + blown pupil means it\'s getting worse fast.' },
      { conditionId: 'headache', how: 'Thunderclap "worst headache of my life" + Cushing\'s / AMS is not a migraine — treat as intracranial emergency.' },
      { conditionId: 'htn-emergency', how: 'Both have high BP. Hypertensive emergency: high BP + headache/vision changes, usually tachycardic or normal HR. Cushing\'s: high BP + BRADYCARDIA + irregular respirations.' },
    ],
    examTips: [
      'Memorize Cushing\'s triad: ↑ BP · ↓ HR · irregular respirations. That pattern on a neuro patient = ICP until proven otherwise.',
      'AVPU/GCS will be dropping — reassess q5 min and say the trend out loud.',
      'Head elevation ~30° only if they are not in shock. Shock wins over ICP positioning.',
    ],
  },

  'seizure-active': {
    id: 'seizure-active',
    name: 'Active Seizure / Status Epilepticus',
    shortName: 'Active Seizure',
    findings: [
      { phase: 'primary', label: 'General', value: 'Actively convulsing (tonic-clonic); cyanosis during the seizure is common' },
      { phase: 'history', label: 'SAMPLE', value: 'Epilepsy history / missed anticonvulsants — or first-time seizure (worse)' },
      { phase: 'vitals', label: 'Duration', value: 'STATUS EPILEPTICUS = seizure > 5 min, or repeated seizures without waking between — true emergency' },
    ],
    keyDiscriminator: 'Convulsing in front of you; status if > 5 min or back-to-back',
    impression: 'Active seizure / status epilepticus',
    interventions: {
      airway: 'NOTHING in the mouth during the seizure. Protect from injury, move hazards away. After it stops: recovery position, NPA, suction',
      oxygen: 'High-flow O2 / BVM 15 LPM if inadequate breathing after seizure',
      meds: 'None at EMT level (ALS carries benzodiazepines) — request ALS for status',
      medIds: ['oxygen'],
      medControl: 'No',
      other: 'Check BG when able — hypoglycemia causes seizures',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'postictal', how: 'Same patient, different moment: actively convulsing vs. gradually waking after.' },
    ],
  },

  postictal: {
    id: 'postictal',
    name: 'Postictal State',
    findings: [
      { phase: 'primary', label: 'General', value: 'Labored breathing, confused, sleepy; possibly incontinent or tongue bitten' },
      { phase: 'history', label: 'SAMPLE', value: 'Bystanders report they were just convulsing' },
      { phase: 'vitals', label: 'Trend', value: 'IMPROVING toward baseline over minutes; no persistent focal deficits' },
    ],
    keyDiscriminator: 'Witnessed convulsion + steadily improving LOC',
    impression: 'Postictal state (after seizure)',
    interventions: {
      airway: 'NPA (or OPA if no gag reflex); suction ready; recovery position',
      oxygen: 'NC 1–6 LPM or NRB 10–15 LPM by severity',
      meds: 'None. Check BG',
      medIds: ['oxygen'],
      medControl: 'No',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'stroke', how: 'Postictal improves over minutes; stroke deficits persist. When in doubt, treat as stroke.' },
      { conditionId: 'hypoglycemia', how: 'Hypoglycemia can CAUSE the seizure — always check BG.' },
    ],
  },

  'alcohol-intoxication': {
    id: 'alcohol-intoxication',
    name: 'Alcohol Intoxication / Withdrawal',
    shortName: 'Alcohol',
    findings: [
      { phase: 'primary', label: 'General', value: 'Odor of alcohol, slurred speech, ataxia, decreased LOC' },
      { phase: 'history', label: 'SAMPLE', value: 'Drinking history. WITHDRAWAL: last drink 1–3 days ago → tremors, hallucinations, seizures (delirium tremens)' },
      { phase: 'vitals', label: 'Blood Glucose', value: 'CHECK IT — never assume "just drunk"' },
    ],
    keyDiscriminator: 'ETOH odor + ataxia — after ruling out hypoglycemia and head injury',
    impression: 'Alcohol intoxication (or withdrawal / DTs)',
    interventions: {
      airway: 'Recovery position; suction READY (high vomiting/aspiration risk)',
      oxygen: 'NC/NRB by severity',
      meds: 'None',
      medIds: [],
      medControl: 'No',
    },
    shock: 'none',
    transport: { code: 'Code 3 if altered; routine if stable', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'hypoglycemia', how: 'THE exam trap: "drunk" patients who are actually hypoglycemic. Check BG.' },
      { conditionId: 'sedative-od', how: 'Similar depressant picture; look for bottles vs. odor.' },
    ],
    examTips: ['Intoxicated patients cannot refuse care — they lack capacity.'],
  },

  'co-poisoning': {
    id: 'co-poisoning',
    name: 'Carbon Monoxide Poisoning',
    shortName: 'CO Poisoning',
    findings: [
      { phase: 'primary', label: 'Scene', value: 'MULTIPLE patients in the same building; winter, faulty heater/generator, enclosed space' },
      { phase: 'history', label: 'SAMPLE', value: 'Headache, nausea, dizziness, confusion — "flu-like" but everyone in the house has it' },
      { phase: 'vitals', label: 'SpO2', value: 'UNRELIABLE — pulse ox reads falsely normal with CO' },
    ],
    keyDiscriminator: 'Whole-household "flu" + enclosed space with combustion source',
    impression: 'Carbon monoxide poisoning',
    interventions: {
      airway: 'Maintain; suction as needed',
      oxygen: 'NRB 10–15 LPM at 100% for EVERYONE exposed — regardless of how they look. BVM if inadequate breathing',
      meds: 'Oxygen IS the medicine here',
      medIds: ['oxygen'],
      medControl: 'No',
      other: 'REMOVE from environment first — scene safety. Do not become patient #2',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED (hyperbaric center if protocol directs)' },
    confusedWith: [
      { conditionId: 'pneumonia', how: '"Flu-like" complaints — the multiple-victims-same-building pattern is the giveaway.' },
    ],
    examTips: ['Cherry-red skin is a LATE and unreliable sign — don\'t wait for it.'],
  },

  // ============================================================
  // RESPIRATORY
  // ============================================================
  asthma: {
    id: 'asthma',
    name: 'Asthma',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Normal, or cyanotic if severe; tripoding, accessory muscle use' },
      { phase: 'history', label: 'PASTE', value: 'Triggered by exercise / allergens / cold air; has a prescribed inhaler; prior attacks' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'WHEEZING (dry), usually bilateral, expiratory' },
    ],
    keyDiscriminator: 'Known asthmatic + trigger + bilateral dry wheezing',
    impression: 'Acute asthma attack',
    interventions: {
      airway: 'Keep patent; suction standby',
      oxygen: 'NC 1–6 LPM or NRB 10–15 LPM by severity',
      meds: 'Assist with prescribed Albuterol MDI, 1–2 puffs (wait 5 min before repeating)',
      medIds: ['albuterol', 'oxygen'],
      medControl: 'Yes — call med control for albuterol (must be the patient\'s own prescribed inhaler)',
      other: 'May assist with albuterol early on strong suspicion (obvious asthma attack, patient has their inhaler)',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'copd', how: 'Both wheeze. Asthma = younger, episodic, trigger-based. COPD = older, chronic smoker, barrel chest.' },
      { conditionId: 'anaphylaxis', how: 'Anaphylaxis also wheezes — but adds hives, swelling, and hypotension. Wheezing + hives = epi, not just albuterol.' },
    ],
    examTips: ['Silent chest in an asthmatic = pre-arrest. No wheezing because no air is moving.'],
  },

  anaphylaxis: {
    id: 'anaphylaxis',
    name: 'Anaphylaxis',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Flushed, warm, HIVES (urticaria); swelling of face/lips/tongue' },
      { phase: 'history', label: 'PASTE/SAMPLE', value: 'Exposure to known allergen (food, sting, med) minutes before' },
      { phase: 'vitals', label: 'Lung Sounds + BP', value: 'Wheezing and/or stridor + HYPOTENSION' },
    ],
    keyDiscriminator: 'Allergen exposure + hives + respiratory involvement or hypotension (2+ body systems)',
    impression: 'Anaphylaxis',
    interventions: {
      airway: 'OPA/NPA if unconscious; BVM early if airway swelling — it only gets worse',
      oxygen: 'NRB 10–15 LPM or BVM 15 LPM',
      meds: 'EPINEPHRINE IM: 0.3 mg adult / 0.15 mg pediatric (1:1,000), lateral thigh. Repeat in ~5 min if no improvement (per protocol)',
      medIds: ['epinephrine', 'oxygen'],
      medControl: 'Yes — call med control for epinephrine',
      positioning: 'Supine (legs elevated per protocol) if hypotensive; sitting up if respiratory distress dominates',
      other: 'GIVE EPI EARLY on strong suspicion — do not wait for hypotension. Ensure ALS en route',
    },
    shock: 'treat',
    shockNote: 'Distributive shock: massive vasodilation. BLOT applies — but if breathing is the bigger problem, position for breathing.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'allergic-mild', how: 'Mild reaction = hives ONLY, normal breathing, normal BP → no epi. Anaphylaxis = 2+ systems involved → epi now.' },
      { conditionId: 'asthma', how: 'Both wheeze — the hives, swelling, and allergen exposure make it anaphylaxis.' },
    ],
    examTips: ['Epi lasts ~5 minutes — be ready to re-dose and have ALS coming.'],
  },

  'allergic-mild': {
    id: 'allergic-mild',
    name: 'Mild Allergic Reaction',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Localized hives, itching, maybe mild swelling at the site' },
      { phase: 'primary', label: 'Breathing', value: 'NORMAL — no wheezing, no stridor, speaking full sentences' },
      { phase: 'vitals', label: 'BP', value: 'Normal' },
    ],
    keyDiscriminator: 'Hives ONLY — one body system, no respiratory or BP involvement',
    impression: 'Mild (local) allergic reaction',
    interventions: {
      airway: 'Monitor',
      oxygen: 'Usually not needed; give if any distress develops',
      meds: 'No epinephrine for a mild reaction',
      medIds: [],
      medControl: 'No',
      other: 'WATCH CLOSELY — mild can become anaphylaxis. Reassess constantly; be ready to escalate to epi',
    },
    shock: 'watch',
    transport: { code: 'Routine transport (upgrade if worsening)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'anaphylaxis', how: 'The moment a second body system joins (wheeze, swelling airway, hypotension, GI symptoms) it\'s anaphylaxis → epi.' },
    ],
  },

  copd: {
    id: 'copd',
    name: 'COPD Exacerbation',
    shortName: 'COPD',
    findings: [
      { phase: 'primary', label: 'General', value: 'Barrel chest, pursed-lip breathing, thin, possibly on home O2' },
      { phase: 'history', label: 'PASTE', value: 'Chronic smoker; long history of dyspnea; constant fatigue; worse over days' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'Wheezing (dry) and/or diminished sounds; chronic productive cough' },
    ],
    keyDiscriminator: 'Older chronic smoker + barrel chest + pursed lips + chronic course',
    impression: 'COPD exacerbation (emphysema / chronic bronchitis)',
    interventions: {
      airway: 'Keep patent; suction standby',
      oxygen: 'Give the O2 they need — NC or NRB by severity, BVM if failing. Do NOT withhold O2 over hypoxic-drive worries',
      meds: 'Assist with prescribed Albuterol MDI, 1–2 puffs',
      medIds: ['albuterol', 'oxygen'],
      medControl: 'Yes — call med control for albuterol (must be the patient\'s own prescribed inhaler)',
      positioning: 'Position of comfort, usually upright',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'asthma', how: 'Both wheeze and both get albuterol — age, smoking history, and chronicity separate them.' },
      { conditionId: 'chf', how: 'Older patients can have BOTH. CHF = wet (crackles, frothy sputum, orthopnea); COPD = dry wheeze.' },
    ],
  },

  chf: {
    id: 'chf',
    name: 'CHF / Pulmonary Edema',
    shortName: 'CHF',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Pale, cool, diaphoretic; severe distress, often at night (woke up gasping)' },
      { phase: 'history', label: 'PASTE', value: 'Coughing PINK FROTHY SPUTUM; orthopnea (sleeps propped on pillows); pedal edema; history of CHF/HTN' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'CRACKLES / RALES (wet), often with JVD and hypertension' },
    ],
    keyDiscriminator: 'Wet crackles + pink frothy sputum + orthopnea/pedal edema',
    impression: 'CHF with acute pulmonary edema',
    interventions: {
      airway: 'Suction REQUIRED for sputum',
      oxygen: 'NRB 10–15 LPM; CPAP per protocol; BVM 15 LPM if failing',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'SIT THEM UP, legs dependent (dangling). NEVER lay flat — you will drown them',
    },
    shock: 'exception',
    shockNote: 'THE EXCEPTION: skin looks like shock (pale/cool/diaphoretic) but laying flat worsens pulmonary edema. Upright, legs dependent. If they truly crash into cardiogenic shock (hypotensive), it becomes a judgment call — support ABCs and go.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'copd', how: 'Wet vs dry: CHF = crackles + frothy sputum; COPD = dry wheeze. Listen carefully.' },
      { conditionId: 'pneumonia', how: 'Both have crackles — pneumonia adds fever + productive (colored) sputum, usually one-sided.' },
    ],
    examTips: ['This is the #1 positioning trap: pale/cool/diaphoretic usually means "lay flat" — NOT here.'],
  },

  epiglottitis: {
    id: 'epiglottitis',
    name: 'Epiglottitis',
    findings: [
      { phase: 'primary', label: 'General', value: 'Pediatric (classically), drooling, tripod/sniffing position, looks toxic' },
      { phase: 'history', label: 'SAMPLE', value: 'SUDDEN onset (hours), HIGH fever, painful swallowing, muffled voice' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'STRIDOR (upper airway)' },
    ],
    keyDiscriminator: 'Sudden high fever + drooling + stridor + tripod',
    impression: 'Epiglottitis',
    interventions: {
      airway: 'DO NOT put ANYTHING in the mouth — no OPA/NPA, no suction, no tongue depressor. Do not agitate the child',
      oxygen: 'Humidified blow-by O2 (parent can hold it)',
      meds: 'None',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Position of comfort, usually on parent\'s lap, sitting up',
    },
    shock: 'none',
    transport: { code: 'Code 3 — calm, gentle ride', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'croup', how: 'Croup = GRADUAL onset (days), barking seal cough, low fever, worse at night. Epiglottitis = SUDDEN, high fever, drooling, no barking cough.' },
    ],
    examTips: ['Agitating the child (or instrumenting the mouth) can trigger complete airway obstruction — instant critical fail.'],
  },

  croup: {
    id: 'croup',
    name: 'Croup',
    findings: [
      { phase: 'primary', label: 'General', value: 'Pediatric, seal-bark cough, hoarse voice; worse at night' },
      { phase: 'history', label: 'SAMPLE', value: 'GRADUAL onset over days after a cold; low-grade fever' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'Stridor with the barking cough' },
    ],
    keyDiscriminator: 'Barking cough + gradual onset + low fever',
    impression: 'Croup (viral upper airway infection)',
    interventions: {
      airway: 'Keep the child calm; nothing invasive',
      oxygen: 'Humidified blow-by O2; cool night air often helps en route',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Position of comfort with parent',
    },
    shock: 'none',
    transport: { code: 'Routine or Code 3 by severity', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'epiglottitis', how: 'The classic peds airway pair — croup barks and came on slowly; epiglottitis drools and came on fast with high fever.' },
    ],
  },

  pe: {
    id: 'pe',
    name: 'Pulmonary Embolism',
    shortName: 'PE',
    findings: [
      { phase: 'primary', label: 'General', value: 'SUDDEN severe dyspnea + tachycardia; anxious, sense of doom' },
      { phase: 'history', label: 'PASTE', value: 'Sharp pleuritic chest pain; recent surgery, long travel, immobilization, pregnancy, or birth control use' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'CLEAR — the lungs sound fine but the patient is hypoxic' },
    ],
    keyDiscriminator: 'Sudden dyspnea + CLEAR lungs + clot risk factors',
    impression: 'Pulmonary embolism',
    interventions: {
      airway: 'Suction if coughing blood (hemoptysis)',
      oxygen: 'NRB 10–15 LPM mandatory — high-flow regardless',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No',
    },
    shock: 'watch',
    shockNote: 'Massive PE can cause obstructive shock and arrest — monitor closely.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'pneumothorax-spont', how: 'Both: sudden sharp chest pain + dyspnea. Pneumothorax has DIMINISHED sounds on one side; PE sounds clear.' },
      { conditionId: 'ami', how: 'Chest pain + distress — PE pain is sharp/pleuritic (worse on breathing), AMI is crushing pressure.' },
      { conditionId: 'hyperventilation', how: 'Both anxious + tachypneic with clear lungs. PE has risk factors and true hypoxia — NEVER write off dyspnea as anxiety without considering PE.' },
    ],
  },

  pneumonia: {
    id: 'pneumonia',
    name: 'Pneumonia',
    findings: [
      { phase: 'primary', label: 'General', value: 'Ill for days, febrile, weak; often elderly or bedridden' },
      { phase: 'history', label: 'PASTE', value: 'Fever + chills + productive cough (colored sputum); gradual worsening' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'Crackles or RHONCHI, often localized to one area/side' },
    ],
    keyDiscriminator: 'Fever + productive cough + localized crackles/rhonchi over days',
    impression: 'Pneumonia',
    interventions: {
      airway: 'Suction if needed for secretions',
      oxygen: 'NC or NRB by severity',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Position of comfort (usually sitting up)',
    },
    shock: 'watch',
    shockNote: 'Elderly pneumonia can progress to sepsis — hot flushed skin then hypotension. Treat shock if present.',
    transport: { code: 'Routine, or Code 3 if hypoxic/septic', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'chf', how: 'Both crackle. Pneumonia = fever + colored sputum + one-sided. CHF = pink frothy + orthopnea + edema, both sides.' },
      { conditionId: 'co-poisoning', how: '"Flu-like" symptoms — CO hits multiple people in the same building.' },
    ],
  },

  'pneumothorax-spont': {
    id: 'pneumothorax-spont',
    name: 'Spontaneous Pneumothorax',
    shortName: 'Pneumothorax',
    findings: [
      { phase: 'primary', label: 'General', value: 'SUDDEN sharp one-sided chest pain + dyspnea; classically a tall thin young male, or a COPD patient' },
      { phase: 'history', label: 'PASTE', value: 'May have started with a cough or strain — or nothing at all' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'DIMINISHED or ABSENT on ONE side' },
    ],
    keyDiscriminator: 'Sudden one-sided pain + diminished breath sounds on that side',
    impression: 'Spontaneous pneumothorax',
    interventions: {
      airway: 'Maintain',
      oxygen: 'NRB 10–15 LPM',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No — request ALS',
      other: 'Watch for TENSION pneumothorax: worsening distress, JVD, tracheal deviation (late), hypotension → needs ALS decompression',
    },
    shock: 'watch',
    shockNote: 'Tension physiology = obstructive shock. If they deteriorate, that\'s why.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'pe', how: 'Both sudden sharp pain + dyspnea — the one-sided diminished sounds are the pneumothorax giveaway.' },
    ],
  },

  pertussis: {
    id: 'pertussis',
    name: 'Pertussis (Whooping Cough)',
    shortName: 'Pertussis',
    findings: [
      { phase: 'primary', label: 'General', value: 'Violent coughing FITS — rapid-fire coughs ending in a "whooping" gasp on inspiration; may vomit after a fit' },
      { phase: 'history', label: 'SAMPLE', value: 'Pediatric or unvaccinated; sick contacts; weeks of worsening cough (the "100-day cough")' },
      { phase: 'vitals', label: 'Between fits', value: 'May look fine between fits; infants can turn cyanotic or apneic DURING fits' },
    ],
    keyDiscriminator: 'Coughing fits + inspiratory whoop + post-cough vomiting',
    impression: 'Pertussis (whooping cough)',
    interventions: {
      airway: 'Suction ready for secretions/emesis after fits',
      oxygen: 'NC/NRB by severity; blow-by for infants; be ready to ventilate an apneic infant',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No meds beyond O2',
      other: 'DROPLET PPE — mask yourself AND the patient. Highly contagious',
    },
    shock: 'none',
    transport: { code: 'Routine, or Code 3 for infant apnea/cyanosis', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'croup', how: 'Both peds coughs: croup BARKS like a seal (worse at night); pertussis comes in FITS ending in a whoop.' },
    ],
  },

  'cystic-fibrosis': {
    id: 'cystic-fibrosis',
    name: 'Cystic Fibrosis Exacerbation',
    shortName: 'Cystic Fibrosis',
    findings: [
      { phase: 'primary', label: 'General', value: 'Young patient (childhood diagnosis), chronically ill/thin, clubbed fingers' },
      { phase: 'history', label: 'SAMPLE', value: 'KNOWN CF — patient/family will tell you; thick copious mucus; frequent lung infections; daily airway-clearance therapy' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'Crackles and RHONCHI (thick mucus everywhere)' },
    ],
    keyDiscriminator: 'Known CF + thick copious secretions + young patient',
    impression: 'Cystic fibrosis exacerbation',
    interventions: {
      airway: 'SUCTION — secretions are the problem; let them cough/clear',
      oxygen: 'NC/NRB by severity; BVM if failing',
      meds: 'May assist with their own prescribed inhaler/nebulizer per protocol',
      medIds: ['albuterol', 'oxygen'],
      medControl: 'Yes — call med control (inhaler must be their own prescription)',
      positioning: 'Position of comfort, usually upright',
    },
    shock: 'none',
    transport: { code: 'Routine or Code 3 by severity', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'pneumonia', how: 'CF patients GET pneumonia constantly — the known-CF history is the differentiator, treatment is similar.' },
    ],
  },

  hyperventilation: {
    id: 'hyperventilation',
    name: 'Hyperventilation Syndrome',
    findings: [
      { phase: 'primary', label: 'General', value: 'Anxious, rapid deep breathing; often after emotional stress' },
      { phase: 'history', label: 'SAMPLE', value: 'Numbness/tingling in fingers, toes, around the mouth; carpopedal spasm (cramped hands)' },
      { phase: 'vitals', label: 'Lung Sounds', value: 'Clear; vitals otherwise unremarkable' },
    ],
    keyDiscriminator: 'Anxiety + tingling extremities/lips + carpopedal spasm + clear lungs',
    impression: 'Hyperventilation syndrome (anxiety)',
    interventions: {
      airway: 'Maintain',
      oxygen: 'Coach slow breathing. Do NOT use a paper bag. If in doubt about hypoxia, give O2 — never withhold from someone who needs it',
      meds: 'None',
      medIds: [],
      medControl: 'No',
      other: 'DIAGNOSIS OF EXCLUSION: rule out PE, DKA, and other real causes of tachypnea before settling on anxiety',
    },
    shock: 'none',
    transport: { code: 'Routine transport', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'pe', how: 'The dangerous miss — PE also presents anxious + tachypneic with clear lungs. Check risk factors.' },
      { conditionId: 'hyperglycemia-dka', how: 'Kussmaul breathing looks like hyperventilation — check BG.' },
    ],
  },

  // ============================================================
  // CARDIOVASCULAR
  // ============================================================
  'cardiac-arrest': {
    id: 'cardiac-arrest',
    name: 'Sudden Cardiac Arrest',
    shortName: 'Cardiac Arrest',
    findings: [
      { phase: 'primary', label: 'LOC / Pulse / Resp', value: 'Unresponsive + PULSELESS + apneic or agonal gasps (checked simultaneously, ≤ 10 sec)' },
      { phase: 'history', label: 'Bystanders', value: 'Witnessed sudden collapse; possibly chest pain beforehand' },
      { phase: 'vitals', label: 'AED', value: 'Rhythm analysis: shockable vs non-shockable' },
    ],
    keyDiscriminator: 'No pulse. That\'s the whole decision',
    impression: 'Sudden cardiac arrest',
    interventions: {
      airway: 'OPA + BVM 15 LPM high-flow O2; suction ready',
      oxygen: 'BVM 15 LPM with compressions (30:2)',
      meds: 'None — immediate high-quality CPR (100–120/min, 2+ inches, full recoil, minimal interruptions) + AED as soon as it arrives',
      medIds: ['oxygen'],
      medControl: 'No — follow the AED',
      other: 'Compressions start the moment pulselessness is confirmed. Clear for analysis and shock',
    },
    shock: 'none',
    transport: { code: 'Per local protocol (work on scene / Code 3 after ROSC)', destination: 'Closest ED / STEMI center per protocol' },
    confusedWith: [],
    examTips: ['Check breathing and pulse SIMULTANEOUSLY, max 10 seconds.', 'Interrupting CPR > 10 seconds is a critical fail on the AED station.'],
  },

  angina: {
    id: 'angina',
    name: 'Angina Pectoris',
    shortName: 'Angina',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Pale, cool, diaphoretic during the episode' },
      { phase: 'history', label: 'OPQRST', value: 'Crushing/pressure pain brought on by EXERTION, relieved by REST (and their nitro) within ~3–8 min' },
      { phase: 'vitals', label: 'Vitals', value: 'Relatively stable once resting' },
    ],
    keyDiscriminator: 'Exertional pain that RESOLVES with rest — known pattern for the patient',
    impression: 'Angina pectoris',
    interventions: {
      airway: 'Maintain',
      oxygen: 'NC/NRB by severity — give O2 if they need it',
      meds: 'Aspirin 81–324 mg PO chewable + assist prescribed Nitroglycerin 0.4 mg SL if systolic BP > 100 and no contraindications (ED meds 24–48 hr, head injury)',
      medIds: ['aspirin', 'nitroglycerin', 'oxygen'],
      medControl: 'Yes — call med control for aspirin & nitro (nitro must be the patient\'s own prescription)',
      positioning: 'Position of comfort, resting',
    },
    shock: 'none',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ami', how: 'Same pain, different behavior: angina resolves with rest/nitro; AMI does NOT. New/changed/unresolving pattern = treat as AMI.' },
    ],
  },

  ami: {
    id: 'ami',
    name: 'Acute Myocardial Infarction',
    shortName: 'AMI',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Pale, cool, diaphoretic; nausea; sense of doom' },
      { phase: 'history', label: 'OPQRST', value: 'Crushing pain radiating to jaw/arm/back; does NOT resolve with rest or nitro; may start at rest. Women/elderly/diabetics: may be atypical (weakness, SOB, nausea only)' },
      { phase: 'vitals', label: 'Pulse & BP', value: 'Pulse may be irregular; BP may drop (cardiogenic shock)' },
    ],
    keyDiscriminator: 'Crushing radiating pain that does NOT resolve + diaphoresis',
    impression: 'Acute myocardial infarction',
    interventions: {
      airway: 'OPA/NPA if unconscious',
      oxygen: 'NC/NRB by severity',
      meds: 'Aspirin 81–324 mg PO chewable + assist prescribed Nitroglycerin 0.4 mg SL ONLY if systolic BP > 100 and no ED meds in 24–48 hr, no head injury',
      medIds: ['aspirin', 'nitroglycerin', 'oxygen'],
      medControl: 'Yes — call med control for aspirin & nitro (nitro must be the patient\'s own prescription)',
      positioning: 'Position of comfort; supine if shocky',
    },
    shock: 'watch',
    shockNote: 'Cardiogenic shock: if BP falls, NO nitro; lay flat, high-flow O2, rapid transport.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED / STEMI center per protocol' },
    confusedWith: [
      { conditionId: 'angina', how: 'Resolves with rest = angina. Doesn\'t = AMI. When unsure, treat as AMI.' },
      { conditionId: 'dissection', how: 'TEARING pain to the BACK with BP arm-difference = dissection → NO aspirin, NO nitro.' },
    ],
    examTips: ['Ask about ED meds BEFORE assisting with nitro — it\'s a scored (and real-world lethal) step.'],
  },

  dissection: {
    id: 'dissection',
    name: 'Aortic Aneurysm / Dissection',
    shortName: 'Dissection',
    findings: [
      { phase: 'primary', label: 'Pulse RRQ', value: 'Tachycardic; pulses may differ between sides' },
      { phase: 'history', label: 'OPQRST', value: 'VERY sudden onset, maximal from the start; TEARING/ripping pain radiating straight to the BACK between shoulder blades' },
      { phase: 'vitals', label: 'BP', value: 'Significant difference between LEFT and RIGHT arms' },
    ],
    keyDiscriminator: 'Sudden tearing pain to the back + BP differential between arms',
    impression: 'Aortic aneurysm / dissection',
    interventions: {
      airway: 'Maintain',
      oxygen: 'NC or NRB as needed',
      meds: 'NONE — aspirin and nitro are CONTRAINDICATED (you\'d worsen the bleed)',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Supine if shocky; otherwise comfort. Gentle handling — no jostling',
    },
    shock: 'treat',
    shockNote: 'If it ruptures: catastrophic internal hemorrhage → full BLOT + fastest possible transport.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED (surgical capability if protocol allows)' },
    confusedWith: [
      { conditionId: 'ami', how: 'Both are severe chest pain. Dissection = tearing, to the back, sudden-maximal, arm BP difference — and it flips the med decision to NONE.' },
    ],
    examTips: ['This is why you take BP in BOTH arms on chest pain patients.'],
  },

  headache: {
    id: 'headache',
    name: 'Headache (Tension / Migraine / Sinus)',
    shortName: 'Headache',
    findings: [
      { phase: 'primary', label: 'General', value: 'Alert and oriented; may be photophobic, nauseated (migraine), or have facial pressure (sinus)' },
      { phase: 'history', label: 'OPQRST', value: 'GRADUAL onset; history of similar headaches; migraine may have aura. Tension = band-like squeeze; migraine = one-sided throbbing' },
      { phase: 'vitals', label: 'Rule-outs', value: 'BEFAST NEGATIVE, BP not critically elevated, no fever/stiff neck, normal BG' },
    ],
    keyDiscriminator: 'Normal neuro exam + normal-ish BP + history of similar headaches',
    impression: 'Primary headache (tension / migraine / sinus)',
    interventions: {
      airway: 'Maintain',
      oxygen: 'Only if indicated',
      meds: 'None at EMT level',
      medIds: [],
      medControl: 'No meds to give',
      other: 'Dim lights, quiet ride, emesis bag ready (migraine)',
    },
    shock: 'none',
    transport: { code: 'Routine transport', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'stroke', how: 'RED FLAGS that mean this is NOT a simple headache: sudden "worst headache of my life" (thunderclap = possible bleed), focal deficits, AMS, fever + stiff neck (meningitis). Any of those → treat as the serious cause.' },
      { conditionId: 'htn-emergency', how: 'Severe headache + severely elevated BP + vision changes = hypertensive emergency, not a migraine.' },
      { conditionId: 'increased-icp', how: 'Thunderclap headache + Cushing\'s triad (↑ BP, ↓ HR, irregular respirations) or blown pupil = increased ICP / intracranial emergency — not a migraine.' },
    ],
    examTips: [
      'If the headache is sudden, maximal, "worst of my life," or paired with AMS / neuro deficits / Cushing\'s signs — do not call it a migraine.',
    ],
  },

  'htn-emergency': {
    id: 'htn-emergency',
    name: 'Hypertensive Emergency',
    findings: [
      { phase: 'primary', label: 'General', value: 'Severe headache, blurred vision, possibly altered; maybe epistaxis' },
      { phase: 'history', label: 'SAMPLE', value: 'History of hypertension; ran out of / stopped BP meds' },
      { phase: 'vitals', label: 'BP', value: 'Severely elevated (systolic ≥ 180 with symptoms)' },
    ],
    keyDiscriminator: 'Extreme BP + neuro symptoms (headache, vision changes, AMS)',
    impression: 'Hypertensive emergency',
    interventions: {
      airway: 'Maintain',
      oxygen: 'NC/NRB by severity',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Calm, position of comfort, head elevated',
    },
    shock: 'none',
    transport: { code: 'Code 3 if symptomatic', destination: 'Closest ED (stroke center if neuro deficits)' },
    confusedWith: [
      { conditionId: 'stroke', how: 'Hypertensive emergency can CAUSE a stroke — run BEFAST; any focal deficit → treat as stroke.' },
      { conditionId: 'increased-icp', how: 'High BP alone ≠ Cushing\'s. Cushing\'s adds bradycardia + irregular respirations (± blown pupil). That pattern is ICP, not just a HTN emergency.' },
    ],
  },

  // ============================================================
  // ABDOMINAL / GI / GU / HEME / OB-GYN
  // ============================================================
  'ugib-ulcer': {
    id: 'ugib-ulcer',
    name: 'Upper GI Bleed (Peptic Ulcer)',
    shortName: 'UGIB (Ulcer)',
    findings: [
      { phase: 'primary', label: 'Skin & Pulse', value: 'Pale, cool, diaphoretic; rapid weak pulse' },
      { phase: 'history', label: 'SAMPLE', value: 'COFFEE-GROUND emesis or MELENA (black tarry stool); NSAID use; burning epigastric pain' },
      { phase: 'vitals', label: 'BP', value: 'Hypotension (hypovolemic shock)' },
    ],
    keyDiscriminator: 'Coffee-ground emesis / melena + shock signs + NSAID history',
    impression: 'Upper GI bleed (peptic ulcer)',
    interventions: {
      airway: 'OPA/NPA if unconscious; suction READY',
      oxygen: 'NRB 10–15 LPM for shock',
      meds: 'None. Nothing by mouth',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Supine (BLOT); recovery position if actively vomiting',
    },
    shock: 'treat',
    shockNote: 'Classic hypovolemic shock → full BLOT: lay flat, high-flow O2, keep warm, rapid transport.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ugib-varices', how: 'Ulcer bleeds "old" blood (coffee grounds); varices bleed BRIGHT RED and massively, with liver/alcohol history.' },
    ],
  },

  'ugib-varices': {
    id: 'ugib-varices',
    name: 'Upper GI Bleed (Varices / Mallory-Weiss)',
    shortName: 'UGIB (Varices)',
    findings: [
      { phase: 'primary', label: 'General', value: 'Vomiting BRIGHT RED blood (hematemesis), often large volume' },
      { phase: 'history', label: 'OPQRST/SAMPLE', value: 'Heavy alcohol use / liver disease (jaundice, ascites); or violent vomiting/coughing beforehand (Mallory-Weiss)' },
      { phase: 'vitals', label: 'BP & Pulse', value: 'Hypotension + tachycardia' },
    ],
    keyDiscriminator: 'Bright red hematemesis + liver/alcohol history',
    impression: 'Upper GI bleed (esophageal varices / Mallory-Weiss tear)',
    interventions: {
      airway: 'OPA/NPA if unconscious; AGGRESSIVE suction required — airway fills fast',
      oxygen: 'NRB 10–15 LPM for shock',
      meds: 'None',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Supine per BLOT if not vomiting; recovery position to protect airway if actively vomiting',
    },
    shock: 'treat',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ugib-ulcer', how: 'Bright red + massive + alcoholic liver disease = varices; coffee-ground + NSAIDs = ulcer.' },
    ],
  },

  lgib: {
    id: 'lgib',
    name: 'Lower GI Bleed',
    shortName: 'LGIB',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Normal or pale' },
      { phase: 'history', label: 'SAMPLE', value: 'Bright red blood per rectum (hematochezia); LLQ pain (diverticulitis) or painless (hemorrhoids, diverticulosis)' },
      { phase: 'vitals', label: 'Vitals', value: 'Usually normal; slight tachycardia if bleeding prolonged' },
    ],
    keyDiscriminator: 'Bright red rectal bleeding + otherwise stable vitals',
    impression: 'Lower GI bleed (diverticular / hemorrhoidal)',
    interventions: {
      airway: 'Maintain',
      oxygen: 'NC 1–6 LPM if needed',
      meds: 'None',
      medIds: ['oxygen'],
      medControl: 'No',
    },
    shock: 'watch',
    shockNote: 'If shock signs appear (pale/cool/diaphoretic, weak rapid pulse, hypotension): BLOT + upgrade to Code 3.',
    transport: { code: 'Routine transport (Code 3 if shock)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ugib-ulcer', how: 'Black tarry stool = upper source (digested blood); bright red = lower source.' },
    ],
  },

  appendicitis: {
    id: 'appendicitis',
    name: 'Appendicitis',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Warm, flushed (fever); patient lies still — movement hurts' },
      { phase: 'history', label: 'OPQRST', value: 'Dull pain around the navel MIGRATING to sharp localized RLQ pain; nausea, anorexia, low fever' },
      { phase: 'vitals', label: 'Palpation', value: 'Tenderness at RLQ (McBurney point); rebound tenderness' },
    ],
    keyDiscriminator: 'Periumbilical → RLQ migration of pain',
    impression: 'Appendicitis',
    interventions: {
      airway: 'Suction standby for emesis',
      oxygen: 'NC or NRB if hypoxic',
      meds: 'None. Nothing by mouth (likely surgical)',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Position of comfort (often knees drawn up)',
    },
    shock: 'watch',
    shockNote: 'Rupture → peritonitis → sepsis. Sudden relief of pain followed by rigid abdomen and fever is a BAD sign.',
    transport: { code: 'Routine, or Code 3 if rupture/shock suspected', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ectopic', how: 'In females of childbearing age, RLQ pain = ask about last period. Ectopic kills faster.' },
      { conditionId: 'peritonitis', how: 'Ruptured appendix IS one cause of peritonitis — the pain generalizes and the belly goes rigid.' },
    ],
  },

  cholecystitis: {
    id: 'cholecystitis',
    name: 'Cholecystitis',
    findings: [
      { phase: 'primary', label: 'Skin', value: 'Normal or warm' },
      { phase: 'history', label: 'SAMPLE', value: 'Pain shortly after a heavy/fatty meal; belching, bloating, nausea' },
      { phase: 'vitals', label: 'Palpation', value: 'RUQ tenderness radiating to the RIGHT SHOULDER / scapula' },
    ],
    keyDiscriminator: 'RUQ pain after fatty food, radiating to right shoulder',
    impression: 'Cholecystitis (gallbladder)',
    interventions: {
      airway: 'Suction standby for emesis',
      oxygen: 'NC if hypoxic',
      meds: 'None. Nothing by mouth',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Position of comfort',
    },
    shock: 'none',
    transport: { code: 'Routine transport', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ami', how: 'RUQ/epigastric pain can be an atypical MI (especially in women/diabetics). If anything feels cardiac, treat it as cardiac.' },
    ],
  },

  ectopic: {
    id: 'ectopic',
    name: 'Ectopic Pregnancy / Spontaneous Abortion',
    shortName: 'Ectopic',
    findings: [
      { phase: 'primary', label: 'Skin & Pulse', value: 'Pale, cool, diaphoretic; rapid weak pulse' },
      { phase: 'history', label: 'SAMPLE', value: 'Female of childbearing age; MISSED PERIOD; vaginal bleeding; sudden one-sided lower abdominal pain' },
      { phase: 'vitals', label: 'BP + Palpation', value: 'Hypotension; unilateral lower quadrant tenderness' },
    ],
    keyDiscriminator: 'Childbearing age + missed period + lower abd pain + shock',
    impression: 'Ectopic pregnancy (until proven otherwise)',
    interventions: {
      airway: 'OPA/NPA if unconscious',
      oxygen: 'NRB 10–15 LPM for shock',
      meds: 'None. Nothing by mouth',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Supine (BLOT); keep warm',
    },
    shock: 'treat',
    shockNote: 'Internal hemorrhage you cannot control — BLOT + speed is the treatment.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'appendicitis', how: 'Both cause lower quadrant pain — ALWAYS ask about last menstrual period in females of childbearing age.' },
      { conditionId: 'pid', how: 'PID is gradual with fever and discharge; ectopic is sudden with missed period and shock.' },
    ],
    examTips: ['Any female of childbearing age + abdominal pain + syncope/shock = ectopic until proven otherwise.'],
  },

  'kidney-stone': {
    id: 'kidney-stone',
    name: 'Kidney Stone',
    findings: [
      { phase: 'primary', label: 'General', value: 'Writhing in pain, CANNOT hold still (opposite of peritonitis)' },
      { phase: 'history', label: 'OPQRST', value: 'Severe colicky FLANK pain radiating to the GROIN; comes in waves; possible blood in urine; prior stones' },
      { phase: 'vitals', label: 'Vitals', value: 'Tachycardia and hypertension from pain; no fever unless infected' },
    ],
    keyDiscriminator: 'Flank-to-groin colicky pain + patient who can\'t sit still',
    impression: 'Kidney stone (renal colic)',
    interventions: {
      airway: 'Suction standby for emesis',
      oxygen: 'Usually not needed; give if indicated',
      meds: 'None at EMT level',
      medIds: [],
      medControl: 'No',
      positioning: 'Position of comfort (they will keep moving)',
    },
    shock: 'none',
    transport: { code: 'Routine transport', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'dissection', how: 'An aortic aneurysm can masquerade as flank pain in older patients — check for the sudden tearing quality and BP differences.' },
      { conditionId: 'peritonitis', how: 'Movement is the tell: stone patients writhe; peritonitis patients lie perfectly still.' },
    ],
  },

  peritonitis: {
    id: 'peritonitis',
    name: 'Peritonitis',
    findings: [
      { phase: 'primary', label: 'General', value: 'Lies PERFECTLY STILL, knees drawn up — any movement hurts; looks sick' },
      { phase: 'history', label: 'SAMPLE', value: 'Preceding abdominal problem (appendicitis, ulcer, diverticulitis); fever; worsening diffuse pain' },
      { phase: 'vitals', label: 'Palpation', value: 'RIGID, board-like abdomen; rebound tenderness; guarding' },
    ],
    keyDiscriminator: 'Rigid board-like abdomen + patient lying motionless',
    impression: 'Peritonitis',
    interventions: {
      airway: 'Suction standby for emesis',
      oxygen: 'NRB 10–15 LPM if shock signs',
      meds: 'None. Nothing by mouth',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Position of comfort (usually supine, knees flexed); supine flat if shock',
    },
    shock: 'watch',
    shockNote: 'Progresses to septic shock — warm flushed skin early, then pale/hypotensive late. BLOT when it appears.',
    transport: { code: 'Code 3 (Load and go)', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'kidney-stone', how: 'Motionless vs writhing — the patient\'s behavior on the stretcher is diagnostic.' },
      { conditionId: 'appendicitis', how: 'Localized RLQ = appendicitis; generalized rigidity = it may have ruptured into peritonitis.' },
    ],
  },

  dialysis: {
    id: 'dialysis',
    name: 'Dialysis Complications',
    findings: [
      { phase: 'primary', label: 'General', value: 'Renal failure patient; fistula/graft in arm or dialysis catheter' },
      { phase: 'history', label: 'SAMPLE', value: 'MISSED dialysis → weakness, dyspnea, fluid overload. JUST HAD dialysis → hypotension, dizziness. Or bleeding from the access site' },
      { phase: 'vitals', label: 'Vitals', value: 'Crackles if fluid overloaded; hypotension post-dialysis. NEVER take BP on the fistula arm' },
    ],
    keyDiscriminator: 'Dialysis history + timing relative to last session',
    impression: 'Dialysis-related emergency (fluid overload / hypotension / access bleed)',
    interventions: {
      airway: 'Suction if pulmonary edema',
      oxygen: 'NRB 10–15 LPM if fluid overloaded / dyspneic',
      meds: 'None. Access-site bleeding: firm direct pressure',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Fluid overload: upright. Post-dialysis hypotension: supine',
    },
    shock: 'watch',
    shockNote: 'Missed dialysis also risks hyperkalemia → sudden cardiac arrest. Be AED-ready.',
    transport: { code: 'Code 3 if unstable', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'chf', how: 'Fluid-overloaded dialysis patients look exactly like CHF (crackles, dyspnea) — same positioning: sit them up.' },
    ],
  },

  'sickle-cell': {
    id: 'sickle-cell',
    name: 'Sickle Cell Crisis',
    findings: [
      { phase: 'primary', label: 'General', value: 'Severe diffuse pain — joints, back, chest, abdomen; patient KNOWS their disease' },
      { phase: 'history', label: 'SAMPLE', value: 'Known sickle cell disease; trigger: dehydration, cold, infection, stress' },
      { phase: 'vitals', label: 'Red flags', value: 'Chest pain + dyspnea + fever = ACUTE CHEST SYNDROME (life threat). Also watch for stroke signs' },
    ],
    keyDiscriminator: 'Known sickle cell + diffuse severe pain crisis',
    impression: 'Sickle cell (vaso-occlusive) crisis',
    interventions: {
      airway: 'Maintain',
      oxygen: 'NRB 10–15 LPM — oxygen helps stop sickling',
      meds: 'None at EMT level',
      medIds: ['oxygen'],
      medControl: 'No',
      positioning: 'Comfort; keep warm',
    },
    shock: 'none',
    transport: { code: 'Code 3 if chest syndrome / neuro signs; otherwise routine-prompt', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ami', how: 'Sickle chest crisis vs cardiac chest pain — in a known sickler, treat the crisis but don\'t dismiss cardiac.' },
    ],
  },

  'clotting-disorder': {
    id: 'clotting-disorder',
    name: 'Clotting Disorder / Anticoagulant Bleed',
    shortName: 'Clotting Disorder',
    findings: [
      { phase: 'primary', label: 'General', value: 'Bleeding OUT OF PROPORTION to the injury — won\'t stop with normal pressure; extensive bruising; possible joint swelling (hemophilia)' },
      { phase: 'history', label: 'SAMPLE', value: 'Hemophilia, or blood thinners (warfarin/Coumadin, Eliquis, Xarelto, Plavix); even minor trauma matters — especially head strikes' },
      { phase: 'vitals', label: 'Trend', value: 'Watch for progressive shock signs; internal bleeds (GI, head) may show nothing early' },
    ],
    keyDiscriminator: 'Bleeding/bruising out of proportion + anticoagulant or hemophilia history',
    impression: 'Bleeding complication of clotting disorder / anticoagulant use',
    interventions: {
      airway: 'Maintain; suction if GI bleeding',
      oxygen: 'NRB 10–15 LPM if shock signs',
      meds: 'None. Sustained direct pressure on external bleeding — it will take longer than normal to stop',
      medIds: ['oxygen'],
      medControl: 'No meds beyond O2',
      other: 'ANY head injury on blood thinners = high-priority transport even if they look fine',
    },
    shock: 'watch',
    shockNote: 'These patients can quietly bleed into shock. Reassess q5 min; BLOT the moment shock signs appear.',
    transport: { code: 'Code 3 if significant bleed or head injury; otherwise prompt', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ugib-ulcer', how: 'A GI bleed on blood thinners is both conditions at once — treat the shock, report the med list.' },
    ],
  },

  'sexual-assault': {
    id: 'sexual-assault',
    name: 'Sexual Assault',
    findings: [
      { phase: 'primary', label: 'General', value: 'Emotional distress; possible physical injuries — treat life threats first like any other patient' },
      { phase: 'history', label: 'SAMPLE', value: 'Limit questions to what you medically need. Do not press for details of the assault' },
      { phase: 'vitals', label: 'Assess', value: 'Injuries may be hidden — assess and manage bleeding/trauma found' },
    ],
    keyDiscriminator: 'Disclosed or suspected assault — care is medical + emotional + evidentiary',
    impression: 'Sexual assault (with any associated injuries)',
    interventions: {
      airway: 'Per injuries',
      oxygen: 'Per injuries',
      meds: 'None specific',
      medIds: [],
      medControl: 'No meds to give',
      other: 'EMOTIONAL SUPPORT is the intervention: same-gender provider when possible, one calm caregiver, patient consent for every step. PRESERVE EVIDENCE: discourage bathing, changing clothes, eating/drinking; bring clothing in a paper bag if removed; disturb the scene as little as possible. Police per protocol',
    },
    shock: 'watch',
    shockNote: 'Treat any significant bleeding/trauma per BLOT like any other patient.',
    transport: { code: 'Routine unless injuries dictate otherwise', destination: 'Closest ED (SANE-capable facility if protocol directs)' },
    confusedWith: [],
    examTips: ['Your job: treat injuries, protect evidence, support the patient. Not to investigate.'],
  },

  pid: {
    id: 'pid',
    name: 'PID / Gynecologic Infection',
    shortName: 'PID',
    findings: [
      { phase: 'primary', label: 'General', value: 'Female, ill-appearing, walking bent forward with a shuffling gait' },
      { phase: 'history', label: 'SAMPLE', value: 'GRADUAL lower abdominal pain, fever, foul vaginal discharge; pain worse with walking' },
      { phase: 'vitals', label: 'Palpation', value: 'Bilateral lower quadrant tenderness' },
    ],
    keyDiscriminator: 'Gradual bilateral lower abd pain + fever + discharge ("PID shuffle")',
    impression: 'Pelvic inflammatory disease',
    interventions: {
      airway: 'Maintain',
      oxygen: 'Usually not needed',
      meds: 'None',
      medIds: [],
      medControl: 'No',
      positioning: 'Position of comfort',
    },
    shock: 'none',
    transport: { code: 'Routine transport', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ectopic', how: 'RULE OUT ECTOPIC FIRST: sudden + missed period + shock = ectopic; gradual + fever + discharge = PID.' },
      { conditionId: 'appendicitis', how: 'RLQ overlap — PID is typically bilateral and gradual.' },
    ],
  },

  // ============================================================
  // TOXICOLOGY (beyond the OD trio above)
  // ============================================================
  'ingested-poison': {
    id: 'ingested-poison',
    name: 'Ingested Poison (General)',
    findings: [
      { phase: 'primary', label: 'Scene', value: 'Pill bottles, chemical containers, plants; child or intentional ingestion' },
      { phase: 'history', label: 'SAMPLE', value: 'WHAT was taken, HOW MUCH, WHEN — bring containers to the ED. Contact Poison Control (1-800-222-1222)' },
      { phase: 'vitals', label: 'Presentation', value: 'Varies wildly by substance — burns around the mouth suggest caustics' },
    ],
    keyDiscriminator: 'Known/suspected ingestion — identify substance, amount, time',
    impression: 'Poisoning by ingestion',
    interventions: {
      airway: 'Suction ready; airway adjuncts if LOC drops',
      oxygen: 'By severity',
      meds: 'Activated Charcoal 1 g/kg PO — ONLY per med control, ONLY if alert, NOT for caustics/corrosives/petroleum. (Many systems no longer carry it)',
      medIds: ['activated-charcoal', 'oxygen'],
      medControl: 'Yes — call med control for activated charcoal (required)',
      other: 'Do NOT induce vomiting. Nothing else by mouth',
    },
    shock: 'none',
    transport: { code: 'Code 3 if symptomatic', destination: 'Closest ED (with the containers)' },
    confusedWith: [
      { conditionId: 'opioid-od', how: 'If the toxidrome fits opioids (pinpoint, hypoventilation), go down that branch — naloxone exists; charcoal is for other oral poisons.' },
    ],
  },

  organophosphate: {
    id: 'organophosphate',
    name: 'Organophosphate / Nerve Agent',
    shortName: 'Organophosphate',
    findings: [
      { phase: 'primary', label: 'Scene', value: 'Farm/pesticide exposure, or nerve agent; patient soaked in secretions' },
      { phase: 'history', label: 'DUMBELS', value: 'Defecation, Urination, Miosis, Bradycardia/Bronchorrhea/Bronchospasm, Emesis, Lacrimation, Salivation — "leaking from everywhere"' },
      { phase: 'vitals', label: 'Pupils + Pulse', value: 'Pinpoint pupils + BRADYcardia (vs opioid: pinpoint but no mass secretions)' },
    ],
    keyDiscriminator: 'DUMBELS cholinergic toxidrome + exposure scene',
    impression: 'Organophosphate / cholinergic poisoning',
    interventions: {
      airway: 'AGGRESSIVE suction (bronchorrhea drowns them); OPA/NPA as needed',
      oxygen: 'BVM 15 LPM / NRB — support ventilation',
      meds: 'None at EMT level (ALS: atropine / DuoDote). Request ALS immediately',
      medIds: ['oxygen'],
      medControl: 'No',
      other: 'DECON FIRST — remove clothing, avoid contaminating yourself and the rig. Scene safety is the first test point',
    },
    shock: 'none',
    transport: { code: 'Code 3 after decon', destination: 'Closest ED (notify ahead — contamination)' },
    confusedWith: [
      { conditionId: 'opioid-od', how: 'Both have pinpoint pupils — organophosphate adds the flood of secretions and bradycardia.' },
    ],
  },

  'absorbed-poison': {
    id: 'absorbed-poison',
    name: 'Absorbed Poison (Skin Exposure)',
    findings: [
      { phase: 'primary', label: 'Scene', value: 'Chemical spill on skin/clothes; burns, irritation, redness at contact site' },
      { phase: 'history', label: 'SAMPLE', value: 'What chemical, how long ago; SDS sheet if industrial' },
      { phase: 'vitals', label: 'Presentation', value: 'Local burns/blisters ± systemic effects depending on agent' },
    ],
    keyDiscriminator: 'Chemical contact with skin',
    impression: 'Absorbed (dermal) poisoning',
    interventions: {
      airway: 'Maintain; watch for inhaled component',
      oxygen: 'By severity',
      meds: 'None. BRUSH OFF dry powder FIRST, then flush with copious water ~20 min; remove contaminated clothing/jewelry',
      medIds: ['oxygen'],
      medControl: 'No',
      other: 'Protect yourself — gloves/gown; don\'t touch the agent',
    },
    shock: 'none',
    transport: { code: 'Per severity', destination: 'Closest ED' },
    confusedWith: [],
  },

  // ============================================================
  // BEHAVIORAL
  // ============================================================
  psychosis: {
    id: 'psychosis',
    name: 'Acute Psychosis',
    findings: [
      { phase: 'primary', label: 'General', value: 'Hallucinations, delusions, disorganized speech; may be calm or agitated' },
      { phase: 'history', label: 'SAMPLE', value: 'Psychiatric history (schizophrenia, bipolar); stopped taking meds; no drug/medical cause found' },
      { phase: 'vitals', label: 'Rule-outs', value: 'CHECK BG, SpO2/hypoxia, drugs — medical mimics first. Normal vitals support psychiatric cause' },
    ],
    keyDiscriminator: 'Psychiatric history + off meds + medical causes ruled out',
    impression: 'Acute psychotic episode',
    interventions: {
      airway: 'N/A unless sedated/altered',
      oxygen: 'Only if hypoxic',
      meds: 'None at EMT level',
      medIds: [],
      medControl: 'No. Police if any threat to you or the patient',
      other: 'Calm, low voice; one person talks; don\'t argue with or feed the delusions; keep your exit clear',
    },
    shock: 'none',
    transport: { code: 'Routine (Code per agitation/safety)', destination: 'Closest ED (behavioral-capable if protocol)' },
    confusedWith: [
      { conditionId: 'sympathomimetic-od', how: 'Drug-induced paranoia mimics psychosis — dilated pupils, tachycardia, sweating point to drugs.' },
      { conditionId: 'hypoglycemia', how: 'Bizarre behavior + diaphoresis in a diabetic is sugar, not psych. Check BG.' },
    ],
  },

  'excited-delirium': {
    id: 'excited-delirium',
    name: 'Agitated / Excited Delirium',
    shortName: 'Excited Delirium',
    findings: [
      { phase: 'primary', label: 'General', value: 'EXTREME agitation, screaming/incoherent, "superhuman strength," clothes off (hyperthermia)' },
      { phase: 'history', label: 'SAMPLE', value: 'Often stimulant use (meth/cocaine) or psych history; bystanders describe sudden violent behavior' },
      { phase: 'vitals', label: 'Vitals', value: 'HOT skin, extreme tachycardia — a true medical emergency, high mortality' },
    ],
    keyDiscriminator: 'Extreme agitation + hyperthermia + incoherence',
    impression: 'Agitated (excited) delirium',
    interventions: {
      airway: 'Monitor closely — sudden cardiac arrest is the feared outcome',
      oxygen: 'High-flow when feasible',
      meds: 'None at EMT level (ALS sedation). POLICE + ALS both needed',
      medIds: ['oxygen'],
      medControl: 'No',
      other: 'NEVER restrain prone (positional asphyxia kills). Supine or lateral only. Passive cooling. Continuous monitoring',
    },
    shock: 'none',
    transport: { code: 'Code 3 with ALS', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'sympathomimetic-od', how: 'Often the same drug — excited delirium is the extreme, hyperthermic, high-mortality end of the spectrum.' },
    ],
    examTips: ['If restrained: never prone, never hobble-tied, constant airway/breathing monitoring.'],
  },

  'suicide-risk': {
    id: 'suicide-risk',
    name: 'Suicide Risk',
    findings: [
      { phase: 'primary', label: 'General', value: 'Statements of hopelessness or intent; may have already self-harmed or ingested something' },
      { phase: 'history', label: 'SAMPLE', value: 'Ask DIRECTLY: "Are you thinking of hurting or killing yourself?" Do they have a PLAN and the MEANS? Prior attempts?' },
      { phase: 'vitals', label: 'Also assess', value: 'Any co-existing OD/injury — treat the medical problem too' },
    ],
    keyDiscriminator: 'Expressed intent — plan + means = highest risk',
    impression: 'Suicide risk / self-harm emergency',
    interventions: {
      airway: 'Per any co-existing medical problem',
      oxygen: 'Per any co-existing medical problem',
      meds: 'None (unless treating a co-ingestion — see poisoning funnel)',
      medIds: [],
      medControl: 'No. Police for safety / involuntary hold per local law',
      other: 'NEVER leave the patient alone. Remove means if safe. Listen without judgment. Scene safety: suicidal can become homicidal',
    },
    shock: 'none',
    transport: { code: 'Transport is REQUIRED — routine unless medical emergency', destination: 'Closest ED' },
    confusedWith: [
      { conditionId: 'ingested-poison', how: 'Always ask what they took — intentional ingestion turns this into a poisoning call too.' },
    ],
  },
};

export const CONDITION_LIST = Object.values(CONDITIONS);
