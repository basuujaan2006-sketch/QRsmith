import React, { useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Download, FileCode, Image, Check, Loader2, Sparkles } from 'lucide-react';

export default function DownloadButton({
  qrData,
  styleOptions,
  isValid,
  onAfterDownload,
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const createExportInstance = (targetResolution) => {
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

    return new QRCodeStyling({
      width: targetResolution,
      height: targetResolution,
      data: qrData,
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
    });
  };

  const handleDownload = async (extension) => {
    if (!isValid || !qrData || isExporting) return;

    try {
      setIsExporting(true);
      const resolution = extension === 'svg' ? 500 : (styleOptions.size || 500);
      const exportInstance = createExportInstance(resolution);

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `qrsmith-${timestamp}-${resolution}px`;

      await exportInstance.download({
        name: filename,
        extension,
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2200);

      if (onAfterDownload) {
        onAfterDownload();
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Glowing Primary PNG Button */}
        <button
          type="button"
          disabled={!isValid || isExporting}
          onClick={() => handleDownload('png')}
          className={`min-h-[50px] px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
            !isValid
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300/40 dark:border-slate-800'
              : 'bg-gradient-to-r from-forge-500 to-amber-600 hover:from-forge-400 hover:to-amber-500 text-slate-950 shadow-glow-forge active:scale-95 cursor-pointer'
          }`}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : downloadSuccess ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>
            {downloadSuccess
              ? 'Saved to Downloads!'
              : `Download PNG (${styleOptions.size || 450}px)`}
          </span>
        </button>

        {/* Vector SVG Button */}
        <button
          type="button"
          disabled={!isValid || isExporting}
          onClick={() => handleDownload('svg')}
          className={`min-h-[50px] px-4 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 border ${
            !isValid
              ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer active:scale-95 shadow-sm'
          }`}
        >
          <FileCode className="w-4 h-4 text-forge-500" />
          <span>Vector SVG (Print)</span>
        </button>
      </div>

      {!isValid && (
        <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center font-mono">
          Enter valid data above to download in high resolution.
        </p>
      )}
    </div>
  );
}
