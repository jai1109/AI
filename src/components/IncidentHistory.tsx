import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Trash2,
  Phone,
  FileAudio,
  Mic,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ThreatIncident } from "../types";

const INITIAL_INCIDENTS: ThreatIncident[] = [
  {
    id: "INC-9941",
    timestamp: Date.now() - 1000 * 60 * 42,
    sourceType: "SCENARIO_SIM",
    callerName: "David Harrison (CEO)",
    callerPhone: "+1 (415) 555-0199 [Spoofed]",
    durationSeconds: 38,
    peakRiskScore: 94,
    finalVerdict: "CLONED",
    actionTaken: "AUDIO_ISOLATED_AND_MUTED",
    confidence: 0.97,
    anomaliesDetected: [
      "Brickwall vocoder cutoff (<4.8kHz)",
      "Zero glottal micro-jitter",
      "Missing biological breath sounds",
      "Urgency wire transfer keywords",
    ],
    chunksAnalyzedCount: 16,
  },
  {
    id: "INC-9940",
    timestamp: Date.now() - 1000 * 60 * 180,
    sourceType: "SCENARIO_SIM",
    callerName: "Liam (Grandson)",
    callerPhone: "+1 (617) 555-0143",
    durationSeconds: 24,
    peakRiskScore: 89,
    finalVerdict: "CLONED",
    actionTaken: "STREAM_ISOLATED_DISCONNECTED",
    confidence: 0.94,
    anomaliesDetected: [
      "VITS neural model phase discontinuity",
      "Artificial pitch vibrato",
      "Severe pitch quantization & vocoder roll-off",
    ],
    chunksAnalyzedCount: 11,
  },
  {
    id: "INC-9939",
    timestamp: Date.now() - 1000 * 60 * 360,
    sourceType: "DEVICE_UPLOAD",
    callerName: "Uploaded Audio: voice_note_review.wav",
    callerPhone: "Device Storage",
    durationSeconds: 19,
    peakRiskScore: 14,
    finalVerdict: "GENUINE",
    actionTaken: "CLEARED_LEGITIMATE",
    confidence: 0.96,
    anomaliesDetected: [],
    chunksAnalyzedCount: 9,
  },
  {
    id: "INC-9938",
    timestamp: Date.now() - 1000 * 60 * 720,
    sourceType: "LIVE_CALL",
    callerName: "Branch Support Representative",
    callerPhone: "+1 (800) 555-0182",
    durationSeconds: 45,
    peakRiskScore: 11,
    finalVerdict: "GENUINE",
    actionTaken: "ALLOWED_SESSION_CONTINUED",
    confidence: 0.98,
    anomaliesDetected: [],
    chunksAnalyzedCount: 20,
  },
];

interface IncidentHistoryProps {
  onReplayIncident?: (incident: ThreatIncident) => void;
}

