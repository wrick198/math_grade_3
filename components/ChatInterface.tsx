import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Topic } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithTutor } from '../services/geminiService';

interface ChatInterfaceProps {
  topic: Topic;
  initialExplanation: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ topic, initialExplanation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with the explanation
  useEffect(() => {
    if (initialExplanation) {
      setMessages([{
        role: 'model',
        text: initialExplanation,
        timestamp: Date.now()
      }]);
    }
  }, [initialExplanation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));
    
    // Add current user message to context logic handled by chat helper usually, 
    // but here we pass history *before* the new message for the `chatWithTutor` implementation if it uses `ai.chats.create`.
    // However, my service `chatWithTutor` takes history.
    
    const responseText = await chatWithTutor(history, userMsg.text);

    const botMsg: ChatMessage = {
      role: 'model',
      text: responseText || "我好像走神了，能再说一遍吗？",
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-500 p-2 rounded-full">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900">AI 数学老师</h3>
            <p className="text-xs text-indigo-500">随时提问，耐心解答</p>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-white rounded-full text-indigo-400 border border-indigo-200">
            Powered by Gemini
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[85%] ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } items-start space-x-2 space-x-reverse`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-indigo-500 ml-2' : 'bg-green-500 mr-2'
                }`}
              >
                {msg.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 ml-10">
              <Sparkles size={16} className="text-yellow-500 animate-spin" />
              <span className="text-gray-400 text-sm">老师正在思考...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="我不明白，请再讲讲..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className={`ml-2 p-2 rounded-full transition-colors ${
              isLoading || !inputValue.trim()
                ? 'bg-gray-200 text-gray-400'
                : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
