import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Shield, BookOpen, Trophy, Leaf, Crown, Gift, Globe2, LogOut, Users, CheckCircle2, Swords } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Decorative vertical frosting strip (separate fixed layer next to sidebar)
function VerticalFrostingStrip() {
  return (
    <svg viewBox="0 0 80 1440" className="block h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="frostingGradVertical" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffa6df" />
          <stop offset="100%" stopColor="#ff4fa3" />
        </linearGradient>
      </defs>
      <line x1="8" y1="0" x2="8" y2="1440" stroke="#7b5eb6" strokeWidth="6" strokeDasharray="8 16" strokeLinecap="round" opacity="0.8" />
      <path d="M18 0 C 10 360, 10 1080, 18 1440 L34 1440 L34 0 Z" fill="#ffffff" opacity="0.35" />
      <path
        d="
          M18 0 L18 1440 L78 1440
          C102 1320, 54 1200, 78 1080
          C102 960, 54 840, 78 720
          C102 600, 54 480, 78 360
          C102 240, 54 120, 78 0
          Z"
        fill="url(#frostingGradVertical)"
      />
      <line x1="66" y1="0" x2="66" y2="1440" stroke="#a81d74" strokeWidth="3" opacity="0.45" />
      <path
        d="
          M78 0
          C102 240, 54 480, 78 720
          C102 960, 54 1200, 78 1440
          L110 1440 L110 0 Z"
        fill="#f5c338"
        stroke="#b58a1a"
        strokeWidth="4"
      />
    </svg>
  );
}

// Add: Simple Cloud SVG component for background
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

