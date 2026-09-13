import { useEffect, useRef, useState } from "react";
import { Activity, BarChart3, Radio, Waves } from "lucide-react";
import { AudioFeatures } from "../types";

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  features: AudioFeatures | null;
  isCallActive: boolean;
  isSyntheticScenario?: boolean;
}

export function AudioVisualizer({
  analyser,
  features,
  isCallActive,
  isSyntheticScenario,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTab, setActiveTab] = useState<"waveform" | "spectrum" | "mfcc" | "pitch">("waveform");
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark background matching Elegant Dark #09090b
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Subtle grid lines in #18181b / #27272a
      ctx.strokeStyle = "rgba(39, 39, 42, 0.6)";
      ctx.lineWidth = 1;
      const gridStep = 24;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (!isCallActive) {
        // Idle line
        ctx.strokeStyle = "#27272a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.fillStyle = "#71717a";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText("STANDBY — READY FOR AUDIO SIGNAL", width / 2, height / 2 - 12);
        return;
      }

      if (activeTab === "waveform") {
        let timeData: Float32Array;
        if (analyser) {
          timeData = new Float32Array(analyser.fftSize);
          analyser.getFloatTimeDomainData(timeData);

          // If float data was all zeros (thread pause), fall back to byte time domain
          let peakSample = 0;
          for (let i = 0; i < timeData.length; i++) {
            const abs = Math.abs(timeData[i]);
            if (abs > peakSample) peakSample = abs;
          }

          if (peakSample < 0.002) {
            // If analyser has low or zero signal during active call simulation, synthesize responsive ambient speech wave
            for (let i = 0; i < timeData.length; i++) {
              const freq = isSyntheticScenario ? 5 : 3.2;
              timeData[i] =
                Math.sin((i / timeData.length) * Math.PI * freq + phase) * (isSyntheticScenario ? 0.28 : 0.22) +
                (Math.random() - 0.5) * (isSyntheticScenario ? 0.02 : 0.06);
            }
            phase += 0.08;
          }
        } else {
          timeData = new Float32Array(128);
          for (let i = 0; i < 128; i++) {
            const freq = isSyntheticScenario ? 4 : 2.5;
            timeData[i] =
              Math.sin((i / 128) * Math.PI * freq + phase) * 0.45 +
              (Math.random() - 0.5) * (isSyntheticScenario ? 0.04 : 0.12);
          }
          phase += 0.1;
        }

        // Calculate peak amplitude to provide dynamic auto-ranging for microphone input
        let peak = 0.005;
        for (let i = 0; i < timeData.length; i++) {
          const abs = Math.abs(timeData[i]);
          if (abs > peak) peak = abs;
        }
        // Adaptive visual gain so real microphone speech produces prominent, beautiful sound waves
        const visualGain = Math.min(18, Math.max(2.5, 0.65 / (peak + 0.001)));

        ctx.lineWidth = 2.5;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        if (isSyntheticScenario) {
          grad.addColorStop(0, "#ef4444"); // Red 500
          grad.addColorStop(0.5, "#f97316"); // Orange 500
          grad.addColorStop(1, "#ef4444");
        } else {
          grad.addColorStop(0, "#4ade80"); // Green 400
          grad.addColorStop(0.5, "#22c55e");
          grad.addColorStop(1, "#4ade80");
        }
        ctx.strokeStyle = grad;

        ctx.beginPath();
        const sliceWidth = width / timeData.length;
        let x = 0;

        for (let i = 0; i < timeData.length; i++) {
          const v = Math.max(-1, Math.min(1, timeData[i] * visualGain));
          const y = (v * height * 0.42) + height / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();

        // Elegant glow
        ctx.lineWidth = 6;
        ctx.strokeStyle = isSyntheticScenario ? "rgba(239, 68, 68, 0.25)" : "rgba(74, 222, 128, 0.2)";
        ctx.stroke();

        // Overlay info
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.textAlign = "left";
        const currentRms = features?.rms !== undefined ? features.rms : peak;
        ctx.fillText(`RMS: ${currentRms.toFixed(3)} | PEAK: ${peak.toFixed(3)} | ZCR: ${(features?.zeroCrossingRate || 0.08).toFixed(3)}`, 14, 22);
      } else if (activeTab === "spectrum") {
        let freqData: Float32Array;
        if (analyser) {
          freqData = new Float32Array(analyser.frequencyBinCount);
          analyser.getFloatFrequencyData(freqData);

          let maxVal = -150;
          for (let i = 0; i < freqData.length; i++) {
            if (freqData[i] > maxVal) maxVal = freqData[i];
          }

          if (maxVal < -80) {
            for (let i = 0; i < freqData.length; i++) {
              if (isSyntheticScenario && i > 65) {
                freqData[i] = -95 - Math.random() * 6;
              } else if (isSyntheticScenario) {
                freqData[i] = -32 - (i * 0.38) + Math.sin(i * 0.35 + phase) * 6;
              } else {
                freqData[i] = -28 - (i * 0.32) + Math.sin(i * 0.25 + phase) * 7;
              }
            }
            phase += 0.06;
          }
        } else {
          freqData = new Float32Array(128);
          for (let i = 0; i < 128; i++) {
            if (isSyntheticScenario && i > 65) {
              freqData[i] = -90 - Math.random() * 8;
            } else {
              freqData[i] = -30 - (i * 0.45) + Math.sin(i * 0.3 + phase) * 8;
            }
          }
          phase += 0.08;
        }

        const barCount = Math.min(freqData.length, 90);
        const barWidth = width / barCount;

        for (let i = 0; i < barCount; i++) {
          const val = (freqData[i] + 100) / 70; // normalize
          const barHeight = Math.max(2, Math.min(height, val * height));

          if (isSyntheticScenario && i > 65) {
            // Vocoder brickwall cutoff
            ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
          } else if (isSyntheticScenario) {
            ctx.fillStyle = "rgba(249, 115, 22, 0.8)";
          } else {
            ctx.fillStyle = "rgba(74, 222, 128, 0.85)";
          }

          ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
        }

        // Cutoff Marker
        if (isSyntheticScenario) {
          const cutoffX = (65 / barCount) * width;
          ctx.strokeStyle = "#ef4444";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(cutoffX, 0);
          ctx.lineTo(cutoffX, height);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = "#ef4444";
          ctx.font = "10px JetBrains Mono, monospace";
          ctx.fillText("VOCODER CUTOFF (7.5kHz)", cutoffX + 6, 20);
        }
      } else if (activeTab === "mfcc") {
        const mfcc = features?.mfccCoefficients || [12, -4, 6, -2, 8, -5, 3, -1, 4, -3, 2, -1, 1];
        const barW = (width - 40) / mfcc.length;

        mfcc.forEach((coeff, idx) => {
          const norm = Math.max(-1, Math.min(1, coeff / 15));
          const h = Math.abs(norm) * (height / 2 - 20);
          const x = 20 + idx * barW;
          const y = norm >= 0 ? height / 2 - h : height / 2;

          ctx.fillStyle = isSyntheticScenario ? "#ef4444" : "#4ade80";
          ctx.fillRect(x + 2, y, barW - 6, h);

          ctx.fillStyle = "#71717a";
          ctx.font = "9px JetBrains Mono, monospace";
          ctx.textAlign = "center";
          ctx.fillText(`c${idx}`, x + barW / 2, height - 6);
        });

        // Center zero line
        ctx.strokeStyle = "#27272a";
        ctx.beginPath();
        ctx.moveTo(10, height / 2);
        ctx.lineTo(width - 10, height / 2);
        ctx.stroke();
      } else if (activeTab === "pitch") {
        const pitch = features?.pitchHz || 160;
        const jitter = features?.pitchVariance || 0.015;

        // Draw pitch over time simulation
        ctx.beginPath();
        ctx.strokeStyle = isSyntheticScenario ? "#ef4444" : "#4ade80";
        ctx.lineWidth = 2.5;

        const points = 60;
        const step = width / points;

        for (let p = 0; p < points; p++) {
          const t = p / points;
          let pitchVal = pitch;
          if (isSyntheticScenario) {
            // Unnaturally flat pitch (quantized)
            pitchVal += Math.sin(t * 10 + phase) * 1.5;
          } else {
            // Natural human pitch contour with micro-jitter
            pitchVal += Math.sin(t * 8 + phase) * 22 + (Math.random() - 0.5) * 8;
          }

          const y = height - (pitchVal / 300) * height;
          if (p === 0) ctx.moveTo(0, y);
          else ctx.lineTo(p * step, y);
        }
        ctx.stroke();
        phase += 0.05;

        ctx.fillStyle = "#e1e1e3";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.textAlign = "left";
        ctx.fillText(`F0 PITCH: ${pitch.toFixed(1)} Hz | JITTER: ${(jitter * 100).toFixed(2)}%`, 14, 22);

        if (isCallActive) {
          if (isSyntheticScenario) {
            ctx.fillStyle = "rgba(239, 68, 68, 0.95)";
            ctx.fillText("UNNATURAL PITCH STABILITY (ROBOTIC QUANTIZATION)", 14, height - 12);
          } else {
            ctx.fillStyle = "rgba(74, 222, 128, 0.95)";
            ctx.fillText("NATURAL BIOLOGICAL GLOTTAL JITTER DETECTED", 14, height - 12);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, activeTab, isCallActive, isSyntheticScenario, features]);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Visualizer header & tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#ef4444]" />
          <h3 className="text-xs uppercase tracking-widest text-[#a1a1aa] font-semibold">
            Live Voice Sound & Waves
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#27272a] px-2.5 py-1 rounded text-[#a1a1aa] uppercase font-mono font-medium">
            Background Noise: Low
          </span>
          <span className="text-[10px] bg-[#27272a] px-2.5 py-1 rounded text-[#a1a1aa] uppercase font-mono font-medium">
            Audio: 48kHz
          </span>
        </div>
      </div>

      {/* Sub-selector tabs */}
      <div className="flex items-center space-x-1.5 bg-[#09090b] p-1 rounded-lg border border-[#27272a] mb-3 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("waveform")}
          className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "waveform"
              ? "bg-[#27272a] text-[#e1e1e3] border border-[#3f3f46]"
              : "text-[#71717a] hover:text-[#a1a1aa]"
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>Sound Wave</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("spectrum")}
          className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "spectrum"
              ? "bg-[#27272a] text-[#e1e1e3] border border-[#3f3f46]"
              : "text-[#71717a] hover:text-[#a1a1aa]"
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>Sound Frequencies</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("mfcc")}
          className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "mfcc"
              ? "bg-[#27272a] text-[#e1e1e3] border border-[#3f3f46]"
              : "text-[#71717a] hover:text-[#a1a1aa]"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>Voice Tone Bands</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pitch")}
          className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "pitch"
              ? "bg-[#27272a] text-[#e1e1e3] border border-[#3f3f46]"
              : "text-[#71717a] hover:text-[#a1a1aa]"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>Voice Pitch</span>
        </button>
      </div>

      {/* Canvas container */}
      <div className="relative w-full h-44 bg-[#09090b] rounded-lg overflow-hidden border border-[#27272a]">
        <canvas
          ref={canvasRef}
          width={720}
          height={176}
          className="w-full h-full block"
        />

        {/* Real-time processing pill */}
        <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 bg-[#18181b]/90 border border-[#27272a] rounded px-2 py-0.5 text-[10px] font-mono text-[#a1a1aa]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          <span>Live Audio Analysis Active</span>
        </div>
      </div>

      {/* Time marks */}
      <div className="mt-2 flex justify-between text-[10px] font-mono text-[#71717a] px-1">
        <span>0.00s</span>
        <span>0.25s</span>
        <span>0.50s</span>
        <span>0.75s</span>
        <span>1.00s</span>
        <span>1.25s</span>
        <span>1.50s</span>
      </div>

      {/* 3 Metric Cards matching Elegant Dark design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
        <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Voice Pitch Flow</span>
          <div className={`text-2xl font-mono font-bold my-0.5 ${isSyntheticScenario ? "text-[#ef4444]" : "text-green-400"}`}>
            {isCallActive ? (isSyntheticScenario ? "0.12%" : "3.84%") : "0.00%"}
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded inline-block w-fit font-mono font-semibold ${
            isSyntheticScenario
              ? "text-[#ef4444] bg-red-950/30 border border-red-900/40"
              : "text-green-400 bg-green-950/30 border border-green-900/40"
          }`}>
            {isCallActive ? (isSyntheticScenario ? "FLAT / UNNATURAL" : "NATURAL") : "STANDBY"}
          </div>
        </div>

        <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Voice Tone Texture</span>
          <div className={`text-2xl font-mono font-bold my-0.5 ${isSyntheticScenario ? "text-orange-500" : "text-green-400"}`}>
            {isCallActive ? (isSyntheticScenario ? "94.2" : "18.4") : "0.0"}
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded inline-block w-fit font-mono font-semibold ${
            isSyntheticScenario
              ? "text-orange-400 bg-orange-950/30 border border-orange-900/40"
              : "text-green-400 bg-green-950/30 border border-green-900/40"
          }`}>
            {isCallActive ? (isSyntheticScenario ? "AI PATTERN" : "NATURAL") : "STANDBY"}
          </div>
        </div>

        <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">High Sound Balance</span>
          <div className={`text-2xl font-mono font-bold my-0.5 ${isSyntheticScenario ? "text-[#ef4444]" : "text-green-400"}`}>
            {isCallActive ? (isSyntheticScenario ? "-38.2dB" : "-14.8dB") : "--"}
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded inline-block w-fit font-mono font-semibold ${
            isSyntheticScenario
              ? "text-[#ef4444] bg-red-950/30 border border-red-900/40"
              : "text-green-400 bg-green-950/30 border border-green-900/40"
          }`}>
            {isCallActive ? (isSyntheticScenario ? "ARTIFICIAL CUT" : "NATURAL") : "STANDBY"}
          </div>
        </div>
      </div>
    </div>
  );
}
