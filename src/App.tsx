import { useState, useEffect, useRef, useCallback } from "react";
import { RealtimeAudioProcessor } from "./utils/audioAnalyzer";
import { ScenarioAudioSynthesizer, CALL_SCENARIOS } from "./utils/scenariosData";
import { runLocalForensics } from "./utils/localForensics";
import {
  AudioFeatures,
  ChunkAnalysis,
  CallScenario,
  RiskClassification,
  SessionAuditLog,
  UploadedAudioInfo,
  ActiveAppView,
  DefensePolicy,
  ThreatIncident,
} from "./types";
import { CallHeader } from "./components/CallHeader";
import { CoreProcessPipeline } from "./components/CoreProcessPipeline";
import { RunningRiskScoreGauge } from "./components/RunningRiskScoreGauge";
import { AudioVisualizer } from "./components/AudioVisualizer";
import { ThreatAnomalyPanel } from "./components/ThreatAnomalyPanel";
import { ProtectiveActionsBar } from "./components/ProtectiveActionsBar";
import { AuditLogDrawer } from "./components/AuditLogDrawer";
import { ForensicVoiceLab } from "./components/ForensicVoiceLab";
import { VoiceprintVault } from "./components/VoiceprintVault";
import { IncidentHistory } from "./components/IncidentHistory";
import { DefensePolicySettings } from "./components/DefensePolicySettings";
import { QuickStartCards } from "./components/QuickStartCards";
import { PlainEnglishVerdict } from "./components/PlainEnglishVerdict";
import { HowItWorksModal } from "./components/HowItWorksModal";
import { CyberBackground, CyberTheme } from "./components/CyberBackground";
import {
  Shield,
  Sparkles,
  AlertTriangle,
  Microscope,
  Fingerprint,
  FileText,
  Sliders,
  PhoneCall,
  PhoneOff,
  Activity,
  CheckCircle2,
  HelpCircle,
  Eye,
  Layers,
  Palette,
} from "lucide-react";

