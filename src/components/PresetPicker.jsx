import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export const PRESETS = [
  {
    id: 'obsidian-amber',
    name: 'Obsidian Amber',
    description: 'Stealth black with molten gold dots',
    tag: 'Signature',
    style: {
      fgColor: '#f59e0b',
      bgColor: '#0b0f17',
      isGradient: false,
      gradientType: 'linear',
      gradientColor1: '#f59e0b',
      gradientColor2: '#d97706',
      gradientAngle: 45,
      dotStyle: 'classy-rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      margin: 12,
      errorCorrectionLevel: 'Q',
    },
    gradientPreview: 'linear-gradient(135deg, #f59e0b, #d97706)',
    bgPreview: '#0b0f17',
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Matrix',
    description: 'Bioluminescent neon teal on pitch black',
    tag: 'Cyberpunk',
    style: {
      fgColor: '#10b981',
      bgColor: '#02141a',
      isGradient: true,
      gradientType: 'linear',
      gradientColor1: '#10b981',
      gradientColor2: '#06b6d4',
      gradientAngle: 135,
      dotStyle: 'dots',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      margin: 12,
      errorCorrectionLevel: 'Q',
    },
    gradientPreview: 'linear-gradient(135deg, #10b981, #06b6d4)',
    bgPreview: '#02141a',
  },
  {
    id: 'neon-sunset',
    name: 'Sunset Foundry',
    description: 'Hot crimson into electric magenta',
    tag: 'Vibrant',
    style: {
      fgColor: '#ea580c',
      bgColor: '#ffffff',
      isGradient: true,
      gradientType: 'linear',
      gradientColor1: '#f97316',
      gradientColor2: '#ec4899',
      gradientAngle: 45,
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      margin: 10,
      errorCorrectionLevel: 'M',
    },
    gradientPreview: 'linear-gradient(135deg, #f97316, #ec4899)',
    bgPreview: '#ffffff',
  },
  {
    id: 'hyper-violet',
    name: 'Hyper Violet',
    description: 'Electric violet into cyan glow on dark',
    tag: 'Neon',
    style: {
      fgColor: '#a855f7',
      bgColor: '#090514',
      isGradient: true,
      gradientType: 'linear',
      gradientColor1: '#8b5cf6',
      gradientColor2: '#38bdf8',
      gradientAngle: 45,
      dotStyle: 'classy',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      margin: 12,
      errorCorrectionLevel: 'Q',
    },
    gradientPreview: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
    bgPreview: '#090514',
  },
  {
    id: 'forge-classic',
    name: 'Ink & Paper',
    description: 'Clean monochrome high contrast print',
    tag: 'Classic',
    style: {
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      isGradient: false,
      gradientType: 'linear',
      gradientColor1: '#0f172a',
      gradientColor2: '#334155',
      gradientAngle: 45,
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      margin: 10,
      errorCorrectionLevel: 'M',
    },
    gradientPreview: 'linear-gradient(135deg, #0f172a, #334155)',
    bgPreview: '#ffffff',
  },
  {
    id: 'royal-sapphire',
    name: 'Royal Cobalt',
    description: 'Deep cobalt precision on frosted slate',
    tag: 'Executive',
    style: {
      fgColor: '#1d4ed8',
      bgColor: '#f8fafc',
      isGradient: false,
      gradientType: 'linear',
      gradientColor1: '#1d4ed8',
      gradientColor2: '#2563eb',
      gradientAngle: 45,
      dotStyle: 'extra-rounded',
      cornerSquareStyle: 'classy',
      cornerDotStyle: 'square',
      margin: 10,
      errorCorrectionLevel: 'M',
    },
    gradientPreview: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
    bgPreview: '#f8fafc',
  },
];

export default function PresetPicker({ currentStyle, onSelectPreset }) {
  const isMatch = (preset) => {
    return (
      preset.style.fgColor === currentStyle.fgColor &&
      preset.style.bgColor === currentStyle.bgColor &&
      preset.style.isGradient === currentStyle.isGradient &&
      preset.style.dotStyle === currentStyle.dotStyle
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-forge-500" />
          Curated Studio Presets
        </label>
        <span className="text-[11px] text-slate-600 dark:text-slate-400">
          Instant 1-tap styles
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {PRESETS.map((preset) => {
          const active = isMatch(preset);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.style)}
              className={`group relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                active
                  ? 'border-forge-500 bg-forge-500/10 shadow-md ring-2 ring-forge-500/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.02]'
              }`}
            >
              {/* Color preview swatch */}
              <div className="flex items-center justify-between w-full mb-2.5">
                <div className="flex items-center">
                  <div
                    className="w-5 h-5 rounded-full shadow-md border-2 border-white dark:border-slate-800 z-10"
                    style={{ background: preset.gradientPreview }}
                  />
                  <div
                    className="w-5 h-5 rounded-full shadow-inner border border-slate-300 dark:border-slate-700 -ml-2"
                    style={{ backgroundColor: preset.bgPreview }}
                  />
                </div>
                {active ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-forge-500 text-slate-950 shadow-glow-forge">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {preset.tag}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-display">
                  {preset.name}
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
