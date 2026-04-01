/// <reference types="vite/client" />

interface Window {
  tagClarityEvent?: (key: string, value: string) => void;
  trackRoamEvent?: (eventName: string, params: Record<string, unknown>) => void;
}
