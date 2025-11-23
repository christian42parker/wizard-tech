import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark'; // light = texte blanc (pour fond sombre), dark = texte noir (pour fond clair)
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, variant = 'dark' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className={showText ? "h-20 w-auto mb-2" : "h-full w-full"}
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDB931" />
            <stop offset="30%" stopColor="#FFFFAC" />
            <stop offset="50%" stopColor="#D1B464" />
            <stop offset="70%" stopColor="#5d4a1f" />
            <stop offset="100%" stopColor="#FDB931" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Le W Doré */}
        <path
          d="M40 50 L70 150 L100 80 L130 150 L160 50 L135 50 L120 110 L100 60 L80 110 L65 50 Z"
          fill="url(#goldGradient)"
          stroke="#B8860B"
          strokeWidth="1"
          filter="url(#glow)"
        />

        {/* La baguette magique */}
        <line 
          x1="160" y1="40" 
          x2="100" y2="120" 
          stroke="url(#goldGradient)" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
        
        {/* L'étincelle/Étoile au bout de la baguette */}
        <path
          d="M160 40 L165 25 L170 40 L185 45 L170 50 L165 65 L160 50 L145 45 Z"
          fill="#FFFFAC"
          filter="url(#glow)"
        />
      </svg>

      {showText && (
        <div className="text-center">
          <h1 className={`text-2xl font-bold tracking-widest leading-none ${variant === 'light' ? 'text-white' : 'text-gray-900'}`}>
            WIZARD
          </h1>
          <p className={`text-[10px] font-medium tracking-[0.3em] mt-1 ${variant === 'light' ? 'text-gray-300' : 'text-gray-500'}`}>
            CONGO TECH
          </p>
        </div>
      )}
    </div>
  );
};
