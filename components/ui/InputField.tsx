import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full group">
      <label className={`block text-xs font-medium uppercase tracking-wider mb-2 transition-colors duration-300 ${isFocused ? 'text-[#FDB931]' : 'text-gray-500'}`}>
        {label}
      </label>
      <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.01]' : ''}`}>
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-[#FDB931]' : 'text-gray-500'}`}>
          <Icon size={18} />
        </div>
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-11 pr-4 py-3.5 
            bg-white/5 border border-white/10 
            rounded-xl text-white placeholder-gray-600 
            focus:outline-none focus:bg-white/10 focus:border-[#FDB931]/50 focus:ring-1 focus:ring-[#FDB931]/50
            transition-all duration-300
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};