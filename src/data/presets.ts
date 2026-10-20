import { PresetGroup, CameraPreset } from '../types';

export const F_STOPS = [
  1.4, 1.6, 1.8, 2.0, 2.2, 2.5, 2.8, 3.2, 3.5, 4.0,
  4.5, 5.0, 5.6, 6.3, 7.1, 8.0, 9.0, 10.0, 11.0, 13.0,
  14.0, 16.0, 18.0, 20.0, 22.0
];

export const STOPS_LABELS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

export const FOCAL_PRESETS = [14, 16, 20, 24, 28, 35, 50, 85, 100, 135, 200, 300, 400, 500];

export const VIDEO_RESOLUTIONS = [
  { group: 'Ultra-High Res (12K - 17K)', options: [
    { label: '17K DCI (17520 x 8040)', widthPx: 17520 },
    { label: '12K DCI (12288 x 6480)', widthPx: 12288 },
  ]},
  { group: '8K Format', options: [
    { label: '8K DCI (8192 x 4320)', widthPx: 8192 },
    { label: '8K UHD (7680 x 4320)', widthPx: 7680 },
  ]},
  { group: '5K - 6K Format', options: [
    { label: '6K DCI (6144 x 3240)', widthPx: 6144 },
    { label: '6K FF / Open Gate (6048 x 4032)', widthPx: 6048 },
    { label: '5.7K (5720 x 3016)', widthPx: 5720 },
    { label: '5K (5120 x 2700)', widthPx: 5120 },
  ]},
  { group: '4K Format', options: [
    { label: '4.6K (4608 x 2592)', widthPx: 4608 },
    { label: '4.5K LF (4448 x 3096)', widthPx: 4448 },
    { label: '4K DCI (4096 x 2160)', widthPx: 4096 },
    { label: '4K UHD (3840 x 2160)', widthPx: 3840 },
  ]},
  { group: '2K & Sub-4K', options: [
    { label: '3.2K (3200 x 1800)', widthPx: 3200 },
    { label: '2.8K (2880 x 1620)', widthPx: 2880 },
    { label: '2.5K (2432 x 1366)', widthPx: 2432 },
    { label: '2K DCI (2048 x 1080)', widthPx: 2048 },
    { label: '1080p FHD (1920 x 1080)', widthPx: 1920 },
    { label: '720p HD (1280 x 720)', widthPx: 1280 },
  ]}
];

