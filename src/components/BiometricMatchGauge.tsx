import { motion } from "motion/react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Waves,
  Cpu,
  Fingerprint,
  Radio,
  Sliders,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { EnrolledVoiceprint } from "../types";

export interface BiometricMatchResult {
  overallScore: number;
  pitchScore: number;
  mfccScore: number;
  formantScore: number;
  jitterScore: number;
  hnrScore: number;
  status: "MATCH_CONFIRMED" | "INCONCLUSIVE" | "MISMATCH_DETECTED";
  confidence: number;
  livePitchHz: number;
  liveSpectralCentroid: number;
  liveJitterVariance: number;
}

interface BiometricMatchGaugeProps {
  targetVoiceprint: EnrolledVoiceprint;
  matchResult: BiometricMatchResult;
  isStreamActive: boolean;
  streamSourceLabel: string;
  allVoiceprints: EnrolledVoiceprint[];
  onSelectTarget: (voiceprint: EnrolledVoiceprint) => void;
  scoresByVoiceprintId?: Record<string, number>;
}

export function BiometricMatchGauge({
  targetVoiceprint,
  matchResult,
  isStreamActive,
  streamSourceLabel,
  allVoiceprints,
  onSelectTarget,
  scoresByVoiceprintId = {},
}: BiometricMatchGaugeProps) {
  const {
    overallScore,
    pitchScore,
    mfccScore,
    formantScore,
    jitterScore,
    status,
    livePitchHz,
    liveSpectralCentroid,
    liveJitterVariance,
  } = matchResult;

  // Arc Gauge Geometry (Semi-Circle Dome: 180 degrees from 180deg to 0deg)
  const radius = 80;
  const arcLength = Math.PI * radius; // ~251.3
  const strokeDashoffset = arcLength * (1 - Math.max(0, Math.min(100, overallScore)) / 100);

  // Status Styling
  let themeColor = "#22c55e";
  let themeGlow = "rgba(34, 197, 94, 0.35)";
  let statusText = "REAL PERSON'S VOICE MATCHES";
  let statusBadge = "bg-green-950/40 border-green-500/50 text-green-400";
  let StatusIcon = ShieldCheck;

  if (status === "INCONCLUSIVE") {
    themeColor = "#f59e0b";
    themeGlow = "rgba(245, 158, 11, 0.35)";
    statusText = "SLIGHT VOICE DIFFERENCE DETECTED";
    statusBadge = "bg-amber-950/40 border-amber-500/50 text-amber-400";
    StatusIcon = AlertTriangle;
  } else if (status === "MISMATCH_DETECTED") {
    themeColor = "#ef4444";
    themeGlow = "rgba(239, 68, 68, 0.35)";
    statusText = "FAKE VOICE / DOES NOT MATCH";
    statusBadge = "bg-red-950/40 border-[#ef4444]/60 text-[#ef4444]";
    StatusIcon = ShieldAlert;
  }

  return (
    <div className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center border"
            style={{
              borderColor: themeColor,
              backgroundColor: `${themeColor}15`,
              color: themeColor,
            }}
          >
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Voice Match Meter
              </h3>
              <span className="text-[10px] font-mono text-[#71717a] bg-[#09090b] px-1.5 py-0.5 rounded border border-[#27272a]">
                Caller vs Saved Voice
              </span>
            </div>
            <p className="text-xs text-[#71717a]">
              Checks pitch, throat resonance, and sound frequency to verify if the caller is the real person.
            </p>
          </div>
        </div>

        {/* Live Stream Status Indicator */}
        <div className="flex items-center space-x-2 bg-[#09090b] px-3 py-1.5 rounded-lg border border-[#27272a]">
          <span className="relative flex h-2 w-2">
            {isStreamActive && (
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: themeColor }}
              />
            )}
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: isStreamActive ? themeColor : "#71717a" }}
            />
          </span>
          <Radio className="w-3.5 h-3.5 text-[#71717a]" />
          <span className="text-xs font-mono font-semibold text-[#e1e1e3]">
            {isStreamActive ? streamSourceLabel : "Stream Idle (Standby)"}
          </span>
        </div>
      </div>

      {/* Center Layout: Visual Gauge + Dimensional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Visual Arc Gauge (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#09090b] rounded-xl border border-[#27272a] relative overflow-hidden">
          {/* Subtle background ambient pulse */}
          <div
            className="absolute inset-0 opacity-10 blur-2xl pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: themeColor }}
          />

          <div className="relative w-[220px] h-[130px] flex items-center justify-center mt-2">
            <svg
              className="w-[220px] h-[130px] overflow-visible"
              viewBox="0 0 220 125"
            >
              {/* Background Arc: 180 to 0 degrees */}
              <path
                d="M 30,110 A 80,80 0 0,1 190,110"
                fill="none"
                stroke="#27272a"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Foreground Animated Value Arc */}
              <path
                d="M 30,110 A 80,80 0 0,1 190,110"
                fill="none"
                stroke={themeColor}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease",
                  filter: `drop-shadow(0 0 8px ${themeGlow})`,
                }}
              />

              {/* Tick Markers */}
              <circle cx="30" cy="110" r="2.5" fill="#71717a" />
              <circle cx="110" cy="30" r="2.5" fill="#71717a" />
              <circle cx="190" cy="110" r="2.5" fill="#71717a" />
            </svg>

            {/* Inner Gauge Readout */}
            <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center">
              <motion.div
                key={overallScore}
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline justify-center"
              >
                <span>{isStreamActive ? overallScore : "--"}</span>
                <span className="text-lg font-bold ml-0.5" style={{ color: themeColor }}>
                  %
                </span>
              </motion.div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#71717a] -mt-0.5">
                Biometric Match
              </span>
            </div>
          </div>

          {/* Scale Labels */}
          <div className="w-[180px] flex justify-between text-[9px] font-mono text-[#71717a] px-1 mb-2">
            <span>0% (Mismatch)</span>
            <span>50%</span>
            <span>100% (Exact)</span>
          </div>

          {/* Status Badge */}
          <div className={`mt-2 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${statusBadge}`}>
            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{isStreamActive ? statusText : "AWAITING AUDIO STREAM"}</span>
          </div>

          {/* Target Identity Pill */}
          <div className="mt-3 text-[11px] text-[#a1a1aa] flex items-center space-x-1 font-mono">
            <span>Target:</span>
            <span className="text-white font-bold">{targetVoiceprint.name}</span>
            <span className="text-[#71717a]">({targetVoiceprint.role})</span>
          </div>
        </div>

        {/* Right Column: 4-Vector Multi-Dimensional Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#a1a1aa] border-b border-[#27272a] pb-1.5">
            <span className="flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#ef4444]" />
              <span>Voice Characteristic Checks</span>
            </span>
            <span className="text-[10px] font-mono text-[#71717a]">
              Confidence: {Math.round(matchResult.confidence * 100)}%
            </span>
          </div>

          {/* Vector 1: Fundamental Pitch (F0) */}
          <div className="bg-[#09090b] p-3 rounded-lg border border-[#27272a] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1.5">
                <Waves className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white">Natural Voice Pitch</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="text-[#71717a]">
                  Live: <strong className="text-white">{isStreamActive && livePitchHz > 0 ? `${livePitchHz.toFixed(0)}Hz` : "--"}</strong>
                </span>
                <span className="text-[#71717a]">/</span>
                <span className="text-[#71717a]">
                  Saved: <strong className="text-white">{targetVoiceprint.baseline.pitchMeanHz.toFixed(0)}Hz</strong>
                </span>
                <span className="font-bold text-white px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a]">
                  {isStreamActive ? `${pitchScore}%` : "--"}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#18181b] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: isStreamActive ? `${pitchScore}%` : "0%" }}
              />
            </div>
          </div>

          {/* Vector 2: Mel-Frequency Cepstral (MFCC) Timbre Cosine */}
          <div className="bg-[#09090b] p-3 rounded-lg border border-[#27272a] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold text-white">Voice Tone & Texture</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="text-[#71717a]">Sound Frequency Bands</span>
                <span className="font-bold text-white px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a]">
                  {isStreamActive ? `${mfccScore}%` : "--"}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#18181b] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: isStreamActive ? `${mfccScore}%` : "0%" }}
              />
            </div>
          </div>

          {/* Vector 3: Vocal Tract Formants & Spectral Centroid */}
          <div className="bg-[#09090b] p-3 rounded-lg border border-[#27272a] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1.5">
                <Waves className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">Throat & Mouth Resonance</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="text-[#71717a]">
                  Live: <strong className="text-white">{isStreamActive && liveSpectralCentroid > 0 ? `${liveSpectralCentroid.toFixed(0)}Hz` : "--"}</strong>
                </span>
                <span className="text-[#71717a]">/</span>
                <span className="text-[#71717a]">
                  Saved: <strong className="text-white">{targetVoiceprint.baseline.spectralCentroidHz}Hz</strong>
                </span>
                <span className="font-bold text-white px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a]">
                  {isStreamActive ? `${formantScore}%` : "--"}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#18181b] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: isStreamActive ? `${formantScore}%` : "0%" }}
              />
            </div>
          </div>

          {/* Vector 4: Glottal Dynamic Micro-Jitter */}
          <div className="bg-[#09090b] p-3 rounded-lg border border-[#27272a] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-semibold text-white">Vocal Cord Micro-Tremors</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="text-[#71717a]">
                  Natural Tremor: <strong className="text-white">{isStreamActive ? `${(liveJitterVariance * 100).toFixed(1)}%` : "--"}</strong>
                </span>
                <span className="font-bold text-white px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a]">
                  {isStreamActive ? `${jitterScore}%` : "--"}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#18181b] rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: isStreamActive ? `${jitterScore}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Profile Comparison Matrix */}
      <div className="border-t border-[#27272a] pt-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-[#a1a1aa]">
            Compare Against All Saved People
          </span>
          <span className="text-[10px] text-[#71717a]">
            Click a person to check if the caller sounds like them
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {allVoiceprints.map((vp) => {
            const isSelected = vp.id === targetVoiceprint.id;
            const score = scoresByVoiceprintId[vp.id] ?? (isSelected ? overallScore : 35);
            let pillColor = "text-[#ef4444]";
            let barColor = "bg-[#ef4444]";
            if (score >= 80) {
              pillColor = "text-green-400";
              barColor = "bg-green-500";
            } else if (score >= 60) {
              pillColor = "text-amber-400";
              barColor = "bg-amber-500";
            }

            return (
              <button
                key={vp.id}
                type="button"
                onClick={() => onSelectTarget(vp)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#27272a] border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${vp.avatarColor}`}
                    >
                      {vp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{vp.name}</div>
                      <div className="text-[10px] text-[#71717a] font-mono truncate">{vp.role}</div>
                    </div>
                  </div>

                  <div className="font-mono text-xs font-black shrink-0 ml-2">
                    <span className={isStreamActive ? pillColor : "text-[#71717a]"}>
                      {isStreamActive ? `${score}%` : "--"}
                    </span>
                  </div>
                </div>

                <div className="mt-2 h-1 w-full bg-[#18181b] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: isStreamActive ? `${score}%` : "0%" }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
