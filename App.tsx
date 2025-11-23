import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white selection:bg-[#FDB931] selection:text-black">
      {/* Background Layer */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-screen flex flex-col">
        {isLoggedIn ? (
          <ChatPage onLogout={() => setIsLoggedIn(false)} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <LoginPage onLogin={() => setIsLoggedIn(true)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;