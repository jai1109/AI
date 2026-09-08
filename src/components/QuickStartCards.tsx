import { useRef, ChangeEvent } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Mic,
  Upload,
  Play,
  Square,
  Sparkles,
  HelpCircle,
  Volume2,
} from "lucide-react";
import { CallScenario, UploadedAudioInfo } from "../types";
import { CALL_SCENARIOS } from "../utils/scenariosData";

interface QuickStartCardsProps {
  isCallActive: boolean;
  isMicActive: boolean;
  activeScenario: CallScenario | null;
  uploadedAudio: UploadedAudioInfo | null;
  onStartScenarioCall: (scenario: CallScenario) => void;
  onStartMicCall: () => void;
  onUploadAudioFile: (file: File) => void;
  onEndCall: () => void;
  onOpenHelp: () => void;
}

export function QuickStartCards({
  isCallActive,
  isMicActive,
  activeScenario,
  uploadedAudio,
  onStartScenarioCall,
  onStartMicCall,
  onUploadAudioFile,
  onEndCall,
  onOpenHelp,
}: QuickStartCardsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadAudioFile(files[0]);
    }
    if (e.target) e.target.value = "";
  };

  const isTestingAI = isCallActive && activeScenario?.isSynthetic === true;
  const isTestingHuman = isCallActive && activeScenario?.isSynthetic === false;
  const isTestingMic = isCallActive && isMicActive;
  const isTestingFile = isCallActive && !!uploadedAudio;

  return (
    <div className="w-full bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-xl">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm,.aac,.flac"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#27272a]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Test: Choose How You Want to Try It
            </h2>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Click any option below to test the AI voice clone detector in seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenHelp}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#e1e1e3] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>How It Works Guide</span>
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: AI Clone Scam Test */}
        <div
          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
            isTestingAI
              ? "bg-red-950/30 border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              : "bg-[#09090b] border-[#27272a] hover:border-[#ef4444]/40"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/50 text-[#ef4444] border border-[#ef4444]/30">
                ATTACK DEMO
              </span>
            </div>
            <h3 className="text-xs font-bold text-white mb-1">
              Test AI Voice Clone
            </h3>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed mb-3">
              Hear an AI clone of a CEO impersonator demanding an urgent wire transfer. Watch the risk score surge to 85–95%.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isTestingAI) {
                onEndCall();
              } else {
                onStartScenarioCall(CALL_SCENARIOS[0]);
              }
            }}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-colors ${
              isTestingAI
                ? "bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                : "bg-red-950/40 hover:bg-red-900/50 border border-[#ef4444]/40 text-[#ef4444]"
            }`}
          >
            {isTestingAI ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Stop Test</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate AI Attack</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Authentic Human Voice Test */}
        <div
          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
            isTestingHuman
              ? "bg-green-950/30 border-green-500/60 shadow-[0_0_15px_rgba(74,222,128,0.15)]"
              : "bg-[#09090b] border-[#27272a] hover:border-green-500/40"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-950/50 border border-green-500/40 flex items-center justify-center text-green-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-950/50 text-green-400 border border-green-900/40">
                GENUINE DEMO
              </span>
            </div>
            <h3 className="text-xs font-bold text-white mb-1">
              Test Real Human Voice
            </h3>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed mb-3">
              Hear an authentic family member conversation with natural breathing and vocal jitter. Verifies safe at 10–20%.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isTestingHuman) {
                onEndCall();
              } else {
                onStartScenarioCall(CALL_SCENARIOS[3]); // Mother/Sunday Dinner genuine
              }
            }}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-colors ${
              isTestingHuman
                ? "bg-green-600 text-white shadow-[0_0_12px_rgba(74,222,128,0.3)]"
                : "bg-green-950/40 hover:bg-green-900/50 border border-green-500/40 text-green-400"
            }`}
          >
            {isTestingHuman ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Stop Test</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Real Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Card 3: Test Your Own Microphone */}
        <div
          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
            isTestingMic
              ? "bg-[#27272a] border-[#3f3f46] shadow-[0_0_15px_rgba(239,68,68,0.15)]"
              : "bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#ef4444]">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#27272a] text-[#a1a1aa]">
                LIVE HARDWARE
              </span>
            </div>
            <h3 className="text-xs font-bold text-white mb-1">
              Test Your Own Voice
            </h3>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed mb-3">
              Speak into your microphone naturally. Your real vocal folds and breathing will verify you as an authentic human.
            </p>
          </div>

          <button
            type="button"
            onClick={isTestingMic ? onEndCall : onStartMicCall}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-colors ${
              isTestingMic
                ? "bg-[#ef4444] text-white"
                : "bg-[#27272a] hover:bg-[#3f3f46] text-white"
            }`}
          >
            {isTestingMic ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Stop Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>Turn On Mic</span>
              </>
            )}
          </button>
        </div>

        {/* Card 4: Upload Audio File */}
        <div
          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
            isTestingFile
              ? "bg-[#27272a] border-[#ef4444]/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
              : "bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#ef4444]">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#27272a] text-[#a1a1aa]">
                RECORDINGS
              </span>
            </div>
            <h3 className="text-xs font-bold text-white mb-1">
              Upload Audio File
            </h3>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed mb-3">
              Inspect any voice recording (.wav, .mp3, .m4a, .ogg) to detect if it was synthesized by an AI voice engine.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>Select File...</span>
          </button>
        </div>
      </div>
    </div>
  );
}
