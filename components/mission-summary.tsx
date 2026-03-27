"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Zap, TrendingUp } from "lucide-react";

interface MissionSummaryProps {
  missionType: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  objective: string;
  onConfirm: () => void;
}

export function MissionSummary({
  missionType,
  origin,
  destination,
  distance,
  duration,
  objective,
  onConfirm,
}: MissionSummaryProps) {
  const currentHour = new Date().getHours();
  const isNightOps = currentHour >= 22 || currentHour < 6;

  // Calculate consultation fee based on mission tier
  const calculateFee = () => {
    let baseFee = 0;
    let tierName = "";

    // Hub-Transition Mission
    if (
      destination.toLowerCase().includes("msy") ||
      destination.toLowerCase().includes("airport")
    ) {
      baseFee = 45;
      tierName = "Hub-Transition Mission";
    } else if (
      origin.toLowerCase().includes("msy") ||
      origin.toLowerCase().includes("airport")
    ) {
      baseFee = 65;
      tierName = "Hub-Transition Mission";
    }
    // Strategic Time-Bank
    else if (missionType === "strategic") {
      baseFee = 130; // 2-hour minimum deposit
      tierName = "Strategic Time-Bank";
    }
    // Regional Corridor Mission (distance > 30 miles)
    else if (distance > 30) {
      baseFee = distance * 1.31 + duration * 1.42;
      tierName = "Regional Corridor Mission";
    }
    // Metro-Link Mission
    else {
      const calculated = 7 + distance * 1.3 + duration * 0.5;
      baseFee = Math.max(calculated, 15); // $15 floor
      tierName = "Metro-Link Mission";
    }

    const subtotal = baseFee;
    const stewardship = subtotal * 0.1; // 10% Regional Growth Fund
    const nightOps = isNightOps ? 10 : 0;
    const total = subtotal + stewardship + nightOps;

    return {
      tierName,
      baseFee: baseFee.toFixed(2),
      subtotal: subtotal.toFixed(2),
      stewardship: stewardship.toFixed(2),
      nightOps: nightOps.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const fees = calculateFee();

  return (
    <Card className="glass-purple border-glow-gold animate-fade-in-up">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Mission Summary
          </CardTitle>
          <span className="text-xs font-mono text-royal-purple bg-royal-purple/20 px-3 py-1 rounded-full">
            {fees.tierName}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Mission Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Mission Objective</span>
            <span className="text-foreground font-medium">{objective}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Meeting Spot</span>
            <span className="text-foreground font-mono text-xs truncate max-w-[200px]">
              {origin}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Mission Destination</span>
            <span className="text-foreground font-mono text-xs truncate max-w-[200px]">
              {destination}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Distance
            </span>
            <span className="text-foreground font-mono">
              {distance.toFixed(1)} mi
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Est. Duration
            </span>
            <span className="text-foreground font-mono">{duration} min</span>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="border-t border-border/50 pt-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Base Consultation Fee</span>
            <span className="text-foreground font-mono">${fees.baseFee}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-gold" />
              Regional Growth Fund (10%)
            </span>
            <span className="text-gold font-mono">${fees.stewardship}</span>
          </div>
          {isNightOps && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Night-Ops Surcharge (After 22:00)
              </span>
              <span className="text-royal-purple font-mono">
                ${fees.nightOps}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gold/30 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gold">
              Total Consultation Fee
            </span>
            <span className="text-2xl font-bold text-gold font-mono">
              ${fees.total}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="gold"
          size="xl"
          className="w-full mt-4"
          onClick={onConfirm}
        >
          Confirm Mission Parameters
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Your ShoFur Consultant will be dispatched upon confirmation
        </p>
      </CardContent>
    </Card>
  );
}
