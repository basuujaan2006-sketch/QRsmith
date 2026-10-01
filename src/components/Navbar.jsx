import React from 'react';
import { Sun, Moon, RotateCcw, QrCode, Shuffle, Sparkles } from 'lucide-react';

export default function Navbar({
  theme,
  onToggleTheme,
  onResetAll,
  onRandomStyle,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-forge-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-glow-forge">
            <QrCode className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-950 dark:text-white">
                QR<span className="text-forge-500">smith</span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-forge-500/10 text-forge-600 dark:text-forge-400 border border-forge-500/20">
                STUDIO
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Surprise Me / Random Style Button */}
          {onRandomStyle && (
            <button
              type="button"
              onClick={onRandomStyle}
              title="Generate a random artistic QR style"
              className="min-h-[40px] px-3 rounded-xl border border-forge-500/30 bg-forge-500/10 hover:bg-forge-500/20 text-forge-600 dark:text-forge-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>
          )}

          {/* Reset button */}
          <button
            type="button"
            onClick={onResetAll}
            title="Reset to default settings"
            className="min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-forge-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
