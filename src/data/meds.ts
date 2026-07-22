import type { Med } from './types';

export const NINE_RIGHTS: { right: string; question: string }[] = [
  { right: 'Right Patient', question: 'Ensure that the patient who needs the medication is the person who receives the medication.' },
  { right: 'Right Medication and Indication', question: 'Verify the proper medication and prescription.' },
  { right: 'Right Dose', question: 'Verify the form and dose of the medication.' },
  { right: 'Right Route', question: 'Verify the route of the medication.' },
  { right: 'Right Time', question: 'Check the expiration date and condition of the medication.' },
  { right: 'Right Education', question: 'Inform the patient of the medication you intend to administer, including any likely adverse effects or unusual sensations they may experience.' },
  { right: 'Right to Refuse', question: 'Patients with decision-making capacity can decline or refuse proposed interventions or medications.' },
  { right: 'Right Response and Evaluation', question: 'Monitor vital signs, mental status, perfusion, and respiratory effort after administration. Assess for the anticipated response and observe for adverse effects.' },
  { right: 'Right Documentation', question: 'Document your actions and the patient\'s response.' },
];

/** Instructor rule for med control. */
export const MED_CONTROL_RULE =
  'Call med control before administering ANYTHING except oxygen and oral glucose (for glucose you can still call to be safe). Albuterol and nitroglycerin must additionally be the patient\'s own prescription — the EMT assists.';

export const MEDS: Record<string, Med> = {
  'activated-charcoal': {
    id: 'activated-charcoal',
    name: 'Activated Charcoal',
    indication: 'Most oral poisonings; overdose.',
    skinSigns: 'Varies wildly by poison — could be sweaty or dry.',
    contraindications: [
      'Decreased LOC',
      'OD on corrosives, caustics, or petroleum substances',
      'Not carried or used in many EMS systems today',
    ],
    routeDose: 'PO / 1 g/kg',
    adminConcerns: [
      'Stains — protect patient and provider clothing',
      'Do not give anything else PO',
    ],
    sideEffects: 'Nausea, vomiting, constipation, black stools.',
  },
  aspirin: {
    id: 'aspirin',
    name: 'Aspirin',
    indication: 'Chest pain of cardiac origin.',
    skinSigns: 'Pale, cool, diaphoretic/sweaty.',
    contraindications: [
      'Allergy',
      'Recent bleeding',
      'Unable to swallow',
      'Suspected aortic dissection (tearing pain to back, BP arm difference)',
    ],
    routeDose: 'PO (chewable) / 81–324 mg (1–4 tablets)',
    adminConcerns: ['Patient must be able to chew the tablets'],
    sideEffects: 'Nausea, vomiting, stomach pain, bleeding, allergic reactions.',
  },
  albuterol: {
    id: 'albuterol',
    name: 'Albuterol Inhaler (MDI)',
    indication: 'Asthma; difficulty breathing with wheezing.',
    skinSigns: 'Normal, or cyanotic/blue around lips if severe.',
    contraindications: ['Allergy', 'Chest pain of cardiac origin'],
    routeDose: 'Inhalation / 1–2 inhalations; wait 5 min before repeating',
    adminConcerns: [
      'Patient must inhale all medication in one breath',
      'Patient must have a prescribed inhaler if assisting with a patient medication',
    ],
    sideEffects: 'Hypertension, tachycardia, anxiety, restlessness.',
    earlyAdmin: 'May assist early on strong suspicion of an asthma attack (wheezing + known asthmatic with their inhaler).',
  },
  epinephrine: {
    id: 'epinephrine',
    name: 'Epinephrine',
    brandNote: 'EpiPen®, 1:1,000 concentration',
    indication: 'Anaphylaxis.',
    skinSigns: 'Flushed/red, warm, urticaria/hives, swelling.',
    contraindications: ['Chest pain of cardiac origin'],
    routeDose: 'IM (lateral thigh) / 0.3 mg Adult; 0.15 mg Pediatric',
    adminConcerns: [
      'Medication lasts approximately 5 minutes — be ready to repeat per protocol',
      'Ensure ALS is en route',
      'Check expiration date and solution clarity if possible',
    ],
    sideEffects: 'Hypertension, tachycardia, anxiety, restlessness.',
    earlyAdmin: 'GIVE EARLY on strong suspicion of anaphylaxis (allergen + hives + any second system). Do not wait for hypotension.',
  },
  naloxone: {
    id: 'naloxone',
    name: 'Naloxone',
    brandNote: 'Narcan®',
    indication: 'Opioid overdose.',
    skinSigns: 'Cyanotic/blue, pale; pinpoint pupils.',
    contraindications: ['No significant contraindications in a life-threatening opioid overdose'],
    routeDose: 'IN / 2–4 mg',
    adminConcerns: [
      'Ventilate FIRST — fix the hypoxia, then reverse the drug',
      'Patient may wake up combative and may have projectile vomiting',
    ],
    sideEffects: 'Nausea, vomiting (acute withdrawal).',
    earlyAdmin: 'May administer early on strong suspicion of opioid OD (pinpoint pupils + hypoventilation + drug evidence).',
  },
  nitroglycerin: {
    id: 'nitroglycerin',
    name: 'Nitroglycerin',
    indication: 'Chest pain of cardiac origin.',
    skinSigns: 'Pale, cool, diaphoretic.',
    contraindications: [
      'Hypotension (systolic BP < 100)',
      'Erectile dysfunction meds (Viagra®, Cialis®, Levitra®) within the last 24–48 hours depending on the medication',
      'Head injury',
      'Suspected aortic dissection',
    ],
    routeDose: 'SL tablet or spray / 0.4 mg (1 tablet or 1 spray)',
    adminConcerns: [
      'Must be the patient\'s own prescription (EMT assists)',
      'Recheck BP before and after every dose',
      'Ensure ALS is en route',
    ],
    sideEffects: 'Headache, hypotension, nausea.',
  },
  'oral-glucose': {
    id: 'oral-glucose',
    name: 'Oral Glucose',
    indication: 'Hypoglycemia (BG < 70 mg/dL; normal 70–120).',
    skinSigns: 'Pale, cool, diaphoretic.',
    contraindications: ['Decreased LOC / unable to protect airway', 'Nausea, vomiting'],
    routeDose: 'PO / 1 tube (15 g of glucose)',
    adminConcerns: ['Patient must be awake and able to maintain their own airway'],
    sideEffects: 'Nausea, vomiting.',
    earlyAdmin: 'May administer early on strong suspicion (known diabetic, altered, able to swallow) — don\'t wait on a glucometer if the picture is obvious and they can protect their airway.',
  },
  oxygen: {
    id: 'oxygen',
    name: 'Oxygen',
    indication: 'Hypoxia or suspected hypoxia. NEVER withhold O2 from a patient who needs it.',
    skinSigns: 'Cyanosis, pale.',
    contraindications: ['Do not use near open flame'],
    routeDose: 'Inhalation — pick the device by severity: Nasal cannula 1–6 LPM (mild) · Non-rebreather 10–15 LPM (severe) · BVM 15 LPM (apneic/hypoventilating) · Humidified blow-by (peds upper airway)',
    adminConcerns: ['Do not withhold oxygen from a hypoxic patient (hypoxic drive is not your problem in the field)'],
    sideEffects: 'None expected when used appropriately.',
  },
};

export const MED_LIST = Object.values(MEDS);
