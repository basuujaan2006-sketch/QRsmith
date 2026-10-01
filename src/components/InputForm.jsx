import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Mail,
  Phone,
  Wifi,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function InputForm({
  activeType,
  formData,
  onChangeField,
  validationResult,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const error = validationResult?.isValid === false ? validationResult.error : null;
  const hint = validationResult?.hint;
  const isValid = validationResult?.isValid === true;

  // Quick preset sample fillers
  const fillSample = (samples) => {
    Object.entries(samples).forEach(([k, v]) => onChangeField(k, v));
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forge-500/10 text-forge-600 dark:text-forge-400 flex items-center justify-center">
            {activeType === 'url' && <Globe className="w-4 h-4" />}
            {activeType === 'text' && <FileText className="w-4 h-4" />}
            {activeType === 'email' && <Mail className="w-4 h-4" />}
            {activeType === 'phone' && <Phone className="w-4 h-4" />}
            {activeType === 'wifi' && <Wifi className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 font-display">
              {activeType === 'url' && 'Website Link'}
              {activeType === 'text' && 'Plain Text & Notes'}
              {activeType === 'email' && 'Email Message'}
              {activeType === 'phone' && 'Phone Direct Dial'}
              {activeType === 'wifi' && 'Wi-Fi Network'}
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {activeType === 'url' && 'Visitors will instantly open this webpage'}
              {activeType === 'text' && 'Encodes plain text for any barcode scanner'}
              {activeType === 'email' && 'Opens draft email with recipient & body'}
              {activeType === 'phone' && 'Opens phone dialer with one tap'}
              {activeType === 'wifi' && 'Connects phones automatically without typing passwords'}
            </p>
          </div>
        </div>

        {isValid ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            Valid
          </span>
        ) : (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium">
            Required
          </span>
        )}
      </div>

      {/* Dynamic Fields */}
      {activeType === 'url' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="input-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Web Address / URL
            </label>
            <div className="relative">
              <input
                id="input-url"
                type="text"
                value={formData.url || ''}
                onChange={(e) => onChangeField('url', e.target.value)}
                placeholder="e.g. https://qrsmith.dev or myportfolio.com"
                className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-sm font-mono transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-forge-500 focus:ring-forge-500/20'
                }`}
              />
            </div>
          </div>

          {/* Quick Demo Fillers */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-forge-500" />
              Try demo:
            </span>
            <button
              type="button"
              onClick={() => fillSample({ url: 'https://qrsmith.dev' })}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              qrsmith.dev
            </button>
            <button
              type="button"
              onClick={() => fillSample({ url: 'https://github.com' })}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              github.com
            </button>
            <button
              type="button"
              onClick={() => fillSample({ url: 'https://instagram.com' })}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              instagram.com
            </button>
          </div>
        </div>
      )}

      {activeType === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-text" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Message or Plain Text
            </label>
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              {(formData.text || '').length} / 2500 chars
            </span>
          </div>
          <textarea
            id="input-text"
            rows={4}
            value={formData.text || ''}
            onChange={(e) => onChangeField('text', e.target.value)}
            placeholder="Type or paste any text, voucher coupon, secret code, or note..."
            className={`w-full min-h-[110px] px-4 py-3 rounded-xl border text-sm font-sans transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-forge-500 focus:ring-forge-500/20'
            }`}
          />
        </div>
      )}

      {activeType === 'email' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="input-email-to" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Recipient Email Address
            </label>
            <input
              id="input-email-to"
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChangeField('email', e.target.value)}
              placeholder="e.g. hello@yourbrand.com"
              className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-sm font-mono transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                error
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-forge-500 focus:ring-forge-500/20'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="input-email-subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject Line <span className="text-slate-500 text-[10px]">(Optional)</span>
              </label>
              <input
                id="input-email-subject"
                type="text"
                value={formData.subject || ''}
                onChange={(e) => onChangeField('subject', e.target.value)}
                placeholder="e.g. VIP Consultation Request"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm focus:outline-none focus:border-forge-500 focus:ring-2 focus:ring-forge-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-email-body" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message Body <span className="text-slate-500 text-[10px]">(Optional)</span>
              </label>
              <input
                id="input-email-body"
                type="text"
                value={formData.body || ''}
                onChange={(e) => onChangeField('body', e.target.value)}
                placeholder="e.g. Hi there, I'd like to get in touch."
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm focus:outline-none focus:border-forge-500 focus:ring-2 focus:ring-forge-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {activeType === 'phone' && (
        <div className="space-y-2">
          <label htmlFor="input-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Phone Number
          </label>
          <input
            id="input-phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onChangeField('phone', e.target.value)}
            placeholder="e.g. +1 555-0199 or +44 7700 900077"
            className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-sm font-mono transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-forge-500 focus:ring-forge-500/20'
            }`}
          />
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Phones scanning this code will prompt to call this number immediately.
          </p>
        </div>
      )}

      {activeType === 'wifi' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="input-wifi-ssid" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Network Name (SSID)
              </label>
              <input
                id="input-wifi-ssid"
                type="text"
                value={formData.ssid || ''}
                onChange={(e) => onChangeField('ssid', e.target.value)}
                placeholder="e.g. Guest_Lounge_5G"
                className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-sm font-mono transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  error && !formData.ssid
                    ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-forge-500 focus:ring-forge-500/20'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-wifi-enc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Security Type
              </label>
              <select
                id="input-wifi-enc"
                value={formData.encryption || 'WPA'}
                onChange={(e) => onChangeField('encryption', e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-forge-500 focus:ring-2 focus:ring-forge-500/20 font-mono"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Older)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>

          {formData.encryption !== 'nopass' && (
            <div className="space-y-1.5">
              <label htmlFor="input-wifi-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Wi-Fi Password
              </label>
              <div className="relative">
                <input
                  id="input-wifi-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => onChangeField('password', e.target.value)}
                  placeholder="Enter Wi-Fi password"
                  className="w-full min-h-[46px] pl-4 pr-12 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm font-mono focus:outline-none focus:border-forge-500 focus:ring-2 focus:ring-forge-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="pt-1 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none min-h-[40px]">
              <input
                type="checkbox"
                checked={!!formData.hidden}
                onChange={(e) => onChangeField('hidden', e.target.checked)}
                className="w-4 h-4 text-forge-600 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-forge-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Hidden SSID
              </span>
            </label>

            <button
              type="button"
              onClick={() => fillSample({ ssid: 'Cafe_Craftsman_5G', password: 'forge-guest-pass' })}
              className="text-[11px] font-mono text-forge-600 dark:text-forge-400 hover:underline"
            >
              Fill Demo Wi-Fi
            </button>
          </div>
        </div>
      )}

      {/* Validation Message */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-rose-800 dark:text-rose-300">{error}</p>
            {hint && <p className="text-rose-600 dark:text-rose-400 mt-0.5">{hint}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
