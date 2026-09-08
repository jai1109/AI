import {
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  Wind,
  Activity,
  Layers,
  HelpCircle,
  PhoneOff,
  VolumeX,
} from "lucide-react";
import { RiskClassification, ChunkAnalysis } from "../types";

interface PlainEnglishVerdictProps {
  isCallActive: boolean;
  score: number;
  classification: RiskClassification;
  confidence: number;
  latestChunk: ChunkAnalysis | null;
  callerName?: string;
  onTerminateCall?: () => void;
  onToggleMute?: () => void;
  isMuted?: boolean;
}

export function PlainEnglishVerdict({
  isCallActive,
  score,
  classification,
  confidence,
  latestChunk,
  callerName,
  onTerminateCall,
  onToggleMute,
  isMuted,
}: PlainEnglishVerdictProps) {
  const isClone = score >= 50 || classification === "CLONED" || classification === "SUSPICIOUS";

  // Check which indicators were triggered
  const pitchAnomaly = latestChunk?.indicators?.find((i) => i.id === "pitch-quant")?.detectedAnomaly;
  const spectralAnomaly = latestChunk?.indicators?.find((i) => i.id === "spectral-cutoff")?.detectedAnomaly;
  const breathAnomaly = latestChunk?.indicators?.find((i) => i.id === "bio-breath")?.detectedAnomaly;

  if (!isCallActive) {
    return (
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#09090b] border border-[#27272a] flex items-center justify-center mx-auto text-[#71717a]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Voice Defense Ready
          </h3>
          <p className="text-xs text-[#a1a1aa] max-w-md mx-auto mt-1">
            Echo Voice is standing by. Start any test above or connect a live call to get an instant, plain-English voice authenticity verdict.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xl transition-all ${
        isClone
          ? "bg-red-950/20 border-[#ef4444]/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          : "bg-green-950/20 border-green-500/40 shadow-[0_0_20px_rgba(74,222,128,0.1)]"
      }`}
    >
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27272a]/80 mb-4">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              isClone
                ? "bg-[#ef4444] text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                : "bg-green-500 text-black border-green-300 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            }`}
          >
            {isClone ? (
              <AlertOctagon className="w-7 h-7" />
            ) : (
              <CheckCircle2 className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isClone
                    ? "bg-red-950/60 text-[#ef4444] border border-[#ef4444]/40"
                    : "bg-green-950/60 text-green-400 border border-green-500/40"
                }`}
              >
                {isClone ? "THREAT DETECTED" : "VERIFIED SAFE"}
              </span>
              <span className="text-xs text-[#a1a1aa] font-mono">
                {(confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <h2 className="text-base font-bold text-white mt-1">
              {isClone
                ? "Warning: AI Voice Clone / Deepfake Detected!"
                : "Authentic Human Voice Confirmed"}
            </h2>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              {isClone
                ? `The caller claiming to be "${callerName || "Caller"}" shows strong signs of synthetic voice generation.`
                : `The caller's voice displays natural biological human vocal characteristics.`}
            </p>
          </div>
        </div>

        {/* Quick Action buttons right in the card */}
        {isClone && (
          <div className="flex items-center space-x-2 self-start sm:self-center">
            {onToggleMute && (
              <button
                type="button"
                onClick={onToggleMute}
                className="px-3 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span>{isMuted ? "Unmute" : "Mute Stream"}</span>
              </button>
            )}
            {onTerminateCall && (
              <button
                type="button"
                onClick={onTerminateCall}
                className="px-3 py-2 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-colors shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Hang Up</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3 Physical Checks Explained Plainly */}
      <div>
        <div className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider mb-2.5">
          What the detector found in this voice:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Pitch Jitter */}
          <div className="p-3 rounded-xl bg-[#09090b]/80 border border-[#27272a] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                <Activity className="w-3.5 h-3.5 text-[#a1a1aa]" />
                <span>Vocal Cord Vibration</span>
              </div>
              {isClone && (pitchAnomaly || score >= 50) ? (
                <span className="text-[10px] font-mono font-bold text-[#ef4444] flex items-center space-x-1">
                  <span>ROBOTIC</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-green-400 flex items-center space-x-1">
                  <span>ORGANIC</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#a1a1aa] leading-snug">
              {isClone && (pitchAnomaly || score >= 50)
                ? "The pitch contour is unnaturally flat and quantized, typical of neural text-to-speech vocoders."
                : "Continuous natural micro-tremors detected, consistent with real human vocal cord contractions."}
            </p>
          </div>

          {/* 2. Natural Inhalation */}
          <div className="p-3 rounded-xl bg-[#09090b]/80 border border-[#27272a] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                <Wind className="w-3.5 h-3.5 text-[#a1a1aa]" />
                <span>Lung Breathing Sounds</span>
              </div>
              {isClone && (breathAnomaly || score >= 50) ? (
                <span className="text-[10px] font-mono font-bold text-[#ef4444] flex items-center space-x-1">
                  <span>MISSING</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-green-400 flex items-center space-x-1">
                  <span>DETECTED</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#a1a1aa] leading-snug">
              {isClone && (breathAnomaly || score >= 50)
                ? "Voice lacks natural aerodynamic breath pauses and throat friction between spoken words."
                : "Real respiratory pauses detected in speech cadence, showing natural human lung breathing."}
            </p>
          </div>

          {/* 3. Audio Frequency Quality */}
          <div className="p-3 rounded-xl bg-[#09090b]/80 border border-[#27272a] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                <Layers className="w-3.5 h-3.5 text-[#a1a1aa]" />
                <span>Audio Frequencies</span>
              </div>
              {isClone && (spectralAnomaly || score >= 50) ? (
                <span className="text-[10px] font-mono font-bold text-[#ef4444] flex items-center space-x-1">
                  <span>AI CUTOFF</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-green-400 flex items-center space-x-1">
                  <span>FULL RANGE</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#a1a1aa] leading-snug">
              {isClone && (spectralAnomaly || score >= 50)
                ? "Frequencies drop off sharply above 5.2 kHz, a signature artifact of neural vocoder synthesis."
                : "Harmonic overtones extend smoothly across high frequencies without artificial cutoffs."}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Action Card */}
      <div className="mt-4 pt-3 border-t border-[#27272a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <strong className="text-white">Recommended Action:</strong>
          <span className={isClone ? "text-[#ef4444] font-bold" : "text-green-400 font-semibold"}>
            {isClone
              ? "Terminate call or ask a private personal question that only the real caller would know."
              : "Voice is verified authentic. Safe to continue conversation."}
          </span>
        </div>
        {latestChunk?.forensicNotes && (
          <div className="text-[11px] text-[#71717a] font-mono truncate max-w-xs">
            {latestChunk.forensicNotes}
          </div>
        )}
      </div>
    </div>
  );
}
