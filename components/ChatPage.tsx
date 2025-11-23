import React, { useState, useRef, useEffect } from 'react';
import { Send, LogOut, User, Plus, MessageSquare, Menu, Sparkles, X, ChevronRight } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Logo } from './ui/Logo';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatPageProps {
  onLogout: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '**Bienvenue.** Je suis l\'intelligence Wizard. \n\nJe suis là pour vous assister dans vos projets technologiques, analyser vos données ou créer du contenu. \n\n*Par quoi commençons-nous ?*'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  const startNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: 'Système réinitialisé. Nouvelle session prête.'
    }]);
    chatSessionRef.current = null;
    setSidebarOpen(false);
  };

  const getChatSession = () => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "Tu es Wizard, une IA de haute technologie créée par CongoTech. Ton ton est professionnel, futuriste mais serviable. Tu utilises parfois des termes techniques précis. Tu excelles en programmation et en stratégie d'entreprise.",
        },
      });
    }
    return chatSessionRef.current;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    if (textAreaRef.current) textAreaRef.current.style.height = 'auto';

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chat = getChatSession();
      const aiMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMessageId,
        role: 'model',
        text: ''
      }]);

      const result = await chat.sendMessageStream({ message: userText });
      
      let fullText = '';
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }

    } catch (error) {
      console.error("Erreur AI:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "⚠️ **Erreur système.** La connexion au noyau neuronal a échoué. Veuillez réessayer."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden backdrop-blur-sm">
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Glassmorphism */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[280px] flex flex-col transition-all duration-300 ease-out
        bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/5
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <Logo variant="light" className="scale-90 origin-left" />
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400">
              <X size={24} />
            </button>
          </div>

          <button 
            onClick={startNewChat}
            className="group w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-[#004aad]/20 to-[#004aad]/10 hover:from-[#004aad] hover:to-[#003c8f] border border-[#004aad]/30 hover:border-[#004aad] text-blue-200 hover:text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/30"
          >
            <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Plus size={18} />
            </div>
            <span className="font-semibold tracking-wide text-sm">Nouveau Chat</span>
          </button>

          <div className="mt-8 mb-4 flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Historique</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          
          <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {['Architecture Système', 'Audit de Sécurité', 'Marketing RDC'].map((item, i) => (
              <button key={i} className="group w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 flex items-center gap-3 transition-all duration-200 border border-transparent hover:border-white/5">
                <MessageSquare size={16} className="text-gray-500 group-hover:text-[#FDB931] transition-colors" />
                <span className="truncate text-sm text-gray-400 group-hover:text-gray-200">{item}</span>
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-gray-600 transition-opacity" />
              </button>
            ))}
          </div>

          <div className="pt-6 mt-auto border-t border-white/5">
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full h-full relative z-0">
        
        {/* Header - Floating Glass */}
        <header className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-300 hover:bg-white/10 rounded-lg backdrop-blur-md"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <span className="font-space font-bold text-xl text-white tracking-tight flex items-center gap-2">
                Wizard <span className="text-xs bg-[#FDB931] text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Pro</span>
              </span>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-0 pt-24 pb-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-6 animate-slide-up ${
                  message.role === 'model' ? 'bg-transparent' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg
                  ${message.role === 'user' 
                    ? 'bg-gradient-to-br from-[#004aad] to-[#007BFF] text-white' 
                    : 'bg-black/50 border border-[#FDB931]/20 text-[#FDB931] backdrop-blur-md'}
                `}>
                  {message.role === 'user' ? (
                    <User size={20} />
                  ) : (
                    <Sparkles size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm tracking-wide text-gray-200">
                      {message.role === 'user' ? 'Vous' : 'Wizard AI'}
                    </span>
                    {message.role === 'model' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5">v2.5</span>
                    )}
                  </div>
                  
                  <div className={`prose prose-invert max-w-none text-gray-300 leading-7 ${
                    message.role === 'model' ? 'markdown-content' : ''
                  }`}>
                    {message.role === 'model' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap text-white text-lg font-light">{message.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-6 animate-fade-in">
                 <div className="w-10 h-10 rounded-xl bg-black/50 border border-[#FDB931]/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                   <Sparkles size={20} className="text-[#FDB931] animate-pulse" />
                 </div>
                 <div className="flex items-center space-x-2 mt-4">
                   <div className="w-2 h-2 bg-[#FDB931] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 bg-[#FDB931] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 bg-[#FDB931] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className={`
              relative flex items-end gap-2 p-2
              bg-[#1a1a1a]/80 backdrop-blur-2xl 
              border border-white/10 rounded-2xl 
              shadow-2xl shadow-black/50
              transition-all duration-300
              ${isLoading ? 'opacity-80' : 'hover:border-white/20 focus-within:border-[#FDB931]/50 focus-within:ring-1 focus-within:ring-[#FDB931]/20'}
            `}>
              <textarea
                ref={textAreaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez une question technique..."
                className="w-full max-h-[200px] py-3 pl-4 pr-12 bg-transparent border-0 focus:ring-0 resize-none text-white placeholder-gray-500 font-light text-base leading-relaxed custom-scrollbar"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className={`
                  mb-1 mr-1 p-3 rounded-xl transition-all duration-300 flex items-center justify-center
                  ${inputValue.trim() && !isLoading 
                    ? 'bg-[#FDB931] text-black hover:bg-[#e0a221] shadow-[0_0_15px_rgba(253,185,49,0.3)]' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'}
                `}
              >
                <Send size={20} className={inputValue.trim() && !isLoading ? "ml-0.5" : ""} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-4 tracking-wider uppercase">
              Wizard CongoTech AI v2.5 &bull; Accès Sécurisé
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;