"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import type { ConsultationPayload } from "@/lib/types";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";

type Status = "idle" | "connecting" | "listening" | "processing" | "done" | "error";

export default function VoiceConsultation() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [collected, setCollected] = useState<Partial<ConsultationPayload>>({});
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const vapiRef = useRef<any>(null);

  const startCall = async () => {
    if (!VAPI_PUBLIC_KEY) {
      setStatus("error");
      setErrorMsg("Vapi public key is not configured. Add NEXT_PUBLIC_VAPI_PUBLIC_KEY to your environment.");
      return;
    }

    setStatus("connecting");
    setErrorMsg("");

    try {
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on("call-start", () => setStatus("listening"));
      vapi.on("call-end", () => {
        setStatus((prev) => (prev === "done" || prev === "processing" ? prev : "idle"));
      });
      vapi.on("error", (err: any) => {
        setStatus("error");
        setErrorMsg(err?.message ?? "Voice assistant encountered an error.");
      });

      vapi.on("message", async (message: any) => {
        const toolCalls = message?.message?.toolCalls ?? message?.toolCalls;
        if (!Array.isArray(toolCalls)) return;

        for (const call of toolCalls) {
          if (call?.function?.name !== "scheduleConsultation") continue;

          setStatus("processing");
          try {
            const parameters = JSON.parse(call.function.arguments ?? "{}");
            const payload = parameters as unknown as ConsultationPayload;
            setCollected(payload);

            const res = await fetch("/api/schedule-consultation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!res.ok) {
              const errBody = await res.json().catch(() => ({}));
              throw new Error(errBody.error ?? "Failed to schedule consultation");
            }

            const data = (await res.json()) as { checkoutUrl: string; price: number };
            setCheckoutUrl(data.checkoutUrl);
            setStatus("done");
          } catch (err: any) {
            setStatus("error");
            setErrorMsg(err?.message ?? "Failed to schedule consultation.");
          }
        }
      });

      await vapi.start({
        name: "CCS Missions Coordinator",
        firstMessage: "Hello! Thanks for calling CCS Missions. I'm here to help you schedule a consultation for solar, wind, or water purification. Could I get your name to get started?",
        backgroundSound: "office",
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600,
        voice: { provider: "openai", voiceId: "alloy" },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are the CCS Missions scheduling assistant for Coalition for Community Sustainability, based in New Orleans, Louisiana. CCS empowers Louisiana toward energy self-sufficiency through expert on-site consultations in solar, wind, and water purification.

Your job: collect the following information from the caller through natural conversation, one or two questions at a time:
1. Full name (stakeholderName)
2. Email address (stakeholderEmail)
3. Phone number (stakeholderPhone)
4. Meeting type (meetingType) — ask whether they prefer a "virtual" consultation or an "on-site" visit
5. Site address (siteAddress) — the property address for the consultation
6. Preferred date (preferredDate) — format YYYY-MM-DD
7. Preferred time (preferredTime) — format HH:MM in 24h

Be conversational and warm. Don't sound like a form. Ask follow-ups naturally. Once you have all details, confirm them back to the stakeholder, then call the scheduleConsultation function with all parameters. After the function returns, tell the stakeholder the price and that they'll be redirected to checkout. Keep responses concise (1-3 sentences). If the stakeholder asks about CCS, share: we empower Louisiana toward energy self-sufficiency through expert on-site consultations in solar, wind, and water purification.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "scheduleConsultation",
                description: "Schedule a CCS Missions consultation and generate a Stripe checkout link.",
                parameters: {
                  type: "object",
                  properties: {
                    stakeholderName: { type: "string", description: "Full name of the stakeholder" },
                    stakeholderEmail: { type: "string", description: "Email address" },
                    stakeholderPhone: { type: "string", description: "Phone number" },
                    meetingType: { type: "string", description: "Meeting type: 'virtual' or 'onsite'" },
                    siteAddress: { type: "string", description: "Property address for the consultation" },
                    preferredDate: { type: "string", description: "Preferred date YYYY-MM-DD" },
                    preferredTime: { type: "string", description: "Preferred time HH:MM 24h" },
                  },
                  required: ["stakeholderName", "stakeholderEmail", "stakeholderPhone", "meetingType", "siteAddress", "preferredDate", "preferredTime"],
                },
              },
            },
          ],
        },
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Failed to start voice assistant.");
    }
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setStatus("idle");
  };

  useEffect(() => {
    return () => { vapiRef.current?.stop(); };
  }, []);

  useEffect(() => {
    if (status === "done" && checkoutUrl) {
      const timer = setTimeout(() => { window.location.href = checkoutUrl; }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, checkoutUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      {status === "listening" && (
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-24 h-24 rounded-full bg-gold/20 animate-pulse-ring" />
          <div className="absolute w-24 h-24 rounded-full bg-gold/20 animate-pulse-ring" style={{ animationDelay: "1s" }} />
        </div>
      )}

      {status === "idle" && (
        <button
          onClick={startCall}
          className="group relative px-12 py-6 overflow-hidden rounded-2xl border-2 border-gold transition-all duration-500 hover:scale-105"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative font-cinzel text-gold group-hover:text-black uppercase text-sm tracking-[0.3em] font-bold transition-colors duration-500">
            Fuel the Mission
          </span>
        </button>
      )}

      {status === "connecting" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          <p className="text-gold/70 text-sm tracking-widest uppercase">Connecting…</p>
        </div>
      )}

      {status === "listening" && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
            <p className="text-gold text-sm tracking-widest uppercase">Listening — speak naturally</p>
          </div>
          <button onClick={endCall} className="px-8 py-3 border border-red-400/50 text-red-400 text-xs uppercase tracking-widest rounded-lg hover:bg-red-400/10 transition-all">
            End Call
          </button>
        </div>
      )}

      {status === "processing" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          <p className="text-gold/70 text-sm tracking-widest uppercase">Scheduling your consultation…</p>
        </div>
      )}

      {status === "done" && (
        <div className="glass-panel p-8 text-center max-w-md">
          <p className="font-cinzel text-gold text-lg uppercase tracking-widest mb-3">Mission Briefing Scheduled</p>
          <p className="text-sm text-gray-300 mb-2">
            {collected.stakeholderName}, your {collected.meetingType === "onsite" ? "on-site" : "virtual"} consultation is being processed.
          </p>
          <p className="text-xs text-gold/60 tracking-widest uppercase mt-4 animate-pulse">Redirecting to checkout…</p>
        </div>
      )}

      {status === "error" && (
        <div className="glass-panel p-6 text-center max-w-md">
          <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
          <button
            onClick={() => { setStatus("idle"); setErrorMsg(""); }}
            className="px-6 py-2 border border-gold/50 text-gold text-xs uppercase tracking-widest rounded-lg hover:bg-gold/10 transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
