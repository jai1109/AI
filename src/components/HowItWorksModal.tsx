import {
  X,
  ShieldCheck,
  Zap,
  Activity,
  Wind,
  Layers,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickTestAI: () => void;
  onQuickTestHuman: () => void;
}

export function HowItWorksModal({
  isOpen,
  onClose,
  onQuickTestAI,
  onQuickTestHuman,
}: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-[#e1e1e3]">
        {/* Header */}
        <div className="sticky top-0 bg-[#18181b]/95 backdrop-blur-sm border-b border-[#27272a] p-5 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">How Echo Voice Detects AI Clones</h2>
              <p className="text-xs text-[#a1a1aa]">
                A beginner-friendly guide to understanding real-time voice verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Intro */}
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#ef4444] uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>The Danger: 3-Second Voice Clones</span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Modern AI systems can clone any person’s voice using just 3 seconds of audio from social media (TikTok, LinkedIn, Instagram). Attackers then spoof phone numbers and impersonate CEOs, executives, or family members to execute emergency wire fraud or extortion scams.
            </p>
          </div>

          {/* How The Detector Works: 4 Biological Markers */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span>The 4 Physical Acoustic Markers We Measure</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Vocal Cord Tremor */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>1. Vocal Cord Jitter</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-green-950/40 text-green-400 border border-green-900/40">
                    BIOMETRIC
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Real human vocal cords produce constant, subtle micro-vibrations (jitter). AI voice generators produce mathematically flat, over-smoothed pitch tracks that feel robotic underneath.
                </p>
              </div>

              {/* 2. Biological Breathing */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Wind className="w-3.5 h-3.5 text-blue-400" />
                    <span>2. Breathing Inhalations</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-900/40">
                    RESPIRATORY
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Humans must inhale air into their lungs between sentences. AI voice clones generate audio frames continuously without realistic respiratory suction and throat friction.
                </p>
              </div>

              {/* 3. Vocoder High-Frequency Cutoff */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>3. High-Frequency Cutoff</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-900/40">
                    VOCODER
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Neural vocoders (like HiFi-GAN and ElevenLabs engines) often cut audio sharply above 5.2 kHz to save bandwidth. Human speech retains natural airy harmonics all the way up to 16 kHz.
                </p>
              </div>

              {/* 4. Phase Coherence */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    <span>4. Phase Smearing</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-900/40">
                    ACOUSTIC
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Physical vocal tracts preserve coherent phase angles across overtone frequencies. Fast neural vocoders smear phase information, resulting in unnatural acoustic flatness.
                </p>
              </div>
            </div>
          </div>

          {/* How to Test: 3 Simple Ways */}
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Easy Ways to Try This App Right Now</span>
            </h3>
            <div className="space-y-2 text-xs text-[#a1a1aa]">
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-red-950/60 border border-[#ef4444]/40 text-[#ef4444] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white">Try an AI Clone Attack:</strong> Click &ldquo;Test AI Clone Attack&rdquo; to hear a simulated scam call. Watch the risk score surge to 85–95% and see the red warning fire!
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-green-950/60 border border-green-500/40 text-green-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white">Try a Real Human Voice:</strong> Click &ldquo;Test Real Human Voice&rdquo; to hear a family call. Watch the risk score stay safely low between 10–20% (Genuine).
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#27272a] text-[#e1e1e3] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white">Test Your Own Voice:</strong> Click &ldquo;Live Mic Stream&rdquo; and speak naturally into your computer or phone microphone. Your natural vocal cords will pass verification!
                </div>
              </div>
            </div>
          </div>

          {/* Action Checklist for Scams */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-[#ef4444]/30 space-y-2">
            <div className="text-xs font-bold text-[#ef4444] uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>What To Do If You Receive an AI Impersonation Call</span>
            </div>
            <ul className="text-xs text-[#a1a1aa] space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-white">Ask a personal challenge question:</strong> Something only the real person would know that isn&apos;t on social media.
              </li>
              <li>
                <strong className="text-white">Hang up and call back:</strong> Dial their known number directly, not the number calling you.
              </li>
              <li>
                <strong className="text-white">Never authorize urgent payments:</strong> Scammers create manufactured urgency to stop you from checking.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#09090b] border-t border-[#27272a] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[#71717a] font-mono">
            Echo Voice Protection • Powered by Multimodal Gemini & Acoustic DSP
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onQuickTestHuman();
              }}
              className="px-3.5 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-green-400 hover:text-green-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Test Human Voice
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onQuickTestAI();
              }}
              className="px-3.5 py-2 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Test AI Clone Voice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
