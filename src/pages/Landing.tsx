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

  // Add: Candy SVG component (wrapped and lollipop variants)
  const Candy = ({
    variant = "wrapped",
    color = "#ff79c6",
    className = "",
    delay = 0,
  }: {
    variant?: "wrapped" | "lollipop";
    color?: string;
    className?: string;
    delay?: number;
  }) => (
    <motion.svg
      initial={{ opacity: 0, y: 6, rotate: 0 }}
      animate={{ opacity: 1, y: [0, -6, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, delay }}
      viewBox="0 0 80 80"
      className={className}
      aria-hidden="true"
    >
      {variant === "wrapped" ? (
        <>
          <rect x="18" y="26" width="44" height="28" rx="6" fill={color} stroke="black" strokeWidth="4" />
          <path d="M18 40 L6 28 L14 40 L6 52 Z" fill={color} stroke="black" strokeWidth="4" />
          <path d="M62 40 L74 28 L66 40 L74 52 Z" fill={color} stroke="black" strokeWidth="4" />
          <circle cx="40" cy="40" r="8" fill="#fff" opacity="0.5" />
        </>
      ) : (
        <>
          <rect x="38" y="36" width="6" height="36" rx="3" fill="#e6e6e6" stroke="black" strokeWidth="3" />
          <circle cx="41" cy="30" r="18" fill={color} stroke="black" strokeWidth="4" />
          <path d="M28 30 A13 13 0 0 0 54 30" stroke="white" strokeWidth="4" fill="none" opacity="0.7" />
        </>
      )}
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
        {/* earth land masses — emphasize Indian subcontinent */}
        <g fill="#2ecc71" stroke="black" strokeWidth="4" opacity="0.98">
          {/* Eurasia base (upper-right blob) */}
          <path
            d="M100 86
               q18 -10 36 -8
               q14 2 24 9
               q10 7 10 16
               q0 10 -10 16
               q-10 6 -26 6
               q-18 0 -30 -6
               q-10 -5 -12 -12
               q-2 -7 8 -21 Z"
          />
          {/* India subcontinent (triangular peninsula pointing south) - shifted slightly east to separate */}
          <g transform="translate(6,0)">
            <path
              d="M144 100
                 q-4 6 -6 12
                 q-2 6 2 12
                 q3 5 1 10
                 q-2 6 -8 10
                 q10 0 16 -3
                 q6 -3 12 -2
                 q6 1 10 6
                 q-2 -10 -6 -16
                 q-3 -5 -3 -10
                 q0 -6 4 -12
                 q-10 2 -22 3 Z"
            />
          </g>
          {/* Sri Lanka (small island below India) - nudged slightly SE to maintain gap */}
          <path d="M160 154 q6 2 4 8 q-6 4 -10 0 q0 -6 6 -8 Z" />
          {/* Arabian region hint (west of India) */}
          <path
            d="M120 108
               q-10 2 -16 8
               q-6 6 -4 12
               q2 6 10 8
               q8 2 14 -2
               q6 -4 6 -10
               q0 -8 -10 -16 Z"
          />
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

  // Add: global candy background layer (fixed, subtle, sparse)
  const GlobalCandyBackground = () => (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* top-left */}
      <Candy
        variant="wrapped"
        color="#ffa6df"
        className="absolute left-4 top-24 w-8 sm:w-10 opacity-30"
        delay={0.2}
      />
      {/* upper-right */}
      <Candy
        variant="lollipop"
        color="#79a7ff"
        className="absolute right-6 top-36 w-10 sm:w-12 opacity-25"
        delay={0.8}
      />
      {/* mid-left */}
      <Candy
        variant="wrapped"
        color="#35c163"
        className="absolute left-10 top-1/2 w-9 sm:w-11 opacity-20"
        delay={0.5}
      />
      {/* mid-right */}
      <Candy
        variant="wrapped"
        color="#ffd34d"
        className="absolute right-8 top-[60%] w-8 sm:w-10 opacity-22"
        delay={1.1}
      />
      {/* lower-left */}
      <Candy
        variant="lollipop"
        color="#ff79c6"
        className="absolute left-1/5 bottom-24 w-9 sm:w-11 opacity-22"
        delay={1.4}
      />
      {/* lower-right */}
      <Candy
        variant="wrapped"
        color="#79a7ff"
        className="absolute right-12 bottom-16 w-8 sm:w-10 opacity-20"
        delay={0.9}
      />

      {/* NEW: mid-page subtle candies to fill center area */}
      <Candy
        variant="wrapped"
        color="#ff79c6"
        className="absolute left-[42%] top-[45%] w-7 sm:w-8 opacity-20"
        delay={0.65}
      />
      <Candy
        variant="lollipop"
        color="#35c163"
        className="absolute right-[40%] top-[52%] w-8 sm:w-9 opacity-18"
        delay={1.05}
      />

      {/* ADDED: more subtle global candies to balance empty regions across the site */}
      {/* top-center accent */}
      <Candy
        variant="wrapped"
        color="#ffd34d"
        className="absolute left-1/2 top-10 w-8 sm:w-9 -translate-x-1/2 opacity-25"
        delay={0.35}
      />
      {/* upper mid-left band */}
      <Candy
        variant="lollipop"
        color="#ff79c6"
        className="absolute left-[18%] top-[30%] w-9 sm:w-10 opacity-24"
        delay={0.7}
      />
      {/* upper mid-right band */}
      <Candy
        variant="wrapped"
        color="#35c163"
        className="absolute right-[16%] top-[34%] w-8 sm:w-9 opacity-22"
        delay={1.0}
      />
      {/* center-low accent */}
      <Candy
        variant="wrapped"
        color="#79a7ff"
        className="absolute left-1/2 top-[68%] w-8 sm:w-9 -translate-x-1/2 opacity-22"
        delay={0.55}
      />
      {/* bottom-left corner */}
      <Candy
        variant="lollipop"
        color="#ffa6df"
        className="absolute left-4 bottom-10 w-10 sm:w-12 opacity-22"
        delay={0.9}
      />
      {/* bottom-right corner */}
      <Candy
        variant="wrapped"
        color="#ff79c6"
        className="absolute right-5 bottom-12 w-9 sm:w-11 opacity-22"
        delay={1.15}
      />
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#ffd139" }}>
      {/* Global subtle animated candy layer across the page */}
      <GlobalCandyBackground />
      
      {/* Top Nav - frosting style */}
      <nav
        className="sticky top-0 z-50 border-b-2 border-black relative"
        style={{
          background: "linear-gradient(180deg,#ff9dd6 0%,#ff64b5 100%)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {navItems.map((item, i) => (
              <button
                key={i}
                className="hidden rounded-md border-2 border-black bg-white px-3 py-1 text-sm font-extrabold tracking-tight hover:translate-y-0.5 active:translate-y-1 transition md:block"
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

          <div className="flex items-center gap-2 -mr-6 sm:-mr-10 md:-mr-14 lg:-mr-20 xl:-mr-24">
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

      {/* Frosting drip and biscuit base under navbar */}
      <div className="relative -mt-1 pointer-events-none">
        <svg
          viewBox="0 0 1440 110"
          className="block w-full h-[78px]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="frostingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffa6df" />
              <stop offset="100%" stopColor="#ff4fa3" />
            </linearGradient>
          </defs>

          {/* stitched sprinkles line at the very top */}
          <line x1="0" y1="6" x2="1440" y2="6" stroke="#7b5eb6" strokeWidth="6" strokeDasharray="8 16" strokeLinecap="round" opacity="0.8" />

          {/* subtle gloss curve */}
          <path d="M0 18 C 360 10, 1080 10, 1440 18 L1440 34 L0 34 Z" fill="#ffffff" opacity="0.35" />

          {/* main frosting band with wavy bottom - increased curvature and frequency */}
          <path
            d="M0 18 L1440 18 L1440 78
               C1320 102, 1200 54, 1080 78
               C960 102, 840 54, 720 78
               C600 102, 480 54, 360 78
               C240 102, 120 54, 0 78
               Z"
            fill="url(#frostingGrad)"
          />

          {/* thin separator under frosting */}
          <line x1="0" y1="66" x2="1440" y2="66" stroke="#a81d74" strokeWidth="3" opacity="0.45" />

          {/* biscuit base following the wave - matched curvature */}
          <path
            d="M0 78
               C240 102, 480 54, 720 78
               C960 102, 1200 54, 1440 78
               L1440 110 L0 110 Z"
            fill="#f5c338"
            stroke="#b58a1a"
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* Clouds */}
      <div className="pointer-events-none relative mx-auto max-w-7xl">
        <Cloud className="absolute left-4 top-10 w-32" delay={0.2} />
        <Cloud className="absolute right-10 top-6 w-40" delay={0.6} />
        <Cloud className="absolute left-1/2 top-24 w-28 -translate-x-1/2" delay={1.0} />
      </div>

      {/* Hero Content */}
      <section id="hero" className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        {/* subtle scattered candies in hero */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Candy variant="wrapped" color="#ffa6df" className="absolute left-2 top-6 w-7 sm:w-8 opacity-80" delay={0.3} />
          <Candy variant="lollipop" color="#79a7ff" className="absolute right-4 top-12 w-8 sm:w-9 opacity-80" delay={0.9} />
          <Candy variant="wrapped" color="#35c163" className="absolute right-1/3 top-1/3 w-7 opacity-80" delay={0.6} />
          <Candy variant="wrapped" color="#ffd34d" className="absolute left-[28%] top-[26%] w-6 sm:w-7 opacity-50" delay={0.45} />
          <Candy variant="lollipop" color="#ff79c6" className="absolute right-[30%] top-[24%] w-7 sm:w-8 opacity-55" delay={0.75} />
          <Candy variant="wrapped" color="#79a7ff" className="absolute left-[50%] top-[40%] w-6 -translate-x-1/2 opacity-45" delay={1.05} />
          <Candy variant="wrapped" color="#ffa6df" className="absolute left-[18%] top-[22%] w-6 sm:w-7 opacity-55" delay={0.2} />
          <Candy variant="lollipop" color="#35c163" className="absolute left-[42%] top-[28%] w-7 sm:w-8 opacity-50" delay={0.55} />
          <Candy variant="wrapped" color="#79a7ff" className="absolute right-[26%] top-[30%] w-6 sm:w-7 opacity-50" delay={0.85} />
          <Candy variant="wrapped" color="#ffd34d" className="absolute right-[12%] top-[20%] w-6 sm:w-7 opacity-45" delay={1.15} />

          {/* NEW: add a few very subtle candies around headline to reduce emptiness */}
          <Candy
            variant="wrapped"
            color="#ffa6df"
            className="absolute left-[46%] top-[18%] w-6 sm:w-7 opacity-45 -translate-x-1/2"
            delay={0.4}
          />
          <Candy
            variant="lollipop"
            color="#79a7ff"
            className="absolute left-[58%] top-[22%] w-7 sm:w-8 opacity-40"
            delay={0.95}
          />
          <Candy
            variant="wrapped"
            color="#35c163"
            className="absolute left-[38%] top-[20%] w-6 sm:w-7 opacity-42"
            delay={0.7}
          />

          {/* ADD: Far-left and far-right sparse candies to fill empty side areas */}
          <Candy
            variant="wrapped"
            color="#ffa6df"
            className="absolute left-[6%] top-[34%] w-7 sm:w-8 opacity-35"
            delay={0.35}
          />
          <Candy
            variant="lollipop"
            color="#79a7ff"
            className="absolute left-[8%] top-[48%] w-8 sm:w-9 opacity-32"
            delay={0.85}
          />
          <Candy
            variant="wrapped"
            color="#35c163"
            className="absolute left-[10%] top-[62%] w-7 sm:w-8 opacity-30"
            delay={1.15}
          />

          <Candy
            variant="wrapped"
            color="#ffd34d"
            className="absolute right-[8%] top-[36%] w-7 sm:w-8 opacity-33"
            delay={0.55}
          />
          <Candy
            variant="lollipop"
            color="#ff79c6"
            className="absolute right-[6%] top=[50%] w-8 sm:w-9 opacity-34"
            delay={0.95}
          />
          <Candy
            variant="wrapped"
            color="#79a7ff"
            className="absolute right-[10%] top-[64%] w-7 sm:w-8 opacity-30"
            delay={1.2}
          />

          {/* Extra left-side candies to fill empty area shown in feedback */}
          <Candy
            variant="wrapped"
            color="#ffa6df"
            className="absolute left-[3%] top-[22%] w-6 sm:w-7 opacity-40"
            delay={0.32}
          />
          <Candy
            variant="lollipop"
            color="#79a7ff"
            className="absolute left-[8%] top-[28%] w-7 sm:w-8 opacity-38"
            delay={0.72}
          />
          <Candy
            variant="wrapped"
            color="#35c163"
            className="absolute left-[14%] top-[34%] w-6 sm:w-7 opacity-36"
            delay={1.02}
          />

          {/* Extra right-side candies to balance the headline area */}
          <Candy
            variant="wrapped"
            color="#ffd34d"
            className="absolute right-[4%] top-[22%] w-6 sm:w-7 opacity-38"
            delay={0.5}
          />
          <Candy
            variant="lollipop"
            color="#ff79c6"
            className="absolute right-[10%] top-[28%] w-7 sm:w-8 opacity-36"
            delay={0.9}
          />
          <Candy
            variant="wrapped"
            color="#79a7ff"
            className="absolute right-[15%] top-[18%] w-6 sm:w-7 opacity-34"
            delay={1.25}
          />

          {/* FEEDBACK TARGET AREA FILL — precise band near hero sides */}
          {/* Left-side band (fills visible empty strip shown in screenshot) */}
          <Candy
            variant="lollipop"
            color="#ff79c6"
            className="absolute left-[7%] top-[30%] w-9 sm:w-10 opacity-45"
            delay={0.42}
          />
          <Candy
            variant="wrapped"
            color="#35c163"
            className="absolute left-[12%] top-[36%] w-8 sm:w-9 opacity-42"
            delay={0.68}
          />
          <Candy
            variant="wrapped"
            color="#ffd34d"
            className="absolute left-[16%] top=[41%] w-7 sm:w-8 opacity-40"
            delay={0.88}
          />

          {/* Right-side band (mirror to balance composition) */}
          <Candy
            variant="lollipop"
            color="#79a7ff"
            className="absolute right-[8%] top-[31%] w-9 sm:w-10 opacity-44"
            delay={0.5}
          />
          <Candy
            variant="wrapped"
            color="#ffa6df"
            className="absolute right-[13%] top-[37%] w-8 sm:w-9 opacity-41"
            delay={0.72}
          />

          {/* NEW: Ultra-precise fill for the visibly empty left strip (between cloud and headline) */}
          <Candy
            variant="lollipop"
            color="#ffa6df"
            className="absolute left-[4%] top-[22%] w-10 sm:w-12 opacity-55"
            delay={0.38}
          />
          <Candy
            variant="wrapped"
            color="#79a7ff"
            className="absolute left-[6%] top-[31%] w-9 sm:w-10 opacity-50"
            delay={0.66}
          />
          <Candy
            variant="wrapped"
            color="#35c163"
            className="absolute left-[9%] top-[40%] w-8 sm:w-9 opacity-48"
            delay={0.92}
          />
          <Candy
            variant="lollipop"
            color="#ffd34d"
            className="absolute left-[12%] top-[47%] w-9 sm:w-10 opacity-46"
            delay={1.18}
          />
          <Candy
            variant="wrapped"
            color="#ff79c6"
            className="absolute left-[7%] top-[27%] w-7 sm:w-8 opacity-52"
            delay={0.51}
          />

          {/* NEW: Mirror precise fill for the visibly empty right strip */}
          <Candy
            variant="lollipop"
            color="#79a7ff"
            className="absolute right-[4%] top-[23%] w-10 sm:w-12 opacity-55"
            delay={0.42}
          />
          <Candy
            variant="wrapped"
            color="#ffa6df"
            className="absolute right-[6%] top-[32%] w-9 sm:w-10 opacity-50"
            delay={0.73}
          />
          <Candy
            variant="wrapped"
            color="#ffd34d"
            className="absolute right-[9%] top-[41%] w-8 sm:w-9 opacity-48"
            delay={0.97}
          />
          <Candy
            variant="lollipop"
            color="#35c163"
            className="absolute right-[12%] top-[48%] w-9 sm:w-10 opacity-46"
            delay={1.22}
          />
          <Candy
            variant="wrapped"
            color="#79a7ff"
            className="absolute right-[7%] top-[28%] w-7 sm:w-8 opacity-52"
            delay={0.55}
          />
        </div>
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
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Candy
                variant="wrapped"
                color="#ffa6df"
                className="absolute -left-6 top-8 w-7 sm:w-8 opacity-70"
                delay={0.25}
              />
              <Candy
                variant="lollipop"
                color="#79a7ff"
                className="absolute -right-6 top-10 w-8 sm:w-9 opacity-70"
                delay={0.6}
              />
              <Candy
                variant="wrapped"
                color="#ffd34d"
                className="absolute left-[20%] -bottom-3 w-7 sm:w-8 opacity-70"
                delay={0.9}
              />
              <Candy
                variant="lollipop"
                color="#35c163"
                className="absolute right-[22%] -bottom-5 w-8 sm:w-9 opacity-70"
                delay={1.15}
              />
            </div>
            <div className="mt-2 h-6 w-full rounded-full bg-black/20 blur-md" />
          </div>
          <div className="relative mt-4 w-full">
            <BricksWithArms />
          </div>
        </div>
      </section>

      {/* About (EcoVerse) */}
      <section id="about" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* light candy accents around about */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Candy variant="wrapped" color="#ffd34d" className="absolute left-6 top-2 w-7 sm:w-8 opacity-70" delay={0.4} />
          <Candy variant="lollipop" color="#ff79c6" className="absolute right-10 bottom-4 w-8 sm:w-9 opacity-70" delay={1.1} />
        </div>
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
        {/* sparse candies across features grid */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Candy variant="wrapped" color="#79a7ff" className="absolute left-8 top-8 w-7 opacity-70" delay={0.2} />
          <Candy variant="lollipop" color="#35c163" className="absolute right-8 top-1/2 w-8 opacity-70" delay={0.8} />
          <Candy variant="wrapped" color="#ffa6df" className="absolute left-1/2 bottom-4 -translate-x-1/2 w-7 opacity-70" delay={1.4} />
          <Candy variant="lollipop" color="#ffd34d" className="absolute left-[35%] top-1/3 w-8 opacity-70" delay={1.0} />
          <Candy variant="wrapped" color="#ff79c6" className="absolute right-[30%] top-[42%] w-7 opacity-70" delay={1.2} />
        </div>
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

      {/* Add: Decorative candies in lower sections */}
      <div className="relative mx-auto max-w-7xl h-40 md:h-48 lg:h-56 px-4 sm:px-6 lg:px-8 mb-6 pointer-events-none">
        {/* Layered candies across bottom area */}
        <Candy variant="wrapped" color="#ff79c6" className="absolute left-6 bottom-3 w-9 sm:w-11" delay={0.4} />
        <Candy variant="lollipop" color="#79a7ff" className="absolute right-8 bottom-4 w-9 sm:w-11" delay={0.9} />
      </div>

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