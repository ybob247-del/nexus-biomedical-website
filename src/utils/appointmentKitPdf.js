/**
 * Appointment Prep Kit as a printable PDF, built in the browser with jsPDF.
 *
 * Layout:
 *   1. The one-page summary for the clinician (about me, what I've been
 *      noticing, the five things to raise first, medications if listed).
 *   2. For the visit: the 30-second opener, questions to ask, and tests people
 *      commonly ask about, with tick boxes.
 *   3. Why these are worth raising, each with its source, and a short glossary.
 *   4. What to bring, what to say if rushed, and when not to wait; then
 *      exposures, conditions and medications, and notes from the appointment.
 *   5. A two-week log to fill in before the visit, on its own last page.
 *
 * Only the built-in Helvetica font is used, so text must stay within
 * Latin-1: accented Spanish is fine, emoji are not.
 */

import jsPDF from 'jspdf';
import { buildAppointmentKit } from './appointmentKit';

const TEAL = [31, 92, 90];
const TEAL_SOFT = [227, 240, 237];
const CORAL = [196, 71, 47];
const CORAL_SOFT = [250, 236, 231];
const INK = [28, 34, 48];
const INK_2 = [74, 81, 96];
const RULE = [221, 213, 204];

export function exportAppointmentKitPDF(results, language) {
  const kit = buildAppointmentKit(results, language);
  const c = kit.copy;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 18;
  const CW = W - M * 2;
  const BOTTOM = H - 18;
  let y = 0;

  const setColor = (rgb) => pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
  const font = (style, size, color = INK) => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(size);
    setColor(color);
  };
  const lineH = (size) => size * 0.42;

  const footer = () => {
    pdf.setDrawColor(RULE[0], RULE[1], RULE[2]);
    pdf.setLineWidth(0.2);
    pdf.line(M, H - 13, W - M, H - 13);
    font('normal', 8, INK_2);
    pdf.text(c.footer, M, H - 8.5);
  };

  const newPage = () => {
    footer();
    pdf.addPage();
    y = M;
  };

  const ensure = (needed) => {
    if (y + needed > BOTTOM) newPage();
  };

  const paragraph = (text, size = 10.5, color = INK_2, style = 'normal', indent = 0) => {
    font(style, size, color);
    const lines = pdf.splitTextToSize(String(text), CW - indent);
    for (const line of lines) {
      ensure(lineH(size) + 1);
      font(style, size, color);
      pdf.text(line, M + indent, y);
      y += lineH(size) + 0.8;
    }
  };

  const sectionTitle = (text, keepWith = 18) => {
    ensure(keepWith);
    y += 4;
    font('bold', 13.5, TEAL);
    pdf.text(text, M, y);
    y += 2.2;
    pdf.setDrawColor(TEAL[0], TEAL[1], TEAL[2]);
    pdf.setLineWidth(0.5);
    pdf.line(M, y, M + 22, y);
    pdf.setLineWidth(0.2);
    y += 6;
  };

  const tickList = (items) => {
    for (const q of items) {
      font('normal', 10.5, INK);
      const lines = pdf.splitTextToSize(q, CW - 10);
      ensure(lines.length * 5 + 4);
      pdf.setDrawColor(CORAL[0], CORAL[1], CORAL[2]);
      pdf.setLineWidth(0.4);
      pdf.rect(M, y - 3.4, 4, 4);
      pdf.setLineWidth(0.2);
      font('normal', 10.5, INK);
      for (const line of lines) {
        pdf.text(line, M + 8, y);
        y += 4.8;
      }
      y += 1.6;
    }
  };

  const bulletList = (items, size = 10, color = INK_2) => {
    for (const item of items) {
      font('normal', size, color);
      const lines = pdf.splitTextToSize(item, CW - 6);
      ensure(lines.length * lineH(size) + 2);
      font('normal', size, color);
      pdf.text('-', M + 1, y);
      for (const line of lines) {
        pdf.text(line, M + 6, y);
        y += lineH(size) + 0.8;
      }
      y += 1;
    }
  };

  // ---- Header band ----
  pdf.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
  pdf.rect(0, 0, W, 30, 'F');
  font('bold', 20, [255, 255, 255]);
  pdf.text(c.title, M, 15);
  font('normal', 10, [226, 238, 235]);
  pdf.text(`Not Imagining It  |  ${c.subtitle}  |  ${c.prepared} ${kit.preparedOn}`, M, 23);
  y = 40;

  // ---- 1. Summary for the clinician ----
  if (kit.about.length) {
    sectionTitle(c.aboutMe);
    const colW = CW / 2;
    kit.about.forEach(([k, v], i) => {
      const col = i % 2;
      if (col === 0) ensure(10);
      const x = M + col * colW;
      font('normal', 8.5, INK_2);
      pdf.text(k.toUpperCase(), x, y);
      font('bold', 11, INK);
      pdf.text(pdf.splitTextToSize(String(v), colW - 6)[0], x, y + 5);
      if (col === 1 || i === kit.about.length - 1) y += 11;
    });
    const meds = [kit.listed.medications, kit.listed.supplements].filter(Boolean).join('; ');
    if (meds) {
      font('bold', 9, INK_2);
      pdf.text(`${c.medications.toUpperCase()} / ${c.supplements.toUpperCase()}`, M, y);
      y += 4.8;
      paragraph(meds, 10.5, INK);
    }
  }

  sectionTitle(c.noticing);
  if (kit.symptomGroups.length) {
    for (const g of kit.symptomGroups) {
      ensure(12);
      font('bold', 10.5, INK);
      pdf.text(g.title, M, y);
      y += 5;
      paragraph(g.items.join(', '), 10.5, INK_2, 'normal', 3);
      y += 1.5;
    }
    if (kit.durationLabel) paragraph(`${c.forDuration(kit.durationLabel).replace(/^./, (s) => s.toUpperCase())}.`, 10, INK_2, 'italic');
  } else {
    paragraph(c.noSymptoms);
  }

  if (kit.raiseFirst.length) {
    sectionTitle(c.raiseFirst);
    paragraph(c.raiseFirstIntro, 9.5, INK_2, 'italic');
    y += 2;
    kit.raiseFirst.forEach((item, i) => {
      font('bold', 11, INK);
      const titleLines = pdf.splitTextToSize(item.title, CW - 12);
      font('normal', 10, INK_2);
      const detailLines = pdf.splitTextToSize(item.detail, CW - 12);
      ensure(4 + titleLines.length * 5 + detailLines.length * 4.6);
      pdf.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
      pdf.circle(M + 3.2, y - 1.3, 3.2, 'F');
      font('bold', 9.5, [255, 255, 255]);
      pdf.text(String(i + 1), M + 3.2, y + 0.1, { align: 'center' });
      font('bold', 11, INK);
      for (const line of titleLines) {
        pdf.text(line, M + 10, y);
        y += 5;
      }
      font('normal', 10, INK_2);
      for (const line of detailLines) {
        pdf.text(line, M + 10, y);
        y += 4.6;
      }
      y += 2.5;
    });
  }

  // ---- 2. For the visit ----
  newPage();
  if (kit.opener) {
    sectionTitle(c.opener);
    paragraph(c.openerIntro, 9.5, INK_2, 'italic');
    y += 1;
    font('normal', 11, INK);
    const openerLines = pdf.splitTextToSize(kit.opener, CW - 12);
    const boxH = openerLines.length * 5.2 + 8;
    ensure(boxH + 4);
    pdf.setFillColor(CORAL_SOFT[0], CORAL_SOFT[1], CORAL_SOFT[2]);
    pdf.roundedRect(M, y - 2, CW, boxH, 2, 2, 'F');
    pdf.text(openerLines, M + 6, y + 4.5, { lineHeightFactor: 1.35 });
    y += boxH + 3;
  }

  sectionTitle(c.questions);
  paragraph(c.questionsIntro, 9.5, INK_2, 'italic');
  y += 2;
  tickList(kit.questions);

  if (kit.tests.length) {
    sectionTitle(c.tests);
    paragraph(c.testsIntro, 9.5, INK_2, 'italic');
    y += 2;
    tickList(kit.tests);
  }

  // ---- 3. Why these are worth raising ----
  if (kit.understanding.length) {
    newPage();
    sectionTitle(c.understanding);
    paragraph(c.understandingIntro, 9.5, INK_2, 'italic');
    y += 2;
    for (const u of kit.understanding) {
      ensure(24);
      font('bold', 11, INK);
      for (const line of pdf.splitTextToSize(u.title, CW)) {
        pdf.text(line, M, y);
        y += 5;
      }
      paragraph(u.why, 10, INK_2);
      for (const [label, src] of [[c.source, u.source], [c.moreInfo, u.more]]) {
        if (!src) continue;
        ensure(10);
        font('normal', 8.5, TEAL);
        pdf.textWithLink(`${label}: ${src.name}`, M, y, { url: src.url });
        y += 4;
        font('normal', 7.5, INK_2);
        pdf.textWithLink(src.url, M, y, { url: src.url });
        y += 4;
      }
      y += 3.5;
    }
    if (kit.glossary.length) {
      sectionTitle(c.glossary, 32);
      for (const g of kit.glossary) {
        font('bold', 10, INK);
        const termW = pdf.getTextWidth(`${g.term}:`) + 2;
        font('normal', 10, INK_2);
        const lines = pdf.splitTextToSize(g.text, CW - termW);
        ensure(lines.length * 4.8 + 2);
        font('bold', 10, INK);
        pdf.text(`${g.term}:`, M, y);
        font('normal', 10, INK_2);
        lines.forEach((line, i) => pdf.text(line, M + termW, y + i * 4.8));
        y += lines.length * 4.8 + 1.5;
      }
    }
  }

  // ---- 4. Before and during the visit ----
  newPage();
  sectionTitle(c.bring);
  bulletList(c.bringItems);
  sectionTitle(c.rushed);
  bulletList(c.rushedItems.map((s) => `"${s}"`), 10.5, INK);
  // "Get care promptly" in a tinted box so it stands out.
  font('normal', 10, INK);
  const urgentLines = c.urgentItems.map((s) => pdf.splitTextToSize(`-  ${s}`, CW - 12));
  const urgentH = 14 + urgentLines.reduce((n, l) => n + l.length * 4.6 + 1, 0);
  ensure(urgentH + 8);
  y += 4;
  pdf.setFillColor(CORAL_SOFT[0], CORAL_SOFT[1], CORAL_SOFT[2]);
  pdf.roundedRect(M, y, CW, urgentH, 2, 2, 'F');
  font('bold', 11.5, CORAL);
  pdf.text(pdf.splitTextToSize(c.urgent, CW - 12)[0], M + 6, y + 8);
  let uy = y + 15;
  font('normal', 10, INK);
  for (const lines of urgentLines) {
    for (const line of lines) {
      pdf.text(line, M + 6, uy);
      uy += 4.6;
    }
    uy += 1;
  }
  y += urgentH + 4;

  // ---- 5. Background and notes (continues on the same page) ----
  sectionTitle(c.exposures);
  if (kit.exposures.length) {
    for (const e of kit.exposures) paragraph(`-  ${e}`, 10.5, INK_2);
  } else {
    paragraph(c.noExposures, 10.5, INK_2);
  }

  sectionTitle(c.meds, 30);
  for (const [k, v] of [
    [c.conditions, kit.listed.conditions],
    [c.medications, kit.listed.medications],
    [c.supplements, kit.listed.supplements],
  ]) {
    ensure(10);
    font('bold', 10, INK);
    pdf.text(`${k}:`, M, y);
    y += 4.8;
    paragraph(v || c.none, 10.5, v ? INK : INK_2, v ? 'normal' : 'italic', 3);
    y += 1;
  }

  sectionTitle(c.notes, 45);
  for (const prompt of c.notesPrompts) {
    ensure(24);
    font('bold', 10, INK_2);
    pdf.text(prompt, M, y);
    y += 2;
    pdf.setDrawColor(RULE[0], RULE[1], RULE[2]);
    for (let i = 0; i < 3; i++) {
      y += 6.5;
      pdf.line(M, y, W - M, y);
    }
    y += 5.5;
  }

  // ---- Disclaimer box ----
  font('normal', 9, INK);
  const discLines = pdf.splitTextToSize(c.disclaimer, CW - 10);
  ensure(discLines.length * 4.4 + 10);
  pdf.setFillColor(TEAL_SOFT[0], TEAL_SOFT[1], TEAL_SOFT[2]);
  pdf.roundedRect(M, y, CW, discLines.length * 4.4 + 7, 2, 2, 'F');
  pdf.text(discLines, M + 5, y + 5.5);
  y += discLines.length * 4.4 + 10;

  // ---- 6. Two-week log, last so it can be torn off and filled in ----
  newPage();
  sectionTitle(c.log);
  paragraph(c.logIntro, 9.5, INK_2, 'italic');
  y += 3;
  const cols = [
    { label: c.logCols.day, w: 10 },
    { label: c.logCols.date, w: 18 },
    { label: c.logCols.sleep, w: 15 },
    { label: c.logCols.energy, w: 15 },
    { label: c.logCols.mood, w: 15 },
    ...kit.logSymptoms.map((s) => ({ label: s, w: 24 })),
    ...(kit.showsPeriodColumn ? [{ label: c.logCols.period, w: 17 }] : []),
  ];
  const used = cols.reduce((n, col) => n + col.w, 0);
  cols.push({ label: c.logCols.notes, w: CW - used });
  font('bold', 8, INK);
  const headLines = cols.map((col) => pdf.splitTextToSize(col.label, col.w - 2));
  const headH = Math.max(...headLines.map((l) => l.length)) * 3.6 + 4;
  const rowH = 9;
  pdf.setFillColor(TEAL_SOFT[0], TEAL_SOFT[1], TEAL_SOFT[2]);
  pdf.rect(M, y, CW, headH, 'F');
  let x = M;
  cols.forEach((col, i) => {
    pdf.text(headLines[i], x + 1.2, y + 4.2);
    x += col.w;
  });
  const top = y;
  y += headH;
  pdf.setDrawColor(RULE[0], RULE[1], RULE[2]);
  font('normal', 8.5, INK_2);
  for (let d = 1; d <= 14; d++) {
    pdf.text(String(d), M + 1.5, y + 5.8);
    y += rowH;
    pdf.line(M, y, M + CW, y);
  }
  x = M;
  for (const col of cols) {
    pdf.line(x, top, x, y);
    x += col.w;
  }
  pdf.line(M + CW, top, M + CW, y);
  pdf.line(M, top, M + CW, top);
  y += 4;

  footer();

  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = kit.lang === 'es'
    ? `Not-Imagining-It-Resumen-para-mi-consulta-${stamp}.pdf`
    : `Not-Imagining-It-Appointment-Summary-${stamp}.pdf`;
  pdf.save(fileName);
  return { success: true, fileName };
}
