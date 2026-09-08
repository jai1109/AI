import { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  ChevronDown,
  User,
  ShieldAlert,
  ShieldCheck,
  Upload,
  FileAudio,
  X,
  Play,
} from "lucide-react";
import { CallScenario, UploadedAudioInfo } from "../types";
import { CALL_SCENARIOS } from "../utils/scenariosData";

interface CallHeaderProps {
  isCallActive: boolean;
  activeScenario: CallScenario | null;
  uploadedAudio: UploadedAudioInfo | null;
  isMicActive: boolean;
  callDurationSeconds: number;
  onStartScenarioCall: (scenario: CallScenario) => void;
  onStartMicCall: () => void;
  onStartUploadedCall: () => void;
  onUploadAudioFile: (file: File) => void;
  onClearUploadedAudio: () => void;
  onEndCall: () => void;
  riskScore: number;
  activeTranscript?: string;
  onOpenHelp?: () => void;
}

export function CallHeader({
  isCallActive,
  activeScenario,
  uploadedAudio,
  isMicActive,
  callDurationSeconds,
  onStartScenarioCall,
  onStartMicCall,
  onStartUploadedCall,
  onUploadAudioFile,
  onClearUploadedAudio,
  onEndCall,
  riskScore,
  activeTranscript,
  onOpenHelp,
}: CallHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadAudioFile(files[0]);
      setIsDropdownOpen(false);
    }
    // reset input so same file can be re-selected if desired
    if (e.target) e.target.value = "";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("audio/") || /\.(wav|mp3|m4a|ogg|webm|aac|flac)$/i.test(file.name)) {
        onUploadAudioFile(file);
      }
    }
  };

  let currentCallerName = "No Call Active";
  let currentCallerPhone = "Ready to connect";

  if (uploadedAudio) {
    currentCallerName = uploadedAudio.name;
    currentCallerPhone = `Device Audio File • ${(uploadedAudio.size / 1024).toFixed(0)} KB • ${uploadedAudio.durationSeconds.toFixed(1)}s`;
  } else if (isMicActive) {
    currentCallerName = "Live Device Microphone";
    currentCallerPhone = "Local Audio Stream (Live Hardware Capture)";
  } else if (activeScenario) {
    currentCallerName = activeScenario.callerName;
    currentCallerPhone = activeScenario.callerPhone;
  }

  const isHighThreat = isCallActive && riskScore >= 70;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full bg-[#18181b] border rounded-xl p-5 shadow-xl transition-colors relative ${
        isDragging
          ? "border-[#ef4444] bg-red-950/20"
          : "border-[#27272a]"
      }`}
    >
      {/* Hidden File Input for Click Selection */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm,.aac,.flac"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag & Drop Visual Notice */}
      {isDragging && (
        <div className="absolute inset-0 z-30 bg-[#09090b]/90 border-2 border-dashed border-[#ef4444] rounded-xl flex items-center justify-center pointer-events-none backdrop-blur-xs">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-[#ef4444] animate-bounce" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#e1e1e3]">
              Drop Voice Recording File to Analyze
            </span>
            <span className="text-xs text-[#71717a] font-mono">
              Supports WAV, MP3, M4A, OGG, WEBM, FLAC
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Caller Info Card */}
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              uploadedAudio
                ? "bg-red-950/30 border-[#ef4444]/50 text-[#ef4444]"
                : isCallActive
                ? isHighThreat
                  ? "bg-red-950/30 border-[#ef4444]/60 text-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                  : "bg-green-950/30 border-green-500/40 text-green-400"
                : "bg-[#09090b] border-[#27272a] text-[#71717a]"
            }`}
          >
            {uploadedAudio ? (
              <FileAudio className="w-6 h-6" />
            ) : isCallActive ? (
              isHighThreat ? (
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-[#e1e1e3] truncate max-w-xs sm:max-w-md">
                {currentCallerName}
              </h2>
              {uploadedAudio && (
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#27272a] text-[#ef4444] border border-[#ef4444]/30 text-[10px] font-mono font-semibold">
                  <span>DEVICE FILE</span>
                </span>
              )}
              {isCallActive && (
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#27272a] text-green-400 text-[10px] font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span>CONNECTED</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-[#71717a] font-mono mt-0.5">
              <span className="truncate max-w-xs sm:max-w-md">{currentCallerPhone}</span>
              {isCallActive && (
                <>
                  <span>•</span>
                  <span className="text-[#e1e1e3] font-bold">
                    {formatTime(callDurationSeconds)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Help & Guide Button */}
          {onOpenHelp && (
            <button
              type="button"
              onClick={onOpenHelp}
              className="px-3 py-2.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-[#e1e1e3] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
              title="Learn how AI voice cloning works and how to test"
            >
              <span className="w-4 h-4 rounded-full border border-[#71717a] flex items-center justify-center text-[10px] font-bold">?</span>
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}

          {/* Upload Audio Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46] text-[#e1e1e3] text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-all shadow-sm"
            title="Upload audio recording (.wav, .mp3, .m4a, .ogg) from device files"
          >
            <Upload className="w-4 h-4 text-[#ef4444]" />
            <span>Upload Audio</span>
          </button>

          {/* Scenario Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-3.5 py-2.5 rounded-lg bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] text-[#e1e1e3] text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <span className="max-w-[140px] truncate">
                {uploadedAudio
                  ? `File: ${uploadedAudio.name}`
                  : activeScenario
                  ? activeScenario.title
                  : "Select Scenario"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-84 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl p-2 z-50 space-y-1">
                {/* Upload from device file option inside dropdown */}
                <div className="border-b border-[#27272a] pb-1.5 mb-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer hover:bg-[#09090b] text-[#e1e1e3] group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded bg-red-950/40 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444] group-hover:scale-105 transition-transform">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Upload Voice Recording...</div>
                        <div className="text-[10px] text-[#71717a]">Select audio file from your device</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-950/40 text-[#ef4444] border border-[#ef4444]/30">
                      DEVICE FILE
                    </span>
                  </button>
                </div>

                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                  Or Select Pre-Configured Attack Scenario:
                </div>
                {CALL_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onStartScenarioCall(sc);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between cursor-pointer ${
                      activeScenario?.id === sc.id && !uploadedAudio
                        ? "bg-[#27272a] text-[#e1e1e3] border border-[#3f3f46]"
                        : "hover:bg-[#09090b] text-[#a1a1aa] hover:text-[#e1e1e3]"
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center space-x-1.5">
                        <span>{sc.title}</span>
                      </div>
                      <div className="text-[10px] text-[#71717a] mt-0.5">
                        {sc.callerRole} • {sc.callerPhone}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        sc.isSynthetic
                          ? "bg-red-950/40 text-[#ef4444] border border-[#ef4444]/30"
                          : "bg-green-950/40 text-green-400 border border-green-900/40"
                      }`}
                    >
                      {sc.isSynthetic ? "AI CLONE" : "GENUINE"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* If an uploaded audio file is loaded, show clear option */}
          {uploadedAudio && (
            <button
              type="button"
              onClick={onClearUploadedAudio}
              className="p-2.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] text-[#71717a] hover:text-[#e1e1e3] transition-colors cursor-pointer"
              title="Remove loaded voice recording"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Live Device Microphone Button */}
          <button
            type="button"
            onClick={isMicActive ? onEndCall : onStartMicCall}
            className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer border ${
              isMicActive
                ? "bg-red-950/30 border-[#ef4444]/50 text-[#ef4444]"
                : "bg-[#09090b] hover:bg-[#27272a] border-[#27272a] text-[#e1e1e3]"
            }`}
          >
            <Mic className="w-4 h-4 text-[#ef4444]" />
            <span>{isMicActive ? "Stop Live Mic" : "Live Mic Stream"}</span>
          </button>

          {/* Call / Hangup / Analyze Main Toggle */}
          {isCallActive ? (
            <button
              type="button"
              onClick={onEndCall}
              className="px-4 py-2.5 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Interrupt Call</span>
            </button>
          ) : uploadedAudio ? (
            <button
              type="button"
              onClick={onStartUploadedCall}
              className="px-4 py-2.5 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <Play className="w-4 h-4" />
              <span>Analyze Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStartScenarioCall(CALL_SCENARIOS[0])}
              className="px-4 py-2.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-green-400" />
              <span>Start Call Simulation</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Speaking Transcript Ticker */}
      {isCallActive && (
        <div className="mt-4 pt-3.5 border-t border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
            {/* Audio pulse bars */}
            <div className="flex items-center space-x-0.5 h-4 shrink-0 mt-0.5 sm:mt-0">
              <span className="w-1 bg-[#ef4444] rounded-full h-2 animate-[pulse_0.6s_ease-in-out_infinite]"></span>
              <span className="w-1 bg-[#ef4444] rounded-full h-4 animate-[pulse_0.4s_ease-in-out_infinite]"></span>
              <span className="w-1 bg-[#ef4444] rounded-full h-3 animate-[pulse_0.8s_ease-in-out_infinite]"></span>
              <span className="w-1 bg-[#ef4444] rounded-full h-1 animate-[pulse_0.5s_ease-in-out_infinite]"></span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa] shrink-0 font-mono">
                  {isMicActive
                    ? "Live Mic Input:"
                    : uploadedAudio
                    ? "File Stream:"
                    : "Now Speaking:"}
                </span>
                <span className="text-xs text-white italic truncate block">
                  &ldquo;{activeTranscript || "Analyzing vocal acoustic signature..."}&rdquo;
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#a1a1aa] shrink-0">
            <span>Audio Status:</span>
            <span className="text-green-400 font-bold">STREAMING ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}
