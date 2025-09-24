import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, BookOpen, Trophy, Leaf, Crown, Gift, Globe2, LogOut, Users, CheckCircle2, Swords } from "lucide-react";
import { toast } from "sonner";

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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Local demo state (simple, clean)
  const [ecoPoints, setEcoPoints] = useState<number>(120);
  const [badges, setBadges] = useState<string[]>(["Starter", "Water Saver"]);
  const [personalMonsterHP, setPersonalMonsterHP] = useState<number>(100);
  const [worldBossHP, setWorldBossHP] = useState<number>(100000);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<string>("overview");

  const lessons = [
    { id: "l1", title: "Plastic Pollution 101", duration: "5 min", tag: "Waste" },
    { id: "l2", title: "Intro to Carbon Footprint", duration: "6 min", tag: "Climate" },
    { id: "l3", title: "Water Conservation Basics", duration: "4 min", tag: "Water" },
  ] as const;

  const quizzes = [
    { id: "q1", title: "Carbon Quiz", questions: 6, tag: "Climate" },
    { id: "q2", title: "Waste Sorting", questions: 5, tag: "Waste" },
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
    setCompleted((m) => ({ ...m, [id]: true }));
    toast.success(`Nice! -${hp} HP personal, -1 HP world, +${pts} pts`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden lg:pl-[21rem]" style={{ backgroundColor: "#ffd139" }}>
      {/* Fixed Left Sidebar (16rem) */}
      <aside
        className="hidden lg:block fixed inset-y-0 left-0 h-screen w-64 border-r-4 border-black z-50 overflow-hidden"
        style={{ background: "linear-gradient(180deg,#ff9dd6 0%,#ff64b5 100%)" }}
      >
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
      </aside>

      {/* Separate fixed frosting strip immediately to the right of the sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-64 h-screen w-[78px] z-40 pointer-events-none">
        <VerticalFrostingStrip />
      </div>

      {/* Main content (offset to sit beside sidebar+frosting) */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || user?.email || "Eco Warrior"}!
          </h1>
          <p className="mt-1 text-sm sm:text-base font-semibold text-black/70">
            Track progress, learn, and take real action.
          </p>
        </div>

        {/* Top stats */}
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

        {/* Tabs for content (also used on mobile) */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="border-2 border-black bg-white lg:hidden">
            <TabsTrigger value="overview" className="data-[state=active]:bg-black data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-black data-[state=active]:text-white">Lessons</TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-black data-[state=active]:text-white">Quizzes</TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-black data-[state=active]:text-white">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-black data-[state=active]:text-white">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-black data-[state=active]:text-white">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-4 border-black bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Personal Monster Actions</CardTitle>
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
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
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
                      <Button className="border-2 border-black" onClick={() => toast(`Started: ${l.title}`)}>
                        <BookOpen className="h-4 w-4 mr-2" /> Start
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
                        <span>{q.questions} Questions</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                      <Button className="border-2 border-black" onClick={() => { setEcoPoints((p) => p + 15); toast.success(`Quiz complete! +15 pts`); }}>
                        <Trophy className="h-4 w-4 mr-2" /> Take Quiz
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
      </main>
    </div>
  );
}