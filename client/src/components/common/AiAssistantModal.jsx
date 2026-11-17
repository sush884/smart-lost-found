import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ShieldAlert } from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    q: 'How does the matching percentage work?',
    a: 'Our engine computes a composite score: 30% Category + 25% Description Overlap + 20% Date Proximity + 15% Campus Location + 10% Attributes (Color/Brand). A score over 80% is flagged as a strong match.',
  },
  {
    q: 'How do I prove ownership safely without leaking private clues?',
    a: 'When filing a public report, keep descriptions visual but general (e.g. "Black backpack"). Do NOT write passwords or serial numbers publicly. Instead, provide those answers privately during the claim step so only campus moderators see them.',
  },
  {
    q: 'Where do I collect recovered items?',
    a: 'All physical handovers occur at the North Gate Security Lost & Found Custody Desk. Once your claim is approved, present your one-time expiring digital QR pass to the duty officer.',
  },
  {
    q: 'What should I do if I find someone’s belongings?',
    a: 'Submit a "Found Item" report with the campus zone where you discovered it, and deposit it with North Gate Security or hold it safely until the claimant coordinates with a moderator.',
  },
];

export default function AiAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your Campus Recovery Assistant. How can I assist you with reporting, matching, or ownership verification today?',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInput('');

    // Answer matching logic
    setTimeout(() => {
      const match = KNOWLEDGE_BASE.find((item) =>
        query.toLowerCase().includes(item.q.toLowerCase().split(' ')[1]) ||
        item.q.toLowerCase().includes(query.toLowerCase())
      );

      const reply = match
        ? match.a
        : "I can help clarify campus lost and found policies, safe reporting tips, and verification procedures. For specific claims, our campus moderators review private evidence directly.";

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg glass-card rounded-3xl border border-slate-200 shadow-2xl flex flex-col h-[520px] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Campus Recovery AI Assistant</h3>
              <p className="text-[10px] text-indigo-100">Guidance on reporting & privacy rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick FAQ Prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
          {KNOWLEDGE_BASE.slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.q)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors"
            >
              {item.q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about matching, safe reporting, or security pickup..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
