"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPanelProps {
  isEmergency: boolean;
}

export default function MapPanel({ isEmergency }: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([30.4583, -91.1403], 10);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    L.circle([30.4583, -91.1403], {
      color: "#cc0000",
      fillColor: "#cc0000",
      fillOpacity: 0.15,
      radius: 25000,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleBlackSkyToggle = () => {
    alert("Black Sky Storm Layer Activated (Simulation)");
  };

  return (
    <div
      className={`flex-1 h-full rounded-2xl overflow-hidden glass relative ${
        isEmergency ? "emergency-mode" : "terminal-glow"
      }`}
    >
      <div ref={mapRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 glass px-5 py-3 rounded-2xl text-xs z-[1000]">
        LOUISIANA CORRIDOR GRID
      </div>

      <button
        onClick={handleBlackSkyToggle}
        className="absolute top-4 right-4 px-6 py-3 rounded-xl glass text-sm hover:bg-red-600/30 transition z-[1000]"
      >
        BLACK SKY
      </button>
    </div>
  );
}