export function IncidentHistory({ onReplayIncident }: IncidentHistoryProps) {
  const [incidents, setIncidents] = useState<ThreatIncident[]>(() => {
    const saved = localStorage.getItem("echo_voice_incidents");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_INCIDENTS;
  });

  const [filterVerdict, setFilterVerdict] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("echo_voice_incidents", JSON.stringify(incidents));
  }, [incidents]);

  const handleClearHistory = () => {
    setIncidents([]);
  };

  const exportAllIncidentsJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      system: "Echo Voice Sentinel Audit Ledger",
      totalIncidentRecords: incidents.length,
      incidents,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `echo-voice-incidents-ledger-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = incidents.filter((item) => {
    if (filterVerdict !== "ALL" && item.finalVerdict !== filterVerdict) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.callerName.toLowerCase().includes(q);
      const matchPhone = item.callerPhone.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      return matchName || matchPhone || matchId;
    }
    return true;
  });

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m > 0 ? `${m}m ` : ""}${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18181b] border border-[#27272a] rounded-xl p-5">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#e1e1e3]">Call History & Saved Logs</h2>
              <p className="text-xs text-[#71717a]">
                Records of previous calls, detected AI voices, safety actions taken, and audio details.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={exportAllIncidentsJSON}
            className="px-3.5 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors border border-[#3f3f46]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export History (JSON)</span>
          </button>

          {incidents.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-2 rounded-lg bg-[#09090b] hover:bg-red-950/30 border border-[#27272a] text-[#71717a] hover:text-[#ef4444] transition-colors cursor-pointer"
              title="Clear all call history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#18181b] border border-[#27272a] rounded-xl p-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caller, phone, or ID..."
            className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#ef4444]"
          />
        </div>

        {/* Verdict Filters */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto text-xs font-mono">
          {["ALL", "CLONED", "SUSPICIOUS", "GENUINE"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setFilterVerdict(v)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                filterVerdict === v
                  ? "bg-[#ef4444] text-white font-bold"
                  : "bg-[#09090b] text-[#71717a] hover:text-white border border-[#27272a]"
              }`}
            >
              {v === "ALL" ? "All Calls" : v === "CLONED" ? "AI Clones" : v === "SUSPICIOUS" ? "Suspicious" : "Real Voice"}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      {filtered.length === 0 ? (
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-12 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-[#71717a] mx-auto" />
          <div className="text-sm font-bold text-white">No Calls Found</div>
          <p className="text-xs text-[#71717a] max-w-sm mx-auto">
            {searchQuery
              ? "No calls match your current search criteria."
              : "Completed calls and uploaded audio inspections will be logged here automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-[#18181b] border rounded-xl transition-all overflow-hidden ${
                  item.finalVerdict === "CLONED"
                    ? "border-red-950/60 hover:border-[#ef4444]/60"
                    : item.finalVerdict === "SUSPICIOUS"
                    ? "border-amber-950/60 hover:border-amber-500/60"
                    : "border-[#27272a] hover:border-[#3f3f46]"
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#27272a]/40 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        item.finalVerdict === "CLONED"
                          ? "bg-red-950/40 border-[#ef4444]/40 text-[#ef4444]"
                          : item.finalVerdict === "SUSPICIOUS"
                          ? "bg-amber-950/40 border-amber-500/40 text-[#f59e0b]"
                          : "bg-green-950/40 border-green-500/40 text-green-400"
                      }`}
                    >
                      {item.sourceType === "DEVICE_UPLOAD" ? (
                        <FileAudio className="w-5 h-5" />
                      ) : item.sourceType === "LIVE_CALL" ? (
                        <Mic className="w-5 h-5" />
                      ) : (
                        <Phone className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{item.callerName}</span>
                        <span className="text-[10px] font-mono text-[#71717a]">{item.id}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-[#71717a] font-mono mt-0.5">
                        <span>{item.callerPhone}</span>
                        <span>•</span>
                        <span>{formatDuration(item.durationSeconds)}</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          item.finalVerdict === "CLONED"
                            ? "bg-red-950/60 text-[#ef4444] border border-[#ef4444]/40"
                            : item.finalVerdict === "SUSPICIOUS"
                            ? "bg-amber-950/60 text-[#f59e0b] border border-amber-500/40"
                            : "bg-green-950/60 text-green-400 border border-green-900/40"
                        }`}
                      >
                        {item.finalVerdict === "CLONED"
                          ? "AI CLONE DETECTED"
                          : item.finalVerdict === "SUSPICIOUS"
                          ? "SUSPICIOUS CALL"
                          : "REAL VOICE"}
                      </span>
                      <div className="text-[10px] font-mono text-[#71717a] mt-0.5">
                        Risk: <span className="font-bold text-white">{item.peakRiskScore}%</span> (Conf:{" "}
                        {(item.confidence * 100).toFixed(0)}%)
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#71717a]" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#27272a] bg-[#09090b]/50 space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a]">
                        <span className="text-[10px] text-[#71717a] block">Action Taken</span>
                        <span className="text-[#ef4444] font-bold">{item.actionTaken}</span>
                      </div>
                      <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a]">
                        <span className="text-[10px] text-[#71717a] block">Audio Chunks Checked</span>
                        <span className="text-white font-bold">{item.chunksAnalyzedCount} Chunks (~{item.chunksAnalyzedCount * 2}s)</span>
                      </div>
                      <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a]">
                        <span className="text-[10px] text-[#71717a] block">Timestamp</span>
                        <span className="text-white">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {item.anomaliesDetected.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#71717a] font-bold">
                          Unusual Audio Signs Detected:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.anomaliesDetected.map((anom, idx) => (
                            <span
                              key={`${item.id}-anom-${idx}`}
                              className="px-2.5 py-1 rounded bg-[#18181b] border border-[#ef4444]/30 text-[#ef4444] text-xs font-mono"
                            >
                              • {anom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