const cyberThemeOptions: Array<{
  id: CyberTheme;
  name: string;
  desc: string;
  colors: string[];
}> = [
  {
    id: "neon",
    name: "Neon Cyberpunk",
    desc: "Vibrant Cyan, Hot Pink & Deep Violet",
    colors: ["#00f0ff", "#ff007f", "#8b5cf6"],
  },
  {
    id: "aurora",
    name: "Cosmic Aurora",
    desc: "Luminous Emerald, Cyan & Royal Purple",
    colors: ["#10b981", "#06b6d4", "#a855f7"],
  },
  {
    id: "synthwave",
    name: "Synthwave Sunset",
    desc: "Neon Rose, Electric Amber & Violet",
    colors: ["#f43f5e", "#ec4899", "#f59e0b"],
  },
  {
    id: "matrix",
    name: "Quantum Matrix",
    desc: "Matrix Green, Cyber Mint & Aqua",
    colors: ["#10b981", "#34d399", "#06b6d4"],
  },
  {
    id: "solarflare",
    name: "Solar Flare",
    desc: "Blazing Amber, Solar Gold & Crimson Flare",
    colors: ["#f59e0b", "#ff5722", "#ef4444"],
  },
  {
    id: "deepocean",
    name: "Oceanic Abyss",
    desc: "Electric Aqua, Oceanic Sapphire & Deep Teal",
    colors: ["#00f0ff", "#0284c7", "#2563eb"],
  },
  {
    id: "amethyst",
    name: "Cosmic Nebula",
    desc: "Royal Violet, Electric Magenta & Lavender Glow",
    colors: ["#c084fc", "#ec4899", "#8b5cf6"],
  },
  {
    id: "crimson",
    name: "Crimson Sentinel",
    desc: "High-Alert Scarlet, Ruby Pulse & Cyber Coral",
    colors: ["#ef4444", "#dc2626", "#fb7185"],
  },
];

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<ActiveAppView>("SENTINEL");

  // Defense Policy Settings State
  const [defensePolicy, setDefensePolicy] = useState<DefensePolicy>(() => {
    const saved = localStorage.getItem("echo_voice_defense_policy");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          enableAutoTerminate: true,
          ...parsed,
        };
      } catch (_) {}
    }
    return {
      alertThreshold: 40,
      autoInterruptThreshold: 80,
      enableAutoMute: true,
      enableAutoTerminate: true,
      vocoderSensitivity: "BALANCED",
      audioBeepAlerts: true,
      webhookUrl: "https://soc-siem.enterprise.local/alerts/v1/voice-intercept",
    };
  });

  // Session & Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [activeScenario, setActiveScenario] = useState<CallScenario | null>(CALL_SCENARIOS[0]);
  const [uploadedAudio, setUploadedAudio] = useState<UploadedAudioInfo | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState<string>("");
  const [sentinelViewMode, setSentinelViewMode] = useState<"SIMPLE" | "EXPERT">("SIMPLE");
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Live Microphone & Surround Voice Recording State
  const [micVolumeDb, setMicVolumeDb] = useState<number>(-100);
  const [isMicSpeaking, setIsMicSpeaking] = useState<boolean>(false);
  const [recordedAudioInfo, setRecordedAudioInfo] = useState<{
    url: string;
    duration: number;
    blob: Blob;
    verdict: string;
    riskScore: number;
  } | null>(null);

  // Pipeline & Detection State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [runningRiskScore, setRunningRiskScore] = useState(14);
  const [classification, setClassification] = useState<RiskClassification>("GENUINE");
  const [confidence, setConfidence] = useState(0.92);
  const [recentChunks, setRecentChunks] = useState<ChunkAnalysis[]>([]);
  const [latestChunk, setLatestChunk] = useState<ChunkAnalysis | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);

  // Defense & Audit Logs State
  const [auditLogs, setAuditLogs] = useState<SessionAuditLog[]>([]);

  // Alert Banner State
  const [alertBanner, setAlertBanner] = useState<{
    show: boolean;
    title: string;
    message: string;
    severity: "warning" | "critical";
  } | null>(null);

  // Cyber Background Theme State
  const [cyberTheme, setCyberTheme] = useState<CyberTheme>(() => {
    const saved = localStorage.getItem("echo_voice_cyber_theme");
    return (saved as CyberTheme) || "neon";
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Audio Engine Refs
  const audioProcessorRef = useRef<RealtimeAudioProcessor | null>(null);
  const synthesizerRef = useRef<ScenarioAudioSynthesizer | null>(null);
  const chunkIndexRef = useRef(0);
  const sessionTokenRef = useRef(0);
  const scenarioSegmentIdxRef = useRef(0);
  const analysisIntervalRef = useRef<number | null>(null);
  const durationTimerRef = useRef<number | null>(null);
  const volumeMonitorRef = useRef<number | null>(null);
  const consecutiveCriticalChunksRef = useRef(0);
  const handleEndCallRef = useRef<((reasonArg?: unknown) => void) | null>(null);

  // Add an audit log entry
  const addAuditLog = useCallback(
    (
      type: SessionAuditLog["type"],
      title: string,
      description: string,
      severity: SessionAuditLog["severity"] = "info",
      riskAtTime: number = runningRiskScore
    ) => {
      const newLog: SessionAuditLog = {
        id: "log-" + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        type,
        severity,
        title,
        description,
        riskScoreAtTime: riskAtTime,
      };
      setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    },
    [runningRiskScore]
  );

  // Initialize Audio Processor singleton
  useEffect(() => {
    audioProcessorRef.current = new RealtimeAudioProcessor();
    synthesizerRef.current = new ScenarioAudioSynthesizer();

    addAuditLog(
      "CHUNK_ANALYSIS",
      "Detection Core Initialized",
      "VoiceClone Sentinel acoustic forensic engine primed with 13-bank MFCC extraction and vocoder analysis.",
      "info",
      12
    );

    return () => {
      audioProcessorRef.current?.stop();
      synthesizerRef.current?.stop();
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, []);

  // Call duration counter
  useEffect(() => {
    if (isCallActive) {
      durationTimerRef.current = window.setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      setCallDurationSeconds(0);
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [isCallActive]);

  // Analyze single audio chunk (Core Process step 0 -> 7)
  const processNextChunk = useCallback(async () => {
    if (!audioProcessorRef.current) return;

    const thisSession = sessionTokenRef.current;
    chunkIndexRef.current += 1;
    const currentChunkIdx = chunkIndexRef.current;

    // Step 0: Voice Input
    setCurrentStepIndex(0);

    // Step 1 & 2: Pre-processing & Feature Extraction
    const isSyntheticExplicit = activeScenario ? activeScenario.isSynthetic : undefined;
    let features: AudioFeatures;

    if (isMicActive || uploadedAudio) {
      features = audioProcessorRef.current.extractFeatures();
    } else if (activeScenario) {
      const segs = activeScenario.audioSegments;
      const seg = segs[scenarioSegmentIdxRef.current % segs.length];
      // In scenario mode, generate features matching the scenario's acoustic profile
      features = audioProcessorRef.current.createMockFeatures(activeScenario.isSynthetic, seg.acousticProfile);
    } else {
      features = audioProcessorRef.current.createMockFeatures(false);
    }

    setAudioFeatures(features);
    setCurrentStepIndex(2);

    // Determine current scenario text snippet if in scenario mode
    let snippet = "Active live audio stream";
    let callerName = "Live Microphone";

    if (uploadedAudio) {
      snippet = `Analyzing voice recording: "${uploadedAudio.name}"`;
      callerName = `Uploaded: ${uploadedAudio.name}`;
    } else if (isMicActive) {
      const vol = audioProcessorRef.current?.getLiveVolume();
      if (vol && vol.isSpeaking) {
        snippet = "Analyzing room speech harmonics & acoustic micro-tremors...";
      } else {
        snippet = "Listening to surrounding room audio... (Speak into microphone)";
      }
      callerName = "Live Room Microphone";
    } else if (activeScenario) {
      const segs = activeScenario.audioSegments;
      const seg = segs[scenarioSegmentIdxRef.current % segs.length];
      snippet = seg.text;
      callerName = activeScenario.callerName;
      scenarioSegmentIdxRef.current += 1;

      // Play sound via synthesizer if not muted
      synthesizerRef.current?.playSpeechSegment(seg.text, activeScenario.isSynthetic);
    }

    setActiveTranscript(snippet);

    // Step 3: AI/ML Detection
    setCurrentStepIndex(3);

    let analysis: ChunkAnalysis;

    try {
      const response = await fetch("/api/analyze-chunk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chunkIndex: currentChunkIdx,
          timestamp: Date.now(),
          durationMs: 2000,
          features,
          scenarioContext: {
            callerName,
            transcriptSnippet: snippet,
            isSynthetic: isSyntheticExplicit,
          },
          runningRiskScore,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        analysis = await response.json();
      } else {
        analysis = runLocalForensics(
          currentChunkIdx,
          features,
          { callerName, transcriptSnippet: snippet, isSynthetic: isSyntheticExplicit },
          runningRiskScore
        );
      }
    } catch (_fetchErr) {
      // Offline, network interruption, or server restart fallback
      analysis = runLocalForensics(
        currentChunkIdx,
        features,
        { callerName, transcriptSnippet: snippet, isSynthetic: isSyntheticExplicit },
        runningRiskScore
      );
    }

    // Drop stale results if session changed or ended while analysis was in flight
    if (sessionTokenRef.current !== thisSession) return;

    // Step 4: Risk Scoring (Smooth running weighted average)
    setCurrentStepIndex(4);
    setLatestChunk(analysis);
    setConfidence(analysis.confidence);
    setClassification(analysis.classification);

    const isCloneDetected =
      analysis.classification === "CLONED" ||
      (analysis.classification === "SUSPICIOUS" && analysis.riskScore >= 60) ||
      analysis.riskScore >= 70;

    // Smooth running risk calculation that tracks true acoustics
    setRunningRiskScore((prev) => {
      const weight = 0.50;
      const updated = Math.round(prev * (1 - weight) + analysis.riskScore * weight);
      return Math.max(10, Math.min(98, updated));
    });

    setRecentChunks((prev) => [...prev.slice(-14), analysis]);

    // Step 5: Alert Trigger based on Defense Policy Threshold
    if (isCloneDetected && analysis.riskScore >= defensePolicy.alertThreshold) {
      setCurrentStepIndex(5);
      setAlertBanner({
        show: true,
        title: analysis.riskScore >= defensePolicy.autoInterruptThreshold ? "CRITICAL: AI VOICE CLONE DETECTED" : "ELEVATED DEEPFAKE RISK",
        message: analysis.forensicNotes || "Abrupt spectral cutoff and absent micro-jitter detected.",
        severity: analysis.riskScore >= defensePolicy.autoInterruptThreshold ? "critical" : "warning",
      });

      addAuditLog(
        "ALERT_TRIGGERED",
        `Suspicious Voice Chunk #${currentChunkIdx}`,
        `Risk score surged to ${analysis.riskScore} pts. Classification: ${analysis.classification}.`,
        analysis.riskScore >= defensePolicy.autoInterruptThreshold ? "critical" : "warning",
        analysis.riskScore
      );

      // Auto-isolate channel if policy allows and threshold reached
      if (
        analysis.riskScore >= defensePolicy.autoInterruptThreshold &&
        defensePolicy.enableAutoMute &&
        !isMuted
      ) {
        handleToggleMute();
      }
    } else {
      setAlertBanner(null);
    }

    // Step 6: Prevent / Isolate (Active Defense recommendation)
    if (
      analysis.riskScore >= defensePolicy.autoInterruptThreshold ||
      analysis.actionRecommended === "TERMINATE_CALL" ||
      analysis.actionRecommended === "ISOLATE_AUDIO"
    ) {
      setCurrentStepIndex(6);
    }

    // Check if the current chunk presents a CRITICAL threat level
    const isCriticalRisk =
      analysis.riskScore >= 75 ||
      analysis.riskScore >= defensePolicy.autoInterruptThreshold ||
      analysis.classification === "CLONED";

    if (isCriticalRisk) {
      consecutiveCriticalChunksRef.current += 1;
    } else {
      consecutiveCriticalChunksRef.current = 0;
    }

    // Auto-Terminate feature in Defense Policy:
    // Automatically ends the call if a 'CRITICAL' risk score is maintained for more than 3 consecutive chunks
    if (
      defensePolicy.enableAutoTerminate &&
      consecutiveCriticalChunksRef.current > 3
    ) {
      addAuditLog(
        "INTERRUPT_TRIGGERED",
        "Auto-Terminate: Critical Threat Threshold Exceeded",
        `Defense Policy automatically terminated the call: CRITICAL deepfake risk score (${analysis.riskScore}%) was maintained for ${consecutiveCriticalChunksRef.current} consecutive audio chunks. Connection severed.`,
        "critical",
        analysis.riskScore
      );

      handleEndCallRef.current?.(
        `Active call automatically severed by Defense Policy: CRITICAL deepfake threat (${analysis.riskScore}% risk) sustained across ${consecutiveCriticalChunksRef.current} consecutive chunks.`
      );
      return;
    }
  }, [isMicActive, uploadedAudio, activeScenario, runningRiskScore, defensePolicy, isMuted, addAuditLog]);

  // Handle Voice Recording File Upload from Device
  const handleUploadAudioFile = async (file: File) => {
    try {
      if (!audioProcessorRef.current) {
        audioProcessorRef.current = new RealtimeAudioProcessor();
      }
      await audioProcessorRef.current.init();
      const buffer = await audioProcessorRef.current.decodeAudioFile(file);

      const info: UploadedAudioInfo = {
        file,
        name: file.name,
        size: file.size,
        durationSeconds: buffer.duration,
        sampleRate: buffer.sampleRate,
        channels: buffer.numberOfChannels,
        audioBuffer: buffer,
      };

      setUploadedAudio(info);
      setActiveScenario(null);
      setIsMicActive(false);

      addAuditLog(
        "CHUNK_ANALYSIS",
        "Voice Recording File Loaded",
        `Imported "${file.name}" (${(file.size / 1024).toFixed(0)} KB, ${buffer.duration.toFixed(1)}s, ${buffer.sampleRate}Hz). Click "Analyze Recording" to run full acoustic inspection.`,
        "info",
        15
      );

      // Automatically launch analysis stream of uploaded recording
      startUploadedAudioAnalysis(buffer, info.name);
    } catch (err: any) {
      console.warn("Failed to decode audio file:", err);
      setAlertBanner({
        show: true,
        title: "Audio Decoding Notice",
        message: "Could not decode this audio file. Please ensure it is a supported audio format (.wav, .mp3, .m4a, .ogg, .webm).",
        severity: "warning",
      });
    }
  };

  const startUploadedAudioAnalysis = (buffer: AudioBuffer, filename: string) => {
    sessionTokenRef.current += 1;
    consecutiveCriticalChunksRef.current = 0;
    setIsCallActive(true);
    setIsMicActive(false);
    chunkIndexRef.current = 0;
    setRecentChunks([]);
    setAlertBanner(null);

    // Check pre-analyzed features of uploaded file to set appropriate starting baseline
    const cached = audioProcessorRef.current?.getCachedBufferFeatures();
    const isSyntheticInitial = cached
      ? (cached.pitchVariance < 0.020 && cached.highFreqEnergyRatio < 0.035)
      : false;
    const initialRisk = isSyntheticInitial ? 86 : 14;

    setRunningRiskScore(initialRisk);
    setClassification(isSyntheticInitial ? "CLONED" : "GENUINE");

    // Play buffer into analysis pipeline
    audioProcessorRef.current?.playBuffer(buffer, () => {
      addAuditLog(
        "CHUNK_ANALYSIS",
        "Playback & Stream Finished",
        `Voice recording "${filename}" completed forensic streaming cycle.`,
        "info",
        runningRiskScore
      );
    });

    addAuditLog(
      "CHUNK_ANALYSIS",
      "Analysis Session Started",
      `Analyzing voice recording "${filename}". Real-time feature extraction & forensic evaluation engaged.`,
      "info",
      initialRisk
    );

    // Warm-up delay to allow audio playback node to fill frequency buffers
    setTimeout(() => {
      processNextChunk();
    }, 200);

    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    analysisIntervalRef.current = window.setInterval(() => {
      processNextChunk();
    }, 2000);
  };

  const handleStartUploadedCall = () => {
    if (uploadedAudio?.audioBuffer) {
      startUploadedAudioAnalysis(uploadedAudio.audioBuffer, uploadedAudio.name);
    }
  };

  const handleClearUploadedAudio = () => {
    handleEndCall();
    setUploadedAudio(null);
    setActiveScenario(CALL_SCENARIOS[0]);
  };

  // Start Scenario Call
  const handleStartScenarioCall = async (scenario: CallScenario) => {
    sessionTokenRef.current += 1;
    consecutiveCriticalChunksRef.current = 0;
    setActiveScenario(scenario);
    setUploadedAudio(null);
    setIsMicActive(false);
    setIsCallActive(true);
    chunkIndexRef.current = 0;
    scenarioSegmentIdxRef.current = 0;
    setRecentChunks([]);
    setAlertBanner(null);

    // Clear any previous uploaded file cache
    audioProcessorRef.current?.clearCachedBufferFeatures();

    // Initial baseline risk
    const baseline = scenario.isSynthetic ? 86 : 13;
    setRunningRiskScore(baseline);
    setClassification(scenario.isSynthetic ? "CLONED" : "GENUINE");

    // Init processor
    await audioProcessorRef.current?.init();

    addAuditLog(
      "CHUNK_ANALYSIS",
      `Call Started: ${scenario.title}`,
      `Monitoring active session for caller ${scenario.callerName} (${scenario.callerPhone}). Expected profile: ${scenario.isSynthetic ? "AI Clone Threat" : "Authentic Human"}.`,
      "info",
      baseline
    );

    // Run first chunk with a short warm-up delay, then start interval
    setTimeout(() => {
      processNextChunk();
    }, 150);

    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    analysisIntervalRef.current = window.setInterval(() => {
      processNextChunk();
    }, 2800);
  };

  // Start Live Microphone Call
  const handleStartMicCall = async () => {
    try {
      // Explicitly disable any synthetic audio playback so only real ambient mic is heard
      synthesizerRef.current?.setEnabled(false);
      synthesizerRef.current?.stop();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      await audioProcessorRef.current?.init(stream);
      audioProcessorRef.current?.clearCachedBufferFeatures();
      audioProcessorRef.current?.startRecording();

      sessionTokenRef.current += 1;
      consecutiveCriticalChunksRef.current = 0;
      setIsMicActive(true);
      setIsCallActive(true);
      setActiveScenario(null);
      setUploadedAudio(null);
      chunkIndexRef.current = 0;
      setRecentChunks([]);
      setAlertBanner(null);
      const initialScore = 12;
      setRunningRiskScore(initialScore);
      setClassification("GENUINE");

      addAuditLog(
        "CHUNK_ANALYSIS",
        "Live Room Microphone Recording Started",
        "Listening to room audio and surrounding voices. Real-time neural vocal tract and synthetic artifact detection active.",
        "info",
        initialScore
      );

      // Start volume monitor loop for live visual VU meter
      if (volumeMonitorRef.current) clearInterval(volumeMonitorRef.current);
      volumeMonitorRef.current = window.setInterval(() => {
        if (audioProcessorRef.current) {
          const vol = audioProcessorRef.current.getLiveVolume();
          setMicVolumeDb(vol.db);
          setIsMicSpeaking(vol.isSpeaking);
        }
      }, 80);

      // Warm-up delay to allow microphone input to reach analyser node
      setTimeout(() => {
        processNextChunk();
      }, 200);

      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = window.setInterval(() => {
        processNextChunk();
      }, 2200);
    } catch (err: any) {
      console.warn("Microphone access note:", err);
      setAlertBanner({
        show: true,
        title: "Microphone Access Required",
        message: "Please allow microphone access in your browser so EchoVoice can record surrounding voices and detect AI voice clones.",
        severity: "warning",
      });
    }
  };

  // End Call
  const handleEndCall = (reasonArg?: unknown) => {
    const terminationReason = typeof reasonArg === "string" ? reasonArg : undefined;
    sessionTokenRef.current += 1;
    consecutiveCriticalChunksRef.current = 0;
    setIsCallActive(false);

    // Stop volume monitoring
    if (volumeMonitorRef.current) {
      clearInterval(volumeMonitorRef.current);
      volumeMonitorRef.current = null;
    }
    setMicVolumeDb(-100);
    setIsMicSpeaking(false);

    // If live microphone was recording, finalize recorded audio blob for user review & playback
    if (isMicActive && audioProcessorRef.current) {
      const recordedBlob = audioProcessorRef.current.stopRecording();
      if (recordedBlob && recordedBlob.size > 0) {
        const url = URL.createObjectURL(recordedBlob);
        const duration = Math.max(1, callDurationSeconds);
        setRecordedAudioInfo({
          url,
          duration,
          blob: recordedBlob,
          verdict: classification,
          riskScore: runningRiskScore,
        });
        addAuditLog(
          "CALL_SESSION",
          "Surrounding Audio Recording Saved",
          `Captured ${duration}s of live room voice audio. Final detection verdict: ${classification} (${runningRiskScore}% risk score).`,
          runningRiskScore >= 70 ? "critical" : "info",
          runningRiskScore
        );
      }
    }

    setIsMicActive(false);
    setActiveTranscript("");
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    audioProcessorRef.current?.stopBuffer();
    audioProcessorRef.current?.stop();
    synthesizerRef.current?.stop();
    // Re-enable synthesizer in case user switches to simulated scenarios
    synthesizerRef.current?.setEnabled(true);
    setRecentChunks([]);

    if (terminationReason) {
      setAlertBanner({
        show: true,
        title: "CALL TERMINATED: SUSTAINED CRITICAL THREAT",
        message: terminationReason,
        severity: "critical",
      });
    } else {
      setAlertBanner(null);
    }

    // Save incident to local storage audit archive
    const newIncident: ThreatIncident = {
      id: "INC-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000),
      timestamp: Date.now(),
      sourceType: uploadedAudio ? "DEVICE_UPLOAD" : isMicActive ? "LIVE_CALL" : "SCENARIO_SIM",
      callerName: uploadedAudio
        ? `Uploaded: ${uploadedAudio.name}`
        : isMicActive
        ? "Live Device Microphone"
        : activeScenario?.callerName || "Unknown Caller",
      callerPhone: uploadedAudio
        ? "Local Audio File"
        : isMicActive
        ? "Local Mic Stream"
        : activeScenario?.callerPhone || "N/A",
      durationSeconds: callDurationSeconds || 6,
      peakRiskScore: runningRiskScore,
      finalVerdict: classification,
      actionTaken: terminationReason
        ? "AUTO_TERMINATED_CRITICAL_THREAT"
        : isMuted
        ? "AUDIO_ISOLATED_MUTED"
        : runningRiskScore >= 70
        ? "FLAGGED_DEEPFAKE_INTERCEPTED"
        : "CLEARED_GENUINE",
      confidence,
      anomaliesDetected: (latestChunk?.indicators || [])
        .filter((i) => i.detectedAnomaly)
        .map((i) => i.name),
      chunksAnalyzedCount: recentChunks.length || 1,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("echo_voice_incidents") || "[]");
      localStorage.setItem("echo_voice_incidents", JSON.stringify([newIncident, ...existing.slice(0, 49)]));
    } catch (_) {}

    addAuditLog(
      "ACTION_ENFORCED",
      terminationReason ? "Call Auto-Terminated by Defense Policy" : "Call Terminated & Logged",
      terminationReason ||
        `Call session ended. Final running risk score: ${runningRiskScore}/100. Peak classification: ${classification}. Saved to Incident Archive.`,
      terminationReason ? "critical" : "info",
      runningRiskScore
    );

    setRunningRiskScore(14);
    setClassification("GENUINE");
  };

  handleEndCallRef.current = handleEndCall;

  const handleUpdatePolicy = (newPolicy: DefensePolicy) => {
    setDefensePolicy(newPolicy);
    localStorage.setItem("echo_voice_defense_policy", JSON.stringify(newPolicy));
    addAuditLog(
      "MANUAL_INTERVENTION",
      "Defense Policy Updated",
      `Risk thresholds: Alert=${newPolicy.alertThreshold}%, Auto-Mute=${newPolicy.autoInterruptThreshold}%.`,
      "info",
      runningRiskScore
    );
  };

  // Toggle Mute Audio
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    synthesizerRef.current?.setMute(next);
    audioProcessorRef.current?.setOutputMute(next);

    addAuditLog(
      "ACTION_ENFORCED",
      next ? "Audio Muted & Isolated" : "Audio Unmuted",
      next
        ? "Caller stream silenced to prevent social engineering while acoustic telemetry continues."
        : "Caller stream audio restored.",
      "warning",
      runningRiskScore
    );
  };

  // Manual Threat Flag
  const handleFlagThreat = () => {
    addAuditLog(
      "MANUAL_INTERVENTION",
      "Manual Anomaly Flagged",
      "Operator flagged audio chunk as suspicious. Raised incident audit priority.",
      "warning",
      Math.max(runningRiskScore, 75)
    );
    setRunningRiskScore((prev) => Math.max(prev, 75));
    setClassification("SUSPICIOUS");
    setAlertBanner({
      show: true,
      title: "MANUALLY FLAGGED ANOMALY",
      message: "Operator flagged caller stream for high-priority forensic examination.",
      severity: "warning",
    });
  };

  // Export Evidence Dossier
  const handleExportEvidence = () => {
    const report = {
      reportId: "REP-" + Date.now(),
      generatedAt: new Date().toISOString(),
      callerProfile: {
        name: uploadedAudio
          ? `Device Audio: ${uploadedAudio.name}`
          : isMicActive
          ? "Live Device Mic"
          : activeScenario?.callerName,
        phone: uploadedAudio
          ? `File: ${uploadedAudio.name} (${uploadedAudio.durationSeconds.toFixed(1)}s, ${uploadedAudio.sampleRate}Hz)`
          : isMicActive
          ? "Local Mic Stream"
          : activeScenario?.callerPhone,
        scenario: uploadedAudio
          ? "Custom Device Audio Upload"
          : activeScenario?.title || "Custom Mic Capture",
      },
      forensics: {
        runningRiskScore,
        peakClassification: classification,
        confidence,
        recentChunksAnalyzed: recentChunks.length,
        chunks: recentChunks,
        acousticFeaturesSample: audioFeatures,
      },
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `echo-voice-forensic-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addAuditLog(
      "MANUAL_INTERVENTION",
      "Forensic Evidence Dossier Exported",
      "Complete acoustic and telemetry package downloaded for fraud compliance review.",
      "info",
      runningRiskScore
    );
  };

  return (
    <div className="relative min-h-screen text-[#e1e1e3] flex flex-col font-sans selection:bg-[#ef4444]/30 selection:text-white">
      {/* Dynamic Cyber & Colorful Sci-Fi Background with Interactive Audio Nodes */}
      <CyberBackground theme={cyberTheme} interactive={true} />

      {/* Top Navbar with Multi-Page Navigation */}
      <header className="border-b border-cyan-500/20 bg-[#060a17]/80 backdrop-blur-xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <div
              onClick={() => setCurrentView("SENTINEL")}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-8 h-8 bg-[#ef4444] rounded-sm flex items-center justify-center rotate-45 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <div className="w-3.5 h-3.5 bg-white rounded-full -rotate-45"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight uppercase text-[#e1e1e3]">
                  Echo <span className="text-[#ef4444]">Voice</span>
                </span>
                <span className="hidden lg:inline-block text-[10px] uppercase tracking-widest bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  AI Clone Detector
                </span>
              </div>
            </div>

            {/* Middle Nav Tabs (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { id: "SENTINEL" as const, label: "Live Call", icon: Shield },
                { id: "FORENSIC_LAB" as const, label: "Audio Lab", icon: Microscope },
                { id: "VOICEPRINTS" as const, label: "Saved Voices", icon: Fingerprint },
                { id: "INCIDENTS" as const, label: "Call History", icon: FileText },
                { id: "POLICY" as const, label: "Safety Rules", icon: Sliders },
              ].map((tab) => {
                const isActive = currentView === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCurrentView(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-950/40 text-white border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#181d2e]/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ef4444]" : ""}`} />
                    <span>{tab.label}</span>
                    {tab.id === "SENTINEL" && isCallActive && (
                      <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse ml-1"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Status, Theme Picker & Guide Button */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
              {/* Cyber Theme Selector Dropdown */}
              <div className="relative" ref={themeMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#12172a]/90 hover:bg-[#1e2746] text-[#e1e1e3] font-semibold text-xs flex items-center space-x-1.5 transition-all cursor-pointer border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  title="Change Cyber Background Theme"
                >
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline font-mono text-[11px]">Cyber Theme</span>
                  <div className="flex items-center -space-x-1">
                    {cyberThemeOptions.find((t) => t.id === cyberTheme)?.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full ring-1 ring-[#060a17]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isThemeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-[#080d1f]/95 border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-2 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold border-b border-cyan-500/20 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>Cyber Theme</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                          {cyberThemeOptions.length}
                        </span>
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    </div>
                    <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
                      {cyberThemeOptions.map((opt) => {
                        const isSelected = cyberTheme === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setCyberTheme(opt.id);
                              localStorage.setItem("echo_voice_cyber_theme", opt.id);
                              setIsThemeMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-cyan-950/60 border border-cyan-500/50 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                                : "hover:bg-[#12172a] text-[#a1a1aa] hover:text-white"
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{opt.name}</span>
                                {isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#71717a] line-clamp-1">{opt.desc}</div>
                            </div>
                            <div className="flex items-center -space-x-1 pl-2 shrink-0">
                              {opt.colors.map((color, idx) => (
                                <span
                                  key={idx}
                                  className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#12172a]/90 hover:bg-[#1e2746] text-[#e1e1e3] font-semibold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#27272a]"
                title="How voice clone detection works"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#ef4444]" />
                <span className="hidden sm:inline">How It Works</span>
              </button>

              <div className="flex items-center gap-2 text-cyan-400 font-mono">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                <span className="hidden sm:inline">Cyber Online</span>
              </div>
              <div className="h-6 w-[1px] bg-cyan-500/20 hidden sm:block"></div>
              <div className="text-cyan-400/80 font-mono text-[11px] hidden sm:block">
                SYS: <span className="text-[#e1e1e3]">EV-8842</span>
              </div>
            </div>
          </div>

          {/* Mobile Nav Tabs Scrollable Strip */}
          <div className="md:hidden flex items-center space-x-1 pb-2.5 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: "SENTINEL" as const, label: "Live Call", icon: Shield },
              { id: "FORENSIC_LAB" as const, label: "Audio Lab", icon: Microscope },
              { id: "VOICEPRINTS" as const, label: "Saved Voices", icon: Fingerprint },
              { id: "INCIDENTS" as const, label: "Call History", icon: FileText },
              { id: "POLICY" as const, label: "Safety Rules", icon: Sliders },
            ].map((tab) => {
              const isActive = currentView === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCurrentView(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#27272a] text-white border border-[#3f3f46]"
                      : "text-[#a1a1aa] hover:text-white bg-[#18181b]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ef4444]" : ""}`} />
                  <span>{tab.label}</span>
                  {tab.id === "SENTINEL" && isCallActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5 relative z-10">
        {/* Background Active Call Pill if user navigated away from Sentinel */}
        {isCallActive && currentView !== "SENTINEL" && (
          <div className="bg-[#18181b] border border-[#ef4444]/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-in fade-in">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse shrink-0"></span>
              <div className="text-xs">
                <span className="font-bold text-white">Call Monitoring Running in Background: </span>
                <span className="text-[#a1a1aa] font-mono">
                  {uploadedAudio ? uploadedAudio.name : isMicActive ? "Live Device Microphone" : activeScenario?.callerName} •{" "}
                  Risk: <span className="text-[#ef4444] font-bold">{runningRiskScore}% ({classification})</span> • {callDurationSeconds}s
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setCurrentView("SENTINEL")}
                className="px-3 py-1.5 bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Return to Live Call</span>
              </button>
              <button
                type="button"
                onClick={handleEndCall}
                className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                End Call
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: ACTIVE LIVE SENTINEL RADAR */}
        {currentView === "SENTINEL" && (
          <div className="space-y-5 animate-in fade-in">
            {/* Threat Alert Banner */}
            {alertBanner && alertBanner.show && (
              <div
                className={`p-4 rounded-xl border flex items-start space-x-3.5 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  alertBanner.severity === "critical"
                    ? "bg-[#18181b] border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.15)] text-[#e1e1e3]"
                    : "bg-[#18181b] border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.1)] text-[#e1e1e3]"
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alertBanner.severity === "critical" ? "text-[#ef4444] animate-pulse" : "text-amber-400"
                  }`}
                />
                <div className="flex-1">
                  <div className="font-bold text-xs uppercase tracking-widest text-[#ef4444] mb-0.5">
                    {alertBanner.title}
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    {alertBanner.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isCallActive ? (
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#e1e1e3] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {isMuted ? "Unmute" : "Mute Stream"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAlertBanner(null)}
                      className="px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#e1e1e3] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Test Starter Cards */}
            <QuickStartCards
              isCallActive={isCallActive}
              isMicActive={isMicActive}
              activeScenario={activeScenario}
              uploadedAudio={uploadedAudio}
              onStartScenarioCall={handleStartScenarioCall}
              onStartMicCall={handleStartMicCall}
              onUploadAudioFile={handleUploadAudioFile}
              onEndCall={handleEndCall}
              onOpenHelp={() => setIsHowItWorksOpen(true)}
            />

            {/* 1. Call Header & Simulation Controller */}
            <CallHeader
              isCallActive={isCallActive}
              activeScenario={activeScenario}
              uploadedAudio={uploadedAudio}
              isMicActive={isMicActive}
              callDurationSeconds={callDurationSeconds}
              onStartScenarioCall={handleStartScenarioCall}
              onStartMicCall={handleStartMicCall}
              onStartUploadedCall={handleStartUploadedCall}
              onUploadAudioFile={handleUploadAudioFile}
              onClearUploadedAudio={handleClearUploadedAudio}
              onEndCall={handleEndCall}
              riskScore={runningRiskScore}
              activeTranscript={activeTranscript}
              onOpenHelp={() => setIsHowItWorksOpen(true)}
              micVolumeDb={micVolumeDb}
              isMicSpeaking={isMicSpeaking}
              recordedAudioInfo={recordedAudioInfo}
              onClearRecordedAudio={() => setRecordedAudioInfo(null)}
            />

            {/* Plain-English Live Verdict Card */}
            <PlainEnglishVerdict
              isCallActive={isCallActive}
              score={runningRiskScore}
              classification={classification}
              confidence={confidence}
              latestChunk={latestChunk}
              callerName={activeScenario?.callerName}
              onTerminateCall={handleEndCall}
              onToggleMute={handleToggleMute}
              isMuted={isMuted}
            />

            {/* View Mode Switcher: Plain English vs Detailed View */}
            <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
              <div className="text-xs text-[#a1a1aa] font-medium">
                {sentinelViewMode === "SIMPLE" ? (
                  <span>Showing simple, easy-to-understand voice check and verdict.</span>
                ) : (
                  <span>Showing detailed sound waves and frequency bands.</span>
                )}
              </div>
              <div className="flex items-center bg-[#18181b] p-1 rounded-lg border border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setSentinelViewMode("SIMPLE")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    sentinelViewMode === "SIMPLE"
                      ? "bg-[#27272a] text-white shadow-sm"
                      : "text-[#a1a1aa] hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#ef4444]" />
                  <span>Simple View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSentinelViewMode("EXPERT")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    sentinelViewMode === "EXPERT"
                      ? "bg-[#27272a] text-white shadow-sm"
                      : "text-[#a1a1aa] hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#ef4444]" />
                  <span>Detailed View</span>
                </button>
              </div>
            </div>

            {/* 2. Core Process Pipeline */}
            <CoreProcessPipeline
              currentStepIndex={currentStepIndex}
              riskScore={runningRiskScore}
              classification={classification}
              isCallActive={isCallActive}
            />

            {/* 3. Primary Dash: Running Risk Gauge + Real-Time Acoustic Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Gauge Widget (4 cols) */}
              <div className="lg:col-span-4">
                <RunningRiskScoreGauge
                  score={runningRiskScore}
                  classification={classification}
                  confidence={confidence}
                  recentChunks={recentChunks}
                  isCallActive={isCallActive}
                />
              </div>

              {/* Audio Visualizer (8 cols) */}
              <div className="lg:col-span-8">
                <AudioVisualizer
                  analyser={audioProcessorRef.current?.getAnalyser() || null}
                  features={audioFeatures}
                  isCallActive={isCallActive}
                  isSyntheticScenario={activeScenario?.isSynthetic}
                />
              </div>
            </div>

            {/* 4. Threat Anomaly Breakdown & Protective Actions Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Threat Anomaly Panel (7 cols or hidden in simple mode if preferred, or shown in forensic mode) */}
              {sentinelViewMode === "EXPERT" ? (
                <div className="lg:col-span-7">
                  <ThreatAnomalyPanel
                    latestChunk={latestChunk}
                    isCallActive={isCallActive}
                  />
                </div>
              ) : (
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#18181b] border border-[#27272a] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        How To Tell If A Voice Is An AI Clone
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsHowItWorksOpen(true)}
                        className="text-xs text-[#ef4444] hover:underline font-semibold"
                      >
                        Read Full Guide →
                      </button>
                    </div>
                    <div className="space-y-2.5 text-xs text-[#a1a1aa] leading-relaxed">
                      <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#27272a]">
                        <strong className="text-white block mb-0.5">1. Listen for Natural Pauses & Breathing:</strong>
                        AI clone generators string words together evenly without having to take breaths. Human speakers naturally pause to inhale.
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#27272a]">
                        <strong className="text-white block mb-0.5">2. Watch for Flat Emotional Tone:</strong>
                        Neural voice generators can sound expressive, but their pitch variations are mathematically smoothed and lack nervous vocal cord micro-tremors.
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#27272a]">
                        <strong className="text-white block mb-0.5">3. If In Doubt, Ask a Personal Secret:</strong>
                        Scammers using AI clones cannot answer unexpected questions about private shared memories. Always verify before sending funds.
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#27272a] flex items-center justify-between text-[11px] text-[#71717a]">
                    <span>Need deeper sound metrics?</span>
                    <button
                      type="button"
                      onClick={() => setSentinelViewMode("EXPERT")}
                      className="text-white hover:text-[#ef4444] font-semibold cursor-pointer underline"
                    >
                      Switch to Detailed View
                    </button>
                  </div>
                </div>
              )}

              {/* Protective Actions Bar (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <ProtectiveActionsBar
                  isCallActive={isCallActive}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  onFlagThreat={handleFlagThreat}
                  onTerminateCall={handleEndCall}
                  onExportEvidence={handleExportEvidence}
                  riskScore={runningRiskScore}
                  recentChunks={recentChunks}
                />

                {/* Quick Context Card */}
                <div className="mt-4 p-4 rounded-xl bg-[#18181b] border border-[#27272a] text-xs text-[#a1a1aa] space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#e1e1e3]">
                    How Live Protection Works
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                    Echo Voice checks the caller's pitch, tone, and breath patterns every 2 seconds. If robotic AI voice patterns are detected, the danger score rises and safety actions (like muting or ending the call) are triggered automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Chronological Forensic Audit Trail */}
            <AuditLogDrawer
              logs={auditLogs}
              onClearLogs={() => setAuditLogs([])}
            />
          </div>
        )}

        {/* VIEW 2: FORENSIC AUDIO LAB */}
        {currentView === "FORENSIC_LAB" && (
          <div className="animate-in fade-in">
            <ForensicVoiceLab />
          </div>
        )}

        {/* VIEW 3: VOICEPRINT BIOMETRIC VAULT */}
        {currentView === "VOICEPRINTS" && (
          <div className="animate-in fade-in">
            <VoiceprintVault
              liveAudioFeatures={audioFeatures}
              isCallActive={isCallActive}
              activeScenario={activeScenario}
              latestChunk={latestChunk}
            />
          </div>
        )}

        {/* VIEW 4: INCIDENT ARCHIVE & AUDIT LEDGER */}
        {currentView === "INCIDENTS" && (
          <div className="animate-in fade-in">
            <IncidentHistory />
          </div>
        )}

        {/* VIEW 5: DEFENSE POLICY RULES & SETTINGS */}
        {currentView === "POLICY" && (
          <div className="animate-in fade-in">
            <DefensePolicySettings
              policy={defensePolicy}
              onUpdatePolicy={handleUpdatePolicy}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-[#060a17]/80 backdrop-blur-xl py-4 text-center text-xs text-[#a1a1aa] font-mono relative z-10">
        Echo Voice • Real-Time Voice Clone & Deepfake Mitigation System
      </footer>

      {/* Educational & Quick-Start Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onQuickTestAI={() => {
          setIsHowItWorksOpen(false);
          setCurrentView("SENTINEL");
          handleStartScenarioCall(CALL_SCENARIOS[0]);
        }}
        onQuickTestHuman={() => {
          setIsHowItWorksOpen(false);
          setCurrentView("SENTINEL");
          handleStartScenarioCall(CALL_SCENARIOS[3]);
        }}
      />
    </div>
  );
}
