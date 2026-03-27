"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FleetStatus } from "@/components/fleet-status";
import { MapPlaceholder } from "@/components/map-placeholder";
import { MissionSummary } from "@/components/mission-summary";
import { MapPin, Navigation, Target, Sparkles } from "lucide-react";

const MISSION_OBJECTIVES = [
  { value: "solar-survey", label: "Solar Site Survey" },
  { value: "ev-audit", label: "EV Logistics Audit" },
  { value: "executive-transit", label: "Executive Transit" },
  { value: "corporate-consultation", label: "Corporate Consultation" },
  { value: "airport-transfer", label: "Airport Transfer" },
  { value: "strategic-ops", label: "Strategic Operations" },
];

export function MissionConsultation() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [objective, setObjective] = useState("");
  const [missionType, setMissionType] = useState("metro");
  const [showSummary, setShowSummary] = useState(false);

  // Simulated distance and duration (in real app, would come from Google Maps API)
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  // Phase progression logic
  useEffect(() => {
    if (origin.length > 3 && phase === 1) {
      setPhase(2);
    }
  }, [origin, phase]);

  useEffect(() => {
    if (destination.length > 3 && phase === 2) {
      // Simulate distance calculation
      const simulatedDistance = Math.random() * 40 + 5;
      const simulatedDuration = Math.round(simulatedDistance * 2.5);
      setDistance(simulatedDistance);
      setDuration(simulatedDuration);

      // Determine mission type based on distance
      if (simulatedDistance > 30) {
        setMissionType("regional");
      } else {
        setMissionType("metro");
      }

      setTimeout(() => setPhase(3), 500);
    }
  }, [destination, phase]);

  useEffect(() => {
    if (phase === 3 && objective) {
      setShowSummary(true);
    }
  }, [phase, objective]);

  const handleConfirm = () => {
    alert(
      "Mission parameters confirmed. Your ShoFur Consultant has been notified."
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-purple">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 border border-gold/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gold tracking-wide">
                CRESCENT CITY SHOFUR
              </h1>
              <p className="text-xs text-muted-foreground">
                A Division of Coastal Consolidated Solutions
              </p>
            </div>
          </div>
          <FleetStatus />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Mission Consultation Portal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Configure your consultation parameters below. Our elite ShoFur
            Consultants operate a premium Tesla fleet for your strategic
            transportation needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Phase 1: Meeting Spot */}
            <Card className="glass-purple border-glow-gold">
              <CardHeader className="pb-4">
                <CardTitle className="text-gold flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  Meeting Spot / Consultation Origin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="origin">Enter Origin Coordinates</Label>
                  <Input
                    id="origin"
                    placeholder="e.g., 500 Poydras St, New Orleans, LA"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Where should your ShoFur Consultant meet you?
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2: Mission Destination */}
            <div
              className={`transition-all duration-500 ${
                phase >= 2
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <Card className="glass-purple border-glow-gold">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gold flex items-center gap-2 text-lg">
                    <Navigation className="w-5 h-5" />
                    Mission Destination
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="destination">
                      Enter Destination Coordinates
                    </Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Louis Armstrong Airport (MSY)"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="bg-muted/50"
                      disabled={phase < 2}
                    />
                    <p className="text-xs text-muted-foreground">
                      Final destination for this mission
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Phase 3: Mission Objective */}
            <div
              className={`transition-all duration-500 delay-200 ${
                phase >= 3
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <Card className="glass-purple border-glow-gold">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gold flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5" />
                    Mission Objective
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="objective">Select Objective Type</Label>
                    <Select
                      value={objective}
                      onValueChange={setObjective}
                      disabled={phase < 3}
                    >
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select mission objective..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MISSION_OBJECTIVES.map((obj) => (
                          <SelectItem key={obj.value} value={obj.value}>
                            {obj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This helps us assign the optimal ShoFur Consultant
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Visualization */}
            <div
              className={`transition-all duration-500 delay-300 ${
                phase >= 2
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <MapPlaceholder
                origin={origin}
                destination={phase >= 2 ? destination : undefined}
              />
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            {showSummary && objective ? (
              <MissionSummary
                missionType={missionType}
                origin={origin}
                destination={destination}
                distance={distance}
                duration={duration}
                objective={
                  MISSION_OBJECTIVES.find((o) => o.value === objective)
                    ?.label || objective
                }
                onConfirm={handleConfirm}
              />
            ) : (
              <Card className="glass-purple border-border/50">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Mission Summary
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Complete the mission parameters above to view your
                    consultation fee breakdown
                  </p>
                  <div className="mt-6 flex justify-center gap-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          phase >= step ? "bg-gold" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Cards */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card className="glass-purple p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold font-mono">$65</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per Hour
                  </p>
                  <p className="text-xs text-gold mt-1">Strategic Time-Bank</p>
                </div>
              </Card>
              <Card className="glass-purple p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold font-mono">$130</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Min. Deposit
                  </p>
                  <p className="text-xs text-gold mt-1">2-Hour Minimum</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Crescent City ShoFur - A Division of Coastal Consolidated
              Solutions
            </p>
            <div className="flex items-center gap-6">
              <span>Premium Tesla Fleet</span>
              <span>New Orleans, LA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
