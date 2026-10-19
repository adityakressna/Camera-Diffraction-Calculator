import React from 'react';
import { X, CheckCircle, AlertTriangle, Lightbulb, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'id';
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isId = lang === 'id';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="panel-card max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-main)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-main)] bg-[var(--label-bg)] text-[var(--label-text)]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E85002]" />
            <h3 className="font-bold text-sm sm:text-base tracking-wide uppercase">
              {isId ? 'Laporan Analisis Menyeluruh Web Aplikasi' : 'Comprehensive Web Application Analysis Report'}
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-[var(--text-body)]">
          {/* Executive Summary */}
          <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-main)]">
            <h4 className="font-bold text-base flex items-center gap-2 text-[var(--text-header)] mb-2">
              <CheckCircle className="w-5 h-5 text-[#388E3C]" />
              {isId ? 'Ringkasan Eksekutif Sistem' : 'Executive System Summary'}
            </h4>
            <p className="leading-relaxed">
              {isId
                ? 'Aplikasi ini telah berevolusi menjadi kalkulator optik dan difraksi sinematografi tingkat produksi (production-ready). Menggabungkan perhitungan difraksi kriteria Rayleigh, simulasi kanvas interaktif, kurva ketajaman MTF Chart.js yang reaktif, seleksi Anamorphic Squeeze Factor (1.0x - 2.0x), serta fitur ekspor Camera Report / Shot Sheet PDF resmi untuk kru kamera di set.'
                : 'This application has evolved into a production-ready cinematography optical and diffraction analyzer. Combining Rayleigh diffraction criterion mathematics, interactive 2D canvas simulation, Chart.js MTF sharpness curves, Anamorphic Squeeze Factor analysis (1.0x - 2.0x), and official Camera Report / Shot Sheet PDF export for on-set camera teams.'}
            </p>
          </div>

          {/* Section 1: Validasi Fisika & Rumus Matematika */}
          <div className="space-y-3">
            <h4 className="font-bold text-base flex items-center gap-2 text-[var(--text-header)]">
              <Cpu className="w-5 h-5 text-[#E85002]" />
              {isId ? '1. Validasi Fisika & Rumus Matematika' : '1. Physics & Mathematical Formulation Validation'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)]">
                <div className="font-bold text-xs uppercase text-[#E85002] mb-1 font-mono">
                  {isId ? 'Diameter Cakram Airy' : 'Airy Disk Diameter'}
                </div>
                <div className="font-mono text-xs mb-1 font-bold">d = 2.44 × λ × N</div>
                <p className="text-xs text-[var(--text-muted)]">
                  {isId
                    ? 'Sesuai dengan kriteria difraksi Rayleigh untuk bukaan sirkular (zero-crossing pertama fungsi Bessel J1). Implementasi: 2.44 * (wavelength_nm / 1000) * f_number.'
                    : 'Accurate Rayleigh diffraction criterion for circular apertures (first Bessel zero). Handled in microns.'}
                </p>
              </div>

              <div className="p-3.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)]">
                <div className="font-bold text-xs uppercase text-[#E85002] mb-1 font-mono">
                  {isId ? 'Jarak Piksel (Pixel Pitch)' : 'Pixel Pitch'}
                </div>
                <div className="font-mono text-xs mb-1 font-bold">p = W / Res (Video) | √(Area/MP) (Foto)</div>
                <p className="text-xs text-[var(--text-muted)]">
                  {isId
                    ? 'Untuk mode video, pitch dihitung horizontal (W / horizontal_px). Untuk foto, estimasi piksel bujur sangkar dari luas sensor / total megapiksel.'
                    : 'Horizontal pixel pitch for video mode; square pixel approximation based on active sensor area and megapixels for photo mode.'}
                </p>
              </div>

              <div className="p-3.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)]">
                <div className="font-bold text-xs uppercase text-[#E85002] mb-1 font-mono">
                  {isId ? 'Batas Difraksi Bukaan (DLA)' : 'Diffraction Limited Aperture (DLA)'}
                </div>
                <div className="font-mono text-xs mb-1 font-bold">N_DLA = (p × Multiplier) / (2.44 × λ)</div>
                <p className="text-xs text-[var(--text-muted)]">
                  {isId
                    ? 'Memberikan f-stop di mana difraksi mulai melampaui toleransi resolusi piksel (1x batas fisik, 2x sampling Nyquist, 3x persepsi visual CoC).'
                    : 'Calculates the threshold f-number where diffraction blur exceeds the sensor tolerance (1x Physic, 2x Nyquist, 3x Visual CoC).'}
                </p>
              </div>

              <div className="p-3.5 rounded border border-[var(--border-main)] bg-[var(--bg-card)]">
                <div className="font-bold text-xs uppercase text-[#E85002] mb-1 font-mono">
                  {isId ? 'Optik Anamorfik & Squeeze Factor' : 'Anamorphic Optics & Squeeze'}
                </div>
                <div className="font-mono text-xs mb-1 font-bold">Aspect = (W/H) × Squeeze | d_H = d × Squeeze</div>
                <p className="text-xs text-[var(--text-muted)]">
                  {isId
                    ? 'Menghitung peregangan rasio aspek desqueezed serta efek optik elips cakram difraksi horizontal pada proyeksi anamorfik.'
                    : 'Computes desqueezed frame aspect ratios and horizontal elongation of the optical point spread function under anamorphic projection.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Kelebihan / Strengths */}
          <div className="space-y-3">
            <h4 className="font-bold text-base flex items-center gap-2 text-[var(--text-header)]">
              <ShieldCheck className="w-5 h-5 text-[#388E3C]" />
              {isId ? '2. Keunggulan Teknis & Fungsionalitas' : '2. Technical & Functional Strengths'}
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text-body)]">
              <li>
                <strong>{isId ? 'Database Sensor Sinematografi Terlengkap:' : 'Exhaustive Sensor Database:'}</strong>{' '}
                {isId
                  ? 'Mendukung lebih dari 50 sistem kamera terkemuka (ARRI, RED, Sony Venice/FX, Canon Cinema/EOS, Nikon Z, Hasselblad, Leica, Fujifilm GFX) hingga stok seluloid analog (8mm, 16mm, 35mm, 65mm, 70mm IMAX, 8x10 Large Format).'
                  : 'Over 50 pro cinema & still cameras plus motion film stocks.'}
              </li>
              <li>
                <strong>{isId ? 'Simulasi Kanvas Sensor Plane & Desqueezed:' : 'Dual-Mode Canvas Simulation:'}</strong>{' '}
                {isId
                  ? 'Kanvas secara real-time menggambarkan kisi 3x3 piksel sensor dan cakram Airy dengan gradien warna spektral riil, serta toggle tampilan desqueezed untuk lensa anamorfik.'
                  : 'Real-time rendering of 3x3 pixel grid and spectral gradient Airy disks with anamorphic toggle.'}
              </li>
              <li>
                <strong>{isId ? 'Ekspor Lembar Laporan Kamera (Camera Report PDF):' : 'One-Click Shot Sheet PDF Export:'}</strong>{' '}
                {isId
                  ? 'Menghasilkan dokumen PDF A4 berformat resmi siap cetak untuk departemen kamera, DIT, dan asisten kamera (AC).'
                  : 'Generates print-ready A4 camera reports and shot sheets for camera crews and DITs.'}
              </li>
              <li>
                <strong>{isId ? 'Antarmuka Industrial Presisi Tinggi:' : 'High-Precision Industrial UI:'}</strong>{' '}
                {isId
                  ? 'Format kontrol satu baris yang bersih, tampilan EN yang presisi, tombol transmitansi 92% dan 100% yang akurat terhadap thumb pointer, serta responsivitas multi-device.'
                  : 'Ultra-clean single line header, precise EN instrument readout, aligned transmission ticks, and dual theme support.'}
              </li>
            </ul>
          </div>

          {/* Section 3: Ringkasan Status Arsitektur Kode */}
          <div className="space-y-3">
            <h4 className="font-bold text-base flex items-center gap-2 text-[#E85002]">
              <AlertTriangle className="w-5 h-5 text-[#E85002]" />
              {isId ? '3. Status Arsitektur & Kinerja Web' : '3. Architecture & Performance Status'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded border border-emerald-500/40 bg-emerald-500/10">
                <strong>{isId ? 'Siklus Hidup Bebas Konflik (No Memory Leaks):' : 'Zero Memory Leaks:'}</strong>{' '}
                {isId
                  ? 'Integrasi Chart.js dan Canvas ref hook menggunakan disposal cycle `chart.destroy()` sehingga pergantian tema dan update state tidak membebani memori.'
                  : 'Clean ref hook teardown ensures smooth re-renders.'}
              </div>
              <div className="p-3 rounded border border-emerald-500/40 bg-emerald-500/10">
                <strong>{isId ? 'Sanitasi Nilai Input Aman (No NaN / Zero Division):' : 'Guarded Math Operations:'}</strong>{' '}
                {isId
                  ? 'Seluruh pembagian pada formula Airy, DLA, T-Stop, dan Pixel pitch telah diproteksi dengan nilai batas bawah `Math.max(0.1, val)`.'
                  : 'All formula divisions are protected against division by zero.'}
              </div>
            </div>
          </div>

          {/* Tips for Production */}
          <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-main)]">
            <h4 className="font-bold text-xs uppercase text-[#E85002] flex items-center gap-1.5 mb-1.5">
              <Lightbulb className="w-4 h-4" />
              {isId ? 'Potensi Pengembangan Mendatang' : 'Potential Future Upgrades'}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-muted)]">
              <li>{isId ? 'Kalkulasi Depth of Field (DoF) & Hyperfocal Distance terintegrasi.' : 'Integrated Depth of Field (DoF) & Hyperfocal Distance calculator.'}</li>
              <li>{isId ? 'Simulasi optical flare / streak biru horizontal khas lensa anamorfik.' : 'Anamorphic horizontal blue streak flare simulation.'}</li>
              <li>{isId ? 'Dukungan penyimpanan preset custom lens package ke local storage.' : 'Custom lens package preset storage in browser local storage.'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-main)] bg-[var(--bg-card)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E85002] hover:bg-[#d44700] text-white font-mono text-xs font-bold transition-colors"
          >
            {isId ? 'Tutup Laporan' : 'Close Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
