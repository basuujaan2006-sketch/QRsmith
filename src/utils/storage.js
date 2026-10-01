/**
 * Browser localStorage management for QRsmith history and preferences
 */

const RECENT_STORAGE_KEY = 'qrsmith_recent_codes_v1';
const THEME_STORAGE_KEY = 'qrsmith_theme_mode';

/**
 * Load list of recent QR codes from localStorage
 */
export function getRecentCodes() {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load recent QR codes from storage:', err);
    return [];
  }
}

/**
 * Save or update a recent QR code entry.
 * Keeps max 10 entries, moves existing duplicate data to front.
 */
export function saveRecentCode(item) {
  try {
    const current = getRecentCodes();
    // Check if duplicate data payload exists
    const filtered = current.filter(
      (entry) => !(entry.type === item.type && entry.rawPayload === item.rawPayload)
    );

    const updated = [
      {
        id: item.id || `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        type: item.type,
        formData: item.formData,
        styleOptions: item.styleOptions,
        rawPayload: item.rawPayload,
        thumbnail: item.thumbnail || null,
        title: item.title || item.rawPayload || 'QR Code',
      },
      ...filtered,
    ].slice(0, 10);

    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save recent QR code to storage:', err);
    return [];
  }
}

/**
 * Remove a specific recent code by id
 */
export function removeRecentCode(id) {
  try {
    const current = getRecentCodes();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to remove recent QR code:', err);
    return [];
  }
}

/**
 * Clear all recent codes
 */
export function clearAllRecentCodes() {
  try {
    localStorage.removeItem(RECENT_STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear recent QR codes:', err);
    return [];
  }
}

/**
 * Get stored theme preference ('dark' | 'light' | null)
 */
export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Persist theme preference
 */
export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme preference:', err);
  }
}
