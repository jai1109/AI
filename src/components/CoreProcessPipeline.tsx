import { motion } from "motion/react";
import { Mic, Sliders, Waves, Cpu, Gauge, AlertTriangle, ShieldAlert } from "lucide-react";
import { RiskClassification } from "../types";

interface CoreProcessPipelineProps {
  currentStepIndex: number;
  riskScore: number;
  classification: RiskClassification;
  isCallActive: boolean;
}

const PIPELINE_STEPS = [
  { id: "input", name: "Voice Input", icon: Mic, detail: "Audio Stream" },
  { id: "prep", name: "Clean Audio", icon: Sliders, detail: "Filter Noise" },
  { id: "features", name: "Voice Patterns", icon: Waves, detail: "Pitch & Tone" },
  { id: "ai", name: "AI Check", icon: Cpu, detail: "Deepfake Detection" },
  { id: "scoring", name: "Danger Score", icon: Gauge, detail: "Continuous Check" },
  { id: "alert", name: "Safety Warning", icon: AlertTriangle, detail: "Alert Banner" },
  { id: "action", name: "Protect & Mute", icon: ShieldAlert, detail: "Safe Actions" },
];

export function CoreProcessPipeline({
  currentStepIndex,
  riskScore,
  isCallActive,
}: CoreProcessPipelineProps) {
  return (
    <div className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2 w-2">
            {isCallActive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#71717a]"></span>
            )}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa]">
            Real-Time Safety Steps
          </span>
        </div>
        <div className="text-xs text-[#a1a1aa] font-mono">
          How it works: <span className="text-[#ef4444] font-semibold">Voice → Clean Audio → AI Check → Protection</span>
        </div>
      </div>

      {/* Pipeline Visual Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = isCallActive && idx <= currentStepIndex;
          const isCurrent = isCallActive && idx === currentStepIndex;

          let stepTheme = "border-[#27272a] bg-[#09090b] text-[#71717a]";
          if (isActive) {
            if ((step.id === "alert" || step.id === "action") && riskScore >= 70) {
              stepTheme = "border-[#ef4444] bg-red-950/30 text-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.2)]";
            } else if (isCurrent) {
              stepTheme = "border-[#ef4444] bg-[#27272a] text-[#e1e1e3] shadow-[0_0_12px_rgba(239,68,68,0.2)]";
            } else {
              stepTheme = "border-green-500/40 bg-green-950/20 text-green-400";
            }
          }

          return (
            <motion.div
              key={step.id}
              className={`relative flex flex-col items-center p-2.5 rounded-lg border transition-all ${stepTheme}`}
              animate={isCurrent ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {isCurrent && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
                </span>
              )}

              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#18181b] border border-[#27272a] mb-1.5 text-[#e1e1e3]">
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="text-[11px] font-bold text-center leading-tight whitespace-nowrap">
                {step.name}
              </div>
              <div className="text-[9px] font-mono text-[#71717a] mt-0.5 truncate max-w-full">
                {step.detail}
              </div>

              {idx < PIPELINE_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-[#3f3f46] text-xs">
                  ›
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
