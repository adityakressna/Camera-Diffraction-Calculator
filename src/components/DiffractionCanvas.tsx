import React, { useEffect, useRef, useState } from 'react';
import { getWaveColor } from '../utils/optics';
import { AnamorphicSqueeze } from '../types';

interface DiffractionCanvasProps {
  pixelPitchMicrons: number;
  airyDiskMicrons: number;
  wavelengthNm: number;
  isDark: boolean;
  anamorphicSqueeze?: AnamorphicSqueeze;
}

export const DiffractionCanvas: React.FC<DiffractionCanvasProps> = ({
  pixelPitchMicrons,
  airyDiskMicrons,
  wavelengthNm,
  isDark,
  anamorphicSqueeze = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'sensor' | 'desqueezed'>('sensor');

  const isAnamorphic = anamorphicSqueeze > 1.0;
  const activeSqueeze = isAnamorphic && viewMode === 'desqueezed' ? anamorphicSqueeze : 1.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale so that 3 pixel pitches span the canvas with some margin
    const effectivePitch = Math.max(0.1, pixelPitchMicrons);
    const scale = canvas.width / (effectivePitch * 3.4 * (isAnamorphic && viewMode === 'desqueezed' ? Math.min(1.4, activeSqueeze) : 1));
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const strokeColor = isDark ? '#444444' : '#999999';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;

    // Draw 3x3 pixel sensor grid (desqueezed if active)
    const pixelWidthPx = effectivePitch * scale * activeSqueeze;
    const pixelHeightPx = effectivePitch * scale;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const px = cx + (x * pixelWidthPx) - (pixelWidthPx / 2);
        const py = cy + (y * pixelHeightPx) - (pixelHeightPx / 2);
        ctx.strokeRect(px, py, pixelWidthPx, pixelHeightPx);
      }
    }

    // Draw subpixel center target crosshair
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy);
    ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx, cy + 8);
    ctx.stroke();

    // Airy Disk representation
    const wColor = getWaveColor(wavelengthNm);
    const radiusY = Math.max(1, (airyDiskMicrons * scale) / 2);
    const radiusX = radiusY * activeSqueeze;

    if (radiusY > 0) {
      // 1st order diffraction outer ring
      const secRadiusX = radiusX * 1.63;
      const secRadiusY = radiusY * 1.63;

      if (secRadiusX < canvas.width / 1.1) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, secRadiusX, secRadiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${wColor.r}, ${wColor.g}, ${wColor.b}, 0.18)`;
        ctx.lineWidth = Math.max(1, radiusY * 0.12);
        ctx.stroke();
      }

      // Central Airy maximum
      ctx.save();
      // Scale canvas context to draw elliptical gradient easily
      ctx.translate(cx, cy);
      ctx.scale(activeSqueeze, 1);

      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusY);
      grd.addColorStop(0, `rgba(${wColor.r}, ${wColor.g}, ${wColor.b}, 0.95)`);
      grd.addColorStop(0.4, `rgba(${wColor.r}, ${wColor.g}, ${wColor.b}, 0.65)`);
      grd.addColorStop(0.85, `rgba(${wColor.r}, ${wColor.g}, ${wColor.b}, 0.25)`);
      grd.addColorStop(1, `rgba(${wColor.r}, ${wColor.g}, ${wColor.b}, 0)`);

      ctx.beginPath();
      ctx.arc(0, 0, radiusY, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Boundary outline
      ctx.lineWidth = 1 / activeSqueeze;
      ctx.strokeStyle = `rgba(${wColor.r}, ${wColor.g}, ${wColor.b}, 0.75)`;
      ctx.stroke();

      ctx.restore();
    }
  }, [pixelPitchMicrons, airyDiskMicrons, wavelengthNm, isDark, activeSqueeze, isAnamorphic, viewMode]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="max-w-full h-auto drop-shadow-sm select-none"
      />

      {isAnamorphic && (
        <div className="flex items-center gap-1 mt-1 bg-[var(--bg-main)]/20 p-0.5 rounded border border-[var(--border-main)]">
          <button
            type="button"
            onClick={() => setViewMode('sensor')}
            className={`px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
              viewMode === 'sensor' ? 'bg-[#E85002] text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
            }`}
          >
            Sensor Plane (1x)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('desqueezed')}
            className={`px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
              viewMode === 'desqueezed' ? 'bg-[#E85002] text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
            }`}
          >
            Desqueezed ({anamorphicSqueeze}x)
          </button>
        </div>
      )}

      <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1.5 text-center leading-relaxed">
        <div>
          1 pixel = {pixelPitchMicrons.toFixed(2)} µm | Airy Ø = {airyDiskMicrons.toFixed(2)} µm
        </div>
        {isAnamorphic && viewMode === 'desqueezed' && (
          <div className="text-[#E85002] font-semibold mt-0.5">
            (H-Blur: {(airyDiskMicrons * anamorphicSqueeze).toFixed(2)} µm)
          </div>
        )}
      </div>
    </div>
  );
};
