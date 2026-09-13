import { motion } from "motion/react";
import { ShieldAlert, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ChunkAnalysis, RiskClassification } from "../types";

interface RunningRiskScoreGaugeProps {
  score: number;
  classification: RiskClassification;
  confidence: number;
  recentChunks: ChunkAnalysis[];
  isCallActive: boolean;
}

export function RunningRiskScoreGauge({
  score,
  classification,
  confidence,
  recentChunks,
  isCallActive,
}: RunningRiskScoreGaugeProps) {
  // Color styling depending on risk tier (matching Elegant Dark)
  let tierColor = "text-green-400";
  let tierBg = "bg-green-950/20 border-green-500/30 text-green-400";
  let strokeColor = "#4ade80";
  let tierLabel = "AUTHENTIC VOICE";
  let tierDesc = "Organic glottal harmonics & natural breath cycles";

  if (score >= 75) {
    tierColor = "text-[#ef4444]";
    tierBg = "bg-red-950/30 border-[#ef4444]/40 text-[#ef4444]";
    strokeColor = "#ef4444";
    tierLabel = "CRITICAL ALERT";
    tierDesc = "Highly likely AI-generated impersonation detected";
  } else if (score >= 50) {
    tierColor = "text-orange-400";
    tierBg = "bg-orange-950/30 border-orange-500/40 text-orange-400";
    strokeColor = "#f97316";
    tierLabel = "SYNTHETIC BIAS";
    tierDesc = "Unusual spectral anomalies & abnormal prosody";
  } else if (score >= 30) {
    tierColor = "text-amber-300";
    tierBg = "bg-amber-950/30 border-amber-500/40 text-amber-300";
    strokeColor = "#f59e0b";
    tierLabel = "ELEVATED SUSPICION";
    tierDesc = "Minor phase artifacts or pitch stabilization";
  }

  // Trend from last 2 chunks
  const prevScore = recentChunks.length >= 2 ? recentChunks[recentChunks.length - 2].riskScore : score;
  const delta = score - prevScore;

  // Arc math for gauge
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degree gauge
  const strokeDashoffset = arcLength - (arcLength * Math.min(score, 100)) / 100;

  const isHighAlert = isCallActive && score >= 75;

  return (
    <div
      className={`bg-[#18181b] rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between h-full ${
        isHighAlert
          ? "border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.12)]"
          : "border-[#27272a]"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-[#a1a1aa] uppercase tracking-[0.2em] font-semibold">
          Deepfake Risk Score
        </span>
        <div className="flex items-center space-x-1.5 text-xs">
          {delta > 2 ? (
            <span className="flex items-center text-[#ef4444] font-mono text-[11px] font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{delta.toFixed(0)} pts
            </span>
          ) : delta < -2 ? (
            <span className="flex items-center text-green-400 font-mono text-[11px]">
              <TrendingDown className="w-3 h-3 mr-0.5" /> {delta.toFixed(0)} pts
            </span>
          ) : (
            <span className="flex items-center text-[#71717a] font-mono text-[11px]">
              <Minus className="w-3 h-3 mr-0.5" /> Stable
            </span>
          )}
        </div>
      </div>

      {/* Radial Gauge Center */}
      <div className="flex flex-col items-center my-2 relative">
        <svg className="w-36 h-36 -rotate-135" viewBox="0 0 140 140">
          {/* Background Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#27272a"
            strokeWidth="8"
            strokeDasharray={arcLength}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* Active Animated Value Track */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={arcLength}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
          <div
            className={`text-5xl font-bold font-mono tracking-tight transition-colors duration-200 ${tierColor}`}
          >
            {isCallActive ? score : "--"}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-mono mt-0.5">
            / 100 Risk
          </div>
          <div className="text-[10px] text-[#71717a] mt-0.5 font-mono">
            Conf: {(confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mt-2 p-3 rounded-lg border text-center ${tierBg}`}>
        <div className="flex items-center justify-center space-x-1.5 mb-1">
          {score >= 75 ? (
            <ShieldAlert className={`w-4 h-4 ${tierColor}`} />
          ) : score >= 50 ? (
            <AlertTriangle className={`w-4 h-4 ${tierColor}`} />
          ) : (
            <ShieldCheck className={`w-4 h-4 ${tierColor}`} />
          )}
          <span className={`text-xs font-bold uppercase tracking-widest ${tierColor}`}>
            {isCallActive ? tierLabel : "STANDBY"}
          </span>
        </div>
        <p className="text-[10px] text-[#a1a1aa] leading-tight">
          {isCallActive ? tierDesc : "System primed for real-time voice verification"}
        </p>
      </div>

      {/* Real-Time Chunk Evolution Sparkline */}
      <div className="mt-3 pt-3 border-t border-[#27272a]">
        <div className="flex items-center justify-between text-[10px] text-[#a1a1aa] mb-2 font-mono">
          <span className="uppercase tracking-wider">Audio Buffer History</span>
          <span className="text-[#ef4444]">2.0s Sliding Window</span>
        </div>
        <div className="flex items-end h-8 gap-1 bg-[#09090b] p-1 rounded-lg border border-[#27272a]">
          {recentChunks.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-[9px] text-[#71717a] font-mono">
              NO CHUNKS ANALYZED YET
            </div>
          ) : (
            recentChunks.map((chunk, i) => {
              const h = Math.max(15, (chunk.riskScore / 100) * 100);
              const color =
                chunk.riskScore >= 75
                  ? "bg-[#ef4444]"
                  : chunk.riskScore >= 45
                  ? "bg-orange-500"
                  : "bg-green-500";
              return (
                <div
                  key={`sparkline-${chunk.timestamp || 0}-${chunk.chunkIndex || 0}-${i}`}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  <div
                    style={{ height: `${h}%` }}
                    className={`w-full rounded-sm transition-all ${color}`}
                  />
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-full mb-1 z-20 bg-[#18181b] border border-[#27272a] text-[#e1e1e3] text-[9px] p-1 rounded font-mono whitespace-nowrap shadow-lg">
                    #{chunk.chunkIndex}: {chunk.riskScore} pts ({chunk.classification})
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
