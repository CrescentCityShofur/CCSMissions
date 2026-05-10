"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/top-bar";
import Terminal from "@/components/terminal";
import ChatWindow from "@/components/chat-window";
import ChatButton from "@/components/chat-button";

const MapPanel = dynamic(() => import("@/components/map-panel"), { ssr: false });

export interface LogEntry {
  text: string;
  color: string;
}

export interface Persona {
  name: string;
  sub: string;
  color: string;
}

export default function Home() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: "> Booting CCS Infrastructure OS...", color: "text-purple-400" },
    { text: "> 18-Year Construction Data Set Loaded.", color: "text-purple-400" },
    { text: "Awaiting objective. Identify your mission corridor.", color: "text-white font-[family-name:var(--font-cinzel)] text-lg mt-6" },
  ]);
  const [persona, setPersona] = useState<Persona>({
    name: "MOTHERSHIP AI",
    sub: "Primary Consciousness Layer",
    color: "#fdb927",
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([]);

  const addLog = (text: string, color = "text-white") => {
    setLogs((prev) => [...prev, { text, color }]);
  };

  const toggleEmergency = () => {
    setIsEmergency((prev) => {
      const newState = !prev;
      if (newState) {
        addLog("!! BLACK SKY PROTOCOL INITIATED !!", "text-red-500 font-bold pulse");
      } else {
        addLog("Blue Sky protocol restored.", "text-green-400");
      }
      return newState;
    });
  };

  const activateCorridor = (type: string) => {
    const corridors: Record<string, Persona & { msg: string }> = {
      energy: { name: "SOLARIS", sub: "Energy Autonomy Agent", color: "#fdb927", msg: "Solaris Online. Energy assessment initiated." },
      water: { name: "AQUA-CORE", sub: "Hydrological Security", color: "#007a33", msg: "Aqua-Core Active. Water purity protocols engaged." },
      property: { name: "STRUX", sub: "Structural Intelligence", color: "#461d7c", msg: "Strux Intelligence Online. Ready for property triage." },
      logistics: { name: "VECTRA", sub: "Movement Engine", color: "#3b82f6", msg: "Vectra Routing System Activated." },
    };

    const p = corridors[type];
    if (p) {
      setPersona({ name: p.name, sub: p.sub, color: p.color });
      addLog(`>> ${p.msg}`, "text-white font-[family-name:var(--font-cinzel)] text-lg");
    }
  };

  const playBriefing = (type: string) => {
    addLog(`>> Retrieving ${type.toUpperCase()} briefing...`, "text-purple-400");
  };

  const sendChatMessage = (message: string) => {
    setChatMessages((prev) => [...prev, { text: message, isUser: true }]);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { text: "Message received. Awaiting further instructions.", isUser: false },
      ]);
    }, 800);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      addLog("All systems nominal.", "text-green-400");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: isEmergency ? "#1a0000" : "#0a0118" }}
    >
      <TopBar
        isEmergency={isEmergency}
        onToggleEmergency={toggleEmergency}
        onPlayBriefing={playBriefing}
      />

      <div className="flex-1 pt-20 p-6 flex gap-6">
        <Terminal
          logs={logs}
          persona={persona}
          isEmergency={isEmergency}
          onActivateCorridor={activateCorridor}
        />
        <MapPanel isEmergency={isEmergency} />
      </div>

      {chatOpen ? (
        <ChatWindow
          persona={persona}
          messages={chatMessages}
          onClose={() => setChatOpen(false)}
          onSend={sendChatMessage}
        />
      ) : (
        <ChatButton onClick={() => setChatOpen(true)} />
      )}
    </div>
  );
}
