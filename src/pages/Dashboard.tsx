import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Globe2, Leaf, Swords, Shield, Trophy, BookOpen, CheckCircle2, LogOut, Crown, Medal, Gift, Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add a small Candy SVG and a sparse global background for the page
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
    animate={{ opacity: 0.5, y: [0, -6, 0], rotate: [0, 2, 0] }}
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

const GlobalCandyBackground = () => (
  <div className="pointer-events-none absolute inset-0 z-10">
    <Candy variant="wrapped" color="#ffa6df" className="absolute left-6 top-24 w-8 opacity-25" delay={0.2} />
    <Candy variant="lollipop" color="#79a7ff" className="absolute right-8 top-36 w-10 opacity-22" delay={0.8} />
    <Candy variant="wrapped" color="#35c163" className="absolute left-[12%] top-[52%] w-8 opacity-20" delay={0.5} />
    <Candy variant="wrapped" color="#ffd34d" className="absolute right-[14%] top-[58%] w-8 opacity-20" delay={1.1} />
    <Candy variant="lollipop" color="#ff79c6" className="absolute left-[46%] bottom-28 w-9 opacity-20" delay={0.9} />
    <Candy variant="wrapped" color="#79a7ff" className="absolute right-10 bottom-16 w-8 opacity-20" delay={0.6} />
  </div>
);

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // New EcoVerse dashboard state (local for now; ready to be wired to backend later)
  const [ecoPoints, setEcoPoints] = useState<number>(120);
  const [badges, setBadges] = useState<string[]>(["Starter", "Water Saver"]);
  const [personalMonsterHP, setPersonalMonsterHP] = useState<number>(100);
  const [worldBossHP, setWorldBossHP] = useState<number>(100000);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});

  // Add a controlled tab state so the left sidebar can switch tabs
  const [tab, setTab] = useState<string>("overview");

  // Static demo content
  const lessons: Array<{ id: string; title: string; duration: string; tag: string }> = [
    { id: "l1", title: "Plastic Pollution 101", duration: "5 min", tag: "Waste" },
    { id: "l2", title: "Intro to Carbon Footprint", duration: "6 min", tag: "Climate" },
    { id: "l3", title: "Water Conservation Basics", duration: "4 min", tag: "Water" },
  ];
  const quizzes: Array<{ id: string; title: string; questions: number; tag: string }> = [
    { id: "q1", title: "Carbon Quiz", questions: 6, tag: "Climate" },
    { id: "q2", title: "Waste Sorting", questions: 5, tag: "Waste" },
  ];
  const challenges: Array<{ id: string; title: string; hp: number; pts: number; tag: string }> = [
    { id: "c1", title: "Carry a Reusable Bottle Today", hp: 5, pts: 10, tag: "Water" },
    { id: "c2", title: "Skip Plastic Cutlery", hp: 5, pts: 12, tag: "Waste" },
    { id: "c3", title: "Plant a Seed or Sapling", hp: 10, pts: 25, tag: "Nature" },
  ];

  // Leaderboard demo data
  const leaderboard: Array<{ id: string; name: string; points: number }> = [
    { id: "u1", name: "Aditi", points: 320 },
    { id: "u2", name: "Rohan", points: 285 },
    { id: "u3", name: "Kiran", points: 260 },
    { id: "u4", name: "Meera", points: 240 },
    { id: "u5", name: "Arjun", points: 225 },
  ];

  // Rewards demo data
  const rewards: Array<{ id: string; title: string; cost: number; desc: string }> = [
    { id: "r1", title: "Eco Badge — Silver Leaf", cost: 150, desc: "Showcase your eco-journey with a silver leaf badge." },
    { id: "r2", title: "Plant a Tree (Sponsor)", cost: 250, desc: "Use points to sponsor a sapling via our partner." },
    { id: "r3", title: "Plastic-Free Kit", cost: 350, desc: "Redeem for a reusable bottle + metal straw set." },
  ];

  // Handlers
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const awardBadgeIfNeeded = (newHP: number) => {
    if (newHP <= 0 && !badges.includes("Monster Slayer")) {
      setBadges((b) => [...b, "Monster Slayer"]);
      toast.success("Badge unlocked: Monster Slayer!");
    }
  };

  const completeChallenge = (id: string, hp: number, pts: number) => {
    if (completedChallenges[id]) {
      toast("Already completed today!");
      return;
    }
    // Basic logic per spec
    setPersonalMonsterHP((prev) => {
      const next = Math.max(0, prev - hp);
      awardBadgeIfNeeded(next);
      return next;
    });
    setWorldBossHP((prev) => Math.max(0, prev - 1));
    setEcoPoints((p) => p + pts);
    setCompletedChallenges((m) => ({ ...m, [id]: true }));
    toast.success(`Challenge completed! -${hp} HP (Personal), -1 HP (World). +${pts} EcoPoints`);
  };

  const takeQuiz = (id: string, pts: number) => {
    setEcoPoints((p) => p + pts);
    toast.success(`Quiz ${id.toUpperCase()} completed! +${pts} EcoPoints`);
  };

  const startLesson = (title: string) => {
    toast(`Started: ${title}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden lg:pl-64" style={{ backgroundColor: "#ffd139" }}>
      <GlobalCandyBackground />

      {/* Fixed Left Sidebar (lg and up) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-transparent border-r-4 border-black z-40">
        <div className="flex h-full flex-col p-4">
          <div className="mb-4">
            <div className="text-black font-extrabold text-lg">EcoVerse</div>
            <div className="text-black/70 text-xs">Save the Planet</div>
          </div>
          <div className="space-y-2">
            <Button
              variant={tab === "overview" ? "default" : "ghost"}
              className={`w-full justify-start ${tab === "overview" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"} border-2 border-black`}
              onClick={() => setTab("overview")}
            >
              <Shield className="h-4 w-4 mr-2" /> Overview
            </Button>
            <Button
              variant={tab === "lessons" ? "default" : "ghost"}
              className={`w-full justify-start ${tab === "lessons" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"} border-2 border-black`}
              onClick={() => setTab("lessons")}
            >
              <BookOpen className="h-4 w-4 mr-2" /> Lessons
            </Button>
            <Button
              variant={tab === "quizzes" ? "default" : "ghost"}
              className={`w-full justify-start ${tab === "quizzes" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"} border-2 border-black`}
              onClick={() => setTab("quizzes")}
            >
              <Trophy className="h-4 w-4 mr-2" /> Quizzes
            </Button>
            <Button
              variant={tab === "challenges" ? "default" : "ghost"}
              className={`w-full justify-start ${tab === "challenges" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"} border-2 border-black`}
              onClick={() => setTab("challenges")}
            >
              <Leaf className="h-4 w-4 mr-2" /> Challenges
            </Button>
            <Button
              variant={tab === "leaderboard" ? "default" : "ghost"}
              className={`w-full justify-start ${tab === "leaderboard" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"} border-2 border-black`}
              onClick={() => setTab("leaderboard")}
            >
              <Crown className="h-4 w-4 mr-2" /> Leaderboard
            </Button>
            <Button
              variant={tab === "rewards" ? "default" : "ghost"}
              className={`w-full justify-start ${tab === "rewards" ? "bg-black text-white" : "bg-white text-black hover:bg-white/90"} border-2 border-black`}
              onClick={() => setTab("rewards")}
            >
              <Gift className="h-4 w-4 mr-2" /> Rewards
            </Button>
          </div>
          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start border-2 border-black bg-white text-black hover:bg-white/90"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Added: Simple welcome heading (replaces removed navbar area) */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || user?.email || "Eco Warrior"}!
          </h1>
          <p className="mt-1 text-sm sm:text-base font-semibold text-black/70">
            Track progress, learn with focus, and take real action—at your pace.
          </p>
        </div>

        {/* Top stats strip */}
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
              <div className="mt-2 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <Badge key={b} variant="secondary" className="border-2 border-black">
                    {b}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Swords className="h-5 w-5" /> Personal Monster
              </CardTitle>
              <CardDescription>Your current foe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>Trash Troll</span>
                <span>{personalMonsterHP} / 100 HP</span>
              </div>
              <Progress value={(personalMonsterHP / 100) * 100} className="h-3 border-2 border-black" />
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe2 className="h-5 w-5" /> World Boss
              </CardTitle>
              <CardDescription>Community challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>Carbon Titan</span>
                <span>{worldBossHP.toLocaleString()} / 100,000 HP</span>
              </div>
              <Progress value={(worldBossHP / 100000) * 100} className="h-3 border-2 border-black" />
            </CardContent>
          </Card>
        </div>

        {/* Content with mobile tabs (sidebar is fixed on lg) */}
        <div className="mt-4">
          {/* Tabs header remains for mobile and small screens */}
          <Tabs value={tab} onValueChange={setTab} className="mt-0">
            <TabsList className="border-2 border-black bg-white lg:hidden">
              <TabsTrigger value="overview" className="data-[state=active]:bg-black data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="lessons" className="data-[state=active]:bg-black data-[state=active]:text-white">Lessons</TabsTrigger>
              <TabsTrigger value="quizzes" className="data-[state=active]:bg-black data-[state=active]:text-white">Quizzes</TabsTrigger>
              <TabsTrigger value="challenges" className="data-[state=active]:bg-black data-[state=active]:text-white">Challenges</TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-black data-[state=active]:text-white">Leaderboard</TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-black data-[state=active]:text-white">Rewards</TabsTrigger>
            </TabsList>

            {/* Overview tab (unchanged content) */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                <Card className="border-4 border-black bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" /> Personal Monster Actions
                    </CardTitle>
                    <CardDescription>Complete actions to reduce HP</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-md border-2 border-black px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        Daily Eco Action (-5 HP, +10 pts)
                      </div>
                      <Button
                        size="sm"
                        onClick={() => completeChallenge("quick-action", 5, 10)}
                        disabled={personalMonsterHP === 0}
                        className="border-2 border-black"
                      >
                        Do it
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-md border-2 border-black px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4" />
                        Bonus Action (-10 HP, +20 pts)
                      </div>
                      <Button
                        size="sm"
                        onClick={() => completeChallenge("bonus-action", 10, 20)}
                        disabled={personalMonsterHP === 0}
                        className="border-2 border-black"
                      >
                        Do it
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-black bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe2 className="h-5 w-5" /> Contribute to World Boss
                    </CardTitle>
                    <CardDescription>Every action helps (-1 HP)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-md border-2 border-black px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Log a community action (-1 HP, +5 pts)
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setWorldBossHP((p) => Math.max(0, p - 1));
                          setEcoPoints((p) => p + 5);
                          toast.success("Thanks for contributing! -1 HP for Carbon Titan, +5 EcoPoints");
                        }}
                        disabled={worldBossHP === 0}
                        className="border-2 border-black"
                      >
                        Contribute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Lessons tab (unchanged content) */}
            <TabsContent value="lessons" className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight">Interactive Lessons</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lessons.map((l, i) => (
                  <motion.div key={l.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="border-4 border-black bg-white h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{l.title}</CardTitle>
                        <CardDescription className="flex items-center justify-between">
                          <Badge variant="secondary" className="border-2 border-black">{l.tag}</Badge>
                          <span>{l.duration}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-end">
                        <Button className="border-2 border-black" onClick={() => startLesson(l.title)}>
                          <BookOpen className="h-4 w-4 mr-2" /> Start
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Quizzes tab (unchanged content) */}
            <TabsContent value="quizzes" className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight">Quizzes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((q, i) => (
                  <motion.div key={q.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="border-4 border-black bg-white h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{q.title}</CardTitle>
                        <CardDescription className="flex items-center justify-between">
                          <Badge variant="secondary" className="border-2 border-black">{q.tag}</Badge>
                          <span>{q.questions} Questions</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-end">
                        <Button className="border-2 border-black" onClick={() => takeQuiz(q.id, 15)}>
                          <Trophy className="h-4 w-4 mr-2" /> Take Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Challenges tab (unchanged content) */}
            <TabsContent value="challenges" className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight">Eco-Challenges</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {challenges.map((c, i) => (
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
                        <div className="text-xs font-semibold">
                          {completedChallenges[c.id] ? "Completed" : "Available"}
                        </div>
                        <Button
                          className="border-2 border-black"
                          disabled={!!completedChallenges[c.id] || personalMonsterHP === 0}
                          onClick={() => completeChallenge(c.id, c.hp, c.pts)}
                        >
                          <Leaf className="h-4 w-4 mr-2" /> Complete
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard */}
            <TabsContent value="leaderboard" className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight flex items-center">
                  <Crown className="h-5 w-5 mr-2" /> Leaderboard
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {leaderboard.map((u, i) => (
                  <motion.div key={u.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="border-4 border-black bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-lg">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-2" /> {u.name}
                          </span>
                          {i === 0 ? <Crown className="h-5 w-5 text-yellow-500" /> : <Medal className="h-5 w-5 text-rose-500" />}
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

            {/* Rewards */}
            <TabsContent value="rewards" className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight flex items-center">
                  <Gift className="h-5 w-5 mr-2" /> Rewards
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            toast.success(`Redeemed: ${r.title} (-${r.cost} EcoPoints)`);
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
        </div>
      </div>
    </div>
  );
}