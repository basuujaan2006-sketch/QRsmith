/**
 * Formats user input into standardized QR code data payloads
 */

/**
 * Format URL with appropriate protocol if missing
 */
export function formatUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Format plain text (returns verbatim trimmed string)
 */
export function formatText(text) {
  return text || '';
}

/**
 * Format email as mailto: URI with RFC-compliant query parameters
 */
export function formatEmail({ email = '', subject = '', body = '' }) {
  const cleanEmail = email.trim();
  if (!cleanEmail) return '';

  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  const queryString = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${cleanEmail}${queryString}`;
}

/**
 * Format phone as tel: URI
 */
export function formatPhone(phone = '') {
  if (!phone) return '';
  // Keep digits and leading plus sign
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

/**
 * Format Wi-Fi configuration into standard MeCard/ZXing format:
 * WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
 */
export function formatWifi({ ssid = '', password = '', encryption = 'WPA', hidden = false }) {
  if (!ssid) return '';

  // Escape special characters in SSID and password: \ ; , : "
  const escapeWifi = (str) => {
    return str.replace(/([\\;,:"])/g, '\\$1');
  };

  const enc = encryption === 'none' ? 'nopass' : encryption;
  const s = escapeWifi(ssid);
  const p = enc === 'nopass' ? '' : escapeWifi(password || '');
  const h = hidden ? 'true' : 'false';

  return `WIFI:T:${enc};S:${s};P:${p};H:${h};;`;
}

/**
 * Master formatter routing
 */
export function formatQRData(type, formData) {
  switch (type) {
    case 'url':
      return formatUrl(formData.url);
    case 'text':
      return formatText(formData.text);
    case 'email':
      return formatEmail(formData);
    case 'phone':
      return formatPhone(formData.phone);
    case 'wifi':
      return formatWifi(formData);
    default:
      return '';
  }
}
