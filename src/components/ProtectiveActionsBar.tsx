import { VolumeX, Volume2, ShieldAlert, Download, PhoneOff, Flag, Radio } from "lucide-react";
import { ChunkAnalysis } from "../types";

interface ProtectiveActionsBarProps {
  isCallActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onFlagThreat: () => void;
  onTerminateCall: () => void;
  onExportEvidence: () => void;
  riskScore: number;
  recentChunks: ChunkAnalysis[];
}

export function ProtectiveActionsBar({
  isCallActive,
  isMuted,
  onToggleMute,
  onFlagThreat,
  onTerminateCall,
  onExportEvidence,
  riskScore,
}: ProtectiveActionsBarProps) {
  const isHighRisk = riskScore >= 65;

  return (
    <div className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center space-x-2">
          <Flag className="w-4 h-4 text-[#ef4444]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa]">
            Active Countermeasures & Defense
          </span>
        </div>
        {isHighRisk && isCallActive && (
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-950/40 border border-[#ef4444]/40 text-[#ef4444] text-[11px] font-mono animate-pulse">
            <Radio className="w-3 h-3" />
            <span>THREAT ELEVATED • INTERVENTION READY</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
        {/* Mute / Isolate */}
        <button
          type="button"
          disabled={!isCallActive}
          onClick={onToggleMute}
          className={`px-3 py-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isMuted
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:text-[#e1e1e3] hover:bg-[#27272a]"
          }`}
        >
          {isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{isMuted ? "Unmute" : "Mute Stream"}</span>
        </button>

        {/* Flag Threat Marker */}
        <button
          type="button"
          disabled={!isCallActive}
          onClick={onFlagThreat}
          className="px-3 py-3 rounded-lg bg-[#09090b] border border-[#27272a] text-[#e1e1e3] hover:bg-[#27272a] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Flag Threat</span>
        </button>

        {/* Export Evidence Dossier */}
        <button
          type="button"
          onClick={onExportEvidence}
          className="px-3 py-3 rounded-lg bg-[#09090b] border border-[#27272a] text-[#a1a1aa] hover:text-[#e1e1e3] hover:bg-[#27272a] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#71717a]" />
          <span>Audit Log</span>
        </button>

        {/* Emergency Terminate / Interrupt Call */}
        <button
          type="button"
          disabled={!isCallActive}
          onClick={onTerminateCall}
          className="px-3 py-3 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Interrupt Call</span>
        </button>
      </div>
    </div>
  );
}
