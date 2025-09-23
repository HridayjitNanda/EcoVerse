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

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(0.3); // 0..1

  // Chosic audio: Island by Luke Bergs
  const ISLAND_URL = "https://www.chosic.com/download-audio/42076/";
  // Use direct download variant for consistent streaming
  const ISLAND_DL_URL = ISLAND_URL.includes("?")
    ? `${ISLAND_URL}&download=1`
    : `${ISLAND_URL}?download=1`;

  // Refs: keep only the HTMLAudioElement and the speaker wrapper
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const speakerWrapRef = useRef<HTMLDivElement | null>(null);

  // Replace startAudio to play the hidden <audio> element
  const startAudio = async () => {
    if (isPlaying) return;
    try {
      if (audioElRef.current) {
        audioElRef.current.volume = volume;
        await audioElRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      // Autoplay might be blocked; user can click again after interaction
    }
  };

  // Replace stopAudio to pause/reset the hidden <audio> element
  const stopAudio = async () => {
    try {
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current.currentTime = 0;
      }
    } catch {}
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

  // Sync volume to <audio>
  useEffect(() => {
    if (audioElRef.current) {
      audioElRef.current.volume = volume;
    }
  }, [volume]);

  // Click outside to close volume panel
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

  // Cleanup on unmount (ensure audio is stopped)
  useEffect(() => {
    return () => {
      if (audioElRef.current) {
        try {
          audioElRef.current.pause();
        } catch {}
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
            Recycle
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
            Plant Trees
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
          Clean Oceans
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
        {/* earth land masses (increase land coverage) */}
        <g fill="#2ecc71" stroke="black" strokeWidth="4" opacity="0.98">
          {/* Large left land mass */}
          <path d="M85 100
                   q18 -16 40 -12
                   q12 2 22 10
                   q6 5 -2 12
                   q-10 9 -20 12
                   q-14 4 -24 0
                   q-18 -6 -16 -22 Z" />
          {/* Central curved land bridge */}
          <path d="M110 118
                   q14 -6 34 -4
                   q10 2 16 8
                   q4 5 -2 10
                   q-10 9 -28 10
                   q-18 1 -26 -6
                   q-5 -4 6 -18 Z" />
          {/* Right land mass */}
          <path d="M158 96
                   q16 4 26 16
                   q6 8 2 16
                   q-6 12 -22 14
                   q-10 2 -18 -2
                   q-6 -3 -4 -10
                   q2 -10 8 -16
                   q6 -6 8 -18 Z" />
          {/* Small islands */}
          <path d="M102 142 q6 -4 10 0 q-2 8 -10 8 q-6 -4 0 -8 Z" />
          <path d="M150 140 q6 -4 10 0 q-2 8 -10 8 q-6 -4 0 -8 Z" />
        </g>

        {/* eyes and smile */}
        <g>
          <ellipse cx="118" cy="110" rx="16" ry="12" fill="white" stroke="black" strokeWidth="4" />
          <ellipse cx="155" cy="112" rx="16" ry="12" fill="white" stroke="black" strokeWidth="4" />
          <circle cx="122" cy="112" r="6" fill="#1f2937" />
          <circle cx="158" cy="114" r="6" fill="#1f2937" />
          <path d="M120 135 q12 10 28 0" stroke="#1f9e55" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );

  // Nav items (removed per request; keeping only icon buttons and SIGN-UP)
  const navItems: string[] = [];

  return (
    <div className="min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#ffd139" }}>
      
      {/* Top Nav */}
      <nav
        className="sticky top-0 z-50 border-b-2 border-black relative"
        style={{
          background: "#ffffff",
        }}
      >
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

          <div className="flex items-center gap-2 sm:-mr-4 lg:-mr-8 xl:-mr-12">
            <Button
              className="rounded-md border-2 border-black bg-white text-black hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              LOG IN
            </Button>

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
        ) : null}
      </div>

      {/* Footer (simple, bold) */}
      <footer className="border-t-4 border-black bg-[#ffd139] py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-extrabold tracking-tight">EcoVerse</span>
          <span className="text-sm font-semibold">
            © 2025 EcoVerse. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}