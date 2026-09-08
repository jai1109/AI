import { useState, useEffect } from "react";
import {
  Sliders,
  Shield,
  Bell,
  Volume2,
  Lock,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Radio,
} from "lucide-react";
import { DefensePolicy } from "../types";

const DEFAULT_POLICY: DefensePolicy = {
  alertThreshold: 40,
  autoInterruptThreshold: 80,
  enableAutoMute: true,
  enableAutoTerminate: true,
  vocoderSensitivity: "BALANCED",
  audioBeepAlerts: true,
  webhookUrl: "https://soc-siem.enterprise.local/alerts/v1/voice-intercept",
};

interface DefensePolicySettingsProps {
  policy: DefensePolicy;
  onUpdatePolicy: (policy: DefensePolicy) => void;
}

export function DefensePolicySettings({
  policy,
  onUpdatePolicy,
}: DefensePolicySettingsProps) {
  const [localPolicy, setLocalPolicy] = useState<DefensePolicy>(policy);
  const [isSaved, setIsSaved] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);

  useEffect(() => {
    setLocalPolicy(policy);
  }, [policy]);

  const handleSave = () => {
    onUpdatePolicy(localPolicy);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    setLocalPolicy(DEFAULT_POLICY);
    onUpdatePolicy(DEFAULT_POLICY);
  };

  const handleTestWebhook = () => {
    setTestWebhookStatus("sending");
    setTimeout(() => {
      setTestWebhookStatus("success");
      setTimeout(() => setTestWebhookStatus(null), 3500);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18181b] border border-[#27272a] rounded-xl p-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e1e1e3]">Safety Rules & Settings</h2>
            <p className="text-xs text-[#71717a]">
              Configure danger alert levels, automatic protection actions, and security notifications.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-lg bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] text-[#71717a] hover:text-white text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          >
            <Shield className="w-4 h-4" />
            <span>{isSaved ? "Saved Successfully!" : "Save Settings"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk Threshold Sliders */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#27272a]">
            <Radio className="w-4 h-4 text-[#ef4444]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a1a1aa]">
              Danger Alert Levels
            </h3>
          </div>

          {/* Slider 1: Yellow Alert Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Warning Alert Level</span>
              <span className="font-mono font-bold text-[#f59e0b] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                {localPolicy.alertThreshold}% Risk
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              step="5"
              value={localPolicy.alertThreshold}
              onChange={(e) =>
                setLocalPolicy({ ...localPolicy, alertThreshold: Number(e.target.value) })
              }
              className="w-full accent-[#f59e0b] cursor-pointer"
            />
            <p className="text-[11px] text-[#71717a]">
              Shows a yellow warning banner when danger reaches this level.
            </p>
          </div>

          {/* Slider 2: Auto Interruption Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Automatic Mute / Protection Level</span>
              <span className="font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                {localPolicy.autoInterruptThreshold}% Risk
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              step="5"
              value={localPolicy.autoInterruptThreshold}
              onChange={(e) =>
                setLocalPolicy({ ...localPolicy, autoInterruptThreshold: Number(e.target.value) })
              }
              className="w-full accent-[#ef4444] cursor-pointer"
            />
            <p className="text-[11px] text-[#71717a]">
              Mutes incoming sound and marks the call as dangerous when this level is reached.
            </p>
          </div>
        </div>

        {/* Automated Defensive Playbook & Sensitivity */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#27272a]">
            <Zap className="w-4 h-4 text-[#ef4444]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a1a1aa]">
              Automatic Protection Actions
            </h3>
          </div>

          {/* Toggles */}
          <div className="space-y-3 text-xs">
            <label className="flex items-start justify-between gap-3 p-3 bg-[#09090b] rounded-lg border border-[#27272a] cursor-pointer">
              <div>
                <div className="font-bold text-white">Automatic Audio Muting</div>
                <div className="text-[11px] text-[#71717a]">
                  Immediately mute caller audio when a fake voice is confirmed.
                </div>
              </div>
              <input
                type="checkbox"
                checked={localPolicy.enableAutoMute}
                onChange={(e) =>
                  setLocalPolicy({ ...localPolicy, enableAutoMute: e.target.checked })
                }
                className="mt-1 accent-[#ef4444] w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-start justify-between gap-3 p-3 bg-[#09090b] rounded-lg border border-[#27272a] hover:border-[#ef4444]/40 transition-colors cursor-pointer">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">Auto-End Call</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/60 text-[#ef4444] border border-red-500/30">
                    HIGH DANGER ACTION
                  </span>
                </div>
                <div className="text-[11px] text-[#71717a] mt-0.5">
                  Automatically hang up the call if high danger continues for more than 3 audio chunks in a row.
                </div>
              </div>
              <input
                type="checkbox"
                checked={localPolicy.enableAutoTerminate ?? true}
                onChange={(e) =>
                  setLocalPolicy({ ...localPolicy, enableAutoTerminate: e.target.checked })
                }
                className="mt-1 accent-[#ef4444] w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-start justify-between gap-3 p-3 bg-[#09090b] rounded-lg border border-[#27272a] cursor-pointer">
              <div>
                <div className="font-bold text-white">Warning Sound Chime</div>
                <div className="text-[11px] text-[#71717a]">
                  Play an alert beep in your ear when suspicious audio is detected.
                </div>
              </div>
              <input
                type="checkbox"
                checked={localPolicy.audioBeepAlerts}
                onChange={(e) =>
                  setLocalPolicy({ ...localPolicy, audioBeepAlerts: e.target.checked })
                }
                className="mt-1 accent-[#ef4444] w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Vocoder Sensitivity Radio */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-[#a1a1aa] block">
              Detection Sensitivity:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {(["LOW", "BALANCED", "HIGH"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLocalPolicy({ ...localPolicy, vocoderSensitivity: lvl })}
                  className={`py-2 rounded-lg border text-center cursor-pointer transition-colors ${
                    localPolicy.vocoderSensitivity === lvl
                      ? "bg-[#27272a] border-[#ef4444] text-white font-bold"
                      : "bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-[#e1e1e3]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Operations SIEM & Webhook Dispatch */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-[#ef4444]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#a1a1aa]">
            Alert Notifications (Webhooks)
          </h3>
        </div>

        <p className="text-xs text-[#71717a]">
          Send instant alerts to your team chat or notification system (Slack, Teams, or security tools) when a fake voice is detected.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={localPolicy.webhookUrl}
            onChange={(e) => setLocalPolicy({ ...localPolicy, webhookUrl: e.target.value })}
            placeholder="https://your-soc.company.com/webhooks/voice-clone-alert"
            className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ef4444] font-mono"
          />

          <button
            type="button"
            onClick={handleTestWebhook}
            className="px-4 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-colors border border-[#3f3f46] whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>Send Test Alert</span>
          </button>
        </div>

        {testWebhookStatus === "sending" && (
          <div className="text-xs text-[#a1a1aa] flex items-center space-x-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Sending test alert message...</span>
          </div>
        )}

        {testWebhookStatus === "success" && (
          <div className="text-xs text-green-400 flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Alert verified! Test notification delivered successfully.</span>
          </div>
        )}
      </div>
    </div>
  );
}
