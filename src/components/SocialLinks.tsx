const SOCIAL_LINKS = [
  {
    label: 'Line',
    href: 'https://lin.ee/qNepI4H',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full h-full">
        <path
          fill="currentColor"
          d="M12 3.25c-5.08 0-9.22 3.32-9.22 7.4 0 3.65 3.2 6.71 7.52 7.29.29.06.68.2.78.45.09.23.06.59.03.82l-.12.77c-.04.23-.18.9.8.49.98-.41 5.29-3.12 7.22-5.34 1.33-1.46 1.98-2.95 1.98-4.47 0-4.08-4.13-7.4-9.21-7.4Zm-3.74 9.78H6.43a.42.42 0 0 1-.42-.42V8.72a.42.42 0 0 1 .84 0v3.47h1.41a.42.42 0 1 1 0 .84Zm1.54-.42a.42.42 0 0 1-.84 0V8.72a.42.42 0 0 1 .84 0v3.89Zm4.1 0a.42.42 0 0 1-.75.26l-1.97-2.68v2.42a.42.42 0 1 1-.84 0V8.72a.42.42 0 0 1 .76-.25l1.96 2.68V8.72a.42.42 0 0 1 .84 0v3.89Zm3.18-2.39a.42.42 0 1 1 0 .84h-1.41v1.13h1.41a.42.42 0 1 1 0 .84h-1.83a.42.42 0 0 1-.42-.42V8.72c0-.23.19-.42.42-.42h1.83a.42.42 0 1 1 0 .84h-1.41v1.08h1.41Z"
        />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/ultimatelifeadvisor',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full h-full">
        <path
          fill="currentColor"
          d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.53 1.5-3.93 3.78-3.93 1.1 0 2.24.2 2.24.2v2.48H15.2c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z"
        />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@ultimate_life6502',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full h-full">
        <path
          fill="currentColor"
          d="M21.58 7.19a2.52 2.52 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.52 2.52 0 0 0-1.77 1.78C2 8.76 2 12.03 2 12.03s0 3.27.42 4.84a2.48 2.48 0 0 0 1.77 1.74C5.75 19.03 12 19.03 12 19.03s6.25 0 7.81-.42a2.48 2.48 0 0 0 1.77-1.74c.42-1.57.42-4.84.42-4.84s0-3.27-.42-4.84ZM10 15.02v-6l5.2 3-5.2 3Z"
        />
      </svg>
    ),
  },
];

interface SocialLinksProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}

export default function SocialLinks({ variant = 'dark', size = 'sm', className = '' }: SocialLinksProps) {
  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const linkTone = variant === 'light'
    ? 'text-gray-300 hover:text-brand-orange border-brand-slate hover:border-brand-orange/50'
    : 'text-gray-500 hover:text-brand-orange border-slate-200 hover:border-brand-orange/40';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          title={item.label}
          className={`inline-flex items-center justify-center rounded-full border transition-colors ${iconSize === 'w-5 h-5' ? 'w-10 h-10' : 'w-8 h-8'} ${linkTone}`}
        >
          <span className={iconSize}>{item.icon}</span>
        </a>
      ))}
    </div>
  );
}
