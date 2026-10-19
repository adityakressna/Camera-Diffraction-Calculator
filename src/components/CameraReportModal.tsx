import React, { useState } from 'react';
import { CameraReportMetadata, OpticsCalculationResult, OpticsState } from '../types';
import { generateCameraReportPdf } from '../utils/exportPdf';
import { X, FileDown, Film, Check, Clapperboard } from 'lucide-react';

interface CameraReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: OpticsState;
  results: OpticsCalculationResult;
  cameraPresetLabel?: string;
  lang: 'en' | 'id';
}

export const CameraReportModal: React.FC<CameraReportModalProps> = ({
  isOpen,
  onClose,
  state,
  results,
  cameraPresetLabel,
  lang,
}) => {
  const isId = lang === 'id';

  const [metadata, setMetadata] = useState<CameraReportMetadata>({
    projectTitle: 'Main Unit Feature',
    director: '',
    cinematographer: '',
    cameraUnit: 'A Cam',
    cameraModel: cameraPresetLabel || `${state.sensorWidth}x${state.sensorHeight}mm`,
    lensModel: `${state.focalLength}mm ${state.anamorphicSqueeze > 1.0 ? `${state.anamorphicSqueeze}x Anamorphic` : 'Prime'}`,
    scene: '14',
    take: '1',
    fps: '24',
    shutterAngle: '180°',
    iso: '800',
    notes: `Airy disk: ${results.airyDiskMicrons.toFixed(2)}µm. DLA: f/${results.dlaFNumber.toFixed(1)}. Status: ${results.status.toUpperCase()}.`,
  });

  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    try {
      generateCameraReportPdf(state, results, metadata, cameraPresetLabel);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="panel-card max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[var(--border-main)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-main)] bg-[var(--label-bg)] text-[var(--label-text)]">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-[#E85002]" />
            <h3 className="font-bold text-sm sm:text-base tracking-wide uppercase">
              {isId ? 'Lembar Laporan Kamera (Camera Report / Shot Sheet)' : 'Camera Report & Shot Sheet PDF'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-[var(--text-body)] font-sans">
          {/* Quick Summary Pill Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-main)] font-mono text-[11px]">
            <div>
              <span className="text-[var(--text-muted)] block text-[9px] font-sans font-bold">APERTURE</span>
              <strong className="text-[var(--text-body)]">f/{results.fNumber.toFixed(1)} (T/{results.tStop.toFixed(1)})</strong>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block text-[9px] font-sans font-bold">DLA THRESHOLD</span>
              <strong className="text-[#E85002]">f/{results.dlaFNumber.toFixed(1)}</strong>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block text-[9px] font-sans font-bold">ANAMORPHIC</span>
              <strong className="text-[var(--text-body)]">{state.anamorphicSqueeze}x ({results.desqueezedAspectLabel})</strong>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block text-[9px] font-sans font-bold">SHARPNESS</span>
              <strong className="uppercase" style={{ color: results.statusColor }}>{results.status}</strong>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                {isId ? 'Nama Proyek / Produksi' : 'Project Title'}
              </label>
              <input
                type="text"
                value={metadata.projectTitle}
                onChange={e => setMetadata(m => ({ ...m, projectTitle: e.target.value }))}
                className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                  Scene
                </label>
                <input
                  type="text"
                  value={metadata.scene}
                  onChange={e => setMetadata(m => ({ ...m, scene: e.target.value }))}
                  className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                  Take
                </label>
                <input
                  type="text"
                  value={metadata.take}
                  onChange={e => setMetadata(m => ({ ...m, take: e.target.value }))}
                  className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                {isId ? 'Unit / Kamera' : 'Camera Unit'}
              </label>
              <input
                type="text"
                value={metadata.cameraUnit}
                onChange={e => setMetadata(m => ({ ...m, cameraUnit: e.target.value }))}
                className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                {isId ? 'Model Lensa & Jarak Fokus' : 'Lens Model & Focal'}
              </label>
              <input
                type="text"
                value={metadata.lensModel}
                onChange={e => setMetadata(m => ({ ...m, lensModel: e.target.value }))}
                className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                Director
              </label>
              <input
                type="text"
                placeholder="e.g. Christopher Nolan"
                value={metadata.director}
                onChange={e => setMetadata(m => ({ ...m, director: e.target.value }))}
                className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                Director of Photography (DOP)
              </label>
              <input
                type="text"
                placeholder="e.g. Hoyte van Hoytema"
                value={metadata.cinematographer}
                onChange={e => setMetadata(m => ({ ...m, cinematographer: e.target.value }))}
                className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                  FPS
                </label>
                <input
                  type="text"
                  value={metadata.fps}
                  onChange={e => setMetadata(m => ({ ...m, fps: e.target.value }))}
                  className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                  Shutter
                </label>
                <input
                  type="text"
                  value={metadata.shutterAngle}
                  onChange={e => setMetadata(m => ({ ...m, shutterAngle: e.target.value }))}
                  className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                  ISO
                </label>
                <input
                  type="text"
                  value={metadata.iso}
                  onChange={e => setMetadata(m => ({ ...m, iso: e.target.value }))}
                  className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase">
                {isId ? 'Catatan Tambahan (Remarks)' : 'Production Notes'}
              </label>
              <input
                type="text"
                value={metadata.notes}
                onChange={e => setMetadata(m => ({ ...m, notes: e.target.value }))}
                className="w-full h-8 px-2.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)] outline-none text-[var(--text-body)] font-mono text-xs"
              />
            </div>
          </div>

          <div className="text-[10px] text-[var(--text-muted)] font-mono bg-[var(--bg-card)]/50 p-2.5 rounded border border-[var(--border-main)]">
            * PDF yang dihasilkan berformat A4 dengan tata letak resmi lembar laporan kamera (Camera Report / Shot Sheet), siap cetak atau diarsipkan untuk tim DIT, post-production VFX, dan camera department.
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-main)] bg-[var(--bg-card)] flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[var(--border-main)] text-[var(--text-body)] hover:bg-[var(--btn-hover)] font-mono text-xs font-semibold transition-colors"
          >
            {isId ? 'Batal' : 'Cancel'}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E85002] hover:bg-[#d44700] text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? (isId ? 'Memproses PDF...' : 'Exporting...') : (isId ? 'Unduh Camera Report PDF' : 'Download Camera Report PDF')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
