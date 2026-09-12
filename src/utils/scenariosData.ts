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
  private currentNodes: (AudioNode | OscillatorNode)[] = [];
  private isMuted: boolean = false;
  private isEnabled: boolean = true;

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

  private initCtx(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.4;
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  getAudioDestination(): AudioNode | null {
    if (!this.audioCtx) this.initCtx();
    return this.masterGain;
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(mute ? 0 : 0.4, this.audioCtx?.currentTime || 0);
    }
  }

  playSpeechSegment(text: string, isSynthetic: boolean, onStart?: () => void, onEnd?: () => void): void {
    if (!this.isEnabled || this.isMuted) {
      onStart?.();
      setTimeout(() => onEnd?.(), 1000);
      return;
    }

    // Attempt browser Web Speech API for audible voice output
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = isSynthetic ? 1.08 : 0.96;
      utterance.pitch = isSynthetic ? 1.0 : 1.1;

      // Select voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (isSynthetic) {
          // Choose a slightly flatter or robotic sounding voice if available
          const roboticVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.lang.startsWith("en"));
          if (roboticVoice) utterance.voice = roboticVoice;
        } else {
          const warmVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Samantha") || v.lang.startsWith("en"));
          if (warmVoice) utterance.voice = warmVoice;
        }
      }

      utterance.onstart = () => onStart?.();
      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: Web Audio Tone burst to simulate speech cadence
      this.playAcousticBurst(isSynthetic, onStart, onEnd);
    }
  }

  playAcousticBurst(isSynthetic: boolean, onStart?: () => void, onEnd?: () => void) {
    const ctx = this.initCtx();
    onStart?.();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = isSynthetic ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(isSynthetic ? 160 : 180, ctx.currentTime);

    // Filter modeling: sharp vocoder lowpass vs natural warm resonance
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(isSynthetic ? 4500 : 8000, ctx.currentTime);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.2);

    osc.connect(filter);
    filter.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2.3);

    setTimeout(() => {
      onEnd?.();
    }, 2400);
  }

  stop(): void {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.currentNodes.forEach((node) => {
      try {
        if ("stop" in node && typeof (node as any).stop === "function") {
          (node as any).stop();
        }
        node.disconnect();
      } catch (e) {}
    });
    this.currentNodes = [];
  }
}
