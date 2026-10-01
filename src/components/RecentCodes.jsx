import React from 'react';
import { History, Trash2, ArrowUpRight, X } from 'lucide-react';

export default function RecentCodes({
  recentCodes,
  onSelectCode,
  onRemoveCode,
  onClearAll,
}) {
  if (!recentCodes || recentCodes.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm text-center">
        <div className="flex flex-col items-center justify-center py-4 space-y-2 text-slate-500 dark:text-slate-400">
          <History className="w-8 h-8 stroke-1 text-slate-400 dark:text-slate-600" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No Saved QR Codes Yet
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-xs">
            As you forge and customize QR codes, your recent 10 items will be saved here for quick reloading.
          </p>
        </div>
      </div>
    );
  }

  const formatRelativeTime = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-forge-500" />
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 font-display">
            Recent Forged Codes
          </h2>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {recentCodes.length}/10
          </span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors flex items-center gap-1 min-h-[36px] px-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Horizontal scroll on mobile, responsive flex/grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-1 gap-2.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
        {recentCodes.map((item) => (
          <div
            key={item.id}
            className="group relative flex-shrink-0 w-64 sm:w-auto p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-forge-500/50 dark:hover:border-forge-500/50 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 transition-all flex items-center gap-3"
          >
            {/* Thumbnail */}
            <button
              type="button"
              onClick={() => onSelectCode(item)}
              className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner cursor-pointer"
            >
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className="w-full h-full rounded"
                  style={{
                    backgroundColor: item.styleOptions?.fgColor || '#0f172a',
                  }}
                />
              )}
            </button>

            {/* Information */}
            <div
              onClick={() => onSelectCode(item)}
              className="flex-1 min-w-0 cursor-pointer text-left"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-1">
                {item.title}
              </p>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 truncate font-mono">
                {item.rawPayload}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onRemoveCode(item.id)}
                aria-label="Remove item"
                className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectCode(item)}
                aria-label="Load code"
                className="w-7 h-7 rounded flex items-center justify-center text-forge-600 dark:text-forge-400 hover:bg-forge-500/10 transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