export const CAMERA_PRESET_GROUPS: PresetGroup[] = [
  {
    groupName: 'ARRI',
    presets: [
      { label: 'ALEXA 65', width: 54.12, height: 25.58, megapixels: 20.3 },
      { label: 'ALEXA Mini LF / ALEXA LF', width: 36.70, height: 25.54, megapixels: 13.8 },
      { label: 'ALEXA 35', width: 27.99, height: 19.22, megapixels: 14.6 },
      { label: 'ALEXA Mini / AMIRA', width: 28.25, height: 18.17, megapixels: 7.5 },
      { label: 'ALEXA SXT / XT / Classic', width: 28.25, height: 18.17, megapixels: 7.5 },
    ]
  },
  {
    groupName: 'Blackmagic Design (Cine & PYXIS)',
    presets: [
      { label: 'URSA Cine 17K (65mm)', width: 50.8, height: 23.3, megapixels: 140.0 },
      { label: 'URSA Cine 12K (Full Frame)', width: 35.6, height: 23.3, megapixels: 98.8 },
      { label: 'PYXIS 6K / Cinema Camera 6K', width: 35.6, height: 23.8, megapixels: 24.6 },
    ]
  },
  {
    groupName: 'Blackmagic Design (URSA & Pocket)',
    presets: [
      { label: 'URSA Mini Pro 12K OLPF', width: 27.0, height: 14.3, megapixels: 79.6 },
      { label: 'URSA Mini Pro 4.6K G2', width: 25.3, height: 14.3, megapixels: 11.9 },
      { label: 'Pocket 6K Pro / URSA Broadcast G2', width: 23.1, height: 13.0, megapixels: 21.2 },
      { label: 'Pocket Cinema Camera 4K', width: 19.0, height: 10.0, megapixels: 8.8 },
    ]
  },
  {
    groupName: 'Blackmagic Design (Studio & Micro)',
    presets: [
      { label: 'Studio Camera 6K Pro', width: 23.1, height: 13.0, megapixels: 21.2 },
      { label: 'Studio 4K Plus/Pro G2 / Micro 4K', width: 17.8, height: 10.0, megapixels: 8.8 },
    ]
  },
  {
    groupName: 'Canon Mirrorless (Full Frame)',
    presets: [
      { label: 'EOS R5 / R5 Mark II / R5 C', width: 35.6, height: 23.8, megapixels: 45.0 },
      { label: 'EOS R', width: 35.6, height: 23.8, megapixels: 30.3 },
      { label: 'EOS RP', width: 35.6, height: 23.8, megapixels: 26.2 },
      { label: 'EOS R1 / R3 / R6 Series / R8', width: 35.6, height: 23.8, megapixels: 24.2 },
      { label: 'EOS R6', width: 35.6, height: 23.8, megapixels: 20.1 },
    ]
  },
  {
    groupName: 'Canon Mirrorless (APS-C)',
    presets: [
      { label: 'EOS R7', width: 22.2, height: 14.8, megapixels: 32.5 },
      { label: 'EOS R10 / R50 / R100', width: 22.2, height: 14.8, megapixels: 24.2 },
    ]
  },
  {
    groupName: 'Canon Cinema EOS',
    presets: [
      { label: 'EOS C500 Mark II / C700 FF', width: 38.1, height: 20.1, megapixels: 18.7 },
      { label: 'EOS C400', width: 35.6, height: 23.8, megapixels: 26.7 },
      { label: 'EOS C300 Mark III / EOS C70', width: 26.2, height: 13.8, megapixels: 9.6 },
      { label: 'EOS C200 / C100 Mark II', width: 24.6, height: 13.8, megapixels: 8.8 },
    ]
  },
  {
    groupName: 'Canon Pro Camcorders',
    presets: [
      { label: 'XF605 / XA75 / XA70 (1-inch)', width: 13.2, height: 8.8, megapixels: 8.2 },
      { label: 'XA65 / XA60 / LEGRIA (1/2.3-inch)', width: 6.17, height: 4.55, megapixels: 8.2 },
    ]
  },
  {
    groupName: 'Freefly Systems (Cameras & Drones)',
    presets: [
      { label: 'Ember S5K', width: 23.04, height: 18.43, megapixels: 21.0 },
      { label: 'Ember S2.5K', width: 23.04, height: 18.43, megapixels: 5.2 },
      { label: 'Wave 4K', width: 22.53, height: 16.90, megapixels: 12.6 },
      { label: 'Astro Drone (Sony LR1 / A7R IV Payload)', width: 35.6, height: 23.8, megapixels: 61.0 },
    ]
  },
  {
    groupName: 'Film - Cine Motion (Fine Grain | ISO 50-100)',
    presets: [
      { label: 'IMAX 15/70', width: 70.41, height: 52.63, megapixels: 200.0, isFilm: true },
      { label: '65mm (5-perf)', width: 52.48, height: 23.01, megapixels: 60.0, isFilm: true },
      { label: 'Super 35 (4-perf)', width: 24.89, height: 18.66, megapixels: 20.0, isFilm: true },
      { label: 'Super 16', width: 12.52, height: 7.41, megapixels: 8.0, isFilm: true },
      { label: 'Standard 16mm', width: 10.26, height: 7.49, megapixels: 6.0, isFilm: true },
      { label: 'Super 8', width: 5.79, height: 4.01, megapixels: 2.0, isFilm: true },
      { label: 'Standard 8mm', width: 4.80, height: 3.50, megapixels: 1.5, isFilm: true },
    ]
  },
  {
    groupName: 'Film - Cine Motion (Medium Grain | ISO 200-250)',
    presets: [
      { label: 'IMAX 15/70', width: 70.41, height: 52.63, megapixels: 100.0, isFilm: true },
      { label: '65mm (5-perf)', width: 52.48, height: 23.01, megapixels: 30.0, isFilm: true },
      { label: 'Super 35 (4-perf)', width: 24.89, height: 18.66, megapixels: 10.0, isFilm: true },
      { label: 'Super 16', width: 12.52, height: 7.41, megapixels: 4.0, isFilm: true },
      { label: 'Standard 16mm', width: 10.26, height: 7.49, megapixels: 3.0, isFilm: true },
      { label: 'Super 8', width: 5.79, height: 4.01, megapixels: 0.8, isFilm: true },
      { label: 'Standard 8mm', width: 4.80, height: 3.50, megapixels: 0.5, isFilm: true },
    ]
  },
  {
    groupName: 'Film - Cine Motion (Coarse Grain | ISO 500+)',
    presets: [
      { label: 'IMAX 15/70', width: 70.41, height: 52.63, megapixels: 40.0, isFilm: true },
      { label: '65mm (5-perf)', width: 52.48, height: 23.01, megapixels: 12.0, isFilm: true },
      { label: 'Super 35 (4-perf)', width: 24.89, height: 18.66, megapixels: 4.0, isFilm: true },
      { label: 'Super 16', width: 12.52, height: 7.41, megapixels: 1.5, isFilm: true },
      { label: 'Standard 16mm', width: 10.26, height: 7.49, megapixels: 1.0, isFilm: true },
      { label: 'Super 8', width: 5.79, height: 4.01, megapixels: 0.3, isFilm: true },
      { label: 'Standard 8mm', width: 4.80, height: 3.50, megapixels: 0.2, isFilm: true },
    ]
  },
  {
    groupName: 'Film - Still Analog (Fine Grain | ISO 50-100)',
    presets: [
      { label: 'Large Format 8x10"', width: 240.0, height: 190.0, megapixels: 800.0, isFilm: true },
      { label: 'Large Format 4x5"', width: 120.0, height: 96.0, megapixels: 300.0, isFilm: true },
      { label: 'Medium Format 6x7', width: 70.0, height: 56.0, megapixels: 100.0, isFilm: true },
      { label: 'Medium Format 6x6', width: 56.0, height: 56.0, megapixels: 80.0, isFilm: true },
      { label: 'Medium Format 645', width: 56.0, height: 41.5, megapixels: 60.0, isFilm: true },
      { label: '35mm Full Frame', width: 36.0, height: 24.0, megapixels: 24.0, isFilm: true },
      { label: '35mm Half-Frame', width: 24.0, height: 18.0, megapixels: 12.0, isFilm: true },
    ]
  },
  {
    groupName: 'Fujifilm GFX (Medium Format)',
    presets: [
      { label: 'GFX100 II / GFX100S II / GFX100', width: 43.8, height: 32.9, megapixels: 102.0 },
      { label: 'GFX50S II / GFX50S / GFX50R', width: 43.8, height: 32.9, megapixels: 51.4 },
    ]
  },
  {
    groupName: 'Fujifilm X-Series (APS-C)',
    presets: [
      { label: 'X-H2 / X-T5 / X100VI', width: 23.5, height: 15.6, megapixels: 40.2 },
      { label: 'X-H2S / X-S20 / X-T4 / X-T30 II / X100V', width: 23.5, height: 15.6, megapixels: 26.1 },
      { label: 'X-T3 / X-Pro3 / X-T200 / X-E4', width: 23.5, height: 15.6, megapixels: 24.3 },
    ]
  },
  {
    groupName: 'Hasselblad X & 907X System (Medium Format)',
    presets: [
      { label: 'X2D 100C / 907X 100C / CFV 100C', width: 43.8, height: 32.9, megapixels: 100.0 },
      { label: 'X1D II 50C / 907X 50C / CFV II 50C', width: 43.8, height: 32.9, megapixels: 50.0 },
    ]
  },
  {
    groupName: 'Hasselblad H System (Medium Format)',
    presets: [
      { label: 'H6D-100c / H6D-400c MS', width: 53.4, height: 40.0, megapixels: 100.0 },
      { label: 'H6D-50c', width: 43.8, height: 32.9, megapixels: 50.0 },
    ]
  },
  {
    groupName: 'Kinefinity (Large Format & Super 35)',
    presets: [
      { label: 'MAVO Edge 8K (Large Format)', width: 36.0, height: 24.0, megapixels: 44.7 },
      { label: 'MAVO Edge 6K / MAVO mark2 LF', width: 36.0, height: 24.0, megapixels: 24.0 },
      { label: 'MAVO mark2 S35 / MAVO S35', width: 23.5, height: 15.6, megapixels: 24.0 },
      { label: 'TERRA 4K', width: 23.5, height: 15.6, megapixels: 9.6 },
    ]
  },
  {
    groupName: 'Leica (M, SL, Q & S Systems)',
    presets: [
      { label: 'Leica S3 (Medium Format)', width: 45.0, height: 30.0, megapixels: 64.0 },
      { label: 'Leica SL3 / M11 / M11-P / Q3', width: 35.8, height: 23.9, megapixels: 60.3 },
      { label: 'Leica SL2 / M10-R / Q2', width: 35.8, height: 23.9, megapixels: 47.3 },
      { label: 'Leica SL2-S / M10 / Q (Typ 116)', width: 35.8, height: 23.9, megapixels: 24.6 },
      { label: 'Leica CL / TL2 (APS-C)', width: 23.6, height: 15.7, megapixels: 24.2 },
      { label: 'Leica D-Lux 8 / 7 (Four Thirds)', width: 17.3, height: 13.0, megapixels: 17.0 },
    ]
  },
  {
    groupName: 'Mamiya Leaf Digital Backs',
    presets: [
      { label: 'Mamiya Leaf Credo 80', width: 53.7, height: 40.3, megapixels: 80.0 },
      { label: 'Mamiya Leaf Credo 60', width: 53.9, height: 40.4, megapixels: 60.0 },
      { label: 'Mamiya Leaf Credo 50', width: 44.0, height: 33.0, megapixels: 50.0 },
      { label: 'Mamiya Leaf Credo 40', width: 43.9, height: 32.9, megapixels: 40.0 },
    ]
  },
  {
    groupName: 'Nikon Mirrorless (FX & DX)',
    presets: [
      { label: 'Z 9 / Z 8 / Z 7II / Z 7', width: 35.9, height: 23.9, megapixels: 45.7 },
      { label: 'Z f / Z 6III / Z 6II / Z 6', width: 35.9, height: 23.9, megapixels: 24.5 },
      { label: 'Z 5', width: 35.9, height: 23.9, megapixels: 24.3 },
      { label: 'Z 50 / Z fc / Z 30 (DX)', width: 23.5, height: 15.7, megapixels: 20.9 },
    ]
  },
  {
    groupName: 'Nikon DSLR (FX & DX)',
    presets: [
      { label: 'D850', width: 35.9, height: 23.9, megapixels: 45.7 },
      { label: 'D810 / D800', width: 35.9, height: 24.0, megapixels: 36.3 },
      { label: 'D780 / D750', width: 35.9, height: 23.9, megapixels: 24.5 },
      { label: 'D6 / D5', width: 35.9, height: 23.9, megapixels: 20.8 },
      { label: 'D7200 / D5600 / D3500 (DX)', width: 23.5, height: 15.6, megapixels: 24.2 },
      { label: 'D500 / D7500 (DX)', width: 23.5, height: 15.7, megapixels: 20.9 },
    ]
  },
  {
    groupName: 'Olympus / OM System (MFT)',
    presets: [
      { label: 'OM-1 Mark II / OM-1 / OM-5', width: 17.3, height: 13.0, megapixels: 20.4 },
      { label: 'E-M1X / E-M1 Mark III / E-M5 III', width: 17.3, height: 13.0, megapixels: 20.4 },
      { label: 'E-M10 Mark IV / PEN-F / PEN E-P7', width: 17.3, height: 13.0, megapixels: 20.3 },
      { label: 'E-M10 Mark III / E-M5 II / PEN E-PL10', width: 17.3, height: 13.0, megapixels: 16.1 },
    ]
  },
  {
    groupName: 'Panasonic Lumix (S & G Series)',
    presets: [
      { label: 'Lumix S1R (Full Frame)', width: 35.6, height: 23.8, megapixels: 47.3 },
      { label: 'Lumix S5 II / S5 IIX / S5 / S9 / S1H', width: 35.6, height: 23.8, megapixels: 24.2 },
      { label: 'Lumix GH6 / G9 II (MFT)', width: 17.3, height: 13.0, megapixels: 25.2 },
      { label: 'Lumix GH5 II / GH5 / G9', width: 17.3, height: 13.0, megapixels: 20.3 },
      { label: 'Lumix GH5S / BGH1', width: 17.3, height: 13.0, megapixels: 10.2 },
      { label: 'AU-EVA1 (Super 35 Cine)', width: 24.6, height: 13.8, megapixels: 17.3 },
      { label: 'VariCam LT / 35', width: 24.5, height: 13.8, megapixels: 8.9 },
    ]
  },
  {
    groupName: 'Pentax (Medium Format, FF, APS-C)',
    presets: [
      { label: 'Pentax 645Z (Medium Format)', width: 43.8, height: 32.8, megapixels: 51.4 },
      { label: 'Pentax K-1 Mark II / K-1 (FF)', width: 35.9, height: 24.0, megapixels: 36.4 },
      { label: 'Pentax K-3 Mark III / Monochrome (APS-C)', width: 23.3, height: 15.5, megapixels: 25.7 },
      { label: 'Pentax KF / K-70 / KP', width: 23.5, height: 15.6, megapixels: 24.2 },
    ]
  },
  {
    groupName: 'RED Digital Cinema',
    presets: [
      { label: 'V-RAPTOR [X] 8K VV / XL [X]', width: 40.96, height: 21.60, megapixels: 35.4 },
      { label: 'MONSTRO 8K VV', width: 40.96, height: 21.60, megapixels: 35.4 },
      { label: 'V-RAPTOR 8K S35 / XL S35', width: 26.21, height: 13.82, megapixels: 35.4 },
      { label: 'KOMODO-X 6K / KOMODO 6K', width: 27.03, height: 14.26, megapixels: 19.9 },
      { label: 'HELIUM 8K S35', width: 29.90, height: 15.77, megapixels: 35.4 },
      { label: 'DRAGON-X 6K S35', width: 30.70, height: 15.80, megapixels: 19.4 },
      { label: 'GEMINI 5K S35', width: 30.72, height: 18.00, megapixels: 15.4 },
    ]
  },
  {
    groupName: 'Samsung (NX Mount)',
    presets: [
      { label: 'NX1 / NX500', width: 23.5, height: 15.7, megapixels: 28.2 },
      { label: 'NX30 / NX300 / NX300M', width: 23.5, height: 15.7, megapixels: 20.3 },
      { label: 'NX Mini (1-inch)', width: 13.2, height: 8.8, megapixels: 20.5 },
    ]
  },
  {
    groupName: 'Sigma (FP & Quattro)',
    presets: [
      { label: 'Sigma fp L (Full Frame)', width: 35.9, height: 23.9, megapixels: 61.0 },
      { label: 'Sigma fp (Full Frame)', width: 35.9, height: 23.9, megapixels: 24.6 },
      { label: 'Sigma sd Quattro H (APS-H)', width: 26.7, height: 17.9, megapixels: 25.5 },
      { label: 'Sigma sd Quattro (APS-C)', width: 23.4, height: 15.5, megapixels: 19.6 },
    ]
  },
  {
    groupName: 'Sony Cinema Line',
    presets: [
      { label: 'VENICE 2 8K', width: 35.9, height: 24.0, megapixels: 50.0 },
      { label: 'BURANO', width: 35.9, height: 24.0, megapixels: 41.9 },
      { label: 'VENICE 1 / VENICE 2 6K', width: 35.6, height: 23.8, megapixels: 24.8 },
      { label: 'FX9', width: 35.6, height: 23.8, megapixels: 20.5 },
      { label: 'FX6 / FX3 / FR7', width: 35.6, height: 23.8, megapixels: 12.1 },
      { label: 'FX30 (Super 35)', width: 23.5, height: 15.6, megapixels: 26.0 },
      { label: 'FS7 II / FS7 / FS5', width: 23.6, height: 13.3, megapixels: 11.6 },
    ]
  },
  {
    groupName: 'Sony Alpha (Full Frame & APS-C)',
    presets: [
      { label: 'A7R V / A7R IV / A7CR', width: 35.6, height: 23.8, megapixels: 61.0 },
      { label: 'A1', width: 35.6, height: 23.8, megapixels: 50.1 },
      { label: 'A7R III / A7R II', width: 35.6, height: 23.8, megapixels: 42.4 },
      { label: 'A7 IV / A7C II', width: 35.6, height: 23.8, megapixels: 33.0 },
      { label: 'A9 III / A9 II / A7 III / A7C', width: 35.6, height: 23.8, megapixels: 24.2 },
      { label: 'A7S III / ZV-E1', width: 35.6, height: 23.8, megapixels: 12.1 },
      { label: 'A6700 (APS-C)', width: 23.5, height: 15.6, megapixels: 26.0 },
      { label: 'A6600 / A6400 / ZV-E10', width: 23.5, height: 15.6, megapixels: 24.2 },
    ]
  }
];

