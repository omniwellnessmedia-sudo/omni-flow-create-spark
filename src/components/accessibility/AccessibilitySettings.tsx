import React, { useState, useEffect } from 'react';
import { Settings, Eye, Type, ZapOff, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface AccessibilityState {
  fontSize: 'default' | 'small' | 'large' | 'xl';
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
  focusHighlight: boolean;
}

const defaultState: AccessibilityState = {
  fontSize: 'default',
  highContrast: false,
  reduceMotion: false,
  dyslexiaFont: false,
  focusHighlight: false,
};

const STORAGE_KEY = 'omni-accessibility-settings';

function loadSettings(): AccessibilityState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaultState;
}

function applySettings(settings: AccessibilityState) {
  const html = document.documentElement;

  // Font size
  html.classList.remove('font-size-small', 'font-size-large', 'font-size-xl');
  if (settings.fontSize !== 'default') {
    html.classList.add(`font-size-${settings.fontSize}`);
  }

  // Toggles
  html.classList.toggle('high-contrast', settings.highContrast);
  html.classList.toggle('reduce-motion', settings.reduceMotion);
  html.classList.toggle('dyslexia-font', settings.dyslexiaFont);
  html.classList.toggle('focus-visible-enhanced', settings.focusHighlight);
}

const fontSizeOptions: { value: AccessibilityState['fontSize']; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'default', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xl', label: 'XL' },
];

const AccessibilitySettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>(() => loadSettings());

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply on mount
  useEffect(() => {
    applySettings(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<AccessibilityState>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  return (
    <div className="fixed bottom-32 sm:bottom-24 right-4 z-[60] flex flex-col items-end gap-2">
      {open && (
        <div
          className="bg-card border border-border rounded-xl shadow-elegant p-4 w-72 max-w-[calc(100vw-32px)] space-y-4 animate-scale-in"
          role="dialog"
          aria-label="Accessibility settings"
        >
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Accessibility Settings
          </h3>

          {/* Font Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
              <Type className="w-3.5 h-3.5" />
              Font Size
            </label>
            <div className="flex gap-1">
              {fontSizeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={settings.fontSize === opt.value ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => update({ fontSize: opt.value })}
                  aria-pressed={settings.fontSize === opt.value}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground cursor-pointer">
              <Eye className="w-3.5 h-3.5" />
              High Contrast
            </label>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(v) => update({ highContrast: v })}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground cursor-pointer">
              <ZapOff className="w-3.5 h-3.5" />
              Reduced Motion
            </label>
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(v) => update({ reduceMotion: v })}
              aria-label="Toggle reduced motion"
            />
          </div>

          {/* Dyslexia Font */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground cursor-pointer">
              <Type className="w-3.5 h-3.5" />
              Dyslexia-Friendly Font
            </label>
            <Switch
              checked={settings.dyslexiaFont}
              onCheckedChange={(v) => update({ dyslexiaFont: v })}
              aria-label="Toggle dyslexia-friendly font"
            />
          </div>

          {/* Focus Highlight */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground cursor-pointer">
              <Focus className="w-3.5 h-3.5" />
              Focus Highlight
            </label>
            <Switch
              checked={settings.focusHighlight}
              onCheckedChange={(v) => update({ focusHighlight: v })}
              aria-label="Toggle enhanced focus highlight"
            />
          </div>
        </div>
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full shadow-lg bg-card border-border"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close accessibility settings' : 'Open accessibility settings'}
        aria-expanded={open}
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AccessibilitySettings;
