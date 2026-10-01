import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  Copy,
  Check,
  Download,
  AlertTriangle,
  Info,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export default function QRPreview({
  qrData,
  styleOptions,
  isValid,
  validationError,
  warnings = [],
  qrCodeRef,
  onGeneratedBlob,
}) {
  const containerRef = useRef(null);
  const qrInstanceRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  // Determine glow color from current style
  const glowColor = styleOptions.isGradient
    ? styleOptions.gradientColor1
    : styleOptions.fgColor || '#f59e0b';

  // Initialize or update QRCodeStyling instance
  useEffect(() => {
    const buildOptions = () => {
      const dotsOptions = {
        type: styleOptions.dotStyle || 'square',
      };

      if (styleOptions.isGradient) {
        dotsOptions.gradient = {
          type: styleOptions.gradientType || 'linear',
          rotation: ((styleOptions.gradientAngle || 0) * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: styleOptions.gradientColor1 || '#f59e0b' },
            { offset: 1, color: styleOptions.gradientColor2 || '#d97706' },
          ],
        };
      } else {
        dotsOptions.color = styleOptions.fgColor || '#0f172a';
      }

      const cornersSquareOptions = {
        type: styleOptions.cornerSquareStyle || 'square',
        color: dotsOptions.color || styleOptions.fgColor,
      };

      const cornersDotOptions = {
        type: styleOptions.cornerDotStyle || 'square',
        color: dotsOptions.color || styleOptions.fgColor,
      };

      return {
        width: 320,
        height: 320,
        data: isValid && qrData ? qrData : 'https://qrsmith.dev',
        margin: styleOptions.margin !== undefined ? styleOptions.margin : 10,
        qrOptions: {
          errorCorrectionLevel: styleOptions.errorCorrectionLevel || 'M',
        },
        image: styleOptions.logoImage || undefined,
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: styleOptions.logoScale || 0.35,
          margin: styleOptions.logoMargin !== undefined ? styleOptions.logoMargin : 5,
          crossOrigin: 'anonymous',
        },
        dotsOptions,
        cornersSquareOptions,
        cornersDotOptions,
        backgroundOptions: {
          color: styleOptions.bgColor || '#ffffff',
        },
      };
    };

    const timer = setTimeout(async () => {
      setIsRendering(true);
      const opts = buildOptions();

      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new QRCodeStyling(opts);
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          qrInstanceRef.current.append(containerRef.current);
        }
      } else {
        qrInstanceRef.current.update(opts);
      }

      if (qrCodeRef) {
        qrCodeRef.current = qrInstanceRef.current;
      }

      try {
        if (qrInstanceRef.current && isValid && qrData) {
          const blob = await qrInstanceRef.current.getRawData('png');
          if (blob && onGeneratedBlob) {
            onGeneratedBlob(blob);
          }
        }
      } catch (err) {
        console.warn('Could not generate thumbnail blob:', err);
      } finally {
        setIsRendering(false);
      }
    }, 160);

    return () => clearTimeout(timer);
  }, [qrData, styleOptions, isValid]);

  // Copy QR code image to clipboard
  const handleCopyImage = async () => {
    if (!qrInstanceRef.current || !isValid) return;
    try {
      setCopyError(false);
      const blob = await qrInstanceRef.current.getRawData('png');
      if (!blob) throw new Error('Could not export image blob');

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const hasHighRiskWarning = warnings.some((w) => w.severity === 'danger');

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Dynamic ambient colored glow in dark mode */}
      <div
        className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-20 dark:opacity-30 transition-all duration-700"
        style={{ backgroundColor: glowColor }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 font-display">
            Live Preview
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isValid && !hasHighRiskWarning ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
              <Smartphone className="w-3 h-3" />
              Scan Ready
            </span>
          ) : hasHighRiskWarning ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
              <AlertTriangle className="w-3 h-3" />
              Low Contrast
            </span>
          ) : null}

          <button
            type="button"
            onClick={handleCopyImage}
            disabled={!isValid}
            aria-label="Copy QR code image to clipboard"
            className="min-h-[36px] px-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all text-slate-700 dark:text-slate-300 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Acrylic Studio Stage for the QR Code */}
      <div className="relative flex items-center justify-center p-6 sm:p-8 bg-slate-100/70 dark:bg-slate-950/70 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden min-h-[320px]">
        {/* Subtle grid dots background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Ambient Bloom behind the QR code */}
        <div
          className="absolute w-48 h-48 rounded-full pointer-events-none blur-2xl opacity-30 dark:opacity-40 transition-all duration-500"
          style={{ backgroundColor: glowColor }}
        />

        {/* Corner Precision Ticks */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-slate-400 dark:border-slate-600 rounded-tl pointer-events-none opacity-60" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-slate-400 dark:border-slate-600 rounded-tr pointer-events-none opacity-60" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-slate-400 dark:border-slate-600 rounded-bl pointer-events-none opacity-60" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-slate-400 dark:border-slate-600 rounded-br pointer-events-none opacity-60" />

        {/* QR Code Canvas Host */}
        <div
          ref={containerRef}
          className={`relative z-10 max-w-full aspect-square flex items-center justify-center p-3 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
            !isValid ? 'opacity-30 grayscale blur-[1px]' : 'opacity-100'
          }`}
          style={{
            backgroundColor: styleOptions.bgColor,
            boxShadow: `0 20px 40px -15px ${glowColor}40`,
          }}
        />

        {/* Invalid state overlay */}
        {!isValid && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px] rounded-2xl text-center">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-xs space-y-1">
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 font-display">
                Input Required
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {validationError || 'Type in a valid link or message to generate your code.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {copyError && (
        <p className="text-xs text-rose-500 text-center font-mono">
          Clipboard access was blocked by your browser. Use the Download PNG button below!
        </p>
      )}

      {/* Inline Safeguard Alerts */}
      {warnings.length > 0 && (
        <div className="space-y-2 pt-1 relative z-10">
          {warnings.map((w) => (
            <div
              key={w.id}
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                w.severity === 'danger'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                  : w.severity === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                  : 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/60 text-sky-900 dark:text-sky-200'
              }`}
            >
              {w.severity === 'danger' ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : w.severity === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold block">{w.title}</span>
                <p className="opacity-90">{w.message}</p>
                {w.recommendation && (
                  <p className="font-medium mt-1 text-[11px] underline underline-offset-2">
                    Tip: {w.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
