import React, { useRef, useState } from 'react';
import {
  Palette,
  Sliders,
  ShieldCheck,
  Shapes,
  Image as ImageIcon,
  Trash2,
  Upload,
  AlertTriangle,
  Info,
  Sparkles,
  Maximize2,
  Check,
} from 'lucide-react';

const QUICK_SWATCHES = [
  { name: 'Obsidian Gold', fg: '#f59e0b', bg: '#0b0f17', isGrad: false },
  { name: 'Cyber Neon', fg: '#06b6d4', bg: '#02141a', isGrad: true, g1: '#10b981', g2: '#06b6d4' },
  { name: 'Sunset Glow', fg: '#f97316', bg: '#ffffff', isGrad: true, g1: '#f97316', g2: '#ec4899' },
  { name: 'Hyper Violet', fg: '#8b5cf6', bg: '#090514', isGrad: true, g1: '#8b5cf6', g2: '#38bdf8' },
  { name: 'Monochrome', fg: '#0f172a', bg: '#ffffff', isGrad: false },
  { name: 'Cobalt Navy', fg: '#1d4ed8', bg: '#f8fafc', isGrad: false },
];

const DOT_STYLES = [
  { id: 'square', label: 'Classic Square', icon: '■' },
  { id: 'rounded', label: 'Soft Rounded', icon: '▢' },
  { id: 'dots', label: 'Perforated Dots', icon: '●' },
  { id: 'classy', label: 'Diamond Classy', icon: '◆' },
  { id: 'classy-rounded', label: 'Curved Classy', icon: '✦' },
  { id: 'extra-rounded', label: 'Organic Fluid', icon: '⬬' },
];

const CORNER_SQUARE_STYLES = [
  { id: 'square', label: 'Square' },
  { id: 'extra-rounded', label: 'Rounded' },
  { id: 'dot', label: 'Circle' },
];

const CORNER_DOT_STYLES = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Circle' },
];

const ERROR_LEVELS = [
  { id: 'L', label: 'Standard (7%)', desc: 'Lowest redundancy, simplest matrix' },
  { id: 'M', label: 'Balanced (15%)', desc: 'Everyday standard for web links' },
  { id: 'Q', label: 'High (25%)', desc: 'Recommended when adding a logo' },
  { id: 'H', label: 'Ultra Shield (30%)', desc: 'Max data armor for worn prints & badges' },
];

