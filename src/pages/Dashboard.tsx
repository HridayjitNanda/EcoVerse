import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Globe2, Leaf, Swords, Shield, Trophy, BookOpen, CheckCircle2, LogOut } from "lucide-react";
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
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#ffd139" }}>
      <GlobalCandyBackground />

      {/* Frosting-style header to match landing */}
      <nav
        className="sticky top-0 z-50 border-b-2 border-black"
        style={{ background: "linear-gradient(180deg,#ff9dd6 0%,#ff64b5 100%)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-1 text-sm font-extrabold hover:bg-white/90"
            onClick={() => navigate("/")}
          >
            <img src="/logo.svg" alt="EcoVerse" className="h-6 w-6" />
            EcoVerse
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm font-semibold text-black">
              {user?.name || user?.email || "Student"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-white/90"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Biscuit base under navbar */}
      <div className="relative -mt-1 pointer-events-none">
        <svg viewBox="0 0 1440 44" className="block w-full h-[44px]" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 10 C240 28, 480 2, 720 10 C960 26, 1200 2, 1440 10 L1440 44 L0 44 Z"
            fill="#f5c338"
            stroke="#b58a1a"
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* REPLACED: Split content into tabs instead of stacking all sections */}
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="border-2 border-black bg-white">
            <TabsTrigger value="overview" className="data-[state=active]:bg-black data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-black data-[state=active]:text-white">Lessons</TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-black data-[state=active]:text-white">Quizzes</TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-black data-[state=active]:text-white">Challenges</TabsTrigger>
          </TabsList>

          {/* Overview: Monsters + World contribution */}
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

          {/* Lessons */}
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

          {/* Quizzes */}
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

          {/* Challenges */}
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
        </Tabs>
      </div>
    </div>
  );
}