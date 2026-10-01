import React from 'react';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';

export const QR_TYPES = [
  { id: 'url', label: 'URL', icon: Globe, description: 'Website or web app link' },
  { id: 'text', label: 'Plain Text', icon: FileText, description: 'Notes, code, or messages' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Draft an email message' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Direct dial phone number' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, description: 'One-tap network connection' },
];

export default function TypeSelector({ activeType, onSelectType }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
          Content Type
        </label>
        <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
          {QR_TYPES.find((t) => t.id === activeType)?.description}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        {QR_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelectType(type.id)}
              className={`relative min-h-[44px] px-3 py-2.5 rounded-lg flex items-center justify-center sm:flex-col gap-2 font-medium text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-forge-600 dark:text-forge-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'scale-110 text-forge-600 dark:text-forge-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              />
              <span className="truncate">{type.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-forge-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
