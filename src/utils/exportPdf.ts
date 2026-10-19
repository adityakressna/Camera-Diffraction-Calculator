import { jsPDF } from 'jspdf';
import { CameraReportMetadata, OpticsCalculationResult, OpticsState } from '../types';

export function generateCameraReportPdf(
  state: OpticsState,
  results: OpticsCalculationResult,
  metadata: CameraReportMetadata,
  cameraPresetLabel?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Header Banner
  doc.setFillColor(35, 35, 35);
  doc.rect(margin, y, contentWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CAMERA REPORT & OPTICAL SHOT SHEET', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(232, 80, 2); // #E85002 accent
  doc.text('DIFFRACTION & CINE OPTICS SPECIFICATION', margin + 6, y + 14);

  const timestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(timestamp, pageWidth - margin - 6, y + 11, { align: 'right' });

  y += 24;

  // Metadata Grid (Project, Scene, Take, Camera, Director, DP)
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);

  const drawRow = (leftKey: string, leftVal: string, rightKey: string, rightVal: string) => {
    doc.setFillColor(242, 242, 242);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.rect(margin, y, contentWidth, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text(leftKey.toUpperCase(), margin + 3, y + 4.8);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);
    doc.text(leftVal || '-', margin + 40, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text(rightKey.toUpperCase(), margin + contentWidth / 2 + 3, y + 4.8);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);
    doc.text(rightVal || '-', margin + contentWidth / 2 + 40, y + 4.8);

    y += 7.2;
  };

  drawRow('PROJECT', metadata.projectTitle || 'Untitled Production', 'SCENE / TAKE', `${metadata.scene || '1'} / ${metadata.take || '1'}`);
  drawRow('DIRECTOR', metadata.director || '-', 'D.O.P.', metadata.cinematographer || '-');
  drawRow('CAMERA UNIT', metadata.cameraUnit || 'A-Camera', 'CAMERA / PRESET', cameraPresetLabel || `${state.sensorWidth} x ${state.sensorHeight} mm`);
  drawRow('LENS / FOCAL', `${metadata.lensModel || 'Prime Lens'} (${state.focalLength} mm)`, 'SHUTTER / FPS', `${metadata.shutterAngle || '180°'} @ ${metadata.fps || '24'} fps`);
  drawRow('EXPOSURE INDEX (ISO)', metadata.iso || '800 ISO', 'OPTICAL FILTER', state.activeFilter.toUpperCase());

  y += 5;

  // Section: OPTICAL & DIFFRACTION ANALYSIS
  doc.setFillColor(45, 45, 45);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('OPTICAL CALCULATIONS & DIFFRACTION LIMIT (DLA)', margin + 3, y + 4.5);

  y += 6.5;

  const drawOpticRow = (items: [string, string][]) => {
    const colW = contentWidth / items.length;
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.rect(margin, y, contentWidth, 12, 'S');

    items.forEach((item, idx) => {
      const colX = margin + idx * colW;
      if (idx > 0) {
        doc.line(colX, y, colX, y + 12);
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(90, 90, 90);
      doc.text(item[0].toUpperCase(), colX + 3, y + 4.2);

      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(item[1], colX + 3, y + 9.5);
    });

    y += 12;
  };

  drawOpticRow([
    ['GEOMETRIC APERTURE', `f/${results.fNumber.toFixed(1)}`],
    ['PHOTOMETRIC T-STOP', `T/${results.tStop.toFixed(1)}`],
    ['TRANSMITTANCE', `${state.transmittance}%`],
    ['ENTRANCE PUPIL (EN)', `${results.entrancePupilMm.toFixed(2)} mm`],
  ]);

  drawOpticRow([
    ['SENSOR PIXEL PITCH', `${results.pixelPitchMicrons.toFixed(2)} um`],
    ['AIRY DISK DIAMETER', `${results.airyDiskMicrons.toFixed(2)} um`],
    ['LIGHT WAVELENGTH', `${state.wavelengthNm} nm`],
    ['TOLERANCE CRITERION', `${state.tolerance}X (${state.tolerance === 1 ? 'Physic' : state.tolerance === 2 ? 'Nyquist' : 'Visual'})`],
  ]);

  y += 2;

  // Anamorphic Specifications Block
  doc.setFillColor(240, 240, 245);
  doc.rect(margin, y, contentWidth, 12, 'F');
  doc.rect(margin, y, contentWidth, 12, 'S');

  const isAnamorphic = state.anamorphicSqueeze > 1.0;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);
  doc.text('ANAMORPHIC SQUEEZE FACTOR', margin + 3, y + 4.5);
  doc.text('DESQUEEZED ASPECT RATIO', margin + 60, y + 4.5);
  doc.text('DIFFRACTION STATUS', margin + 125, y + 4.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(isAnamorphic ? 232 : 40, isAnamorphic ? 80 : 40, isAnamorphic ? 2 : 40);
  doc.text(`${state.anamorphicSqueeze.toFixed(2)}x ${isAnamorphic ? '(Anamorphic)' : '(Spherical)'}`, margin + 3, y + 9.5);

  doc.setTextColor(20, 20, 20);
  doc.text(`${results.desqueezedAspectLabel}`, margin + 60, y + 9.5);

  // Sharpness Status Badge
  doc.setTextColor(
    results.status === 'sharp' ? 46 : results.status === 'optimal' ? 25 : results.status === 'soft' ? 198 : 211,
    results.status === 'sharp' ? 125 : results.status === 'optimal' ? 118 : results.status === 'soft' ? 125 : 47,
    results.status === 'sharp' ? 50 : results.status === 'optimal' ? 210 : results.status === 'soft' ? 0 : 47
  );
  doc.text(`${results.status.toUpperCase()} (DLA: f/${results.dlaFNumber.toFixed(1)})`, margin + 125, y + 9.5);

  y += 18;

  // Diffraction Assessment Box
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, y, contentWidth, 22, 'F');
  doc.rect(margin, y, contentWidth, 22, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text('ASSESSMENT & ON-SET RECOMMENDATION:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);

  const dlaDiff = results.fNumber - results.dlaFNumber;
  let recommendation = '';
  if (dlaDiff > 2.0) {
    recommendation = `WARNING: Current aperture f/${results.fNumber.toFixed(1)} is well beyond the Diffraction-Limited Aperture (f/${results.dlaFNumber.toFixed(1)}). Noticeable softening and contrast loss will occur on fine textures. Consider opening up the lens or using ND filters to maintain maximum sharpness.`;
  } else if (dlaDiff > 0) {
    recommendation = `CAUTION: Operating slightly past DLA (f/${results.dlaFNumber.toFixed(1)}). Fine optical resolution begins to be diffraction-limited, though overall contrast remains acceptable for narrative dialogue and portraits.`;
  } else {
    recommendation = `OPTIMAL: Selected aperture f/${results.fNumber.toFixed(1)} is strictly within the Diffraction-Limited Aperture boundary (f/${results.dlaFNumber.toFixed(1)}). Sensor resolution is fully exploited without MTF loss caused by wave diffraction.`;
  }

  const splitRec = doc.splitTextToSize(recommendation, contentWidth - 8);
  doc.text(splitRec, margin + 4, y + 10);

  y += 28;

  // Notes & Sign-off Section
  doc.setFillColor(242, 242, 242);
  doc.rect(margin, y, contentWidth, 26, 'F');
  doc.rect(margin, y, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text('PRODUCTION NOTES / REMARKS:', margin + 4, y + 5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  const userNotes = metadata.notes || 'Sensor resolution verified against optical diffraction threshold. Rayleigh criterion checked.';
  const splitNotes = doc.splitTextToSize(userNotes, contentWidth - 8);
  doc.text(splitNotes, margin + 4, y + 10);

  y += 32;

  // Signature lines
  const sigW = (contentWidth - 10) / 2;
  doc.line(margin, y + 10, margin + sigW, y + 10);
  doc.line(margin + sigW + 10, y + 10, margin + contentWidth, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('1ST ASSISTANT CAMERA / DIT SIGNATURE', margin, y + 14);
  doc.text('DIRECTOR OF PHOTOGRAPHY CONFIRMATION', margin + sigW + 10, y + 14);

  // Footer branding
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text('Generated via Camera Lens Diffraction Calculator — Cine Optics Suite', margin, 297 - 8);

  const safeFilename = `Camera_Report_Scene_${metadata.scene || '1'}_Take_${metadata.take || '1'}.pdf`.replace(/[^a-zA-Z0-9_-]/g, '_') + '.pdf';
  doc.save(safeFilename);
}
