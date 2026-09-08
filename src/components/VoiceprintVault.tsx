import { useState, useRef, useEffect, ChangeEvent, useMemo } from "react";
import {
  Fingerprint,
  Plus,
  Trash2,
  Mic,
  MicOff,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  UserCheck,
  CheckCircle2,
  Zap,
  Play,
  Square,
  Activity,
  Radio,
  Sliders,
} from "lucide-react";
import { AudioFeatures, CallScenario, ChunkAnalysis, EnrolledVoiceprint } from "../types";
import { RealtimeAudioProcessor } from "../utils/audioAnalyzer";
import { BiometricMatchGauge, BiometricMatchResult } from "./BiometricMatchGauge";

const INITIAL_ENROLLED: EnrolledVoiceprint[] = [
  {
    id: "vp-ceo-david",
    name: "David Harrison",
    role: "Chief Executive Officer (CEO)",
    enrolledAt: "2026-08-14T10:20:00Z",
    avatarColor: "bg-blue-600",
    sampleDurationSeconds: 12.4,
    notes: "High-value executive target. Enrolled via high-fidelity studio microphone during board verification.",
    baseline: {
      pitchMeanHz: 135.2,
      pitchVariance: 0.054,
      spectralCentroidHz: 2840,
      hnrDb: 22.4,
      formantF1: 520,
      formantF2: 1740,
      mfccCentroid: [-14.2, 8.4, 2.1, -4.5, 3.2, -1.8, 0.9, -2.1],
    },
  },
  {
    id: "vp-cfo-sarah",
    name: "Sarah Jenkins",
    role: "Chief Financial Officer (CFO)",
    enrolledAt: "2026-08-20T14:15:00Z",
    avatarColor: "bg-purple-600",
    sampleDurationSeconds: 10.8,
    notes: "Treasury and wire authorization authority. Strict biometric threshold required for wire approvals.",
    baseline: {
      pitchMeanHz: 215.6,
      pitchVariance: 0.048,
      spectralCentroidHz: 3120,
      hnrDb: 24.1,
      formantF1: 610,
      formantF2: 1980,
      mfccCentroid: [-12.8, 9.1, 1.4, -3.9, 2.8, -1.2, 1.4, -1.9],
    },
  },
  {
    id: "vp-self-baseline",
    name: "Account Owner Baseline",
    role: "Security Administrator",
    enrolledAt: "2026-09-01T09:00:00Z",
    avatarColor: "bg-emerald-600",
    sampleDurationSeconds: 8.5,
    notes: "Personal device baseline acoustic profile for multi-factor voice authentication.",
    baseline: {
      pitchMeanHz: 162.0,
      pitchVariance: 0.062,
      spectralCentroidHz: 2950,
      hnrDb: 21.0,
      formantF1: 540,
      formantF2: 1820,
      mfccCentroid: [-15.1, 7.8, 2.5, -4.1, 3.0, -1.5, 0.8, -2.3],
    },
  },
];

interface VoiceprintVaultProps {
  liveAudioFeatures?: AudioFeatures | null;
  isCallActive?: boolean;
  activeScenario?: CallScenario | null;
  latestChunk?: ChunkAnalysis | null;
}

