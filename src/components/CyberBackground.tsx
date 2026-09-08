import React, { useEffect, useRef, useState } from "react";

export type CyberTheme =
  | "neon"
  | "aurora"
  | "synthwave"
  | "matrix"
  | "solarflare"
  | "deepocean"
  | "amethyst"
  | "crimson";

interface CyberBackgroundProps {
  theme?: CyberTheme;
  interactive?: boolean;
}

export function CyberBackground({
  theme = "neon",
  interactive = true,
}: CyberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  // Track mouse coordinates for interactive cyber spotlight
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive]);

  // Canvas-based cyber particles & digital nodes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate cyber nodes (representing voice frequency data packets)
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseColor: string;
      glowColor: string;
      pulsePhase: number;
    }> = [];

    // Theme color palettes
    const palette = {
      neon: {
        nodes: ["#00f0ff", "#ff007f", "#8b5cf6", "#38bdf8"],
        glow: "rgba(0, 240, 255, 0.4)",
        lineColor: "rgba(0, 240, 255, 0.12)",
      },
      aurora: {
        nodes: ["#10b981", "#06b6d4", "#a855f7", "#3b82f6"],
        glow: "rgba(16, 185, 129, 0.4)",
        lineColor: "rgba(6, 182, 212, 0.12)",
      },
      synthwave: {
        nodes: ["#f43f5e", "#ec4899", "#f59e0b", "#8b5cf6"],
        glow: "rgba(244, 63, 94, 0.4)",
        lineColor: "rgba(236, 72, 153, 0.12)",
      },
      matrix: {
        nodes: ["#10b981", "#34d399", "#06b6d4", "#059669"],
        glow: "rgba(16, 185, 129, 0.4)",
        lineColor: "rgba(16, 185, 129, 0.12)",
      },
      solarflare: {
        nodes: ["#f59e0b", "#ff5722", "#eab308", "#ef4444"],
        glow: "rgba(245, 158, 11, 0.45)",
        lineColor: "rgba(245, 158, 11, 0.14)",
      },
      deepocean: {
        nodes: ["#00f0ff", "#0284c7", "#2563eb", "#14b8a6"],
        glow: "rgba(0, 240, 255, 0.4)",
        lineColor: "rgba(2, 132, 199, 0.14)",
      },
      amethyst: {
        nodes: ["#c084fc", "#ec4899", "#8b5cf6", "#e879f9"],
        glow: "rgba(192, 132, 252, 0.4)",
        lineColor: "rgba(139, 92, 246, 0.14)",
      },
      crimson: {
        nodes: ["#ef4444", "#dc2626", "#fb7185", "#f97316"],
        glow: "rgba(239, 68, 68, 0.45)",
        lineColor: "rgba(239, 68, 68, 0.14)",
      },
    }[theme];

    for (let i = 0; i < particleCount; i++) {
      const color = palette.nodes[i % palette.nodes.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.2,
        baseColor: color,
        glowColor: color,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines between close cyber nodes
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = palette.lineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw cyber nodes with pulsating glow
      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interaction with mouse cursor
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180 && mdist > 0) {
            const push = (1 - mdist / 180) * 0.4;
            p.x -= (mdx / mdist) * push;
            p.y -= (mdy / mdist) * push;
          }
        }

        const pulse = Math.sin(time + p.pulsePhase) * 0.5 + 1;
        const currentRadius = p.radius * pulse;

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor.startsWith("#")
          ? `${p.glowColor}25`
          : "rgba(0, 240, 255, 0.15)";
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Dynamic theme gradients & accent glows
  const themeGradients = {
    neon: {
      bgBase: "bg-[#050814]",
      blob1: "from-[#00f0ff]/20 via-[#0284c7]/15 to-transparent",
      blob2: "from-[#ff007f]/18 via-[#ec4899]/12 to-transparent",
      blob3: "from-[#8b5cf6]/22 via-[#6366f1]/15 to-transparent",
      blob4: "from-[#06b6d4]/15 to-transparent",
      gridColor: "rgba(0, 240, 255, 0.05)",
      gridAccent: "rgba(255, 0, 127, 0.08)",
      mouseGlow: "rgba(0, 240, 255, 0.14)",
      horizonColor: "rgba(0, 240, 255, 0.2)",
    },
    aurora: {
      bgBase: "bg-[#040d1a]",
      blob1: "from-[#10b981]/22 via-[#059669]/15 to-transparent",
      blob2: "from-[#06b6d4]/20 via-[#0284c7]/14 to-transparent",
      blob3: "from-[#a855f7]/20 via-[#7c3aed]/12 to-transparent",
      blob4: "from-[#3b82f6]/18 to-transparent",
      gridColor: "rgba(16, 185, 129, 0.05)",
      gridAccent: "rgba(6, 182, 212, 0.08)",
      mouseGlow: "rgba(16, 185, 129, 0.14)",
      horizonColor: "rgba(6, 182, 212, 0.2)",
    },
    synthwave: {
      bgBase: "bg-[#0e071e]",
      blob1: "from-[#f43f5e]/22 via-[#e11d48]/15 to-transparent",
      blob2: "from-[#ec4899]/20 via-[#db2777]/12 to-transparent",
      blob3: "from-[#f59e0b]/18 via-[#d97706]/10 to-transparent",
      blob4: "from-[#8b5cf6]/20 to-transparent",
      gridColor: "rgba(244, 63, 94, 0.06)",
      gridAccent: "rgba(236, 72, 153, 0.08)",
      mouseGlow: "rgba(244, 63, 94, 0.15)",
      horizonColor: "rgba(244, 63, 94, 0.25)",
    },
    matrix: {
      bgBase: "bg-[#02100d]",
      blob1: "from-[#10b981]/24 via-[#059669]/16 to-transparent",
      blob2: "from-[#34d399]/18 via-[#059669]/12 to-transparent",
      blob3: "from-[#06b6d4]/18 via-[#0891b2]/12 to-transparent",
      blob4: "from-[#14b8a6]/16 to-transparent",
      gridColor: "rgba(16, 185, 129, 0.06)",
      gridAccent: "rgba(52, 211, 153, 0.08)",
      mouseGlow: "rgba(16, 185, 129, 0.16)",
      horizonColor: "rgba(16, 185, 129, 0.25)",
    },
    solarflare: {
      bgBase: "bg-[#140804]",
      blob1: "from-[#f59e0b]/24 via-[#d97706]/16 to-transparent",
      blob2: "from-[#ff5722]/22 via-[#ea580c]/14 to-transparent",
      blob3: "from-[#eab308]/20 via-[#ca8a04]/12 to-transparent",
      blob4: "from-[#ef4444]/18 to-transparent",
      gridColor: "rgba(245, 158, 11, 0.06)",
      gridAccent: "rgba(255, 87, 34, 0.08)",
      mouseGlow: "rgba(245, 158, 11, 0.16)",
      horizonColor: "rgba(245, 158, 11, 0.25)",
    },
    deepocean: {
      bgBase: "bg-[#020a1a]",
      blob1: "from-[#0284c7]/25 via-[#0369a1]/16 to-transparent",
      blob2: "from-[#00f0ff]/22 via-[#0891b2]/14 to-transparent",
      blob3: "from-[#2563eb]/22 via-[#1d4ed8]/14 to-transparent",
      blob4: "from-[#14b8a6]/18 to-transparent",
      gridColor: "rgba(2, 132, 199, 0.06)",
      gridAccent: "rgba(0, 240, 255, 0.08)",
      mouseGlow: "rgba(0, 240, 255, 0.15)",
      horizonColor: "rgba(0, 240, 255, 0.22)",
    },
    amethyst: {
      bgBase: "bg-[#0d051c]",
      blob1: "from-[#8b5cf6]/24 via-[#7c3aed]/16 to-transparent",
      blob2: "from-[#ec4899]/20 via-[#db2777]/14 to-transparent",
      blob3: "from-[#c084fc]/22 via-[#a855f7]/12 to-transparent",
      blob4: "from-[#e879f9]/18 to-transparent",
      gridColor: "rgba(139, 92, 246, 0.06)",
      gridAccent: "rgba(236, 72, 153, 0.08)",
      mouseGlow: "rgba(192, 132, 252, 0.16)",
      horizonColor: "rgba(192, 132, 252, 0.25)",
    },
    crimson: {
      bgBase: "bg-[#140408]",
      blob1: "from-[#ef4444]/25 via-[#b91c1c]/16 to-transparent",
      blob2: "from-[#fb7185]/20 via-[#f43f5e]/14 to-transparent",
      blob3: "from-[#f97316]/20 via-[#ea580c]/12 to-transparent",
      blob4: "from-[#dc2626]/18 to-transparent",
      gridColor: "rgba(239, 68, 68, 0.06)",
      gridAccent: "rgba(251, 113, 133, 0.08)",
      mouseGlow: "rgba(239, 68, 68, 0.16)",
      horizonColor: "rgba(239, 68, 68, 0.25)",
    },
  }[theme];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${themeGradients.bgBase} transition-colors duration-1000`}
    >
      {/* 1. Cyber Ambient Glowing Blobs / Plasma Aura */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top-left vibrant cyber glow */}
        <div
          className={`absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br ${themeGradients.blob1} blur-[120px] opacity-90 animate-pulse`}
          style={{ animationDuration: "8s" }}
        />

        {/* Top-right cyber glow */}
        <div
          className={`absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-bl ${themeGradients.blob2} blur-[110px] opacity-85 animate-pulse`}
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />

        {/* Center-bottom neon glow */}
        <div
          className={`absolute -bottom-40 left-1/4 w-[750px] h-[750px] rounded-full bg-gradient-to-tr ${themeGradients.blob3} blur-[140px] opacity-85 animate-pulse`}
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />

        {/* Center-right energetic accent */}
        <div
          className={`absolute top-1/3 -right-36 w-[500px] h-[500px] rounded-full bg-gradient-to-l ${themeGradients.blob4} blur-[100px] opacity-75 animate-pulse`}
          style={{ animationDuration: "9s", animationDelay: "1s" }}
        />
      </div>

      {/* 2. Interactive Cursor Cyber Spotlight */}
      {interactive && mousePos.x >= 0 && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, ${themeGradients.mouseGlow}, transparent 75%)`,
          }}
        />
      )}

      {/* 3. Cyber Digital Grid Pattern with Perspective Horizon */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${themeGradients.gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${themeGradients.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 40%, transparent 95%)",
        }}
      />

      {/* 4. Fine Digital Micro-Grid overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, ${themeGradients.gridAccent} 1.2px, transparent 0)
          `,
          backgroundSize: "22px 22px",
        }}
      />

      {/* 5. Cyber Geometric Circuit Traces & Corner Markers */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Top-left corner cyber reticle */}
        <div className="absolute top-4 left-4 w-28 h-28 border-t-2 border-l-2 border-cyan-500/40">
          <div className="absolute top-1 left-1 text-[9px] font-mono text-cyan-400/70 tracking-widest">
            SYS::DEFENSE
          </div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400"></div>
        </div>

        {/* Top-right corner cyber reticle */}
        <div className="absolute top-4 right-4 w-28 h-28 border-t-2 border-r-2 border-fuchsia-500/40">
          <div className="absolute top-1 right-1 text-[9px] font-mono text-fuchsia-400/70 tracking-widest text-right">
            GRID::ONLINE
          </div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-fuchsia-400"></div>
        </div>

        {/* Bottom-left cyber reticle */}
        <div className="absolute bottom-4 left-4 w-28 h-28 border-b-2 border-l-2 border-cyan-500/40">
          <div className="absolute bottom-1 left-1 text-[9px] font-mono text-cyan-400/70 tracking-widest">
            48kHz::DSP
          </div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400"></div>
        </div>

        {/* Bottom-right cyber reticle */}
        <div className="absolute bottom-4 right-4 w-28 h-28 border-b-2 border-r-2 border-purple-500/40">
          <div className="absolute bottom-1 right-1 text-[9px] font-mono text-purple-400/70 tracking-widest text-right">
            AI::ANALYSIS
          </div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-400"></div>
        </div>
      </div>

      {/* 6. High-tech Cyber Canvas (Voice Data Nodes & Interactive Waveform) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block opacity-70"
      />

      {/* 7. Subtle Cyber Scanlines for authentic digital display texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* 8. Top & Bottom Vignette to focus attention on content */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-black/40" />
    </div>
  );
}
