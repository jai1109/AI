import { CallScenario } from "../types";

export const CALL_SCENARIOS: CallScenario[] = [
  {
    id: "ceo-deepfake-wire",
    title: "Executive Impersonation (CEO Wire Scam)",
    subtitle: "AI Voice Clone targeted social engineering attack",
    callerName: "David Harrison (CEO)",
    callerPhone: "+1 (415) 555-0199 [Spoofed]",
    callerRole: "Executive / C-Suite",
    isSynthetic: true,
    avatarIcon: "Briefcase",
    riskLevelTarget: 94,
    scenarioDescription: "Attacker trained a zero-shot voice clone on the CEO's quarterly earnings webcast. Calls the finance controller to demand an urgent $420k confidential wire transfer.",
    audioSegments: [
      {
        durationMs: 2500,
        text: "Hey Mark, it's David. I'm at JFK airport about to board the flight to Zurich.",
        acousticProfile: {
          pitchBase: 135,
          jitterVariance: 0.009,
          spectralCutoff: 4800,
          vocoderNoise: 0.38,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
      {
        durationMs: 3000,
        text: "We have an emergency with the Frankfurt acquisition escrow. The legal team needs four hundred twenty thousand dollars wired right now.",
        acousticProfile: {
          pitchBase: 138,
          jitterVariance: 0.011,
          spectralCutoff: 4600,
          vocoderNoise: 0.44,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
      {
        durationMs: 2800,
        text: "Do not message Slack or call back, my phone is on one percent battery. Just send the confirmation to my personal email immediately.",
        acousticProfile: {
          pitchBase: 136,
          jitterVariance: 0.008,
          spectralCutoff: 4500,
          vocoderNoise: 0.46,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
    ],
  },
  {
    id: "grandchild-emergency",
    title: "Family Emergency Kidnapping / Bail Scam",
    subtitle: "Emotional AI clone targeting grandparents",
    callerName: "Liam (Grandson)",
    callerPhone: "+1 (617) 555-0143",
    callerRole: "Family Member",
    isSynthetic: true,
    avatarIcon: "HeartHandshake",
    riskLevelTarget: 91,
    scenarioDescription: "A 3-second TikTok video was scraped to clone the grandson's voice. Simulates a panicked distress call claiming a car crash and urgent bail demand.",
    audioSegments: [
      {
        durationMs: 2600,
        text: "Grandma, please don't be mad at me... I got into a really bad car accident.",
        acousticProfile: {
          pitchBase: 215,
          jitterVariance: 0.012,
          spectralCutoff: 5100,
          vocoderNoise: 0.35,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
      {
        durationMs: 2900,
        text: "They took me to the precinct. The public defender says I need five thousand dollars for bond right away.",
        acousticProfile: {
          pitchBase: 220,
          jitterVariance: 0.014,
          spectralCutoff: 4900,
          vocoderNoise: 0.42,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
      {
        durationMs: 2500,
        text: "Please don't call Mom or Dad, they'll disown me. The officer is handing me the wire payment details.",
        acousticProfile: {
          pitchBase: 218,
          jitterVariance: 0.01,
          spectralCutoff: 4700,
          vocoderNoise: 0.48,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
    ],
  },
  {
    id: "bank-fraud-robocall",
    title: "Bank Security Neural Robocaller",
    subtitle: "AI voice agent impersonating fraud prevention",
    callerName: "Chase Security Alert",
    callerPhone: "1-800-935-9935 [Verified Spoof]",
    callerRole: "Financial Security",
    isSynthetic: true,
    avatarIcon: "ShieldAlert",
    riskLevelTarget: 87,
    scenarioDescription: "Synthesized neural conversational agent impersonating bank security to extract two-factor authentication SMS codes verbally.",
    audioSegments: [
      {
        durationMs: 2400,
        text: "This is an urgent security notification from the Chase Fraud Prevention Department.",
        acousticProfile: {
          pitchBase: 175,
          jitterVariance: 0.007,
          spectralCutoff: 5500,
          vocoderNoise: 0.3,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
      {
        durationMs: 2800,
        text: "A suspicious transaction of nine hundred eighty dollars was initiated from Miami, Florida.",
        acousticProfile: {
          pitchBase: 174,
          jitterVariance: 0.008,
          spectralCutoff: 5300,
          vocoderNoise: 0.34,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
      {
        durationMs: 2700,
        text: "To decline this charge, please state the six-digit verification passcode sent to your device now.",
        acousticProfile: {
          pitchBase: 176,
          jitterVariance: 0.006,
          spectralCutoff: 5200,
          vocoderNoise: 0.36,
          breathPauses: false,
          syntheticRoboticFormants: true,
        },
      },
    ],
  },
  {
    id: "mother-sunday-dinner",
    title: "Family Member Call (Authentic Voice)",
    subtitle: "Genuine human vocal tract with natural breathing",
    callerName: "Eleanor (Mother)",
    callerPhone: "+1 (206) 555-0812",
    callerRole: "Family Member",
    isSynthetic: false,
    avatarIcon: "UserCheck",
    riskLevelTarget: 14,
    scenarioDescription: "Authentic call from a family member. Exhibits natural glottal jitter, organic breathing inhalation cycles, and high-frequency harmonic extension.",
    audioSegments: [
      {
        durationMs: 2700,
        text: "Hi sweetie! Just wanted to check if you're coming over for dinner this Sunday.",
        acousticProfile: {
          pitchBase: 195,
          jitterVariance: 0.065,
          spectralCutoff: 8200,
          vocoderNoise: 0.08,
          breathPauses: true,
          syntheticRoboticFormants: false,
        },
      },
      {
        durationMs: 2800,
        text: "I found that apple pie recipe grandma used to make, and your brother is bringing the salad.",
        acousticProfile: {
          pitchBase: 192,
          jitterVariance: 0.072,
          spectralCutoff: 8400,
          vocoderNoise: 0.06,
          breathPauses: true,
          syntheticRoboticFormants: false,
        },
      },
      {
        durationMs: 2400,
        text: "No rush at all, just let me know before tomorrow afternoon. Love you!",
        acousticProfile: {
          pitchBase: 198,
          jitterVariance: 0.068,
          spectralCutoff: 8300,
          vocoderNoise: 0.07,
          breathPauses: true,
          syntheticRoboticFormants: false,
        },
      },
    ],
  },
  {
    id: "colleague-sync",
    title: "Work Colleague Sync (Authentic Voice)",
    subtitle: "Authentic human coworker discussion",
    callerName: "Sarah Jenkins (Engineering)",
    callerPhone: "+1 (408) 555-0922",
    callerRole: "Coworker",
    isSynthetic: false,
    avatarIcon: "Users",
    riskLevelTarget: 16,
    scenarioDescription: "Colleague calling about a project sprint review. Displays normal conversational pauses, acoustic room reverberance, and non-quantized prosody.",
    audioSegments: [
      {
        durationMs: 2600,
        text: "Hey! When you have a moment, take a quick peek at the pull request on GitHub.",
        acousticProfile: {
          pitchBase: 180,
          jitterVariance: 0.058,
          spectralCutoff: 8100,
          vocoderNoise: 0.09,
          breathPauses: true,
          syntheticRoboticFormants: false,
        },
      },
      {
        durationMs: 2700,
        text: "We reworked the database connection pool so we don't run into that latency bottleneck we saw earlier.",
        acousticProfile: {
          pitchBase: 178,
          jitterVariance: 0.062,
          spectralCutoff: 8300,
          vocoderNoise: 0.08,
          breathPauses: true,
          syntheticRoboticFormants: false,
        },
      },
      {
        durationMs: 2500,
        text: "I'll be at my desk until five, so feel free to ping me or jump into the huddle. Thanks!",
        acousticProfile: {
          pitchBase: 182,
          jitterVariance: 0.064,
          spectralCutoff: 8200,
          vocoderNoise: 0.07,
          breathPauses: true,
          syntheticRoboticFormants: false,
        },
      },
    ],
  },
];

// Audio synthesizer helper to play audible synthetic or human-modeled acoustic sound
export class ScenarioAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private targetAnalyser: AnalyserNode | null = null;
  private currentNodes: (AudioNode | OscillatorNode)[] = [];
  private isMuted: boolean = false;
  private isEnabled: boolean = true;
  private speechTimeout: number | null = null;

  constructor() {
    // Lazy init on first user interaction
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  getIsEnabled(): boolean {
    return this.isEnabled;
  }

  init(externalCtx?: AudioContext, targetAnalyser?: AnalyserNode): AudioContext {
    if (externalCtx) {
      this.audioCtx = externalCtx;
    } else if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }

    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }

    if (targetAnalyser) {
      this.targetAnalyser = targetAnalyser;
    }

    if (!this.masterGain && this.audioCtx) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.35;
      // Connect to speakers for audible sound
      this.masterGain.connect(this.audioCtx.destination);
      // Connect to analyser so AudioVisualizer and spectrum see real acoustic data
      if (this.targetAnalyser) {
        try {
          this.masterGain.connect(this.targetAnalyser);
        } catch (_) {}
      }
    } else if (this.masterGain && this.targetAnalyser) {
      try {
        this.masterGain.connect(this.targetAnalyser);
      } catch (_) {}
    }

    return this.audioCtx;
  }

  getAudioDestination(): AudioNode | null {
    if (!this.audioCtx) this.init();
    return this.masterGain;
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(mute ? 0 : 0.35, this.audioCtx.currentTime);
    }
  }

  playSpeechSegment(
    text: string,
    isSynthetic: boolean,
    profile?: { pitchBase: number; spectralCutoff: number; vocoderNoise: number },
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (!this.isEnabled || this.isMuted) {
      onStart?.();
      setTimeout(() => onEnd?.(), 1500);
      return;
    }

    const ctx = this.init();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Stop previous sounds
    this.stopCurrentOscillators();
    onStart?.();

    const now = ctx.currentTime;
    const duration = 2.4;

    // 1. Root Pitch Oscillator (F0)
    const osc1 = ctx.createOscillator();
    const pitch = profile?.pitchBase || (isSynthetic ? 142 : 188);
    osc1.frequency.setValueAtTime(pitch, now);

    if (isSynthetic) {
      // Neural vocoder signature: harsh sawtooth, sharp harmonic quantization
      osc1.type = "sawtooth";
      // Subtle robotic step quantization
      const stepLfo = ctx.createOscillator();
      const stepGain = ctx.createGain();
      stepLfo.type = "square";
      stepLfo.frequency.setValueAtTime(2.2, now);
      stepGain.gain.setValueAtTime(2.5, now);
      stepLfo.connect(osc1.frequency);
      stepLfo.start(now);
      stepLfo.stop(now + duration);
      this.currentNodes.push(stepLfo, stepGain);
    } else {
      // Authentic human: warm triangle wave with natural biological micro-jitter
      osc1.type = "triangle";
      const jitterLfo = ctx.createOscillator();
      const jitterGain = ctx.createGain();
      jitterLfo.type = "sine";
      jitterLfo.frequency.setValueAtTime(5.6, now);
      jitterGain.gain.setValueAtTime(8.0, now);
      jitterLfo.connect(osc1.frequency);
      jitterLfo.start(now);
      jitterLfo.stop(now + duration);
      this.currentNodes.push(jitterLfo, jitterGain);
    }

    // 2. Harmonic Formant Oscillator (F1 vocal tract resonance)
    const osc2 = ctx.createOscillator();
    osc2.type = isSynthetic ? "square" : "sine";
    osc2.frequency.setValueAtTime(pitch * 1.5, now);

    // 3. Formant Bandpass & Lowpass Filter Chain
    const formantFilter = ctx.createBiquadFilter();
    formantFilter.type = "bandpass";
    formantFilter.frequency.setValueAtTime(isSynthetic ? 750 : 620, now);
    formantFilter.Q.setValueAtTime(isSynthetic ? 3.8 : 2.0, now);

    const cutoffFilter = ctx.createBiquadFilter();
    cutoffFilter.type = "lowpass";
    const cutoffFreq = profile?.spectralCutoff || (isSynthetic ? 4600 : 8800);
    cutoffFilter.frequency.setValueAtTime(cutoffFreq, now);
    cutoffFilter.Q.setValueAtTime(isSynthetic ? 2.8 : 0.7, now);

    // 4. Syllabic Cadence Envelope (Simulates spoken words cadence)
    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0.001, now);
    // Syllable 1
    envGain.gain.exponentialRampToValueAtTime(0.24, now + 0.12);
    envGain.gain.exponentialRampToValueAtTime(0.08, now + 0.55);
    // Syllable 2
    envGain.gain.exponentialRampToValueAtTime(0.22, now + 0.75);
    envGain.gain.exponentialRampToValueAtTime(0.06, now + 1.25);
    // Syllable 3
    envGain.gain.exponentialRampToValueAtTime(0.25, now + 1.45);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Connect audio graph
    osc1.connect(formantFilter);
    osc2.connect(formantFilter);
    formantFilter.connect(cutoffFilter);
    cutoffFilter.connect(envGain);

    if (this.masterGain) {
      envGain.connect(this.masterGain);
    }

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    this.currentNodes.push(osc1, osc2, formantFilter, cutoffFilter, envGain);

    // 5. In addition, speak text via SpeechSynthesis API if available
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = isSynthetic ? 1.08 : 0.96;
        utterance.pitch = isSynthetic ? 0.92 : 1.08;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          if (isSynthetic) {
            const rob = voices.find(v => v.lang.startsWith("en") && (v.name.includes("David") || v.name.includes("Male") || v.name.includes("Google")));
            if (rob) utterance.voice = rob;
          } else {
            const warm = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Natural")));
            if (warm) utterance.voice = warm;
          }
        }
        window.speechSynthesis.speak(utterance);
      }
    } catch (_) {}

    if (this.speechTimeout) clearTimeout(this.speechTimeout);
    this.speechTimeout = window.setTimeout(() => {
      onEnd?.();
    }, 2500);
  }

  private stopCurrentOscillators(): void {
    this.currentNodes.forEach((node) => {
      try {
        if ("stop" in node && typeof (node as any).stop === "function") {
          (node as any).stop();
        }
        node.disconnect();
      } catch (_) {}
    });
    this.currentNodes = [];
  }

  stop(): void {
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (_) {}
    this.stopCurrentOscillators();
  }
}