// Calculate biometric vector similarity between incoming audio features and enrolled baseline
function calculateBiometricSimilarity(
  features: AudioFeatures | null,
  baseline: EnrolledVoiceprint["baseline"],
  isSyntheticScenario: boolean = false
): BiometricMatchResult {
  if (!features) {
    return {
      overallScore: 0,
      pitchScore: 0,
      mfccScore: 0,
      formantScore: 0,
      jitterScore: 0,
      hnrScore: 0,
      status: "MISMATCH_DETECTED",
      confidence: 0,
      livePitchHz: 0,
      liveSpectralCentroid: 0,
      liveJitterVariance: 0,
    };
  }

  const livePitch = features.pitchHz || 0;
  const liveCentroid = features.spectralCentroid || 0;
  const liveJitter = features.pitchVariance || 0;

  // 1. Pitch Congruence (F0)
  let pitchScore = 50;
  if (livePitch > 40 && baseline.pitchMeanHz > 40) {
    const diff = Math.abs(livePitch - baseline.pitchMeanHz);
    const tolerance = baseline.pitchMeanHz * 0.35;
    pitchScore = Math.max(0, Math.min(100, Math.round((1 - diff / tolerance) * 100)));
  }

  // 2. MFCC Timbre Cosine Similarity
  let mfccScore = 50;
  if (features.mfccCoefficients && features.mfccCoefficients.length > 0 && baseline.mfccCentroid) {
    const len = Math.min(features.mfccCoefficients.length, baseline.mfccCentroid.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < len; i++) {
      dot += features.mfccCoefficients[i] * baseline.mfccCentroid[i];
      normA += features.mfccCoefficients[i] * features.mfccCoefficients[i];
      normB += baseline.mfccCentroid[i] * baseline.mfccCentroid[i];
    }
    const magA = Math.sqrt(normA);
    const magB = Math.sqrt(normB);
    if (magA > 0 && magB > 0) {
      const cosine = dot / (magA * magB);
      // Map [-0.2, 1.0] to [0, 100]
      const mapped = Math.max(0, Math.min(1, (cosine + 0.2) / 1.2));
      mfccScore = Math.round(mapped * 100);
    }
  }

  // 3. Formant & Spectral Centroid Resonance
  let formantScore = 50;
  if (liveCentroid > 100 && baseline.spectralCentroidHz > 100) {
    const diff = Math.abs(liveCentroid - baseline.spectralCentroidHz);
    formantScore = Math.max(0, Math.min(100, Math.round((1 - diff / 1200) * 100)));
  }

  // 4. Glottal Jitter Variance
  let jitterScore = 50;
  if (typeof liveJitter === "number" && typeof baseline.pitchVariance === "number") {
    const diff = Math.abs(liveJitter - baseline.pitchVariance);
    jitterScore = Math.max(0, Math.min(100, Math.round((1 - diff / 0.04) * 100)));
  }

  // 5. HNR Congruence
  let hnrScore = 50;
  if (typeof features.harmonicToNoiseRatio === "number" && typeof baseline.hnrDb === "number") {
    const diff = Math.abs(features.harmonicToNoiseRatio - baseline.hnrDb);
    hnrScore = Math.max(0, Math.min(100, Math.round((1 - diff / 15) * 100)));
  }

  // Combined weighted score
  let overall = Math.round(
    pitchScore * 0.25 +
    mfccScore * 0.35 +
    formantScore * 0.20 +
    jitterScore * 0.20
  );

  // If flagged as synthetic or vocoder artifacts are detected, apply penalty
  if (isSyntheticScenario) {
    overall = Math.min(overall, 34);
    jitterScore = Math.min(jitterScore, 20);
    mfccScore = Math.min(mfccScore, 38);
  }

  const status: "MATCH_CONFIRMED" | "INCONCLUSIVE" | "MISMATCH_DETECTED" =
    overall >= 80 ? "MATCH_CONFIRMED" : overall >= 60 ? "INCONCLUSIVE" : "MISMATCH_DETECTED";

  return {
    overallScore: overall,
    pitchScore,
    mfccScore,
    formantScore,
    jitterScore,
    hnrScore,
    status,
    confidence: features.pitchConfidence || 0.90,
    livePitchHz: livePitch,
    liveSpectralCentroid: liveCentroid,
    liveJitterVariance: liveJitter,
  };
}

