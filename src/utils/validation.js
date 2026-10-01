/**
 * Validation utilities for QRsmith input forms.
 * All functions return { isValid: boolean, error?: string, hint?: string }
 */

/**
 * Validates a URL string. Supports http, https, ftp or domains that can be auto-prefixed.
 */
export function validateUrl(url) {
  if (!url || !url.trim()) {
    return {
      isValid: false,
      error: 'URL cannot be empty.',
      hint: 'Enter a valid address (e.g. https://example.com)',
    };
  }

  const trimmed = url.trim();
  // Check if it looks like a valid URL or domain
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;
  const ipPattern = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/[^\s]*)?$/;
  const localhostPattern = /^(https?:\/\/)?localhost(:\d+)?(\/[^\s]*)?$/i;

  if (!urlPattern.test(trimmed) && !ipPattern.test(trimmed) && !localhostPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid web address (e.g., https://example.com).',
      hint: 'Include domain name and extension like .com, .org, or .io',
    };
  }

  return { isValid: true };
}

/**
 * Validates plain text. Must not be empty.
 */
export function validateText(text) {
  if (!text || !text.trim()) {
    return {
      isValid: false,
      error: 'Text content cannot be empty.',
      hint: 'Enter any message, note, or alphanumeric code.',
    };
  }

  if (text.length > 2500) {
    return {
      isValid: false,
      error: `Text is too long (${text.length}/2500 chars). QR codes become difficult to scan above 2,500 characters.`,
      hint: 'Try shortening the text for higher scan reliability.',
    };
  }

  return { isValid: true };
}

/**
 * Validates an email address.
 */
export function validateEmail({ email, subject = '', body = '' }) {
  if (!email || !email.trim()) {
    return {
      isValid: false,
      error: 'Recipient email address is required.',
      hint: 'e.g. name@example.com',
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid email address format (name@example.com).',
      hint: 'Check for missing @ or domain suffix',
    };
  }

  return { isValid: true };
}

/**
 * Validates a telephone number.
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      error: 'Phone number cannot be empty.',
      hint: 'e.g. +1 555-0199 or 08012345678',
    };
  }

  const clean = phone.replace(/[\s\-\(\)\.]/g, '');
  // Must have at least 6 digits and only optional leading +
  const phonePattern = /^\+?[0-9]{6,16}$/;

  if (!phonePattern.test(clean)) {
    return {
      isValid: false,
      error: 'Please enter a valid telephone number (6 to 16 digits).',
      hint: 'Digits and optional leading + country code only.',
    };
  }

  return { isValid: true };
}

/**
 * Validates Wi-Fi network configuration.
 */
export function validateWifi({ ssid, password = '', encryption = 'WPA' }) {
  if (!ssid || !ssid.trim()) {
    return {
      isValid: false,
      error: 'Network Name (SSID) is required.',
      hint: 'Enter the exact name of the Wi-Fi network.',
    };
  }

  if (encryption === 'WPA' && password.length < 8 && password.length > 0) {
    return {
      isValid: false,
      error: 'WPA/WPA2 passwords must be at least 8 characters long.',
      hint: 'Check password or set encryption to None if open.',
    };
  }

  if (encryption !== 'nopass' && !password && password !== '') {
    return {
      isValid: false,
      error: 'Password is required for encrypted Wi-Fi networks.',
      hint: 'Enter the Wi-Fi password or select "None" for open network.',
    };
  }

  return { isValid: true };
}

/**
 * Master validator routing to specific type validators
 */
export function validateInput(type, formData) {
  switch (type) {
    case 'url':
      return validateUrl(formData.url);
    case 'text':
      return validateText(formData.text);
    case 'email':
      return validateEmail(formData);
    case 'phone':
      return validatePhone(formData.phone);
    case 'wifi':
      return validateWifi(formData);
    default:
      return { isValid: false, error: 'Unknown QR type selected.' };
  }
}
