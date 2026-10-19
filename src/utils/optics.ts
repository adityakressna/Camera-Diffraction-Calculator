import { F_STOPS } from '../data/presets';
import { OpticsCalculationResult, OpticsState } from '../types';

export function getWaveColor(nm: number): { r: number; g: number; b: number; hex: string } {
  if (nm < 380) return { r: 126, g: 87, b: 194, hex: '#7E57C2' }; // UV - Purple
  if (nm < 490) return { r: 21, g: 101, b: 192, hex: '#1565C0' };  // Blue
  if (nm < 570) return { r: 46, g: 125, b: 50, hex: '#2E7D32' };   // Green
  if (nm < 600) return { r: 198, g: 125, b: 0, hex: '#C67D00' };   // Yellow
  if (nm < 750) return { r: 198, g: 40, b: 40, hex: '#C62828' };   // Red
  return { r: 232, g: 80, b: 2, hex: '#E85002' };                   // Infrared
}

export function calculateOpticsData(state: OpticsState): OpticsCalculationResult {
  const w = Math.max(0.1, state.sensorWidth || 35.6);
  const h = Math.max(0.1, state.sensorHeight || 23.8);

  let pixelPitchMicrons: number;
  if (state.mode === 'video') {
    const horizontalPx = Math.max(1, state.videoResPx || 1920);
    pixelPitchMicrons = (w / horizontalPx) * 1000;
  } else {
    const mp = Math.max(0.1, state.megapixels || 12.1);
    // Square pixel pitch assumption: pitch = sqrt((w * h) / (total pixels))
    pixelPitchMicrons = Math.sqrt((w * h) / (mp * 1_000_000)) * 1000;
  }

  const fNumber = F_STOPS[state.fStopIndex] || 22.0;
  const transVal = Math.max(1, Math.min(100, state.transmittance || 100));
  // T-Stop formula: T = f-number / sqrt(transmittance / 100)
  const tStop = fNumber / Math.sqrt(transVal / 100);

  const focal = Math.max(1, state.focalLength || 50);
  // Entrance pupil diameter: EP = focal / f-number
  const entrancePupilMm = focal / fNumber;

  const waveNm = Math.max(200, state.wavelengthNm || 550);
  const waveMicrons = waveNm / 1000;
  const multiplier = state.tolerance || 3;

  // Airy disk diameter (first zero-crossing of Bessel function): d = 2.44 * lambda * N
  const airyDiskMicrons = 2.44 * waveMicrons * fNumber;

  // Diffraction Limited Aperture (DLA): N = (pixel_pitch * multiplier) / (2.44 * lambda)
  const dlaFNumber = (pixelPitchMicrons * multiplier) / (2.44 * waveMicrons);

  // Anamorphic Squeeze calculations
  const squeeze = state.anamorphicSqueeze || 1.0;
  const sensorAspectRatio = w / h;
  const desqueezedAspectRatio = sensorAspectRatio * squeeze;

  let desqueezedAspectLabel = `${desqueezedAspectRatio.toFixed(2)}:1`;
  if (Math.abs(desqueezedAspectRatio - 2.39) < 0.06) {
    desqueezedAspectLabel = '2.39:1 (Scope)';
  } else if (Math.abs(desqueezedAspectRatio - 2.35) < 0.05) {
    desqueezedAspectLabel = '2.35:1 (Cinema)';
  } else if (Math.abs(desqueezedAspectRatio - 1.78) < 0.04) {
    desqueezedAspectLabel = '1.78:1 (16:9)';
  } else if (Math.abs(desqueezedAspectRatio - 2.76) < 0.08) {
    desqueezedAspectLabel = '2.76:1 (Ultra Panavision)';
  } else if (Math.abs(desqueezedAspectRatio - 2.66) < 0.06) {
    desqueezedAspectLabel = '2.66:1 (Classic Scope)';
  } else if (Math.abs(desqueezedAspectRatio - 1.33) < 0.04) {
    desqueezedAspectLabel = '1.33:1 (4:3 Academy)';
  }

  // When desqueezed, horizontal blur is optically enlarged by the squeeze ratio
  const horizontalAiryDiskMicrons = airyDiskMicrons * squeeze;
  const horizontalDlaFNumber = dlaFNumber / squeeze;

  // Ratio of Airy disk to tolerance-scaled pixel pitch
  const ratio = (airyDiskMicrons / pixelPitchMicrons) / multiplier;

  let status: 'sharp' | 'optimal' | 'soft' | 'blur' = 'optimal';
  let statusColor = '#1976D2';
  let statusBorderColor = '#1976D2';

  if (ratio <= 1.0) {
    status = 'sharp';
    statusColor = '#388E3C';
    statusBorderColor = '#388E3C';
  } else if (ratio <= 1.5) {
    status = 'optimal';
    statusColor = '#1976D2';
    statusBorderColor = '#1976D2';
  } else if (ratio <= 2.5) {
    status = 'soft';
    statusColor = '#F9A825';
    statusBorderColor = '#F9A825';
  } else {
    status = 'blur';
    statusColor = '#D32F2F';
    statusBorderColor = '#D32F2F';
  }

  return {
    fNumber,
    tStop,
    entrancePupilMm,
    pixelPitchMicrons,
    airyDiskMicrons,
    dlaFNumber,
    ratio,
    status,
    statusColor,
    statusBorderColor,
    anamorphicSqueeze: squeeze,
    sensorAspectRatio,
    desqueezedAspectRatio,
    desqueezedAspectLabel,
    horizontalAiryDiskMicrons,
    horizontalDlaFNumber
  };
}

export function computeSharpnessCurve(
  pixelPitchMicrons: number,
  waveMicrons: number,
  multiplier: number
): number[] {
  return F_STOPS.map(f => {
    const airy = 2.44 * waveMicrons * f;
    const normRatio = (airy / pixelPitchMicrons) / multiplier;
    if (normRatio <= 1.0) return 100 - (normRatio * 25);
    if (normRatio <= 1.5) return 75 - (((normRatio - 1.0) / 0.5) * 25);
    if (normRatio <= 2.5) return 50 - (((normRatio - 1.5) / 1.0) * 25);
    return Math.max(0, 25 - (((normRatio - 2.5) / 1.5) * 25));
  });
}
