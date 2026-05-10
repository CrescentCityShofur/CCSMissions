"use client";

interface TopBarProps {
  isEmergency: boolean;
  onToggleEmergency: () => void;
  onPlayBriefing: (type: string) => void;
}

export default function TopBar({ isEmergency, onToggleEmergency, onPlayBriefing }: TopBarProps) {
  return (
    <div className="fixed top-0 w-full p-6 flex justify-between items-center z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="flex items-center space-x-4">
        <h1 className="font-[family-name:var(--font-cinzel)] text-3xl text-mardi-gold">CCS MOTHERSHIP</h1>
        <span
          className="text-xs border px-3 py-1 rounded tracking-widest transition-colors"
          style={{
            borderColor: isEmergency ? "#cc0000" : "#007a33",
            color: isEmergency ? "#cc0000" : "#007a33",
          }}
        >
          {isEmergency ? "CRITICAL: BLACK SKY PROTOCOL" : "SYSTEM ONLINE: BLUE SKY"}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={() => onPlayBriefing("mission")}
          className="hover:text-mardi-gold transition"
        >
          MISSION
        </button>
        <button
          onClick={() => onPlayBriefing("founder")}
          className="hover:text-mardi-gold transition"
        >
          FOUNDER
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">BLACK SKY OVERRIDE</span>
          <input
            type="checkbox"
            checked={isEmergency}
            onChange={onToggleEmergency}
            className="accent-red-600 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