// ADD: Non-animated large cloud SVG for background art
const StaticCloud = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 260 120" className={className} aria-hidden="true">
    <path
      d="M40 90c-16 0-30-14-30-30s14-30 30-30c4-14 16-24 30-24 18 0 34 14 36 34 3-2 7-3 12-3 18 0 32 14 32 32s-14 32-32 32H40Z"
      fill="white"
      stroke="black"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Local demo state (simple, clean)
  const [ecoPoints, setEcoPoints] = useState<number>(10);
  const [badges, setBadges] = useState<string[]>([]);
  const [personalMonsterHP, setPersonalMonsterHP] = useState<number>(95);
  const [worldBossHP, setWorldBossHP] = useState<number>(93200);

  // NEW: extra dashboard stats
  const [ecoTokens] = useState<number>(1);
  const [challengesCount] = useState<number>(1);

  // Add: track completed actions by id to prevent repeats
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Rename default tab to "dashboard"
  const [tab, setTab] = useState<string>("dashboard");

  // Sync tab from query string (?tab=lessons, etc.)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    const allowed = ["dashboard", "lessons", "quizzes", "challenges", "leaderboard", "rewards"];
    if (t && allowed.includes(t) && t !== tab) {
      setTab(t);
    }
  }, [location.search]);

  // NEW: names/levels for monsters
  const personalMonsterName = "Forest Guardian";
  const personalMonsterLevel = 1;
  const worldBossName = "Climate Destroyer";
  const worldBossLevel = 1;

  // Add: Quiz cooldown state (24h locks) scoped per user
  const QUIZ_LOCK_HOURS = 24;
  const [now, setNow] = useState<number>(Date.now());
  const [quizLocks, setQuizLocks] = useState<Record<string, number>>({});
  const storageKey = `quizLocks:${user?.email || "anon"}`;

  // Quiz modal state
  const [openQuizId, setOpenQuizId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({}); // idx -> optionIndex
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Topic-specific quiz bank (add difficulty and more quizzes)
  const QUIZ_BANK: Record<string, {
    title: string;
    difficulty: "easy" | "medium" | "hard";
    questions: Array<{ q: string; options: string[]; correct: number }>;
  }> = {
    q1: {
      title: "Carbon Quiz",
      difficulty: "medium",
      questions: [
        { q: "Which gas is the primary contributor to human-caused climate change?", options: ["Oxygen (O2)", "Carbon Dioxide (CO2)", "Nitrogen (N2)", "Ozone (O3)"], correct: 1 },
        { q: "Which activity generally has the lowest carbon footprint?", options: ["Driving alone in a car", "Eating beef daily", "Cycling or walking", "Taking short flights frequently"], correct: 2 },
        { q: "What does 'carbon footprint' measure?", options: ["Money spent on energy", "Amount of waste produced", "Total greenhouse gases emitted", "Electricity used per day"], correct: 2 },
        { q: "Which sector is a major source of CO2 emissions globally?", options: ["Transportation", "Entertainment", "Sports", "Libraries"], correct: 0 },
        { q: "Which diet change most effectively lowers emissions?", options: ["More beef", "More lamb", "More plant-based meals", "More cheese"], correct: 2 },
        { q: "Best way to cut home electricity emissions?", options: ["Leave lights on", "Use LED bulbs and efficient appliances", "Open windows in winter", "Run devices 24/7"], correct: 1 },
      ],
    },
    q2: {
      title: "Waste Sorting",
      difficulty: "easy",
      questions: [
        { q: "Which of the following should typically go into recycling (check local rules)?", options: ["Clean paper and cardboard", "Food scraps", "Used tissues", "Ceramic plates"], correct: 0 },
        { q: "What's the best place for fruit and vegetable peels?", options: ["General trash", "Recycling bin", "Compost", "Glass-only bin"], correct: 2 },
        { q: "Why rinse containers before recycling?", options: ["To reduce odor only", "To remove food residue that can contaminate recycling", "To make them shinier", "It's not necessary"], correct: 1 },
        { q: "Which is typically NOT recyclable curbside?", options: ["Plastic bags/films", "Aluminum cans", "Glass bottles", "Cardboard boxes"], correct: 0 },
        { q: "Best way to avoid contamination?", options: ["Bag recyclables tightly", "Put liquids in bottles", "Keep materials clean and dry", "Mix trash into recycling"], correct: 2 },
      ],
    },
    q3: {
      title: "Renewable Energy",
      difficulty: "medium",
      questions: [
        { q: "Solar PV panels convert sunlight into...", options: ["Heat energy", "Mechanical energy", "Electrical energy", "Sound energy"], correct: 2 },
        { q: "Wind turbines capture energy from...", options: ["Ocean currents", "Moving air", "Geothermal vents", "Tides"], correct: 1 },
        { q: "Why is storage important for renewables?", options: ["It decorates the grid", "It smooths intermittent supply", "It increases fossil fuels", "It reduces efficiency"], correct: 1 },
        { q: "Which is a form of energy storage?", options: ["Pumped hydro", "Wooden crates", "Plastic bags", "Paper bins"], correct: 0 },
      ],
    },
    q4: {
      title: "Water Savers",
      difficulty: "easy",
      questions: [
        { q: "Which habit saves the most water at home?", options: ["Shorter showers", "Running tap while brushing", "Leaky toilet", "Half-load laundry frequently"], correct: 0 },
        { q: "Best time to water plants?", options: ["Midday", "Early morning", "Evening", "Anytime"], correct: 1 },
        { q: "Good way to reduce outdoor water use?", options: ["Use native plants and mulch", "Wash driveway with hose", "Water daily at noon", "Over-fertilize lawn"], correct: 0 },
      ],
    },
    // New quizzes
    q5: {
      title: "Sustainable Transport",
      difficulty: "hard",
      questions: [
        { q: "Which mode typically has the lowest per-km emissions?", options: ["Solo driving", "Bus transit", "Cycling", "Short-haul flights"], correct: 2 },
        { q: "What is a key co-benefit of cycling and walking?", options: ["Higher fuel costs", "Air pollution", "Better health outcomes", "More traffic"], correct: 2 },
        { q: "EV emissions are lowest when...", options: ["Charging from coal-heavy grids", "Charging from clean energy", "Idling for long periods", "Driving at high speeds constantly"], correct: 1 },
        { q: "A practical way to cut transport emissions is to...", options: ["Drive solo everywhere", "Combine errands and carpool", "Always take flights", "Keep tires underinflated"], correct: 1 },
        { q: "City designs that reduce emissions include...", options: ["Unsafe bike lanes", "Sprawl and long commutes", "Mixed-use, walkable neighborhoods", "High parking minimums"], correct: 2 },
      ],
    },
    q6: {
      title: "Biodiversity Basics",
      difficulty: "medium",
      questions: [
        { q: "Biodiversity includes...", options: ["Only number of species", "Species, ecosystems, and genetic diversity", "Just large animals", "Only plants"], correct: 1 },
        { q: "A major threat to biodiversity is...", options: ["Habitat loss", "Reading books", "Cloudy weather", "Recycling"], correct: 0 },
        { q: "Pollinators support...", options: ["Soil erosion", "Food production and ecosystems", "Indoor air pollution", "Ocean currents"], correct: 1 },
        { q: "A good backyard action is to...", options: ["Use many pesticides", "Plant native species", "Remove all flowers", "Pave the garden"], correct: 1 },
      ],
    },
  } as const;

  const currentQuiz = openQuizId ? QUIZ_BANK[openQuizId] : null;

  // Helper: points per correct answer based on difficulty
  const pointsPerCorrect = (difficulty: "easy" | "medium" | "hard") => {
    if (difficulty === "hard") return 12;
    if (difficulty === "medium") return 8;
    return 5;
  };

  const openQuiz = (quizId: string) => {
    if (isQuizLocked(quizId)) {
      toast("This quiz is locked. Please try again later.");
      return;
    }
    setOpenQuizId(quizId);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults([]);
    setQuizScore(0);
  };

  const closeQuiz = () => {
    setOpenQuizId(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults([]);
    setQuizScore(0);
  };

  const submitQuiz = () => {
    if (!openQuizId || !currentQuiz) return;
    const total = currentQuiz.questions.length;
    for (let i = 0; i < total; i++) {
      if (quizAnswers[i] === undefined) {
        toast("Please answer all questions before submitting.");
        return;
      }
    }
    const res: boolean[] = [];
    let correct = 0;
    currentQuiz.questions.forEach((qq, idx) => {
      const ok = quizAnswers[idx] === qq.correct;
      res.push(ok);
      if (ok) correct++;
    });
    setQuizResults(res);
    setQuizScore(correct);
    setQuizSubmitted(true);

    // Award variable points & lock after grading
    const per = pointsPerCorrect(currentQuiz.difficulty);
    const pointsToAward = correct * per;
    handleTakeQuiz(openQuizId, currentQuiz.title, pointsToAward);
  };

  // Load existing locks from localStorage on mount / user change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>;
        setQuizLocks(parsed || {});
      } else {
        setQuizLocks({});
      }
    } catch {
      setQuizLocks({});
    }
    // tick immediately on user change
    setNow(Date.now());
  }, [storageKey]);

  // Persist locks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(quizLocks));
    } catch {}
  }, [quizLocks, storageKey]);

  // Update clock every minute to refresh countdowns
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Helpers for cooldown and formatting
  const isQuizLocked = (id: string) => {
    const exp = quizLocks[id];
    return typeof exp === "number" && exp > now;
  };

  const msRemaining = (id: string) => {
    const exp = quizLocks[id] || 0;
    return Math.max(0, exp - now);
  };

  const formatMsToHhMm = (ms: number) => {
    const totalMins = Math.ceil(ms / 60000);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  // Update to accept dynamic points
  const handleTakeQuiz = (quizId: string, quizTitle: string, pointsToAward: number) => {
    if (isQuizLocked(quizId)) {
      toast("This quiz is locked. Please try again later.");
      return;
    }
    setEcoPoints((p) => p + pointsToAward);
    toast.success(`Quiz complete! +${pointsToAward} pts`);

    const expiresAt = Date.now() + QUIZ_LOCK_HOURS * 60 * 60 * 1000;
    setQuizLocks((prev) => ({ ...prev, [quizId]: expiresAt }));
  };

  const lessons = [
    { id: "l1", title: "Climate Change Basics", duration: "15 min", tag: "Beginner" },
    { id: "l2", title: "Renewable Energy Sources", duration: "20 min", tag: "Intermediate" },
    { id: "l3", title: "Ocean Conservation", duration: "18 min", tag: "Beginner" },
    { id: "l4", title: "Sustainable Transport", duration: "16 min", tag: "Beginner" },
    { id: "l5", title: "Water Conservation", duration: "14 min", tag: "Beginner" },
    { id: "l6", title: "Biodiversity Basics", duration: "22 min", tag: "Intermediate" },
  ] as const;

  const quizzes = [
    { id: "q1", title: QUIZ_BANK.q1.title, tag: "Climate" },
    { id: "q2", title: QUIZ_BANK.q2.title, tag: "Waste" },
    { id: "q3", title: QUIZ_BANK.q3.title, tag: "Energy" },
    { id: "q4", title: QUIZ_BANK.q4.title, tag: "Water" },
    { id: "q5", title: QUIZ_BANK.q5.title, tag: "Transport" },
    { id: "q6", title: QUIZ_BANK.q6.title, tag: "Biodiversity" },
  ] as const;

  const leaderboard = [
    { id: "u1", name: "Aditi", points: 320 },
    { id: "u2", name: "Rohan", points: 285 },
    { id: "u3", name: "Kiran", points: 260 },
  ] as const;

  const rewards = [
    { id: "r1", title: "Eco Badge — Silver Leaf", cost: 150, desc: "Showcase your eco-journey with a silver leaf badge." },
    { id: "r2", title: "Plant a Tree (Sponsor)", cost: 250, desc: "Sponsor a sapling via our partner." },
  ] as const;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const awardBadgeIfNeeded = (hp: number) => {
    if (hp <= 0 && !badges.includes("Monster Slayer")) {
      setBadges((b) => [...b, "Monster Slayer"]);
      toast.success("Badge unlocked: Monster Slayer!");
    }
  };

  const completeAction = (id: string, hp: number, pts: number) => {
    if (completed[id]) {
      toast("Already completed today!");
      return;
    }
    setPersonalMonsterHP((prev) => {
      const next = Math.max(0, prev - hp);
      awardBadgeIfNeeded(next);
      return next;
    });
    setWorldBossHP((prev) => Math.max(0, prev - 1));
    setEcoPoints((p) => p + pts);
    setCompleted((m: Record<string, boolean>) => ({ ...m, [id]: true }));
    toast.success(`Nice! -${hp} HP personal, -1 HP world, +${pts} pts`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden lg:pl-[21rem]" style={{ backgroundColor: "#eaf6ff" }}>
      {/* REPLACED: Use large, non-animated background clouds */}
      {/* Ensure clouds render above the page background (not behind it) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Left large cloud */}
        <StaticCloud className="absolute left-4 top-16 w-[280px]" />
        {/* Right large cloud */}
        <StaticCloud className="absolute right-6 top-10 w-[320px]" />
        {/* Center-top smaller cloud */}
        <StaticCloud className="absolute left-1/2 -translate-x-1/2 top-6 w-[220px]" />
        {/* Bottom corners subtle clouds */}
        <StaticCloud className="absolute -left-6 bottom-20 w-[260px]" />
        <StaticCloud className="absolute -right-8 bottom-16 w-[300px]" />
      </div>

      {/* Fixed Left Sidebar (16rem) */}
      <aside
        className="hidden lg:block fixed inset-y-0 left-0 h-screen w-64 border-r-4 border-black z-50 overflow-hidden"
        style={{ background: "linear-gradient(180deg,#ff9dd6 0%,#ff64b5 100%)" }}
      >
        <div className="flex h-full flex-col p-4">
          {/* Increase brand block sizing */}
          <div className="mb-6">
            <div className="text-black font-extrabold text-2xl leading-tight">EcoVerse</div>
            <div className="text-black/80 text-sm font-bold">Save the Planet</div>
          </div>

          <div className="space-y-3">
            {/* Unified sidebar button styles: increase size further */}
            <Button
              variant={tab === "dashboard" ? "default" : "ghost"}
              className={`w-full h-20 justify-start gap-3 rounded-xl border-[3px] text-xl font-bold
                ${tab === "dashboard"
                  ? "bg-black text-white outline outline-4 outline-black/30"
                  : "bg-white text-black hover:bg-white/90 border-2 rounded-md"
                }`}
              onClick={() => setTab("dashboard")}
            >
              <Shield className="h-7 w-7" /> Dashboard
            </Button>

            <Button
              variant={tab === "lessons" ? "default" : "ghost"}
              className={`w-full h-20 justify-start gap-3 rounded-md border-2 border-black text-xl font-bold
                ${tab === "lessons" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"}`}
              onClick={() => setTab("lessons")}
            >
              <BookOpen className="h-7 w-7" /> Lessons
            </Button>

            <Button
              variant={tab === "quizzes" ? "default" : "ghost"}
              className={`w-full h-20 justify-start gap-3 rounded-md border-2 border-black text-xl font-bold
                ${tab === "quizzes" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"}`}
              onClick={() => setTab("quizzes")}
            >
              <Trophy className="h-7 w-7" /> Quizzes
            </Button>

            <Button
              variant={tab === "challenges" ? "default" : "ghost"}
              className={`w-full h-20 justify-start gap-3 rounded-md border-2 border-black text-xl font-bold
                ${tab === "challenges" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"}`}
              onClick={() => setTab("challenges")}
            >
              <Leaf className="h-7 w-7" /> Challenges
            </Button>

            <Button
              variant={tab === "leaderboard" ? "default" : "ghost"}
              className={`w-full h-20 justify-start gap-3 rounded-md border-2 border-black text-xl font-bold
                ${tab === "leaderboard" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"}`}
              onClick={() => setTab("leaderboard")}
            >
              <Crown className="h-7 w-7" /> Leaderboard
            </Button>

            <Button
              variant={tab === "rewards" ? "default" : "ghost"}
              className={`w-full h-20 justify-start gap-3 rounded-md border-2 border-black text-xl font-bold
                ${tab === "rewards" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"}`}
              onClick={() => setTab("rewards")}
            >
              <Gift className="h-7 w-7" /> Rewards
            </Button>
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start border-2 border-black bg-white text-black hover:bg-white/90 h-12"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Separate fixed frosting strip immediately to the right of the sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-64 h-screen w-[78px] z-40 pointer-events-none">
        <VerticalFrostingStrip />
      </div>

      {/* Main content (offset to sit beside sidebar+frosting) */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Replace the static welcome header with a conditional header */}
        {tab === "dashboard" ? (
          <div className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || user?.email || "Eco Warrior"}!
            </h1>
            <p className="mt-1 text-sm sm:text-base font-semibold text-black/70">
              Track progress, learn with focus, and take real action—at your pace.
            </p>
          </div>
        ) : (
          <div className="mb-6 text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {tab === "lessons" && "Environmental Lessons"}
              {tab === "quizzes" && "Quizzes"}
              {tab === "challenges" && "Challenges"}
              {tab === "leaderboard" && "Leaderboard"}
              {tab === "rewards" && "Rewards"}
            </h1>
          </div>
        )}

        {/* NEW: compact stats strip for tokens/challenges/badges */}
        {tab === "dashboard" && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-4 border-black bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">EcoTokens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{ecoTokens}</div>
              </CardContent>
            </Card>
            <Card className="border-4 border-black bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{challengesCount}</div>
              </CardContent>
            </Card>
            <Card className="border-4 border-black bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{badges.length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top stats (EcoPoints + Monsters) */}
        {tab === "dashboard" && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-4 border-black bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Trophy className="h-5 w-5" /> EcoPoints
                </CardTitle>
                <CardDescription>Earn points by learning and taking action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{ecoPoints}</div>
              </CardContent>
            </Card>

            <Card className="border-4 border-black bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Swords className="h-5 w-5" /> Your Personal Monster
                </CardTitle>
                <CardDescription>
                  Level {personalMonsterLevel} • {personalMonsterName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=512&auto=format&fit=crop"
                    alt="Forest Guardian"
                    className="mx-auto h-24 w-24 rounded-lg border-4 border-black object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span>{personalMonsterName}</span>
                  <span>{personalMonsterHP} / 100 HP</span>
                </div>
                <Progress value={(personalMonsterHP / 100) * 100} className="h-3 border-2 border-black" />
                <div className="mt-2 text-xs font-semibold">{((personalMonsterHP / 100) * 100).toFixed(1)}% Health</div>
              </CardContent>
            </Card>

            <Card className="border-4 border-black bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe2 className="h-5 w-5" /> World Boss
                </CardTitle>
                <CardDescription>
                  Level {worldBossLevel} • {worldBossName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=512&auto=format&fit=crop"
                    alt="Climate Destroyer"
                    className="mx-auto h-24 w-24 rounded-lg border-4 border-black object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span>{worldBossName}</span>
                  <span>{worldBossHP.toLocaleString()} / 100,000 HP</span>
                </div>
                <Progress value={(worldBossHP / 100000) * 100} className="h-3 border-2 border-black" />
                <div className="mt-2 text-xs font-semibold">{((worldBossHP / 100000) * 100).toFixed(1)}% Health</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for content (also used on mobile) */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="border-2 border-black bg-white lg:hidden">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-black data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-black data-[state=active]:text-white">Lessons</TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-black data-[state=active]:text-white">Quizzes</TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-black data-[state=active]:text-white">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-black data-[state=active]:text-white">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-black data-[state=active]:text-white">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-4 border-black bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Personal Monster Actions
                  </CardTitle>
                  <CardDescription>Complete actions to reduce HP</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border-2 border-black px-3 py-2">
                    <div className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Daily Eco Action (-5 HP, +10 pts)</div>
                    <Button size="sm" className="border-2 border-black" disabled={personalMonsterHP === 0}
                      onClick={() => completeAction("quick", 5, 10)}>Do it</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-md border-2 border-black px-3 py-2">
                    <div className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Bonus Action (-10 HP, +20 pts)</div>
                    <Button size="sm" className="border-2 border-black" disabled={personalMonsterHP === 0}
                      onClick={() => completeAction("bonus", 10, 20)}>Do it</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-black bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5" /> Contribute to World Boss</CardTitle>
                  <CardDescription>Every action helps (-1 HP, +5 pts)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border-2 border-black px-3 py-2">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Log a community action</div>
                    <Button size="sm" className="border-2 border-black" disabled={worldBossHP === 0}
                      onClick={() => { setWorldBossHP((p) => Math.max(0, p - 1)); setEcoPoints((p) => p + 5); toast.success("Thanks for contributing! -1 HP, +5 pts"); }}>
                      Contribute
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* NEW: Your Badges section with locked placeholders */}
            <div className="mt-6">
              <Card className="border-4 border-black bg-white">
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>Earn badges by completing lessons, quizzes, and challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-center rounded-md border-2 border-black bg-gray-100 py-6 text-lg font-bold">
                        🔒 Locked
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessons.map((l, i) => (
                <motion.div key={l.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="border-4 border-black bg-white h-full min-h-[260px]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">{l.title}</CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <Badge variant="secondary" className="border-2 border-black">{l.tag}</Badge>
                        <span className="text-base sm:text-lg font-bold">{l.duration}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                      <Button className="border-2 border-black h-12 text-lg px-6" onClick={() => navigate(`/lesson/${l.id}`)}>
                        <BookOpen className="h-5 w-5 mr-2" /> Start
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="border-4 border-black bg-white h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{q.title}</CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <Badge variant="secondary" className="border-2 border-black">{q.tag}</Badge>
                        <span>{QUIZ_BANK[q.id].questions.length} Questions</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                      <Button
                        className="border-2 border-black"
                        disabled={isQuizLocked(q.id)}
                        onClick={() => openQuiz(q.id)}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        {isQuizLocked(q.id)
                          ? `Locked (${formatMsToHhMm(msRemaining(q.id))})`
                          : "Take Quiz"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "c1", title: "Carry a Reusable Bottle Today", hp: 5, pts: 10, tag: "Water" },
                { id: "c2", title: "Skip Plastic Cutlery", hp: 5, pts: 12, tag: "Waste" },
                { id: "c3", title: "Plant a Seed or Sapling", hp: 10, pts: 25, tag: "Nature" },
              ].map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="border-4 border-black bg-white h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{c.title}</CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <Badge variant="secondary" className="border-2 border-black">{c.tag}</Badge>
                        <span>-{c.hp} HP • +{c.pts} pts</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div className="text-xs font-semibold">{completed[c.id] ? "Completed" : "Available"}</div>
                      <Button className="border-2 border-black" disabled={!!completed[c.id] || personalMonsterHP === 0}
                        onClick={() => completeAction(c.id, c.hp, c.pts)}>
                        <Leaf className="h-4 w-4 mr-2" /> Complete
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {leaderboard.map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-4 border-black bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center"><Users className="h-4 w-4 mr-2" /> {u.name}</span>
                        {i === 0 ? <Crown className="h-5 w-5 text-yellow-500" /> : <Trophy className="h-5 w-5 text-rose-500" />}
                      </CardTitle>
                      <CardDescription className="font-semibold">EcoPoints</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-extrabold">{u.points}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Rank #{i + 1}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="border-4 border-black bg-white h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{r.title}</CardTitle>
                      <CardDescription>{r.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Cost: {r.cost} pts</div>
                      <Button
                        className="border-2 border-black"
                        disabled={ecoPoints < r.cost}
                        onClick={() => {
                          if (ecoPoints < r.cost) return;
                          setEcoPoints((p) => p - r.cost);
                          toast.success(`Redeemed: ${r.title} (-${r.cost} pts)`);
                        }}
                      >
                        Redeem
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quiz Modal */}
        <Dialog open={!!openQuizId} onOpenChange={(open) => (!open ? closeQuiz() : null)}>
          <DialogContent className="border-4 border-black bg-white max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold">
                {currentQuiz ? currentQuiz.title : "Quiz"}
              </DialogTitle>
            </DialogHeader>

            {currentQuiz ? (
              <>
                <div
                  className={`space-y-5 ${
                    currentQuiz.questions.length > 4 ? "overflow-y-auto pr-2 max-h-[55vh]" : ""
                  }`}
                >
                  {currentQuiz.questions.map((item, idx) => {
                    const selected = quizAnswers[idx];
                    const isCorrect = quizSubmitted ? quizResults[idx] : null;
                    return (
                      <div key={idx} className="rounded-md border-2 border-black p-3">
                        <div className="font-bold mb-2">
                          {idx + 1}. {item.q}
                        </div>
                        <RadioGroup
                          value={quizAnswers[idx]?.toString() ?? ""}
                          onValueChange={(val) =>
                            !quizSubmitted &&
                            setQuizAnswers((prev) => ({ ...prev, [idx]: Number(val) }))
                          }
                        >
                          {item.options.map((opt, i) => {
                            const isUserPick = selected === i;
                            const showGreen = quizSubmitted && i === item.correct;
                            const showRed = quizSubmitted && isUserPick && i !== item.correct;
                            return (
                              <div
                                key={i}
                                className={`flex items-center space-x-2 py-1 rounded ${
                                  showGreen ? "bg-green-100" : showRed ? "bg-red-100" : ""
                                }`}
                              >
                                <RadioGroupItem
                                  id={`q-${idx}-opt-${i}`}
                                  value={i.toString()}
                                  disabled={quizSubmitted}
                                />
                                <Label
                                  htmlFor={`q-${idx}-opt-${i}`}
                                  className={`font-semibold ${
                                    showGreen ? "text-green-700" : showRed ? "text-red-700" : ""
                                  }`}
                                >
                                  {opt}
                                  {quizSubmitted && i === item.correct ? " (Correct)" : ""}
                                  {quizSubmitted && isUserPick && i !== item.correct ? " (Your answer)" : ""}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>

                        {quizSubmitted ? (
                          <div
                            className={`mt-2 text-sm font-bold ${
                              isCorrect ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {isCorrect ? "You got this right!" : `Correct answer: ${item.options[item.correct]}`}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                {quizSubmitted ? (
                  <>
                    <Separator className="border-2 border-black" />
                    <div className="text-lg font-extrabold">
                      Score: {quizScore}/{currentQuiz.questions.length} • Points: {quizScore * pointsPerCorrect(currentQuiz.difficulty)}
                    </div>
                  </>
                ) : null}
              </>
            ) : null}

            <DialogFooter className="flex gap-2">
              {!quizSubmitted ? (
                <>
                  <Button
                    variant="outline"
                    className="border-2 border-black bg-white text-black hover:bg-white/90"
                    onClick={closeQuiz}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="border-2 border-black bg-[#35c163] text-black hover:bg-[#2cb25a]"
                    onClick={submitQuiz}
                  >
                    Submit
                  </Button>
                </>
              ) : (
                <Button
                  className="border-2 border-black bg-black text-white hover:bg-black/90"
                  onClick={closeQuiz}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* End Quiz Modal */}
      </main>
    </div>
  );
}