export interface AudioFeatures {
  rms: number; // 0.0 to 1.0
  zeroCrossingRate: number; // 0.0 to 1.0
  pitchHz: number; // e.g. 80 to 500 Hz
  pitchConfidence: number; // 0.0 to 1.0
  pitchVariance: number; // measure of natural micro-jitter vs synthetic quantization
  spectralCentroid: number; // in Hz
  spectralFlatness: number; // 0 (tonal/harmonic) to 1 (pure noise)
  spectralRolloff: number; // Hz below which 85% energy resides
  highFreqEnergyRatio: number; // ratio of energy >8kHz (often missing in TTS vocoders)
  mfccCoefficients: number[]; // 13 MFCC features
  harmonicToNoiseRatio: number; // dB approx
  biologicalBreathingScore: number; // 0.0 to 1.0 likelihood of natural respiratory pauses
}

export type RiskClassification = 'GENUINE' | 'SUSPICIOUS' | 'CLONED';
export type RecommendedAction = 'ALLOW' | 'MONITOR' | 'ISOLATE_AUDIO' | 'FLAG_SUSPICIOUS' | 'TERMINATE_CALL';

export interface ForensicIndicator {
  id: string;
  name: string;
  category: 'ACOUSTIC' | 'PROSODY' | 'VOCODER' | 'LINGUISTIC';
  severity: 'low' | 'medium' | 'high';
  score: number; // 0 - 100
  description: string;
  detectedAnomaly: boolean;
}

export interface ChunkAnalysis {
  chunkIndex: number;
  timestamp: number;
  durationMs: number;
  riskScore: number; // 0 - 100
  runningAverageRisk: number; // 0 - 100
  classification: RiskClassification;
  confidence: number; // 0.0 - 1.0
  transcriptSnippet?: string;
  indicators: ForensicIndicator[];
  forensicNotes: string;
  actionRecommended: RecommendedAction;
  acousticMetrics: {
    pitchJitterNorm: number;
    vocoderArtifactScore: number;
    spectralCutoffDetected: boolean;
    biologicalBreathingDetected: boolean;
    mfccDistanceScore: number;
  };
}

export interface CallScenario {
  id: string;
  title: string;
  subtitle: string;
  callerName: string;
  callerPhone: string;
  callerRole: string;
  isSynthetic: boolean;
  avatarIcon: string;
  scenarioDescription: string;
  riskLevelTarget: number; // expected risk (e.g. 15 for genuine, 92 for CEO wire clone)
  audioSegments: {
    durationMs: number;
    text: string;
    acousticProfile: {
      pitchBase: number;
      jitterVariance: number;
      spectralCutoff: number;
      vocoderNoise: number;
      breathPauses: boolean;
      syntheticRoboticFormants: boolean;
    };
  }[];
}

export interface SessionAuditLog {
  id: string;
  timestamp: number;
  type: 'CHUNK_ANALYSIS' | 'ALERT_TRIGGERED' | 'ACTION_ENFORCED' | 'MANUAL_INTERVENTION';
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  description: string;
  riskScoreAtTime: number;
}

export interface UploadedAudioInfo {
  file: File;
  name: string;
  size: number;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  audioBuffer?: AudioBuffer;
}

export interface EnrolledVoiceprint {
  id: string;
  name: string;
  role: string;
  enrolledAt: string;
  avatarColor: string;
  baseline: {
    pitchMeanHz: number;
    pitchVariance: number;
    spectralCentroidHz: number;
    hnrDb: number;
    formantF1: number;
    formantF2: number;
    mfccCentroid: number[];
  };
  sampleDurationSeconds: number;
  notes: string;
}

export interface ThreatIncident {
  id: string;
  timestamp: number;
  sourceType: 'LIVE_CALL' | 'DEVICE_UPLOAD' | 'SCENARIO_SIM';
  callerName: string;
  callerPhone: string;
  durationSeconds: number;
  peakRiskScore: number;
  finalVerdict: RiskClassification;
  actionTaken: string;
  confidence: number;
  anomaliesDetected: string[];
  chunksAnalyzedCount: number;
}

export interface DefensePolicy {
  alertThreshold: number; // e.g. 40
  autoInterruptThreshold: number; // e.g. 80
  enableAutoMute: boolean;
  enableAutoTerminate: boolean;
  vocoderSensitivity: 'LOW' | 'BALANCED' | 'HIGH';
  audioBeepAlerts: boolean;
  webhookUrl: string;
}

export type ActiveAppView = 'SENTINEL' | 'FORENSIC_LAB' | 'VOICEPRINTS' | 'INCIDENTS' | 'POLICY';

