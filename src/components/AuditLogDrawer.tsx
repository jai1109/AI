import { useState } from "react";
import { History, ShieldAlert, ShieldCheck, AlertTriangle, FileText } from "lucide-react";
import { SessionAuditLog } from "../types";

interface AuditLogDrawerProps {
  logs: SessionAuditLog[];
  onClearLogs: () => void;
}

export function AuditLogDrawer({ logs, onClearLogs }: AuditLogDrawerProps) {
  const [filter, setFilter] = useState<"ALL" | "THREATS" | "ACTIONS">("ALL");

  const filteredLogs = logs.filter((log) => {
    if (filter === "THREATS") return log.severity === "critical" || log.severity === "warning";
    if (filter === "ACTIONS")
      return log.type === "ACTION_ENFORCED" || log.type === "MANUAL_INTERVENTION";
    return true;
  });

  return (
    <div className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2.5">
          <History className="w-4 h-4 text-[#ef4444]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#a1a1aa]">
            Incident & Forensic Audit Log
          </h3>
          <span className="text-[10px] font-mono bg-[#27272a] text-[#a1a1aa] px-2 py-0.5 rounded font-semibold">
            {logs.length} Events
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#09090b] p-0.5 rounded-lg border border-[#27272a] text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-2.5 py-1 rounded cursor-pointer font-semibold transition-colors ${
                filter === "ALL" ? "bg-[#27272a] text-[#e1e1e3]" : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("THREATS")}
              className={`px-2.5 py-1 rounded cursor-pointer font-semibold transition-colors ${
                filter === "THREATS" ? "bg-red-950/50 text-[#ef4444]" : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
            >
              Threats
            </button>
            <button
              type="button"
              onClick={() => setFilter("ACTIONS")}
              className={`px-2.5 py-1 rounded cursor-pointer font-semibold transition-colors ${
                filter === "ACTIONS" ? "bg-[#27272a] text-[#e1e1e3]" : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
            >
              Actions
            </button>
          </div>

          <button
            type="button"
            onClick={onClearLogs}
            className="text-[10px] font-mono text-[#71717a] hover:text-[#e1e1e3] px-2 py-1 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Log Feed matching incident log design */}
      <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-[#71717a] text-xs font-mono">
            No incident events recorded. Active monitoring registers each 2.0s audio segment.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            let barColor = "bg-[#27272a]";
            let badgeColor = "text-[#71717a]";
            let icon = <FileText className="w-3.5 h-3.5 text-[#71717a]" />;

            if (log.severity === "critical") {
              barColor = "bg-[#ef4444]";
              badgeColor = "text-[#ef4444] font-bold";
              icon = <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />;
            } else if (log.severity === "warning") {
              barColor = "bg-orange-500";
              badgeColor = "text-orange-400";
              icon = <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
            } else if (log.severity === "success") {
              barColor = "bg-green-400";
              badgeColor = "text-green-400";
              icon = <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />;
            }

            return (
              <div
                key={log.id}
                className="bg-[#09090b] border border-[#27272a] rounded-lg p-3 flex gap-3 items-start transition-all hover:border-[#3f3f46]"
              >
                {/* Vertical Indicator Bar */}
                <div className={`w-1 self-stretch ${barColor} rounded-full shrink-0`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[#e1e1e3] text-xs truncate">
                      {log.title}
                    </span>
                    <div className="flex items-center space-x-2 shrink-0 text-[10px] font-mono">
                      <span className={badgeColor}>Risk: {log.riskScoreAtTime} pts</span>
                      <span className="text-[#3f3f46]">|</span>
                      <span className="text-[#71717a]">{timeStr}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] font-sans leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
