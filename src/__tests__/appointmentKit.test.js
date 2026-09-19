/**
 * Appointment Prep Kit builder: ranking, tailored content and the
 * educational-only wording rules.
 */

import { describe, it, expect } from 'vitest';
import { buildAppointmentKit } from '../utils/appointmentKit';
import { TOPICS, EXTRA_TOPICS } from '../utils/appointmentKitTopics';

const S = 'endoguard.steps.symptoms';

// The profile from the first real test purchase.
const reported = {
  age: 32,
  biologicalSex: 'female',
  menstrualStatus: 'regular',
  sleepQuality: 'poor',
  stressLevel: 7,
  exerciseFrequency: 'occasional',
  dietQuality: 'fair',
  symptomDuration: '3_6_months',
  plasticUseFrequency: 'high',
  processedFoodFrequency: 'daily',
  symptomKeys: [
    `${S}.thyroid.fatigue`, `${S}.thyroid.weightChange`, `${S}.thyroid.drySkin`,
    `${S}.reproductive.female.lowLibido`, `${S}.reproductive.female.vaginalDryness`, `${S}.reproductive.female.fertility`,
    `${S}.adrenal.stress`, `${S}.adrenal.moodSwings`,
    `${S}.metabolic.bellyFat`, `${S}.metabolic.weightLoss`,
  ],
};

describe('buildAppointmentKit', () => {
  for (const lang of ['en', 'es']) {
    it(`builds a full kit in ${lang}`, () => {
      const kit = buildAppointmentKit({ reported }, lang);
      expect(kit.raiseFirst).toHaveLength(5);
      // Each ranked item has its own title (no repeated generic heading).
      expect(new Set(kit.raiseFirst.map((x) => x.title)).size).toBe(5);
      // Fertility is not buried under longer lists of milder symptoms.
      expect(kit.raiseFirst[0].id).toBe('fertility');
      expect(kit.opener).toMatch(/_{5,}/);
      expect(kit.tests.length).toBeGreaterThanOrEqual(3);
      expect(kit.understanding.every((u) => u.source?.url?.startsWith('https://'))).toBe(true);
      expect(kit.logSymptoms).toHaveLength(2);
      expect(kit.showsPeriodColumn).toBe(true);
      // PDF uses Helvetica (Latin-1 only).
      const text = JSON.stringify(kit);
      expect([...text].every((ch) => ch.charCodeAt(0) <= 255 || '’“”—–'.includes(ch))).toBe(true);
    });
  }

  it('ranks perimenopause for a 46-year-old with hot flashes', () => {
    const kit = buildAppointmentKit({
      reported: {
        age: 46, biologicalSex: 'female', menstrualStatus: 'irregular', symptomDuration: '6_12_months',
        symptomKeys: [`${S}.reproductive.female.hotFlashes`, `${S}.reproductive.female.irregularCycles`],
      },
    }, 'en');
    const ids = kit.raiseFirst.map((x) => x.id);
    expect(ids).toContain('perimenopause');
    expect(ids).not.toContain('irregular');
  });

  it('puts pregnancy first', () => {
    const kit = buildAppointmentKit({ reported: { ...reported, menstrualStatus: 'pregnant' } }, 'en');
    expect(kit.raiseFirst[0].title).toBe('I am pregnant');
    expect(kit.showsPeriodColumn).toBe(false);
  });
});

describe('topic content stays educational', () => {
  const all = [...TOPICS.flatMap((t) => [t.en, t.es]), ...Object.values(EXTRA_TOPICS).flatMap((t) => [t.en, t.es])];
  it('never tells the reader they have a condition or should take something', () => {
    for (const c of all) {
      const text = `${c.title} ${c.why} ${c.test || ''}`;
      expect(text).not.toMatch(/\byou have\b|\byou should take\b|\bsupplement\b|\btienes (hipo|sop|diabetes)/i);
    }
  });
  it('phrases every test as a question', () => {
    for (const c of all) if (c.test) expect(c.test.trim()).toMatch(/\?$/);
  });
});

describe('endocrine-disrupting chemicals', () => {
  it('appear in every kit with the Endocrine Society source', () => {
    for (const lang of ['en', 'es']) {
      const kit = buildAppointmentKit({ reported: { age: 40, biologicalSex: 'female', symptomKeys: [] } }, lang);
      const edc = kit.understanding.find((u) => u.source.url.includes('endocrine.org'));
      expect(edc).toBeTruthy();
      expect(edc.more.url).toContain('niehs.nih.gov');
      expect(kit.glossary.map((g) => g.term)).toContain(lang === 'es' ? 'EDC' : 'EDCs');
    }
  });
});
