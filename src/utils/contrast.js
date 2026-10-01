/**
 * Color luminance and contrast ratio calculations for QR scan reliability safeguards
 */

/**
 * Convert 3 or 6 hex digit string to RGB object { r, g, b }
 */
export function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculate relative luminance according to WCAG 2.1 specs
 */
export function getRelativeLuminance(rgb) {
  const normalize = (val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = normalize(rgb.r);
  const g = normalize(rgb.g);
  const b = normalize(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two hex colors: (L1 + 0.05) / (L2 + 0.05)
 * Returns a number rounded to 1 decimal place.
 */
export function calculateContrastRatio(hexColor1, hexColor2) {
  const lum1 = getRelativeLuminance(hexToRgb(hexColor1));
  const lum2 = getRelativeLuminance(hexToRgb(hexColor2));
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return Math.round(((brighter + 0.05) / (darker + 0.05)) * 10) / 10;
}

/**
 * Evaluates scan reliability and returns any relevant inline warnings
 */
export function getScanReliabilityWarnings({
  fgColor,
  bgColor,
  isGradient,
  gradientColor1,
  gradientColor2,
  hasLogo,
  errorCorrectionLevel,
}) {
  const warnings = [];

  // Determine effective foreground colors to check
  const fgColors = isGradient ? [gradientColor1, gradientColor2] : [fgColor];
  const bgLum = getRelativeLuminance(hexToRgb(bgColor));

  let minContrast = Infinity;
  let hasInvertedDots = false;

  for (const fg of fgColors) {
    const ratio = calculateContrastRatio(fg, bgColor);
    if (ratio < minContrast) {
      minContrast = ratio;
    }
    const fgLum = getRelativeLuminance(hexToRgb(fg));
    // If foreground is brighter than background, it's an inverted QR code
    if (fgLum > bgLum) {
      hasInvertedDots = true;
    }
  }

  // Warning 1: Insufficient contrast
  if (minContrast < 3.0) {
    warnings.push({
      id: 'low-contrast',
      severity: 'danger',
      title: 'Low Scan Contrast',
      message: `Contrast ratio is only ${minContrast}:1 (safe minimum is 3.0:1). Optical sensors and phone cameras may fail to read this code. Increase contrast between foreground dots and background.`,
      recommendation: 'Use darker dots or a lighter background.',
    });
  } else if (minContrast < 4.5) {
    warnings.push({
      id: 'moderate-contrast',
      severity: 'warning',
      title: 'Moderate Contrast',
      message: `Contrast ratio is ${minContrast}:1. It should scan under normal lighting, but dim environments may degrade scan speed.`,
      recommendation: 'A 5.0+:1 contrast ratio guarantees optimal scan reliability.',
    });
  }

  // Warning 2: Inverted QR code
  if (hasInvertedDots) {
    warnings.push({
      id: 'inverted-colors',
      severity: 'info',
      title: 'Inverted QR Style',
      message: 'Dots are lighter than the background. Modern smartphone cameras can read inverted QR codes, but certain legacy hardware scanners and embedded kiosks cannot.',
      recommendation: 'Use dark dots on light background if deploying in retail/industrial hardware.',
    });
  }

  // Warning 3: Logo present with low Error Correction
  if (hasLogo && (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M')) {
    warnings.push({
      id: 'logo-redundancy',
      severity: 'warning',
      title: 'Center Logo Needs High Redundancy',
      message: `A center logo obscures up to 20% of the code's data modules. Error correction "${errorCorrectionLevel}" only recovers ~${errorCorrectionLevel === 'L' ? '7%' : '15%'} of lost data, risking scan failures.`,
      recommendation: 'Switch Error Correction to "Q" (25%) or "H" (30%) for reliable scanning with a logo.',
    });
  }

  return warnings;
}
