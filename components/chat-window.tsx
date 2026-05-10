"use client";

import { useState, useRef, useEffect } from "react";
import type { Persona } from "@/app/page";

interface ChatWindowProps {
  persona: Persona;
  messages: { text: string; isUser: boolean }[];
  onClose: () => void;
  onSend: (message: string) => void;
}

export default function ChatWindow({ persona, messages, onClose, onSend }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 w-96 h-[500px] glass rounded-2xl flex flex-col z-50">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-bold" style={{ color: persona.color }}>
            {persona.name}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition">
          X
        </button>
      </div>

      <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-hide">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.isUser ? "text-right" : ""}`}>
            <div
              className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
                msg.isUser ? "bg-mardi-gold text-black" : "glass"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Transmit message..."
            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mardi-gold/50"
          />
          <button onClick={handleSend} className="glass px-6 rounded-xl hover:bg-white/10 transition">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
