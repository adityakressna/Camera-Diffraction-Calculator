/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  CAMERA_PRESET_GROUPS,
  CAMERA_PRESET_MAP,
  getPresetKey,
  F_STOPS,
  STOPS_LABELS,
  FOCAL_PRESETS,
  VIDEO_RESOLUTIONS,
  FILTERS,
  WAVELENGTH_PRESETS,
  ANAMORPHIC_SQUEEZE_OPTIONS,
  TRANSLATIONS,
} from './data/presets';
import { Mode, Tolerance, Language, OpticsState, AnamorphicSqueeze } from './types';
import { calculateOpticsData, computeSharpnessCurve, getWaveColor } from './utils/optics';
import { DiffractionCanvas } from './components/DiffractionCanvas';
import { SharpnessChart } from './components/SharpnessChart';
import { CameraReportModal } from './components/CameraReportModal';
import { ChevronDown, Moon, Sun, RotateCcw, FileDown } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('id');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Optical State
  const [state, setState] = useState<OpticsState>({
    sensorWidth: 35.6,
    sensorHeight: 23.8,
    megapixels: 12.1,
    videoResPx: 1920,
    mode: 'video',
    wavelengthNm: 550,
    focalLength: 200,
    focalLengthMode: 'preset',
    fStopIndex: 24, // f/22.0
    transmittance: 100,
    tolerance: 3, // 3x Visual
    activeFilter: 'uvircut',
    anamorphicSqueeze: 1.0,
  });

  const [selectedPreset, setSelectedPreset] = useState<string>('Sony Cinema Line::Sony FX3');

  // Sync dark theme class on document.body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  const t = TRANSLATIONS[lang];

  // Calculated values
  const results = useMemo(() => calculateOpticsData(state), [state]);

  // Sharpness curve data for Chart.js
  const chartCurveData = useMemo(() => {
    return computeSharpnessCurve(
      results.pixelPitchMicrons,
      state.wavelengthNm / 1000,
      state.tolerance
    );
  }, [results.pixelPitchMicrons, state.wavelengthNm, state.tolerance]);

  const waveColor = useMemo(() => getWaveColor(state.wavelengthNm), [state.wavelengthNm]);

  // Handler for camera preset dropdown change
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPreset(val);
    if (val === 'custom') return;

    const preset = CAMERA_PRESET_MAP[val];
    if (preset) {
      const isFilm = Boolean(preset.isFilm || preset.groupName.toLowerCase().includes('film'));
      setState(prev => ({
        ...prev,
        sensorWidth: preset.width,
        sensorHeight: preset.height,
        megapixels: preset.megapixels,
        mode: isFilm ? 'film' : (prev.mode === 'film' ? 'photo' : prev.mode),
      }));
    }
  };

  // Handler for filter dropdown
  const handleFilterChange = (filterVal: string) => {
    if (filterVal === 'uvircut') {
      setState(prev => ({ ...prev, activeFilter: filterVal, wavelengthNm: 550 }));
    } else if (filterVal !== 'none') {
      const nm = parseInt(filterVal, 10);
      setState(prev => ({ ...prev, activeFilter: filterVal, wavelengthNm: nm }));
    } else {
      setState(prev => ({ ...prev, activeFilter: 'none' }));
    }
  };

  // Handler for wavelength slider
  const handleWavelengthChange = (nm: number) => {
    // Check if it matches any exact filter
    const matchedFilter = FILTERS.find(f => f.value === nm.toString());
    const filterKey = matchedFilter ? matchedFilter.value : 'none';

    setState(prev => ({
      ...prev,
      wavelengthNm: nm,
      activeFilter: filterKey,
    }));
  };

  // Switch between Video, Photo, Film
  const setMode = (mode: Mode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const currentPresetLabel = useMemo(() => {
    if (selectedPreset === 'custom') return 'Custom Dimensions';
    const preset = CAMERA_PRESET_MAP[selectedPreset];
    if (preset) {
      return `${preset.label} (${preset.groupName})`;
    }
    return `${state.sensorWidth} x ${state.sensorHeight} mm`;
  }, [selectedPreset, state.sensorWidth, state.sensorHeight]);

  return (
    <div className="p-3 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 relative">

        {/* HEADER & CONTROLS */}
        <div className="flex justify-between items-center mb-3 sm:mb-6 gap-2">
          <h1 className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-[var(--text-title)] tracking-wide whitespace-nowrap truncate">
            {t.title}
          </h1>

          {/* Action buttons: Shot Sheet PDF, Lang, Theme */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[#E85002] hover:bg-[var(--btn-hover)] font-mono text-[10px] sm:text-[12px] font-bold transition-all shadow-sm active:scale-95"
              title="One-click Camera Report / Shot Sheet PDF export"
            >
              <FileDown className="w-3.5 h-3.5 text-[#E85002]" />
              <span className="text-[#E85002]">{t.camera_report_btn}</span>
            </button>

            <button
              onClick={() => setLang(l => (l === 'en' ? 'id' : 'en'))}
              className="flex items-center justify-center h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-body)] font-mono text-[10px] sm:text-[12px] font-bold hover:bg-[var(--btn-hover)] transition-all"
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setIsDark(d => !d)}
              className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-body)] hover:bg-[var(--btn-hover)] transition-all"
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* ROW 1: SENSOR & RESOLUTION */}
        <div className="panel-card p-4 sm:p-6">
          <h2 className="text-xs sm:text-sm font-bold text-[var(--text-header)] mb-4 sm:mb-5 tracking-wider uppercase">
            {t.sec_sensor}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6">
            {/* Left Column: Camera Preset & Dimensions */}
            <div className="space-y-3 sm:space-y-4">
              {/* Sensor / Film Preset Dropdown */}
              <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[38px] sm:h-[42px] bg-transparent transition-colors">
                <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[9px] sm:text-[11px] font-bold tracking-wider flex items-center justify-center px-2 sm:px-4 w-[90px] sm:w-[140px] shrink-0">
                  {t.sensor_film}
                </div>
                <div className="flex-1 relative flex items-center">
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#E85002] absolute left-2 sm:left-3 pointer-events-none" />
                  <select
                    value={selectedPreset}
                    onChange={handlePresetChange}
                    className="w-full h-full bg-transparent appearance-none outline-none font-mono text-[12px] sm:text-[15px] pl-7 sm:pl-10 pr-3 text-[var(--text-body)] cursor-pointer truncate"
                  >
                    <option value="custom">{t.custom_dim}</option>
                    {CAMERA_PRESET_GROUPS.map(grp => (
                      <optgroup key={grp.groupName} label={grp.groupName}>
                        {grp.presets.map(p => {
                          const key = getPresetKey(grp.groupName, p);
                          return (
                            <option key={key} value={key}>
                              {p.label}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sensor Width & Height */}
              <div className="flex justify-between w-full gap-2 sm:gap-4">
                <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[36px] flex-1">
                  <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[9px] sm:text-[10px] font-bold tracking-wider flex items-center justify-center px-1 sm:px-3 w-[55px] sm:w-[65px] shrink-0">
                    {t.width}
                  </div>
                  <div className="flex-1 flex items-center bg-transparent px-2">
                    <input
                      type="number"
                      value={state.sensorWidth}
                      step={0.1}
                      min={1}
                      onChange={e => {
                        setSelectedPreset('custom');
                        setState(prev => ({ ...prev, sensorWidth: parseFloat(e.target.value) || 0 }));
                      }}
                      className="w-full bg-transparent outline-none font-mono text-[13px] sm:text-sm text-center text-[var(--text-body)] no-spinners"
                    />
                    <span className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)] ml-1">mm</span>
                  </div>
                </div>

                <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[36px] flex-1">
                  <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[9px] sm:text-[10px] font-bold tracking-wider flex items-center justify-center px-1 sm:px-3 w-[55px] sm:w-[65px] shrink-0">
                    {t.height}
                  </div>
                  <div className="flex-1 flex items-center bg-transparent px-2">
                    <input
                      type="number"
                      value={state.sensorHeight}
                      step={0.1}
                      min={1}
                      onChange={e => {
                        setSelectedPreset('custom');
                        setState(prev => ({ ...prev, sensorHeight: parseFloat(e.target.value) || 0 }));
                      }}
                      className="w-full bg-transparent outline-none font-mono text-[13px] sm:text-sm text-center text-[var(--text-body)] no-spinners"
                    />
                    <span className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)] ml-1">mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Resolution / Grain & Mode Toggle */}
            <div className="space-y-3 sm:space-y-4">
              {/* Resolution Input (Video vs Photo/Film) */}
              <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[38px] sm:h-[42px] bg-transparent">
                <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[9px] sm:text-[11px] font-bold tracking-wider flex items-center justify-center px-2 sm:px-4 w-[110px] sm:w-[180px] shrink-0 text-center">
                  {t.res_grain}
                </div>

                <div className="flex-1 relative flex items-center">
                  {state.mode === 'video' ? (
                    <>
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#E85002] absolute left-2 sm:left-3 pointer-events-none" />
                      <select
                        value={state.videoResPx}
                        onChange={e => setState(prev => ({ ...prev, videoResPx: parseInt(e.target.value, 10) }))}
                        className="w-full h-full bg-transparent appearance-none outline-none font-mono text-[12px] sm:text-[14px] font-bold pl-7 sm:pl-10 pr-2 text-[var(--text-body)] cursor-pointer"
                      >
                        {VIDEO_RESOLUTIONS.map(group => (
                          <optgroup key={group.group} label={group.group}>
                            {group.options.map(opt => (
                              <option key={opt.label} value={opt.widthPx}>
                                {opt.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center pl-4 sm:pl-6 pr-4">
                      <input
                        type="number"
                        value={state.megapixels}
                        step={0.1}
                        min={0.1}
                        onChange={e => {
                          setSelectedPreset('custom');
                          setState(prev => ({ ...prev, megapixels: parseFloat(e.target.value) || 0 }));
                        }}
                        className="w-full bg-transparent outline-none font-mono text-[14px] sm:text-lg text-[var(--text-body)] font-bold text-center"
                      />
                      <span className="font-mono text-[13px] sm:text-base text-[var(--text-muted)] font-bold ml-1">
                        MP
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Format Toggle (Film / Photo / Video) */}
              <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[38px] sm:h-[42px] bg-transparent">
                <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[9px] sm:text-[11px] font-bold tracking-wider flex items-center justify-center px-4 sm:px-6 shrink-0">
                  {t.format}
                </div>
                <div className="flex-1 flex items-center justify-around px-1 sm:px-2 gap-1">
                  {(['film', 'photo', 'video'] as Mode[]).map(m => {
                    const isActive = state.mode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`font-mono text-[11px] sm:text-base px-2.5 sm:px-4 py-1 rounded-md transition-colors uppercase ${
                          isActive
                            ? 'bg-[#E85002] text-[#1A1A1A] font-bold shadow-sm'
                            : 'text-[var(--text-body)] hover:bg-[var(--btn-hover)]'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: LIGHT WAVELENGTH */}
        <div className="panel-card p-4 sm:p-6 relative">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[var(--text-header)] tracking-wider uppercase">
                {t.light_wave}
              </h2>
              <div className="text-[10px] text-[var(--text-muted)]">
                300 nm (Near UV) — 1100 nm (Near Infrared)
              </div>
            </div>
            <div
              className="value-display px-3 py-1 font-mono font-bold text-[14px] sm:text-[18px] transition-colors"
              style={{ color: waveColor.hex }}
            >
              {state.wavelengthNm} nm
            </div>
          </div>

          {/* Visible Light Range Indicator Bar */}
          <div className="relative w-full mb-2 h-4 text-[6px] min-[360px]:text-[7px] sm:text-[9.5px] font-bold text-[var(--text-muted)] uppercase">
            <div className="absolute left-[10%] h-2 border-l border-[var(--border-main)] top-0" />
            <div className="absolute left-[10%] right-[43.75%] text-center tracking-tight sm:tracking-normal top-0 whitespace-nowrap flex items-center justify-center h-2 px-0.5">
              {t.vis_light} (380 - 750 nm)
            </div>
            <div className="absolute left-[56.25%] h-2 border-r border-[var(--border-main)] top-0" />
          </div>

          {/* Spectrum gradient bar preview */}
          <div className="w-full h-2 rounded-full mb-3 opacity-90 overflow-hidden shadow-inner"
               style={{
                 background: 'linear-gradient(to right, #7E57C2 0%, #1565C0 15%, #2E7D32 30%, #C67D00 45%, #C62828 65%, #E85002 100%)'
               }}
          />

          {/* Range Slider */}
          <div className="px-0 relative mb-2">
            <input
              type="range"
              min={300}
              max={1100}
              step={10}
              value={state.wavelengthNm}
              onChange={e => handleWavelengthChange(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>

          {/* Preset Buttons */}
          <div className="relative w-full h-8 mt-2 font-sans">
            {WAVELENGTH_PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleWavelengthChange(p.nm)}
                style={{ left: p.leftPct }}
                className="absolute top-0 -translate-x-1/2 text-[9px] sm:text-[10px] font-semibold border border-[var(--border-main)] text-[var(--text-body)] bg-[var(--bg-card)] rounded px-1.5 sm:px-2 py-0.5 hover:bg-[var(--btn-hover)] transition-colors active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 3: SPLIT LENS (LEFT) & TOLERANCE / RESULTS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* LEFT: LENS & OPTICS */}
          <div className="panel-card p-4 sm:p-6 flex flex-col justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-[var(--text-header)] mb-4 tracking-wider uppercase">
              {t.sec_lens}
            </h2>

            {/* Focal Length & Filters */}
            <div className="flex flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
              {/* Focal Length */}
              <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[36px] sm:h-[42px] flex-1 min-w-0 bg-transparent">
                <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[7.5px] sm:text-[11px] font-bold tracking-tight sm:tracking-wider flex items-center justify-center px-1 sm:px-3 w-[54px] sm:w-[90px] shrink-0 text-center uppercase leading-tight">
                  {t.focal_len}
                </div>
                <div className="flex-1 min-w-0 relative flex items-center bg-[var(--bg-card)]">
                  {state.focalLengthMode === 'preset' ? (
                    <>
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#E85002] absolute left-1.5 sm:left-3 pointer-events-none" />
                      <select
                        value={state.focalLength}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'custom') {
                            setState(prev => ({ ...prev, focalLengthMode: 'custom' }));
                          } else {
                            setState(prev => ({ ...prev, focalLength: parseFloat(val) }));
                          }
                        }}
                        className="w-full h-full bg-transparent appearance-none outline-none font-mono text-[11px] sm:text-[15px] pl-5 sm:pl-9 pr-1 text-[var(--text-body)] cursor-pointer"
                      >
                        {FOCAL_PRESETS.map(f => (
                          <option key={f} value={f}>
                            {f} mm
                          </option>
                        ))}
                        <option value="custom">{t.custom_focal}</option>
                      </select>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center pl-1.5 pr-6 sm:pr-8 relative">
                      <input
                        type="number"
                        value={state.focalLength}
                        min={1}
                        onChange={e => setState(prev => ({ ...prev, focalLength: parseFloat(e.target.value) || 0 }))}
                        className="w-full h-full bg-transparent outline-none font-mono text-[11px] sm:text-[15px] text-[var(--text-body)] no-spinners text-right pr-1"
                        placeholder="e.g. 58"
                      />
                      <span className="font-mono text-[10px] sm:text-[14px] text-[var(--text-body)] pointer-events-none">
                        mm
                      </span>
                      <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, focalLengthMode: 'preset', focalLength: 200 }))}
                        className="absolute right-1 sm:right-1.5 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[var(--text-muted)] hover:text-[#E85002] transition-colors rounded-full"
                        title={t.reset_to_preset}
                      >
                        <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[36px] sm:h-[42px] flex-1 min-w-0 bg-transparent">
                <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[7.5px] sm:text-[11px] font-bold tracking-tight sm:tracking-wider flex items-center justify-center px-1 sm:px-3 w-[54px] sm:w-[90px] shrink-0 text-center uppercase leading-tight">
                  {t.filters}
                </div>
                <div className="flex-1 min-w-0 relative flex items-center bg-[var(--bg-card)]">
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#E85002] absolute left-1.5 sm:left-3 pointer-events-none" />
                  <select
                    value={state.activeFilter}
                    onChange={e => handleFilterChange(e.target.value)}
                    className="w-full h-full bg-transparent appearance-none outline-none font-mono text-[11px] sm:text-[15px] pl-5 sm:pl-9 pr-1 text-[var(--text-body)] cursor-pointer"
                  >
                    {FILTERS.map(f => (
                      <option key={f.value} value={f.value}>
                        {f.value === 'none' ? t.f_none : f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ANAMORPHIC SQUEEZE SELECTOR */}
            <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[38px] sm:h-[42px] bg-transparent mb-4 sm:mb-6">
              <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[9px] sm:text-[11px] font-bold tracking-wider flex items-center justify-center px-3 sm:px-4 shrink-0">
                {t.anamorphic}
              </div>
              <div className="flex-1 flex items-center justify-around px-1 sm:px-2 gap-1 bg-[var(--bg-card)]">
                {ANAMORPHIC_SQUEEZE_OPTIONS.map(opt => {
                  const isSelected = state.anamorphicSqueeze === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, anamorphicSqueeze: opt.value as AnamorphicSqueeze }))}
                      className={`font-mono text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded transition-colors ${
                        isSelected
                          ? 'bg-[#E85002] text-white font-bold shadow-sm'
                          : 'text-[var(--text-body)] hover:bg-[var(--btn-hover)]'
                      }`}
                      title={opt.label}
                    >
                      {opt.value === 1.0 ? '1.0x' : `${opt.value}x`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Readout Values: f-Number, Entrance Pupil (EN), T-Stop */}
            <div className="flex justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="value-display flex-1 text-[15px] sm:text-[20px] py-1.5 sm:py-2 font-bold text-[var(--text-body)] flex items-center justify-center">
                f/{results.fNumber.toFixed(1)}
              </div>
              <div className="value-display flex-[2] flex justify-between px-3 sm:px-4 py-1.5 sm:py-2 items-center">
                <span className="text-[var(--text-muted)] font-sans font-bold uppercase text-[11px] sm:text-xs tracking-wider">
                  EN
                </span>
                <span className="font-mono font-bold text-[16px] sm:text-[21px] text-[var(--text-body)] tracking-tight">
                  {results.entrancePupilMm.toFixed(2)} mm
                </span>
              </div>
              <div className="value-display flex-1 text-[15px] sm:text-[20px] py-1.5 sm:py-2 font-bold text-[var(--text-body)] flex items-center justify-center">
                T/{results.tStop.toFixed(1)}
              </div>
            </div>

            {/* Aperture Slider & Quick Stops */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] sm:text-xs font-bold text-[var(--text-header)] uppercase">
                  {t.aperture}
                </h3>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  Stop {state.fStopIndex + 1} / {F_STOPS.length}
                </span>
              </div>
              <div className="px-0 relative mb-2">
                <input
                  type="range"
                  min={0}
                  max={F_STOPS.length - 1}
                  step={1}
                  value={state.fStopIndex}
                  onChange={e => setState(prev => ({ ...prev, fStopIndex: parseInt(e.target.value, 10) }))}
                  className="w-full"
                />
              </div>
              {/* Quick Aperture Stop Marks */}
              <div className="relative h-[22px] font-mono text-[var(--text-muted)]">
                {STOPS_LABELS.map(stop => {
                  const idx = F_STOPS.findIndex(f => f >= stop);
                  const pct = (idx / (F_STOPS.length - 1)) * 100;
                  const isSelected = F_STOPS[state.fStopIndex] === stop;
                  return (
                    <button
                      key={stop}
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, fStopIndex: idx }))}
                      style={{ left: `calc(${pct}% + ${10 - (pct / 100) * 20}px)` }}
                      className={`border border-[var(--border-main)] rounded px-1 sm:px-1.5 py-0.5 absolute top-0 -translate-x-1/2 text-[9px] sm:text-[10px] transition-colors ${
                        isSelected
                          ? 'bg-[#E85002] text-white font-bold border-[#E85002]'
                          : 'bg-[var(--bg-card)] hover:bg-[var(--btn-hover)] text-[var(--text-body)]'
                      }`}
                    >
                      {stop}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lens Transmittance Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] sm:text-xs font-bold text-[var(--text-header)] uppercase">
                  {t.transmittance}
                </h3>
                <div className="value-display px-2 sm:px-3 text-xs sm:text-sm font-bold py-0.5 text-[var(--text-body)]">
                  {state.transmittance}%
                </div>
              </div>
              <div className="px-0 relative mb-2">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={state.transmittance}
                  onChange={e => setState(prev => ({ ...prev, transmittance: parseInt(e.target.value, 10) }))}
                  className="w-full"
                />
              </div>
              <div className="relative h-[20px] sm:h-[24px] font-mono text-[10px] sm:text-[11px] text-[var(--text-muted)]">
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, transmittance: 10 }))}
                  style={{ left: 'calc(0% + 10px)' }}
                  className={`border border-[var(--border-main)] rounded px-1.5 sm:px-2 py-0.5 absolute top-0 -translate-x-1/2 cursor-pointer hover:bg-[var(--btn-hover)] bg-[var(--bg-card)] transition-colors ${
                    state.transmittance === 10 ? 'border-[#E85002] text-[#E85002] font-bold' : ''
                  }`}
                >
                  10
                </button>
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, transmittance: 92 }))}
                  style={{ left: 'calc(91.11% - 8px)' }}
                  className={`border border-[var(--border-main)] rounded px-1.5 sm:px-2 py-0.5 absolute top-0 -translate-x-1/2 cursor-pointer hover:bg-[var(--btn-hover)] bg-[var(--bg-card)] transition-colors ${
                    state.transmittance === 92 ? 'border-[#E85002] text-[#E85002] font-bold' : ''
                  }`}
                >
                  92%
                </button>
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, transmittance: 100 }))}
                  style={{ left: 'calc(100% - 10px)' }}
                  className={`border border-[var(--border-main)] rounded px-1.5 sm:px-2 py-0.5 absolute top-0 -translate-x-1/2 cursor-pointer hover:bg-[var(--btn-hover)] bg-[var(--bg-card)] transition-colors ${
                    state.transmittance === 100 ? 'border-[#E85002] text-[#E85002] font-bold' : ''
                  }`}
                >
                  100
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: TOLERANCE & DIFFRACTION RESULTS */}
          <div className="panel-card p-4 sm:p-6 flex flex-col justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-[var(--text-header)] mb-4 tracking-wider uppercase">
              {t.sec_tol}
            </h2>

            {/* Top Banner (Tolerance Selector & DLA Display) */}
            <div className="flex flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
              {/* Tolerance Selector */}
              <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[36px] sm:h-[42px] flex-1 min-w-0 bg-transparent">
                <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[7.5px] sm:text-[11px] font-bold tracking-tight sm:tracking-wider flex items-center justify-center px-1 sm:px-3 w-[54px] sm:w-[90px] shrink-0 text-center uppercase leading-tight">
                  {t.tolerance}
                </div>
                <div className="flex-1 min-w-0 relative flex items-center bg-[var(--bg-card)]">
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#E85002] absolute left-1.5 sm:left-3 pointer-events-none" />
                  <select
                    value={state.tolerance}
                    onChange={e => setState(prev => ({ ...prev, tolerance: parseInt(e.target.value, 10) as Tolerance }))}
                    className="w-full h-full bg-transparent appearance-none outline-none font-mono text-[10px] sm:text-[14px] pl-5 sm:pl-9 pr-1 text-[var(--text-body)] cursor-pointer"
                  >
                    <option value={1}>{t.t_physic}</option>
                    <option value={2}>{t.t_nyquist}</option>
                    <option value={3}>{t.t_visual}</option>
                  </select>
                </div>
              </div>

              {/* DLA Readout */}
              <div className="flex border border-[var(--border-main)] rounded-lg overflow-hidden h-[36px] sm:h-[42px] flex-1 min-w-0 bg-[var(--bg-card)]">
                <div className="bg-[var(--label-bg)] text-[var(--label-text)] text-[7.5px] sm:text-[11px] font-bold tracking-tight sm:tracking-wider flex items-center justify-center px-1 sm:px-3 w-[54px] sm:w-[90px] shrink-0 text-center uppercase leading-tight">
                  DLA
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-end px-2 sm:px-3">
                  <span className="font-mono text-[13px] sm:text-[18px] font-bold text-[#E85002]">
                    f/{results.dlaFNumber.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Split: Canvas (Left) & Metrics Column (Right) */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1 items-center sm:items-stretch">
              {/* Canvas Box */}
              <div className="w-full sm:flex-1 border border-[var(--border-main)] rounded-lg bg-[var(--bg-card)] p-4 flex flex-col justify-center items-center relative transition-colors">
                <DiffractionCanvas
                  pixelPitchMicrons={results.pixelPitchMicrons}
                  airyDiskMicrons={results.airyDiskMicrons}
                  wavelengthNm={state.wavelengthNm}
                  isDark={isDark}
                  anamorphicSqueeze={state.anamorphicSqueeze}
                />
              </div>

              {/* Metrics Column */}
              <div className="w-full sm:w-44 grid grid-cols-2 sm:flex sm:flex-col gap-3 sm:gap-3.5">
                {/* Sharpness Status Indicator */}
                <div
                  className="rounded-lg p-2.5 sm:p-3 text-center flex flex-col justify-center col-span-2 sm:col-span-1 border-2 transition-all shadow-sm"
                  style={{
                    borderColor: results.statusBorderColor,
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <div
                    className="text-[9px] sm:text-[10px] font-bold mb-0.5 tracking-wider uppercase"
                    style={{ color: results.statusColor }}
                  >
                    {t.sharpness}
                  </div>
                  <div
                    className="text-[18px] sm:text-[22px] font-mono font-bold uppercase tracking-wide"
                    style={{ color: results.statusColor }}
                  >
                    {t[`s_${results.status}` as keyof typeof t]}
                  </div>
                </div>

                {/* Pixel Pitch Card */}
                <div className="border border-[var(--border-main)] bg-[var(--bg-card)] rounded-lg p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <div className="text-[8px] sm:text-[9px] font-bold text-[var(--text-header)] mb-0.5 uppercase">
                    {t.pitch}
                  </div>
                  <div className="text-[13px] sm:text-[17px] font-mono font-bold text-[var(--text-body)]">
                    {results.pixelPitchMicrons.toFixed(2)} µm
                  </div>
                </div>

                {/* Airy Disk Diameter Card */}
                <div className="border border-[var(--border-main)] bg-[var(--bg-card)] rounded-lg p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <div className="text-[8px] sm:text-[9px] font-bold text-[var(--text-header)] mb-0.5 uppercase">
                    {t.airy}
                  </div>
                  <div className="text-[13px] sm:text-[17px] font-mono font-bold text-[var(--text-body)]">
                    {results.airyDiskMicrons.toFixed(2)} µm
                  </div>
                </div>

                {/* Anamorphic Desqueezed Aspect Ratio */}
                {state.anamorphicSqueeze > 1.0 && (
                  <div className="border border-[var(--border-main)] bg-[var(--bg-card)] rounded-lg p-2 sm:p-2.5 text-center flex flex-col justify-center col-span-2 sm:col-span-1 transition-colors">
                    <div className="text-[8px] sm:text-[9px] font-bold text-[var(--text-header)] mb-0.5 uppercase tracking-wider">
                      {t.aspect_ratio}
                    </div>
                    <div className="text-[13px] sm:text-[17px] font-mono font-bold text-[#E85002]">
                      {results.desqueezedAspectLabel}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: CHART */}
        <div className="panel-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-[var(--text-header)] tracking-wider uppercase">
              {t.chart_title}
            </h2>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              {t.chart_note}
            </div>
          </div>

          <SharpnessChart
            dataPoints={chartCurveData}
            currentFStopIndex={state.fStopIndex}
            isDark={isDark}
            lang={lang}
          />
        </div>

      </div>

      {/* One-click Camera Report & Shot Sheet PDF Modal */}
      <CameraReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        state={state}
        results={results}
        cameraPresetLabel={currentPresetLabel}
        lang={lang}
      />
    </div>
  );
}
