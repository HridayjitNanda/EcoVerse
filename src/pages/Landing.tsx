import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Coins,
  Flame,
  Rocket,
  Shield,
  Stars,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Add: audio + volume UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(0.3); // 0..1

  // Add: external audio track for "Island" (Luke Bergs) via Chosic
  const ISLAND_URL = "https://www.chosic.com/download-audio/42076/";

  // Add: refs for HTMLAudioElement and media source
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const driftTimerRef = useRef<number | null>(null);
  const speakerWrapRef = useRef<HTMLDivElement | null>(null);

  // Add: start/stop audio using Web Audio (soothing sine)
  const startAudio = async () => {
    if (isPlaying) return;

    // Try external audio element using Chosic link — play directly
    const tryPlayUrl = async (url: string) => {
      const el = new Audio();
      el.src = url;
      el.loop = true;
      el.preload = "auto";
      el.crossOrigin = "anonymous";
      el.volume = volume;
      // Save refs (direct playback, no AudioContext involvement) only on success
      await el.play();
      audioElRef.current = el;
      mediaSourceRef.current = null;
      audioCtxRef.current = null;
      gainRef.current = null;
      setIsPlaying(true);
    };

    try {
      await tryPlayUrl(ISLAND_URL);
      return;
    } catch {
      // Retry with a common streaming variant
      try {
        const altUrl = ISLAND_URL.includes("?")
          ? `${ISLAND_URL}&download=1`
          : `${ISLAND_URL}?download=1`;
        await tryPlayUrl(altUrl);
        return;
      } catch {
        // Fallback to synth if external playback fails
      }
    }

    // Fallback: soothing ambient synth (sine + sawtooth, lowpass, slow drift)
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.value = volume;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1000;
    lowpass.Q.value = 0.9;

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 432;

    const osc2 = ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = 648;

    osc1.connect(lowpass);
    osc2.connect(lowpass);
    lowpass.connect(gain).connect(ctx.destination);

    osc1.start();
    osc2.start();

    let up = true;
    const scheduleDrift = () => {
      const now = ctx.currentTime;
      const dur = 10;
      const target1 = up ? 440 : 432;
      const target2 = up ? 660 : 648;
      try {
        osc1.frequency.cancelScheduledValues(now);
        osc2.frequency.cancelScheduledValues(now);
        osc1.frequency.linearRampToValueAtTime(target1, now + dur);
        osc2.frequency.linearRampToValueAtTime(target2, now + dur);
      } catch {}
      up = !up;
    };
    scheduleDrift();
    driftTimerRef.current = window.setInterval(scheduleDrift, 10000);

    // Save refs for synth mode
    audioCtxRef.current = ctx;
    gainRef.current = gain;
    oscRef.current = osc1;
    osc2Ref.current = osc2;

    // Ensure external refs are cleared
    mediaSourceRef.current = null;
    audioElRef.current = null;

    setIsPlaying(true);
  };

  const stopAudio = async () => {
    try {
      // If using external track
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current.currentTime = 0;
        try {
          mediaSourceRef.current?.disconnect();
        } catch {}
      }

      // If using synth fallback
      oscRef.current?.stop();
      osc2Ref.current?.stop();

      if (driftTimerRef.current) {
        clearInterval(driftTimerRef.current);
        driftTimerRef.current = null;
      }

      await audioCtxRef.current?.close();
    } catch {}
    // Clear refs for both modes
    mediaSourceRef.current = null;
    audioElRef.current = null;
    oscRef.current = null;
    osc2Ref.current = null;
    gainRef.current = null;
    audioCtxRef.current = null;
    setIsPlaying(false);
  };

  // Add: handle speaker click (toggle playback + open volume)
  const handleSpeakerClick = async () => {
    if (isPlaying) {
      await stopAudio();
      setShowVolume(true);
      return;
    }
    await startAudio();
    setShowVolume(true);
  };

  // Add: sync volume with gain node
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
    if (audioElRef.current) {
      audioElRef.current.volume = volume;
    }
  }, [volume]);

  // Add: click outside to close volume panel
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!showVolume) return;
      const t = e.target as Node;
      if (speakerWrapRef.current && !speakerWrapRef.current.contains(t)) {
        setShowVolume(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        stopAudio();
      }
    };
  }, []);

  // Add: smooth scroll helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Simple Cloud SVG component
  const Cloud = ({ className = "", delay = 0 }) => (
    <motion.svg
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, delay }}
      viewBox="0 0 200 80"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M30 60c-12 0-22-10-22-22S18 16 30 16c3-10 12-16 22-16 13 0 24 10 25 23 2-1 5-2 8-2 12 0 22 10 22 22s-10 22-22 22H30Z"
        fill="white"
        stroke="black"
        strokeWidth="4"
      />
    </motion.svg>
  );

  // Bricks base with arms holding brand signs
  const BricksWithArms = () => (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Bricks pile */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-28"
        initial={{ y: 10 }}
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="h-full w-full [--brick:#c3442e] [--mortar:#111]">
          {/* create rows of chunky bricks via CSS gradients */}
          <div
            className="h-full w-full rounded-[12px] border-4 border-black"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--brick), var(--brick) 40px, var(--mortar) 42px), repeating-linear-gradient(0deg, var(--brick), var(--brick) 22px, var(--mortar) 24px)",
              filter: "drop-shadow(0px 6px 0px rgba(0,0,0,0.35))",
              clipPath:
                "polygon(0 40%, 8% 30%, 16% 45%, 24% 35%, 32% 48%, 40% 32%, 48% 50%, 56% 38%, 64% 52%, 72% 36%, 80% 50%, 88% 34%, 96% 46%, 100% 40%, 100% 100%, 0 100%)",
            }}
          />
        </div>
      </motion.div>

      {/* Left arm */}
      <motion.div
        className="absolute -left-3 bottom-16 origin-right"
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        <div className="flex items-center">
          <div className="h-2 w-16 bg-black" />
          <div className="ml-2 rounded-md border-4 border-black bg-orange-400 px-3 py-1 text-xl font-extrabold">
            H&M
          </div>
        </div>
      </motion.div>

      {/* Right arm */}
      <motion.div
        className="absolute -right-3 bottom-16 origin-left"
        animate={{ rotate: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <div className="flex items-center">
          <div className="mr-2 rounded-md border-4 border-black bg-orange-400 px-3 py-1 text-xl font-extrabold">
            ZARA
          </div>
          <div className="h-2 w-16 bg-black" />
        </div>
      </motion.div>

      {/* Floating "Big Cotton" plank on right */}
      <motion.div
        className="absolute right-8 -bottom-2 rotate-6"
        animate={{ y: [0, -6, 0], rotate: [6, 2, 6] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      >
        <div className="rounded-md border-4 border-black bg-orange-400 px-4 py-2 text-lg font-extrabold">
          Big Cotton
        </div>
      </motion.div>
    </div>
  );

  // Hempy mascot (simple bold SVG character)
  const HempyMascot = () => (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-6, 0, -6] }}
      transition={{ duration: 3.4, repeat: Infinity }}
      className="relative"
    >
      <svg
        viewBox="0 0 260 320"
        className="w-[280px] sm:w-[340px] drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]"
      >
        {/* legs */}
        <g>
          <rect x="95" y="210" width="22" height="60" fill="#79a7ff" stroke="black" strokeWidth="6" rx="10" />
          <rect x="142" y="210" width="22" height="60" fill="#79a7ff" stroke="black" strokeWidth="6" rx="10" />
          {/* shoes */}
          <path d="M80 270 h55 v20 h-70 v-10 q0-10 15-10Z" fill="#ffffff" stroke="black" strokeWidth="6" />
          <path d="M130 270 h55 v20 h70 v-10 q0-10-15-10Z" fill="#ffffff" stroke="black" strokeWidth="6" />
          <circle cx="105" cy="280" r="6" fill="#e83c7f" />
          <circle cx="170" cy="280" r="6" fill="#e83c7f" />
        </g>

        {/* hoodie */}
        <path
          d="M60 120 q70-60 140 0 v80 q0 30-70 40 q-70-10-70-40Z"
          fill="#ff79c6"
          stroke="black"
          strokeWidth="6"
        />
        {/* hoodie cords */}
        <path d="M120 170 v30" stroke="black" strokeWidth="6" />
        <path d="M150 170 v30" stroke="black" strokeWidth="6" />
        <circle cx="120" cy="202" r="4" fill="#ffd34d" stroke="black" strokeWidth="3" />
        <circle cx="150" cy="202" r="4" fill="#ffd34d" stroke="black" strokeWidth="3" />

        {/* leaf badge */}
        <path d="M95 185 q10-8 14 0 q-6 10-14 0Z" fill="#27c93f" stroke="black" strokeWidth="4" />

        {/* head circle */}
        <circle cx="130" cy="110" r="60" fill="#4ea3ff" stroke="black" strokeWidth="8" />
        {/* head fluff outline */}
        <path
          d="M70 112 q8-36 40-50 q36-16 70 10 q26 20 24 48"
          fill="none"
          stroke="black"
          strokeWidth="8"
        />
        {/* leaves inside head */}
        <g fill="#2ecc71" stroke="black" strokeWidth="4">
          <ellipse cx="110" cy="90" rx="10" ry="6" />
          <ellipse cx="150" cy="100" rx="12" ry="7" />
          <ellipse cx="128" cy="125" rx="9" ry="5" />
        </g>

        {/* eyes and smile */}
        <g>
          <ellipse cx="118" cy="110" rx="16" ry="12" fill="white" stroke="black" strokeWidth="4" />
          <ellipse cx="155" cy="112" rx="16" ry="12" fill="white" stroke="black" strokeWidth="4" />
          <circle cx="122" cy="112" r="6" fill="#1f2937" />
          <circle cx="158" cy="114" r="6" fill="#1f2937" />
          <path d="M120 135 q12 10 28 0" stroke="#1f9e55" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>

        {/* right hand peace sign */}
        <g>
          <motion.g
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            transform="translate(180,130)"
          >
            <rect x="-10" y="0" width="10" height="40" rx="5" fill="#ff79c6" stroke="black" strokeWidth="6" />
            <rect x="-14" y="-8" width="8" height="22" rx="4" fill="#ffffff" stroke="black" strokeWidth="5" />
            <rect x="-4" y="-8" width="8" height="22" rx="4" fill="#ffffff" stroke="black" strokeWidth="5" />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );

  // Nav items (removed per request; keeping only icon buttons and SIGN-UP)
  const navItems: string[] = [];

  return (
    <div className="min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#ffd139" }}>
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b-4 border-black bg-[#ffd139]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {navItems.map((item, i) => (
              <button
                key={i}
                className="hidden rounded-md border-2 border-black bg-transparent px-3 py-1 text-sm font-extrabold tracking-tight hover:translate-y-0.5 active:translate-y-1 transition md:block"
                onClick={() => {
                  if (item === "Home" || item === "Logo") window.scrollTo({ top: 0, behavior: "smooth" });
                  if (item === "About") document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                  if (item === "Features") document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={speakerWrapRef} className="relative">
                    <button
                      className={`grid h-9 w-9 place-items-center rounded-md border-2 border-black text-lg transition hover:translate-y-0.5 active:translate-y-1 ${
                        isPlaying ? "bg-green-300" : "bg-orange-300"
                      }`}
                      aria-label={isPlaying ? "Stop Music & Show Volume" : "Play Music & Show Volume"}
                      onClick={handleSpeakerClick}
                    >
                      🔈
                    </button>

                    {/* Add: Volume panel */}
                    {showVolume && (
                      <div className="absolute right-0 top-11 z-50 w-44 rounded-md border-2 border-black bg-white p-3">
                        <div className="mb-2 text-xs font-extrabold text-black">Volume</div>
                        <Slider
                          value={[Math.round(volume * 100)]}
                          onValueChange={(val) => setVolume((val?.[0] ?? 30) / 100)}
                          min={0}
                          max={100}
                          step={1}
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-black/70">{Math.round(volume * 100)}%</span>
                          <button
                            className="text-xs font-extrabold underline"
                            onClick={() => {
                              if (isPlaying) stopAudio();
                              else startAudio();
                            }}
                          >
                            {isPlaying ? "Stop" : "Play"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>Music</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              className="rounded-md border-2 border-black bg-white text-black hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              SIGN-UP
            </Button>
          </div>
        </div>
      </nav>

      {/* Clouds */}
      <div className="pointer-events-none relative mx-auto max-w-7xl">
        <Cloud className="absolute left-4 top-10 w-32" delay={0.2} />
        <Cloud className="absolute right-10 top-6 w-40" delay={0.6} />
        <Cloud className="absolute left-1/2 top-24 w-28 -translate-x-1/2" delay={1.0} />
      </div>

      {/* Hero Content */}
      <section id="hero" className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-black sm:text-6xl"
            style={{ textShadow: "0 3px 0 rgba(0,0,0,0.25)" }}
          >
            ECOVERSE —{" "}
            <span className="block">LEARN. PLAY. TAKE ACTION.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-black/80"
          >
            A gamified environmental education platform. Battle your Personal Monster, team up for the World Boss, and earn EcoTokens for real-world impact.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-6 flex justify-center"
          >
            <Button
              className="rounded-md border-2 border-black bg-[#35c163] px-6 py-6 text-base font-extrabold text-black hover:bg-[#2cb25a]"
              onClick={() => navigate("/auth")}
            >
              START NOW
            </Button>
          </motion.div>
        </div>

        {/* Scene: Character + Bricks */}
        <div className="relative mt-10 grid place-items-center">
          <div className="relative">
            <HempyMascot />
            <div className="mt-2 h-6 w-full rounded-full bg-black/20 blur-md" />
          </div>
          <div className="relative mt-4 w-full">
            <BricksWithArms />
          </div>
        </div>
      </section>

      {/* About (EcoVerse) */}
      <section id="about" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black" style={{ textShadow: "0 2px 0 rgba(0,0,0,0.2)" }}>
            EcoVerse — A Gamified Environmental Education Platform
          </h2>
          <p className="mt-3 text-black/80 font-semibold">
            Learn and take action through play. Battle with your Personal Monster, team up against the World Boss, and earn points and EcoTokens as rewards.
          </p>
          <div className="mt-6">
            <Button
              className="rounded-md border-2 border-black bg-white text-black hover:bg-white/90 px-6 py-5 font-extrabold"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Personal Monsters", desc: "Students battle and grow their own eco-avatar through quests and challenges." },
            { title: "World Boss", desc: "Join forces to defeat a collective environmental threat with community progress." },
            { title: "Rewards", desc: "Earn points and EcoTokens for completing actions and learning modules." },
          ].map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-lg border-4 border-black bg-white p-6"
            >
              <h3 className="text-xl font-extrabold tracking-tight text-black mb-2">{f.title}</h3>
              <p className="text-black/80 font-semibold">{f.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            className="rounded-md border-2 border-black bg-[#35c163] px-6 py-5 text-base font-extrabold text-black hover:bg-[#2cb25a]"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Bottom CTA for authenticated users to jump to dashboard */}
      <div className="pb-16 text-center">
        {!isLoading && isAuthenticated ? (
          <Button
            variant="outline"
            className="rounded-md border-2 border-black bg-white px-6 py-5 text-base font-extrabold text-black hover:bg-white/90"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button
            variant="outline"
            className="rounded-md border-2 border-black bg-white px-6 py-5 text-base font-extrabold text-black hover:bg-white/90"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
        )}
      </div>

      {/* Footer (simple, bold) */}
      <footer className="border-t-4 border-black bg-[#ffd139] py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-extrabold tracking-tight">Hempy Fan Token</span>
          <span className="text-sm font-semibold">
            © 2024 Hempy. Built by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              vly.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}