export default function CustomizationPanel({
  styleOptions,
  onChangeStyle,
  warnings = [],
}) {
  const [activeSubTab, setActiveSubTab] = useState('colors');
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Logo file exceeds 4MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onChangeStyle({
        logoImage: event.target.result,
        errorCorrectionLevel:
          styleOptions.errorCorrectionLevel === 'L' || styleOptions.errorCorrectionLevel === 'M'
            ? 'Q'
            : styleOptions.errorCorrectionLevel,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onChangeStyle({ logoImage: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const contrastWarning = warnings.find((w) => w.id === 'low-contrast' || w.id === 'moderate-contrast');
  const invertedWarning = warnings.find((w) => w.id === 'inverted-colors');
  const logoWarning = warnings.find((w) => w.id === 'logo-redundancy');

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Sub-navigation tabs for customization to eliminate endless scrolling */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('colors')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'colors'
                ? 'bg-white dark:bg-slate-800 text-forge-600 dark:text-forge-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colors & Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('shapes')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'shapes'
                ? 'bg-white dark:bg-slate-800 text-forge-600 dark:text-forge-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>Patterns</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('logo')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'logo'
                ? 'bg-white dark:bg-slate-800 text-forge-600 dark:text-forge-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Logo</span>
            {styleOptions.logoImage && (
              <span className="w-2 h-2 rounded-full bg-forge-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('advanced')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'advanced'
                ? 'bg-white dark:bg-slate-800 text-forge-600 dark:text-forge-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tolerances</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Colors & Gradients */}
      {activeSubTab === 'colors' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick Swatch Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Popular Quick Palettes
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {QUICK_SWATCHES.map((swatch, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (swatch.isGrad) {
                      onChangeStyle({
                        isGradient: true,
                        gradientColor1: swatch.g1,
                        gradientColor2: swatch.g2,
                        bgColor: swatch.bg,
                      });
                    } else {
                      onChangeStyle({
                        isGradient: false,
                        fgColor: swatch.fg,
                        bgColor: swatch.bg,
                      });
                    }
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-forge-500 dark:hover:border-forge-500 bg-slate-50 dark:bg-slate-950 flex flex-col items-center gap-1.5 transition-all hover:scale-105"
                >
                  <div
                    className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm"
                    style={{
                      background: swatch.isGrad
                        ? `linear-gradient(135deg, ${swatch.g1}, ${swatch.g2})`
                        : swatch.fg,
                    }}
                  />
                  <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate w-full text-center">
                    {swatch.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Smooth Dual Gradient
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Blend two radiant colors across the QR matrix
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={styleOptions.isGradient}
              onClick={() => onChangeStyle({ isGradient: !styleOptions.isGradient })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-forge-500 ${
                styleOptions.isGradient ? 'bg-forge-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  styleOptions.isGradient ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Custom Color Controls */}
          {!styleOptions.isGradient ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  QR Dots Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleOptions.fgColor}
                    onChange={(e) => onChangeStyle({ fgColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={styleOptions.fgColor.toUpperCase()}
                    onChange={(e) => onChangeStyle({ fgColor: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono uppercase focus:outline-none focus:border-forge-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Canvas Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleOptions.bgColor}
                    onChange={(e) => onChangeStyle({ bgColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={styleOptions.bgColor.toUpperCase()}
                    onChange={(e) => onChangeStyle({ bgColor: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono uppercase focus:outline-none focus:border-forge-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Gradient Start
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styleOptions.gradientColor1}
                      onChange={(e) => onChangeStyle({ gradientColor1: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={styleOptions.gradientColor1.toUpperCase()}
                      onChange={(e) => onChangeStyle({ gradientColor1: e.target.value })}
                      className="w-full min-h-[38px] px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Gradient End
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styleOptions.gradientColor2}
                      onChange={(e) => onChangeStyle({ gradientColor2: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={styleOptions.gradientColor2.toUpperCase()}
                      onChange={(e) => onChangeStyle({ gradientColor2: e.target.value })}
                      className="w-full min-h-[38px] px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styleOptions.bgColor}
                      onChange={(e) => onChangeStyle({ bgColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={styleOptions.bgColor.toUpperCase()}
                      onChange={(e) => onChangeStyle({ bgColor: e.target.value })}
                      className="w-full min-h-[38px] px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Angle ({styleOptions.gradientAngle}°)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={styleOptions.gradientAngle}
                    onChange={(e) => onChangeStyle({ gradientAngle: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Safeguard warnings */}
          {contrastWarning && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{contrastWarning.title}</p>
                <p className="mt-0.5 text-amber-800 dark:text-amber-300">{contrastWarning.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Patterns & Shapes */}
      {activeSubTab === 'shapes' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Matrix Dot Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DOT_STYLES.map((dot) => {
                const active = styleOptions.dotStyle === dot.id;
                return (
                  <button
                    key={dot.id}
                    type="button"
                    onClick={() => onChangeStyle({ dotStyle: dot.id })}
                    className={`min-h-[46px] px-3 py-2 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      active
                        ? 'border-forge-500 bg-forge-500/10 ring-2 ring-forge-500/30 text-slate-900 dark:text-slate-100 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg text-forge-500">{dot.icon}</span>
                    <span className="text-xs truncate">{dot.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Corner Frame (Outer Eyes)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CORNER_SQUARE_STYLES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onChangeStyle({ cornerSquareStyle: c.id })}
                    className={`min-h-[40px] px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      styleOptions.cornerSquareStyle === c.id
                        ? 'border-forge-500 bg-forge-500/10 text-forge-600 dark:text-forge-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Corner Center (Inner Pupil)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CORNER_DOT_STYLES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onChangeStyle({ cornerDotStyle: c.id })}
                    className={`min-h-[40px] px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      styleOptions.cornerDotStyle === c.id
                        ? 'border-forge-500 bg-forge-500/10 text-forge-600 dark:text-forge-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Logo & Center Emblem */}
      {activeSubTab === 'logo' && (
        <div className="space-y-4 animate-fadeIn">
          {!styleOptions.logoImage ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-file-input"
              />
              <label
                htmlFor="logo-file-input"
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-forge-500 dark:hover:border-forge-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/50 min-h-[140px]"
              >
                <div className="w-12 h-12 rounded-full bg-forge-500/10 text-forge-600 dark:text-forge-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Click to Upload Brand Logo
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Supports PNG, SVG, JPG, or WebP. Automatically centered.
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={styleOptions.logoImage}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Center Logo Attached
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                      Scale: {Math.round(styleOptions.logoScale * 100)}%
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-700 dark:text-slate-300">
                      Logo Size ({Math.round(styleOptions.logoScale * 100)}%)
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="0.45"
                    step="0.05"
                    value={styleOptions.logoScale}
                    onChange={(e) => onChangeStyle({ logoScale: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-700 dark:text-slate-300">
                      Clearance Margin ({styleOptions.logoMargin}px)
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="2"
                    value={styleOptions.logoMargin}
                    onChange={(e) => onChangeStyle({ logoMargin: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {logoWarning && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{logoWarning.title}</p>
                <p className="mt-0.5 text-amber-800 dark:text-amber-300">{logoWarning.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Tolerances & Frame */}
      {activeSubTab === 'advanced' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Scan Durability (Reed-Solomon Error Correction)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ERROR_LEVELS.map((lvl) => {
                const active = styleOptions.errorCorrectionLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => onChangeStyle({ errorCorrectionLevel: lvl.id })}
                    className={`min-h-[46px] p-2.5 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-forge-500 bg-forge-500/10 ring-2 ring-forge-500/30 text-slate-900 dark:text-slate-100 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs">{lvl.label}</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Outer White Margin
                </label>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                  {styleOptions.margin}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="2"
                value={styleOptions.margin}
                onChange={(e) => onChangeStyle({ margin: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Export PNG Canvas Size
                </label>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                  {styleOptions.size}px
                </span>
              </div>
              <input
                type="range"
                min="250"
                max="1000"
                step="50"
                value={styleOptions.size}
                onChange={(e) => onChangeStyle({ size: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
