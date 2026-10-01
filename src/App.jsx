import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import TypeSelector from './components/TypeSelector';
import InputForm from './components/InputForm';
import QRPreview from './components/QRPreview';
import CustomizationPanel from './components/CustomizationPanel';
import PresetPicker, { PRESETS } from './components/PresetPicker';
import RecentCodes from './components/RecentCodes';
import DownloadButton from './components/DownloadButton';

import { validateInput } from './utils/validation';
import { formatQRData } from './utils/qrDataFormatters';
import { getScanReliabilityWarnings } from './utils/contrast';
import {
  getRecentCodes,
  saveRecentCode,
  removeRecentCode,
  clearAllRecentCodes,
  getStoredTheme,
  setStoredTheme,
} from './utils/storage';

import { FileText, Palette, Sliders, History, ArrowRight, Sparkles } from 'lucide-react';

const DEFAULT_FORM_DATA = {
  url: 'https://qrsmith.dev',
  text: 'Precision forged QR code by QRsmith.',
  email: 'forge@qrsmith.dev',
  subject: 'Precision Inquiry',
  body: 'Hello QRsmith team,',
  phone: '+1 (555) 234-5678',
  ssid: 'Studio_5GHz',
  password: 'forge-password-123',
  encryption: 'WPA',
  hidden: false,
};

