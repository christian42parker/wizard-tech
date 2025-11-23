import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`
        relative w-full py-4 px-6 
        bg-gradient-to-r from-[#004aad] to-[#0062cc]
        hover:from-[#003c8f] hover:to-[#0056b3]
        text-white font-bold tracking-wide rounded-xl 
        shadow-lg shadow-blue-900/40 
        transition-all duration-300 
        transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]
        overflow-hidden group
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
      <div className="relative flex items-center justify-center">
        {children}
      </div>
    </button>
  );
};