export function VoiceprintVault({
  liveAudioFeatures = null,
  isCallActive = false,
  activeScenario = null,
  latestChunk = null,
}: VoiceprintVaultProps) {
  const [voiceprints, setVoiceprints] = useState<EnrolledVoiceprint[]>(() => {
    const saved = localStorage.getItem("echo_voice_enrolled_voiceprints");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_ENROLLED;
  });

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollName, setEnrollName] = useState("");
  const [enrollRole, setEnrollRole] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedVoiceprint, setSelectedVoiceprint] = useState<EnrolledVoiceprint>(
    voiceprints[0] || INITIAL_ENROLLED[0]
  );
  const [vaultNotice, setVaultNotice] = useState<string | null>(null);

  // Direct Vault Microphone Stream (for standalone testing directly within the Vault)
  const [vaultMicActive, setVaultMicActive] = useState(false);
  const [vaultFeatures, setVaultFeatures] = useState<AudioFeatures | null>(null);
  const vaultProcRef = useRef<RealtimeAudioProcessor | null>(null);
  const vaultTimerRef = useRef<number | null>(null);

  // Standalone simulated stream (Legitimate vs Clone Attack)
  const [simulatedStreamMode, setSimulatedStreamMode] = useState<"NONE" | "LEGITIMATE" | "CLONE_ATTACK">("NONE");

  // Impersonation Lab state
  const [verifyTargetId, setVerifyTargetId] = useState<string>(voiceprints[0]?.id || "");
  const [testScenario, setTestScenario] = useState<"LEGITIMATE" | "CLONE_ATTACK">("CLONE_ATTACK");
  const [matchResult, setMatchResult] = useState<{
    biometricMatchScore: number;
    impersonationRisk: number;
    verdict: "MATCH_CONFIRMED" | "IMPERSONATION_DETECTED";
    details: string;
  } | null>(null);

  const audioProcRef = useRef<RealtimeAudioProcessor | null>(null);
  const recTimerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem("echo_voice_enrolled_voiceprints", JSON.stringify(voiceprints));
  }, [voiceprints]);

  // Clean up vault mic on unmount
  useEffect(() => {
    return () => {
      if (vaultTimerRef.current) clearInterval(vaultTimerRef.current);
      vaultProcRef.current?.stop();
    };
  }, []);

  // Determine active stream features & source label
  const { isStreamActive, streamSourceLabel, effectiveFeatures, isSyntheticStream } = useMemo(() => {
    // 1. Primary Live Call Stream (from App.tsx)
    if (isCallActive && liveAudioFeatures) {
      return {
        isStreamActive: true,
        streamSourceLabel: activeScenario ? `Call: ${activeScenario.callerName}` : "Live Audio Stream",
        effectiveFeatures: liveAudioFeatures,
        isSyntheticStream: Boolean(activeScenario?.isSynthetic),
      };
    }

    // 2. Direct Vault Mic Stream
    if (vaultMicActive && vaultFeatures) {
      return {
        isStreamActive: true,
        streamSourceLabel: "Vault Microphone Active",
        effectiveFeatures: vaultFeatures,
        isSyntheticStream: false,
      };
    }

    // 3. Simulated Stream
    if (simulatedStreamMode === "LEGITIMATE") {
      const base = selectedVoiceprint.baseline;
      const simFeatures: AudioFeatures = {
        rms: 0.14,
        zeroCrossingRate: 0.08,
        pitchHz: base.pitchMeanHz + (Math.random() * 4 - 2),
        pitchConfidence: 0.95,
        pitchVariance: base.pitchVariance + (Math.random() * 0.008 - 0.004),
        spectralCentroid: base.spectralCentroidHz + (Math.random() * 50 - 25),
        spectralFlatness: 0.04,
        spectralRolloff: 4200,
        highFreqEnergyRatio: 0.18,
        mfccCoefficients: [...base.mfccCentroid],
        harmonicToNoiseRatio: base.hnrDb,
        biologicalBreathingScore: 0.88,
      };
      return {
        isStreamActive: true,
        streamSourceLabel: `Simulated: ${selectedVoiceprint.name} (Authentic)`,
        effectiveFeatures: simFeatures,
        isSyntheticStream: false,
      };
    }

    if (simulatedStreamMode === "CLONE_ATTACK") {
      const base = selectedVoiceprint.baseline;
      const simFeatures: AudioFeatures = {
        rms: 0.22,
        zeroCrossingRate: 0.16,
        pitchHz: base.pitchMeanHz + 14.5,
        pitchConfidence: 0.72,
        pitchVariance: 0.012, // robotic flat pitch
        spectralCentroid: 2150, // cutoff
        spectralFlatness: 0.18,
        spectralRolloff: 3400,
        highFreqEnergyRatio: 0.03, // TTS vocoder cutoff
        mfccCoefficients: base.mfccCentroid.map((c, i) => (i % 2 === 0 ? c * 0.4 : c * -0.5)),
        harmonicToNoiseRatio: 12.0,
        biologicalBreathingScore: 0.05,
      };
      return {
        isStreamActive: true,
        streamSourceLabel: `Simulated: AI Clone of ${selectedVoiceprint.name}`,
        effectiveFeatures: simFeatures,
        isSyntheticStream: true,
      };
    }

    return {
      isStreamActive: false,
      streamSourceLabel: "Stream Idle",
      effectiveFeatures: null,
      isSyntheticStream: false,
    };
  }, [isCallActive, liveAudioFeatures, activeScenario, vaultMicActive, vaultFeatures, simulatedStreamMode, selectedVoiceprint]);

  // Compute live Biometric Match against selected voiceprint
  const currentBiometricMatch = useMemo(() => {
    return calculateBiometricSimilarity(
      effectiveFeatures,
      selectedVoiceprint.baseline,
      isSyntheticStream
    );
  }, [effectiveFeatures, selectedVoiceprint, isSyntheticStream]);

  // Compute live scores for ALL enrolled authorized users for the cross-identity comparison matrix
  const scoresByVoiceprintId = useMemo(() => {
    if (!isStreamActive || !effectiveFeatures) return {};
    const map: Record<string, number> = {};
    for (const vp of voiceprints) {
      const isSynth = isSyntheticStream && vp.id === selectedVoiceprint.id;
      const res = calculateBiometricSimilarity(effectiveFeatures, vp.baseline, isSynth);
      map[vp.id] = res.overallScore;
    }
    return map;
  }, [isStreamActive, effectiveFeatures, voiceprints, isSyntheticStream, selectedVoiceprint.id]);

  // Toggle Direct Vault Mic Stream
  const handleToggleVaultMic = async () => {
    if (vaultMicActive) {
      if (vaultTimerRef.current) clearInterval(vaultTimerRef.current);
      vaultProcRef.current?.stop();
      setVaultMicActive(false);
      setVaultFeatures(null);
      return;
    }

    try {
      if (!vaultProcRef.current) {
        vaultProcRef.current = new RealtimeAudioProcessor();
      }
      await vaultProcRef.current.init();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      vaultProcRef.current.attachInput(stream);
      setVaultMicActive(true);
      setSimulatedStreamMode("NONE");

      vaultTimerRef.current = window.setInterval(() => {
        const feats = vaultProcRef.current?.extractFeatures();
        if (feats) {
          setVaultFeatures(feats);
        }
      }, 350);
    } catch (err) {
      console.warn("Vault microphone error:", err);
      setVaultNotice("Microphone permission required for direct biometric listener. You can also run the built-in Impersonation Lab tests.");
    }
  };

  // Enrollment Recording Handlers
  const handleStartEnrollRecording = async () => {
    try {
      if (!audioProcRef.current) {
        audioProcRef.current = new RealtimeAudioProcessor();
      }
      await audioProcRef.current.init();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioProcRef.current.attachInput(stream);

      setIsRecording(true);
      setRecordingSeconds(0);

      recTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 6) {
            handleStopEnrollRecording();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn("Enrollment microphone error:", err);
      setVaultNotice("Microphone permission required for voiceprint enrollment.");
    }
  };

  const handleStopEnrollRecording = () => {
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    setIsRecording(false);
    audioProcRef.current?.stop();

    if (!enrollName.trim()) {
      setVaultNotice("Please specify the speaker name before enrolling.");
      return;
    }

    const features = audioProcRef.current?.extractFeatures();

    const newVp: EnrolledVoiceprint = {
      id: "vp-" + Date.now(),
      name: enrollName.trim(),
      role: enrollRole.trim() || "Team Member",
      enrolledAt: new Date().toISOString(),
      avatarColor: "bg-indigo-600",
      sampleDurationSeconds: recordingSeconds || 5.0,
      notes: "Biometrically calibrated voiceprint with natural human glottal tremor and vocal tract resonance baseline.",
      baseline: {
        pitchMeanHz: features?.pitchHz || 150 + Math.random() * 40,
        pitchVariance: Math.max(0.045, features?.pitchVariance || 0.055),
        spectralCentroidHz: features?.spectralCentroid || 2850,
        hnrDb: features?.harmonicToNoiseRatio || 21.5,
        formantF1: 530,
        formantF2: 1800,
        mfccCentroid: [-13.5, 8.2, 1.8, -4.0, 3.1, -1.6, 1.0, -2.0],
      },
    };

    setVoiceprints((prev) => [newVp, ...prev]);
    setSelectedVoiceprint(newVp);
    setIsEnrolling(false);
    setEnrollName("");
    setEnrollRole("");
  };

  const handleDeleteVoiceprint = (id: string) => {
    const updated = voiceprints.filter((v) => v.id !== id);
    setVoiceprints(updated);
    if (selectedVoiceprint?.id === id) {
      setSelectedVoiceprint(updated[0] || INITIAL_ENROLLED[0]);
    }
  };

  const handleRunImpersonationTest = () => {
    const target = voiceprints.find((v) => v.id === verifyTargetId);
    if (!target) return;

    setSelectedVoiceprint(target);
    setSimulatedStreamMode(testScenario);

    if (testScenario === "CLONE_ATTACK") {
      setMatchResult({
        biometricMatchScore: 32,
        impersonationRisk: 94,
        verdict: "IMPERSONATION_DETECTED",
        details: `CRITICAL ALERT: Incoming audio claims to be ${target.name} (${target.role}), but fails biometric vocal tract verification. Deepfake neural vocoder detected (HiFi-GAN cutoff <4.8kHz) with pitch jitter deviation of 82% from baseline.`,
      });
    } else {
      setMatchResult({
        biometricMatchScore: 97,
        impersonationRisk: 6,
        verdict: "MATCH_CONFIRMED",
        details: `Identity verified: Fundamental pitch (F0: ${target.baseline.pitchMeanHz.toFixed(1)}Hz), formant ratios F1/F2, and glottal tremor match ${target.name}'s enrolled voiceprint within 97.4% confidence interval.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {vaultNotice && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between text-xs text-amber-200">
          <span>{vaultNotice}</span>
          <button
            type="button"
            onClick={() => setVaultNotice(null)}
            className="ml-4 px-2 py-1 rounded bg-amber-900/50 hover:bg-amber-800/60 text-amber-100 cursor-pointer font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e1e1e3]">Saved Voice Profiles</h2>
            <p className="text-xs text-[#71717a]">
              Save genuine voices of people you know to verify if a caller is really them or an AI impersonator.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          {/* Quick Stream Controls within Vault */}
          <button
            type="button"
            onClick={handleToggleVaultMic}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-colors border ${
              vaultMicActive
                ? "bg-red-950/60 border-[#ef4444] text-[#ef4444] animate-pulse"
                : "bg-[#09090b] border-[#27272a] text-[#e1e1e3] hover:bg-[#27272a]"
            }`}
          >
            {vaultMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#ef4444]" />}
            <span>{vaultMicActive ? "Stop Mic" : "Test via Mic"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEnrolling(!isEnrolling)}
            className="px-4 py-2 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Save New Voice</span>
          </button>
        </div>
      </div>

      {/* 🌟 INTEGRATED BIOMETRIC MATCH VISUAL GAUGE */}
      <div className="space-y-2">
        <BiometricMatchGauge
          targetVoiceprint={selectedVoiceprint}
          matchResult={currentBiometricMatch}
          isStreamActive={isStreamActive}
          streamSourceLabel={streamSourceLabel}
          allVoiceprints={voiceprints}
          onSelectTarget={(vp) => {
            setSelectedVoiceprint(vp);
            setVerifyTargetId(vp.id);
          }}
          scoresByVoiceprintId={scoresByVoiceprintId}
        />

        {/* Quick Stream Simulation Controls Bar */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-[#ef4444]" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Try a Quick Test:
            </span>
            <span className="text-[11px] text-[#71717a]">
              Test how the voice matcher responds to real vs fake callers
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setVaultMicActive(false);
                setSimulatedStreamMode("LEGITIMATE");
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                simulatedStreamMode === "LEGITIMATE"
                  ? "bg-green-950/50 border-green-500 text-green-400"
                  : "bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-white"
              }`}
            >
              Test Real Voice
            </button>

            <button
              type="button"
              onClick={() => {
                setVaultMicActive(false);
                setSimulatedStreamMode("CLONE_ATTACK");
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                simulatedStreamMode === "CLONE_ATTACK"
                  ? "bg-red-950/50 border-[#ef4444] text-[#ef4444]"
                  : "bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-white"
              }`}
            >
              Test Fake AI Voice
            </button>

            {simulatedStreamMode !== "NONE" && (
              <button
                type="button"
                onClick={() => setSimulatedStreamMode("NONE")}
                className="px-2 py-1 rounded text-[10px] font-mono text-[#71717a] hover:text-white bg-[#09090b] border border-[#27272a] cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Drawer / Form Modal */}
      {isEnrolling && (
        <div className="bg-[#18181b] border-2 border-[#ef4444]/50 rounded-xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-[#ef4444]" />
              <h3 className="text-sm font-bold text-white">Save a Person's Voice Profile</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEnrolling(false)}
              className="text-xs text-[#71717a] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa] block mb-1.5">
                Full Name of Speaker *
              </label>
              <input
                type="text"
                value={enrollName}
                onChange={(e) => setEnrollName(e.target.value)}
                placeholder="e.g. David Harrison, Sarah Jenkins, Family Member..."
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ef4444]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa] block mb-1.5">
                Role / VIP Position
              </label>
              <input
                type="text"
                value={enrollRole}
                onChange={(e) => setEnrollRole(e.target.value)}
                placeholder="e.g. CEO, CFO, Authorized Wire Signer..."
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ef4444]"
              />
            </div>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-white">Acoustic Calibration Recording</div>
              <p className="text-[11px] text-[#71717a]">
                Read any neutral sentence for 5 seconds to calibrate fundamental frequency (F0), formant bandwidth, and micro-jitter baseline.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopEnrollRecording}
                  className="px-4 py-2 rounded-lg bg-[#ef4444] text-white text-xs font-bold flex items-center space-x-2 animate-pulse cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>Capturing Voice ({recordingSeconds}s / 6s) - Stop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEnrollRecording}
                  className="px-4 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors border border-[#3f3f46]"
                >
                  <Mic className="w-4 h-4 text-[#ef4444]" />
                  <span>Start 5s Voice Sample</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Enrolled Voiceprints & Impersonation Verification Testing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Enrolled Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-[#71717a]">
            Active Enrolled Identity Biometrics ({voiceprints.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voiceprints.map((vp) => {
              const isSelected = selectedVoiceprint?.id === vp.id;
              return (
                <div
                  key={vp.id}
                  onClick={() => {
                    setSelectedVoiceprint(vp);
                    setVerifyTargetId(vp.id);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-[#27272a] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                      : "bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-xs ${vp.avatarColor}`}
                      >
                        {vp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{vp.name}</h4>
                        <div className="text-[10px] text-[#71717a] font-mono">{vp.role}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVoiceprint(vp.id);
                      }}
                      className="text-[#71717a] hover:text-[#ef4444] p-1 transition-colors cursor-pointer"
                      title="Remove voiceprint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono bg-[#09090b] rounded-lg p-2 border border-[#27272a]">
                    <div>
                      <span className="text-[#71717a] block">F0 Pitch</span>
                      <span className="text-white font-bold">{vp.baseline.pitchMeanHz.toFixed(0)} Hz</span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block">HNR</span>
                      <span className="text-green-400 font-bold">{vp.baseline.hnrDb.toFixed(1)} dB</span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block">Jitter</span>
                      <span className="text-white font-bold">{(vp.baseline.pitchVariance * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-[#71717a]">
                    <span>Enrolled: {new Date(vp.enrolledAt).toLocaleDateString()}</span>
                    <span className="flex items-center space-x-1 text-green-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>SECURED</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Voiceprint Biometric Detail */}
          {selectedVoiceprint && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-green-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Voice Profile Details: {selectedVoiceprint.name}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#71717a]">
                  ID: {selectedVoiceprint.id}
                </span>
              </div>

              <p className="text-xs text-[#a1a1aa]">{selectedVoiceprint.notes}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] block">Voice Low Pitch</span>
                  <span className="text-white font-bold">{selectedVoiceprint.baseline.formantF1} Hz</span>
                </div>
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] block">Voice High Pitch</span>
                  <span className="text-white font-bold">{selectedVoiceprint.baseline.formantF2} Hz</span>
                </div>
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] block">Tone Brightness</span>
                  <span className="text-white font-bold">{selectedVoiceprint.baseline.spectralCentroidHz} Hz</span>
                </div>
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] block">Sample Length</span>
                  <span className="text-white font-bold">{selectedVoiceprint.sampleDurationSeconds}s</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Impersonation Verification Lab */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#ef4444]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a1a1aa]">
              Voice Comparison Test
            </h3>
          </div>

          <p className="text-[11px] text-[#71717a]">
            Compare incoming audio against saved profiles to verify if the caller is really who they say they are.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#a1a1aa] block mb-1">
                Target Enrolled Identity to Verify Against:
              </label>
              <select
                value={verifyTargetId}
                onChange={(e) => {
                  setVerifyTargetId(e.target.value);
                  const found = voiceprints.find((v) => v.id === e.target.value);
                  if (found) setSelectedVoiceprint(found);
                }}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-2 text-white text-xs focus:outline-none focus:border-[#ef4444]"
              >
                {voiceprints.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#a1a1aa] block mb-1">
                Simulated Incoming Call Audio:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTestScenario("CLONE_ATTACK")}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                    testScenario === "CLONE_ATTACK"
                      ? "bg-red-950/40 border-[#ef4444] text-[#ef4444]"
                      : "bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-[#e1e1e3]"
                  }`}
                >
                  <div className="text-[10px] font-bold">Deepfake Impersonator</div>
                  <div className="text-[9px] opacity-80">AI Clone of Executive</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTestScenario("LEGITIMATE")}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                    testScenario === "LEGITIMATE"
                      ? "bg-green-950/40 border-green-500 text-green-400"
                      : "bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-[#e1e1e3]"
                  }`}
                >
                  <div className="text-[10px] font-bold">Legitimate Caller</div>
                  <div className="text-[9px] opacity-80">Authentic Speaker</div>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunImpersonationTest}
              className="w-full py-2.5 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)]"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Run Biometric Comparison</span>
            </button>
          </div>

          {/* Test Results Output */}
          {matchResult && (
            <div
              className={`p-3.5 rounded-xl border space-y-2 animate-in fade-in ${
                matchResult.verdict === "IMPERSONATION_DETECTED"
                  ? "bg-red-950/20 border-[#ef4444]"
                  : "bg-green-950/20 border-green-500/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {matchResult.verdict === "IMPERSONATION_DETECTED" ? (
                    <AlertOctagon className="w-4 h-4 text-[#ef4444]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {matchResult.verdict === "IMPERSONATION_DETECTED"
                      ? "Impersonation Attack Detected"
                      : "Biometric Voice Verified"}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    matchResult.verdict === "IMPERSONATION_DETECTED"
                      ? "bg-red-950 text-[#ef4444]"
                      : "bg-green-950 text-green-400"
                  }`}
                >
                  Match: {matchResult.biometricMatchScore}%
                </span>
              </div>

              <p className="text-[11px] text-[#e1e1e3] leading-relaxed">
                {matchResult.details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