const DEFAULT_STYLE_OPTIONS = {
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
  size: 450,
  logoImage: null,
  logoScale: 0.35,
  logoMargin: 6,
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Studio step navigation: 'content' | 'design' | 'history'
  const [studioStep, setStudioStep] = useState('content');

  // Content & Form state
  const [activeType, setActiveType] = useState('url');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [styleOptions, setStyleOptions] = useState(DEFAULT_STYLE_OPTIONS);

  // Recent codes & storage
  const [recentCodes, setRecentCodes] = useState(() => getRecentCodes());
  const latestThumbnailRef = useRef(null);
  const qrCodeRef = useRef(null);

  // Field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Style change handler
  const handleStyleChange = (updated) => {
    setStyleOptions((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Surprise Me / Random Style generator
  const handleRandomStyle = () => {
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setStyleOptions((prev) => ({
      ...prev,
      ...randomPreset.style,
    }));
  };

  // Reset to factory defaults
  const handleResetAll = () => {
    if (window.confirm('Reset all fields and styles to default studio settings?')) {
      setActiveType('url');
      setFormData(DEFAULT_FORM_DATA);
      setStyleOptions(DEFAULT_STYLE_OPTIONS);
      setStudioStep('content');
    }
  };

  // Validate current inputs
  const validationResult = useMemo(() => {
    return validateInput(activeType, formData);
  }, [activeType, formData]);

  const isValid = validationResult.isValid;

  // Format current QR data string
  const rawPayload = useMemo(() => {
    return formatQRData(activeType, formData);
  }, [activeType, formData]);

  // Evaluate scan reliability safeguards
  const warnings = useMemo(() => {
    return getScanReliabilityWarnings({
      fgColor: styleOptions.fgColor,
      bgColor: styleOptions.bgColor,
      isGradient: styleOptions.isGradient,
      gradientColor1: styleOptions.gradientColor1,
      gradientColor2: styleOptions.gradientColor2,
      hasLogo: !!styleOptions.logoImage,
      errorCorrectionLevel: styleOptions.errorCorrectionLevel,
    });
  }, [styleOptions]);

  // Handle fresh blob from preview to capture thumbnail
  const handleGeneratedBlob = (blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      latestThumbnailRef.current = reader.result;
    };
    reader.readAsDataURL(blob);
  };

  // Auto-record to Recent items when payload is valid (debounced)
  useEffect(() => {
    if (!isValid || !rawPayload) return;

    const timeout = setTimeout(() => {
      let title = rawPayload;
      if (activeType === 'url') title = formData.url;
      if (activeType === 'wifi') title = `Wi-Fi: ${formData.ssid}`;
      if (activeType === 'email') title = `Email: ${formData.email}`;
      if (activeType === 'phone') title = `Tel: ${formData.phone}`;
      if (activeType === 'text') title = formData.text.slice(0, 30);

      const updated = saveRecentCode({
        type: activeType,
        formData,
        styleOptions,
        rawPayload,
        title,
        thumbnail: latestThumbnailRef.current,
      });
      setRecentCodes(updated);
    }, 1400);

    return () => clearTimeout(timeout);
  }, [rawPayload, isValid, activeType]);

  // Trigger immediate save on download
  const handleAfterDownload = () => {
    let title = rawPayload;
    if (activeType === 'url') title = formData.url;
    if (activeType === 'wifi') title = `Wi-Fi: ${formData.ssid}`;
    if (activeType === 'email') title = `Email: ${formData.email}`;
    if (activeType === 'phone') title = `Tel: ${formData.phone}`;
    if (activeType === 'text') title = formData.text.slice(0, 30);

    const updated = saveRecentCode({
      type: activeType,
      formData,
      styleOptions,
      rawPayload,
      title,
      thumbnail: latestThumbnailRef.current,
    });
    setRecentCodes(updated);
  };

  // Restore item from history
  const handleSelectRecent = (item) => {
    setActiveType(item.type);
    if (item.formData) {
      setFormData((prev) => ({ ...prev, ...item.formData }));
    }
    if (item.styleOptions) {
      setStyleOptions(item.styleOptions);
    }
    setStudioStep('content');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Remove single item from history
  const handleRemoveRecent = (id) => {
    const updated = removeRecentCode(id);
    setRecentCodes(updated);
  };

  // Clear all history
  const handleClearAllRecent = () => {
    if (window.confirm('Clear all recent saved QR codes?')) {
      const updated = clearAllRecentCodes();
      setRecentCodes(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-forge-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onResetAll={handleResetAll}
        onRandomStyle={handleRandomStyle}
      />

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Responsive Grid: Controls on Left, Sticky Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Controls Column (Left on Desktop, Below Preview on Mobile) */}
          <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-7 space-y-5">
            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between p-1.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
              <button
                type="button"
                onClick={() => setStudioStep('content')}
                className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  studioStep === 'content'
                    ? 'bg-forge-500 text-slate-950 shadow-md shadow-forge-500/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>1. Content</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioStep('design')}
                className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  studioStep === 'design'
                    ? 'bg-forge-500 text-slate-950 shadow-md shadow-forge-500/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Palette className="w-4 h-4 shrink-0" />
                <span>2. Design & Style</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioStep('history')}
                className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  studioStep === 'history'
                    ? 'bg-forge-500 text-slate-950 shadow-md shadow-forge-500/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <History className="w-4 h-4 shrink-0" />
                <span>3. History ({recentCodes.length})</span>
              </button>
            </div>

            {/* STEP 1: CONTENT */}
            {studioStep === 'content' && (
              <div className="space-y-5 animate-fadeIn">
                <TypeSelector
                  activeType={activeType}
                  onSelectType={setActiveType}
                />

                <InputForm
                  activeType={activeType}
                  formData={formData}
                  onChangeField={handleFieldChange}
                  validationResult={validationResult}
                />

                {/* Quick Presets Strip right inside Content step for fast beautification */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <PresetPicker
                    currentStyle={styleOptions}
                    onSelectPreset={handleStyleChange}
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setStudioStep('design')}
                    className="min-h-[46px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <span>Next: Customize Design & Logo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DESIGN & STYLE */}
            {studioStep === 'design' && (
              <div className="space-y-5 animate-fadeIn">
                <CustomizationPanel
                  styleOptions={styleOptions}
                  onChangeStyle={handleStyleChange}
                  warnings={warnings}
                />

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <PresetPicker
                    currentStyle={styleOptions}
                    onSelectPreset={handleStyleChange}
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setStudioStep('content')}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    ← Back to Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudioStep('history')}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>View Saved Codes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: HISTORY */}
            {studioStep === 'history' && (
              <div className="space-y-5 animate-fadeIn">
                <RecentCodes
                  recentCodes={recentCodes}
                  onSelectCode={handleSelectRecent}
                  onRemoveCode={handleRemoveRecent}
                  onClearAll={handleClearAllRecent}
                />
              </div>
            )}
          </div>

          {/* QR Showcase Column (Right on Desktop, Top on Mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 space-y-4">
            {/* Live QR Preview Canvas with Ambient Glow */}
            <QRPreview
              qrData={rawPayload}
              styleOptions={styleOptions}
              isValid={isValid}
              validationError={validationResult.error}
              warnings={warnings}
              qrCodeRef={qrCodeRef}
              onGeneratedBlob={handleGeneratedBlob}
            />

            {/* Download & Export Controls */}
            <DownloadButton
              qrData={rawPayload}
              styleOptions={styleOptions}
              isValid={isValid}
              onAfterDownload={handleAfterDownload}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 dark:text-slate-100">
              QRsmith
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              ● 100% Client-Side Privacy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