export interface FlattenedPreset extends CameraPreset {
  key: string;
  groupName: string;
}

export function getPresetKey(groupName: string, preset: CameraPreset): string {
  return preset.id || `${groupName}::${preset.label}`;
}

export const ALL_CAMERA_PRESETS: FlattenedPreset[] = CAMERA_PRESET_GROUPS.flatMap(grp =>
  grp.presets.map(p => ({
    ...p,
    key: getPresetKey(grp.groupName, p),
    groupName: grp.groupName,
  }))
);

export const CAMERA_PRESET_MAP: Record<string, FlattenedPreset> = ALL_CAMERA_PRESETS.reduce(
  (acc, curr) => {
    acc[curr.key] = curr;
    return acc;
  },
  {} as Record<string, FlattenedPreset>
);

export const FILTERS = [
  { value: 'none', labelKey: 'f_none', defaultNm: null },
  { value: 'uvircut', label: 'UV/IR CUT', defaultNm: 550 },
  { value: '550', label: '550 nm (Green Pass)', defaultNm: 550 },
  { value: '590', label: '590 nm (Orange / IR)', defaultNm: 590 },
  { value: '650', label: '650 nm (Deep Red)', defaultNm: 650 },
  { value: '720', label: '720 nm (Standard IR)', defaultNm: 720 },
  { value: '780', label: '780 nm (Near IR)', defaultNm: 780 },
  { value: '830', label: '830 nm (Wood Effect IR)', defaultNm: 830 },
  { value: '950', label: '950 nm (Deep IR)', defaultNm: 950 },
];

