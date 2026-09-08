import { CheckCircle2, AlertOctagon, Zap, Sparkles } from "lucide-react";
import { ChunkAnalysis } from "../types";

interface ThreatAnomalyPanelProps {
  latestChunk: ChunkAnalysis | null;
  isCallActive: boolean;
}

export function ThreatAnomalyPanel({ latestChunk, isCallActive }: ThreatAnomalyPanelProps) {
  const indicators = latestChunk?.indicators || [
    {
      id: "pitch-quant",
      name: "Natural Voice Flutter",
      category: "ACOUSTIC",
      severity: "low",
      score: 12,
      description: "Organic micro-variations across voice pitch and tone.",
      detectedAnomaly: false,
    },
    {
      id: "spectral-cutoff",
      name: "Sound Frequency Range",
      category: "VOCODER",
      severity: "low",
      score: 14,
      description: "Natural high and low sound balance with no robotic cutoffs.",
      detectedAnomaly: false,
    },
    {
      id: "bio-breath",
      name: "Human Breathing Sounds",
      category: "PROSODY",
      severity: "low",
      score: 8,
      description: "Natural breathing pauses and voice sounds detected.",
      detectedAnomaly: false,
    },
    {
      id: "phase-discontinuity",
      name: "Voice Flow & Smoothness",
      category: "VOCODER",
      severity: "low",
      score: 15,
      description: "Smooth, realistic flow of words without artificial digital glitches.",
      detectedAnomaly: false,
    },
  ];

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-[#ef4444]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa]">
            Voice Safety & Anomaly Checks
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#71717a]">
          Analysis: <span className="text-[#e1e1e3]">Gemini AI + Audio Check</span>
        </div>
      </div>

      {/* Anomaly Indicator List */}
      <div className="space-y-2.5">
        {indicators.map((ind) => {
          const isAnomaly = isCallActive && ind.detectedAnomaly;
          const scorePercent = isCallActive ? ind.score : 10;

          return (
            <div
              key={ind.id}
              className={`p-3 rounded-lg border transition-all ${
                isAnomaly
                  ? "bg-red-950/25 border-[#ef4444]/50 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                  : "bg-[#09090b] border-[#27272a]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  {isAnomaly ? (
                    <AlertOctagon className="w-4 h-4 text-[#ef4444] shrink-0 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-[#e1e1e3]">
                    {ind.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isAnomaly
                      ? "bg-red-950/40 text-[#ef4444] border border-[#ef4444]/30"
                      : "bg-[#27272a] text-[#a1a1aa]"
                  }`}
                >
                  {isCallActive ? (isAnomaly ? "SUSPICIOUS" : "NORMAL") : "STANDBY"} ({scorePercent}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    isAnomaly ? "bg-[#ef4444]" : "bg-green-500"
                  }`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>

              <p className="text-[11px] text-[#a1a1aa] leading-snug">
                {ind.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Forensic Model Synthesis Note */}
      {latestChunk?.forensicNotes && isCallActive && (
        <div className="mt-3.5 p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#e1e1e3]">
            <span className="font-bold text-[#a1a1aa] uppercase tracking-wider">AI Summary:</span>{" "}
            {latestChunk.forensicNotes}
          </div>
        </div>
      )}
    </div>
  );
}
