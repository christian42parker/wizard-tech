import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { InputField } from './ui/InputField';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation d'un délai réseau pour l'effet réaliste
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    onLogin();
  };

  return (
    <div className="w-full max-w-[420px] animate-fade-in">
      {/* Glass Card */}
      <div className="relative group">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#004aad] to-[#FDB931] rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl">
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* Logo avec animation */}
            <div className="mb-8 transform transition-transform duration-500 hover:scale-105">
              <Logo variant="light" className="scale-125" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Bienvenue</h2>
            <p className="text-sm text-gray-400 font-medium mb-10 leading-relaxed">
              Connectez-vous pour accéder à l'intelligence <br/>
              <span className="text-[#FDB931]">conçue chez nous</span>.
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="space-y-4">
                <InputField
                  label="Adresse Email"
                  type="email"
                  icon={Mail}
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="space-y-1">
                  <InputField
                    label="Mot de passe"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-[#FDB931] transition-colors mt-2"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connexion...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Accéder à Wizard <ArrowRight size={18} />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Footer Card */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600">
              Protégé par Wizard CongoTech Security. <br/>
              &copy; 2024 Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;