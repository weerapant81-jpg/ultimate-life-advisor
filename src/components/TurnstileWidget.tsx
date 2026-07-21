import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// Minimal typing for the Cloudflare Turnstile global.
type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      theme?: 'auto' | 'light' | 'dark';
      language?: string;
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<void> | null = null;

const loadTurnstileScript = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile script.'));
    document.head.appendChild(script);
  });

  return scriptPromise;
};

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey: string;
  lang: 'EN' | 'TH';
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  ({ siteKey, lang, onVerify, onExpire }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      let cancelled = false;

      loadTurnstileScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;
          // Avoid double-render (React StrictMode mounts effects twice in dev).
          if (widgetIdRef.current) return;
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            language: lang === 'TH' ? 'th' : 'en',
            theme: 'light',
            callback: (token) => onVerify(token),
            'expired-callback': () => onExpire?.(),
            'error-callback': () => onExpire?.(),
          });
        })
        .catch((error) => {
          console.error('Turnstile load error:', error);
        });

      return () => {
        cancelled = true;
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    return <div ref={containerRef} className="min-h-[65px]" />;
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;