export const WAVELENGTH_PRESETS = [
  { label: 'UV', nm: 350, leftPct: '6.25%' },
  { label: 'BLUE', nm: 460, leftPct: '20%' },
  { label: 'GREEN', nm: 530, leftPct: '28.75%' },
  { label: 'YELLOW', nm: 580, leftPct: '35%' },
  { label: 'RED', nm: 660, leftPct: '45%' },
  { label: 'IR', nm: 850, leftPct: '68.75%' },
];

export const ANAMORPHIC_SQUEEZE_OPTIONS = [
  { value: 1.0, label: '1.0x (Spherical)' },
  { value: 1.33, label: '1.33x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.8, label: '1.8x' },
  { value: 2.0, label: '2.0x' },
];

export const TRANSLATIONS = {
  en: {
    title: "CAMERA LENS DIFFRACTION CALCULATOR",
    sec_sensor: "SENSOR & RESOLUTION",
    sensor_film: "SENSOR/FILM",
    custom_dim: "CUSTOM DIMENSIONS",
    width: "WIDTH",
    height: "HEIGHT",
    res_grain: "RESOLUTION ≈ GRAIN",
    format: "FORMAT",
    light_wave: "LIGHT WAVELENGTH",
    vis_light: "VISIBLE LIGHT",
    sec_lens: "LENS & OPTICS",
    focal_len: "FOCAL LENGTH",
    filters: "FILTERS",
    aperture: "APERTURE",
    transmittance: "LENS TRANSMITTANCE",
    sec_tol: "TOLERANCE & DIFFRACTION LIMITED APERTURE",
    tolerance: "TOLERANCE",
    sharpness: "SHARPNESS",
    pitch: "PIXEL/GRAIN PITCH",
    airy: "AIRY DISK DIAMETER",
    chart_title: "SHARPNESS VS APERTURE",
    t_physic: "1X (PHYSIC)",
    t_nyquist: "2X (NYQUIST)",
    t_visual: "3X (VISUAL)",
    f_none: "NONE",
    custom_focal: "CUSTOM...",
    s_sharp: "SHARP",
    s_optimal: "OPTIMAL",
    s_soft: "SOFT",
    s_blur: "BLUR",
    code_analysis_btn: "Code & Physics Analysis",
    copy_summary: "Copy Summary",
    copied: "Copied!",
    reset_to_preset: "Back to Presets",
    t_stop: "T-STOP",
    dla_badge: "Diffraction Limited Aperture",
    airy_desc: "Simulated Airy Disk vs 3x3 Sensor Pixels",
    chart_note: "Curve represents relative MTF / contrast loss caused by wave diffraction according to the Rayleigh criterion.",
    anamorphic: "ANAMORPHIC SQUEEZE",
    camera_report_btn: "Shot Sheet PDF",
    export_pdf: "Export Camera Report PDF",
    aspect_ratio: "ASPECT RATIO",
    desqueezed: "DESQUEEZED"
  },
  id: {
    title: "KALKULATOR DIFRAKSI LENSA KAMERA",
    sec_sensor: "SENSOR & RESOLUSI",
    sensor_film: "SENSOR/FILM",
    custom_dim: "DIMENSI KUSTOM",
    width: "LEBAR",
    height: "TINGGI",
    res_grain: "RESOLUSI ≈ GRAIN",
    format: "FORMAT",
    light_wave: "PANJANG GELOMBANG CAHAYA",
    vis_light: "CAHAYA TAMPAK",
    sec_lens: "LENSA & OPTIK",
    focal_len: "JARAK FOKUS",
    filters: "FILTER",
    aperture: "BUKAAN",
    transmittance: "TRANSMITANSI LENSA",
    sec_tol: "TOLERANSI & BATAS DIFRAKSI BUKAAN (DLA)",
    tolerance: "TOLERANSI",
    sharpness: "KETAJAMAN",
    pitch: "JARAK PIKSEL/GRAIN",
    airy: "DIAMETER CAKRAM AIRY",
    chart_title: "KETAJAMAN VS BUKAAN",
    t_physic: "1X (FISIK)",
    t_nyquist: "2X (NYQUIST)",
    t_visual: "3X (VISUAL)",
    f_none: "TIDAK ADA",
    custom_focal: "KUSTOM...",
    s_sharp: "TAJAM",
    s_optimal: "OPTIMAL",
    s_soft: "LEMBUT",
    s_blur: "BLUR",
    code_analysis_btn: "Analisis Kode & Fisika Optik",
    copy_summary: "Salin Ringkasan",
    copied: "Tersalin!",
    reset_to_preset: "Kembali ke Preset",
    t_stop: "T-STOP",
    dla_badge: "Batas Difraksi Bukaan (DLA)",
    airy_desc: "Simulasi Cakram Airy vs Kisi Piksel Sensor 3x3",
    chart_note: "Kurva merepresentasikan hilangnya kontras/MTF akibat efek difraksi gelombang cahaya berdasar kriteria Rayleigh.",
    anamorphic: "ANAMORPHIC SQUEEZE",
    camera_report_btn: "Shot Sheet PDF",
    export_pdf: "Ekspor Camera Report PDF",
    aspect_ratio: "ASIO ASPEK",
    desqueezed: "DESQUEEZED"
  }
};
