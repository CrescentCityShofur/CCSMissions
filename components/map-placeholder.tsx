"use client";

import { MapPin, Navigation } from "lucide-react";

interface MapPlaceholderProps {
  origin?: string;
  destination?: string;
}

export function MapPlaceholder({ origin, destination }: MapPlaceholderProps) {
  return (
    <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden glass-purple">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--gold) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--gold) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated route line */}
      {origin && destination && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--gold))" />
              <stop offset="50%" stopColor="hsl(var(--royal-purple))" />
              <stop offset="100%" stopColor="hsl(var(--gold))" />
            </linearGradient>
          </defs>
          <path
            d="M 50 150 Q 150 50 200 100 T 350 50"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            strokeDasharray="10 5"
            className="animate-shimmer"
          />
        </svg>
      )}

      {/* Origin marker */}
      {origin && (
        <div className="absolute left-8 bottom-8 flex items-center gap-2">
          <div className="p-2 rounded-full bg-gold/20 border border-gold/50">
            <MapPin className="w-4 h-4 text-gold" />
          </div>
          <span className="text-xs font-mono text-gold truncate max-w-[120px]">
            {origin}
          </span>
        </div>
      )}

      {/* Destination marker */}
      {destination && (
        <div className="absolute right-8 top-8 flex items-center gap-2">
          <div className="p-2 rounded-full bg-royal-purple/40 border border-royal-purple/60">
            <Navigation className="w-4 h-4 text-foreground" />
          </div>
          <span className="text-xs font-mono text-foreground truncate max-w-[120px]">
            {destination}
          </span>
        </div>
      )}

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
            Route Visualization
          </p>
          {!origin && !destination && (
            <p className="text-xs text-muted-foreground mt-1">
              Enter coordinates to activate
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
