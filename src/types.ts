export type Mode = 'video' | 'photo' | 'film';
export type Tolerance = 1 | 2 | 3;
export type Language = 'en' | 'id';
export type AnamorphicSqueeze = 1.0 | 1.33 | 1.5 | 1.8 | 2.0;

export interface CameraPreset {
  id?: string;
  label: string;
  width: number;
  height: number;
  megapixels: number;
  isFilm?: boolean;
}

export interface PresetGroup {
  groupName: string;
  presets: CameraPreset[];
}

export interface VideoResolution {
  label: string;
  widthPx: number;
  heightPx: number;
}

export interface OpticsState {
  sensorWidth: number;
  sensorHeight: number;
  megapixels: number;
  videoResPx: number;
  mode: Mode;
  wavelengthNm: number;
  focalLength: number;
  focalLengthMode: 'preset' | 'custom';
  fStopIndex: number;
  transmittance: number;
  tolerance: Tolerance;
  activeFilter: string;
  anamorphicSqueeze: AnamorphicSqueeze;
}

export interface OpticsCalculationResult {
  fNumber: number;
  tStop: number;
  entrancePupilMm: number;
  pixelPitchMicrons: number;
  airyDiskMicrons: number;
  dlaFNumber: number;
  ratio: number;
  status: 'sharp' | 'optimal' | 'soft' | 'blur';
  statusColor: string;
  statusBorderColor: string;
  anamorphicSqueeze: AnamorphicSqueeze;
  sensorAspectRatio: number;
  desqueezedAspectRatio: number;
  desqueezedAspectLabel: string;
  horizontalAiryDiskMicrons: number;
  horizontalDlaFNumber: number;
}

export interface CameraReportMetadata {
  projectTitle: string;
  director: string;
  cinematographer: string;
  cameraUnit: string;
  cameraModel: string;
  lensModel: string;
  scene: string;
  take: string;
  fps: string;
  shutterAngle: string;
  iso: string;
  notes: string;
}
