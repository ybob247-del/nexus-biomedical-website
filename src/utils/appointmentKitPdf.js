/**
 * Appointment Prep Kit as a printable PDF, built in the browser with jsPDF.
 *
 * Layout: page 1 is the one-page summary a clinician can read in a minute
 * (about me, what I've been noticing, the five things to raise first). The
 * following page has questions to ask with tick boxes, exposures and listed
 * medications, then space for notes from the appointment.
 *
 * Only the built-in Helvetica font is used, so text must stay within
 * Latin-1: accented Spanish is fine, emoji are not.
 */

import jsPDF from 'jspdf';
import { buildAppointmentKit } from './appointmentKit';

const TEAL = [31, 92, 90];
const TEAL_SOFT = [227, 240, 237];
const CORAL = [196, 71, 47];
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
      pdf.text(line, M + indent, y);
      y += lineH(size) + 0.8;
    }
  };

  const sectionTitle = (text) => {
    ensure(16);
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

  // ---- Header band ----
  pdf.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
  pdf.rect(0, 0, W, 30, 'F');
  font('bold', 20, [255, 255, 255]);
  pdf.text(c.title, M, 15);
  font('normal', 10, [226, 238, 235]);
  pdf.text(`Not Imagining It  |  ${c.subtitle}  |  ${c.prepared} ${kit.preparedOn}`, M, 23);
  y = 40;

  // ---- About me: two-column grid ----
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
  }

  // ---- What I've been noticing ----
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

  // ---- Five things to raise first ----
  if (kit.raiseFirst.length) {
    sectionTitle(c.raiseFirst);
    paragraph(c.raiseFirstIntro, 9.5, INK_2, 'italic');
    y += 2;
    kit.raiseFirst.forEach((item, i) => {
      const detailLines = pdf.splitTextToSize(item.detail, CW - 14);
      ensure(10 + detailLines.length * 5);
      pdf.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
      pdf.circle(M + 3.2, y - 1.3, 3.2, 'F');
      font('bold', 9.5, [255, 255, 255]);
      pdf.text(String(i + 1), M + 3.2, y + 0.1, { align: 'center' });
      font('bold', 11, INK);
      pdf.text(pdf.splitTextToSize(item.title, CW - 14)[0], M + 10, y);
      y += 5;
      font('normal', 10, INK_2);
      for (const line of detailLines) {
        pdf.text(line, M + 10, y);
        y += 4.6;
      }
      y += 2.5;
    });
  }

  // ---- Questions to ask (new page, so page 1 stays a one-page summary) ----
  newPage();
  sectionTitle(c.questions);
  paragraph(c.questionsIntro, 9.5, INK_2, 'italic');
  y += 2;
  for (const q of kit.questions) {
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

  // ---- Everyday exposures ----
  sectionTitle(c.exposures);
  if (kit.exposures.length) {
    for (const e of kit.exposures) paragraph(`-  ${e}`, 10.5, INK_2);
  } else {
    paragraph(c.noExposures, 10.5, INK_2);
  }

  // ---- Conditions, medications, supplements ----
  sectionTitle(c.meds);
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

  // ---- Notes ----
  sectionTitle(c.notes);
  for (const prompt of c.notesPrompts) {
    ensure(20);
    font('bold', 10, INK_2);
    pdf.text(prompt, M, y);
    y += 2;
    pdf.setDrawColor(RULE[0], RULE[1], RULE[2]);
    for (let i = 0; i < 2; i++) {
      y += 6.5;
      pdf.line(M, y, W - M, y);
    }
    y += 5.5;
  }

  // ---- Disclaimer box ----
  const discLines = pdf.splitTextToSize(c.disclaimer, CW - 10);
  ensure(discLines.length * 4.4 + 10);
  pdf.setFillColor(TEAL_SOFT[0], TEAL_SOFT[1], TEAL_SOFT[2]);
  pdf.roundedRect(M, y, CW, discLines.length * 4.4 + 7, 2, 2, 'F');
  font('normal', 9, INK);
  pdf.text(discLines, M + 5, y + 5.5);
  y += discLines.length * 4.4 + 10;

  footer();

  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = kit.lang === 'es'
    ? `Not-Imagining-It-Resumen-para-mi-consulta-${stamp}.pdf`
    : `Not-Imagining-It-Appointment-Summary-${stamp}.pdf`;
  pdf.save(fileName);
  return { success: true, fileName };
}
