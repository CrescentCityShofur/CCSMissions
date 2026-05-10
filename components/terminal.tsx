"use client";

import { useEffect, useRef } from "react";
import type { LogEntry, Persona } from "@/app/page";

interface TerminalProps {
  logs: LogEntry[];
  persona: Persona;
  isEmergency: boolean;
  onActivateCorridor: (type: string) => void;
}

const corridors = [
  { id: "energy", label: "ENERGY", sub: "Solar / EV", color: "text-mardi-gold" },
  { id: "water", label: "WATER", sub: "AWG / Purity", color: "text-mardi-green" },
  { id: "property", label: "PROPERTY", sub: "AI Triage", color: "text-lsu-purple" },
  { id: "logistics", label: "LOGISTICS", sub: "Movement", color: "text-blue-400" },
];

export default function Terminal({ logs, persona, isEmergency, onActivateCorridor }: TerminalProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className={`glass flex-1 rounded-2xl p-8 flex flex-col h-full transition-all ${
        isEmergency ? "emergency-mode" : "terminal-glow"
      }`}
    >
      <div className="flex justify-between mb-6 border-b border-white/10 pb-4">
        <div>
          <div
            className="font-[family-name:var(--font-cinzel)] text-2xl"
            style={{ color: persona.color }}
          >
            {persona.name}
          </div>
          <div className="text-xs text-gray-400">{persona.sub}</div>
        </div>
        <div className="text-xs text-gray-500 text-right">
          COORD: 30.4583° N, 91.1403° W
          <br />
          AUTH: MISSION_LEVEL_0
        </div>
      </div>

      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto space-y-3 text-sm mb-6 scrollbar-hide"
      >
        {logs.map((log, index) => (
          <p key={index} className={log.color} dangerouslySetInnerHTML={{ __html: log.text }} />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {corridors.map((corridor) => (
          <button
            key={corridor.id}
            onClick={() => onActivateCorridor(corridor.id)}
            className="glass p-5 rounded-xl hover:scale-105 transition text-center"
          >
            <div className={`text-sm ${corridor.color}`}>{corridor.label}</div>
            <div className="text-xs text-gray-500">{corridor.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
