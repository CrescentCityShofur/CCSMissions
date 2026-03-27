"use client";

import { Zap } from "lucide-react";

export function FleetStatus() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-purple">
      <div className="relative flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-success animate-pulse-glow" />
        <div className="absolute w-3 h-3 rounded-full bg-success/50 animate-ping" />
      </div>
      <span className="text-sm font-medium text-foreground">
        Tesla Fleet Status
      </span>
      <Zap className="w-4 h-4 text-gold" />
      <span className="text-xs text-success font-mono">OPERATIONAL</span>
    </div>
  );
}
