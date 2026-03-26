export function OmniBioLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Central Node */}
      <circle cx="50" cy="50" r="16" fill="url(#grad1)" />
      
      {/* Branches */}
      <path d="M38 38 L25 25" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      <path d="M25 25 Q15 25 15 35" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      
      <path d="M50 34 L50 15" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      
      <path d="M62 38 L75 25" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      
      <path d="M66 50 L85 50" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      <path d="M85 50 Q85 65 75 65" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      
      <path d="M62 62 L75 75" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      
      <path d="M38 62 L25 75" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />
      <path d="M25 75 Q15 75 15 65" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round" />

      {/* Outer Nodes */}
      <circle cx="15" cy="35" r="6" fill="#60a5fa" />
      <circle cx="50" cy="15" r="6" fill="#60a5fa" />
      <circle cx="75" cy="25" r="6" fill="#60a5fa" />
      <circle cx="75" cy="65" r="6" fill="#60a5fa" />
      <circle cx="75" cy="75" r="6" fill="#60a5fa" />
      <circle cx="15" cy="65" r="6" fill="#60a5fa" />
      
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
