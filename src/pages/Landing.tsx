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

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const ticker = [
    { label: "HFT", value: "$0.0032", delta: "+12.4%" },
    { label: "MKT CAP", value: "$12.5M", delta: "+4.3%" },
    { label: "LIQUIDITY", value: "$2.1M", delta: "Locked" },
    { label: "HOLDERS", value: "24,382", delta: "+281" },
  ];

  const tokenomics = [
    { title: "Liquidity", percent: "55%", desc: "Locked for stability", icon: <Shield className="h-5 w-5" /> },
    { title: "Community", percent: "30%", desc: "AirDrops & rewards", icon: <Stars className="h-5 w-5" /> },
    { title: "Treasury", percent: "10%", desc: "Ecosystem growth", icon: <TrendingUp className="h-5 w-5" /> },
    { title: "Team", percent: "5%", desc: "Vested & transparent", icon: <Wallet className="h-5 w-5" /> },
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Ignition",
      items: ["Launch & Liquidity", "CMC/CG Listings", "1K Holders"],
    },
    {
      phase: "Phase 2",
      title: "Momentum",
      items: ["Staking & Rewards", "Meme Contest", "10K Holders"],
    },
    {
      phase: "Phase 3",
      title: "Orbit",
      items: ["CEX Listings", "Brand Partnerships", "50K Holders"],
    },
  ];

  const howToBuy = [
    {
      title: "Create/Use Wallet",
      desc: "Install a crypto wallet (e.g., MetaMask) or use your existing one.",
      icon: <Wallet className="h-6 w-6" />,
    },
    {
      title: "Add Funds",
      desc: "Buy ETH/BNB/SOL on your preferred on-ramp and send it to your wallet.",
      icon: <Coins className="h-6 w-6" />,
    },
    {
      title: "Swap for HFT",
      desc: "Use your DEX of choice and paste our token address to swap.",
      icon: <Flame className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(59,130,246,.15),transparent),radial-gradient(900px_500px_at_110%_10%,rgba(99,102,241,.15),transparent)] dark:bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(59,130,246,.2),transparent),radial-gradient(900px_500px_at_110%_10%,rgba(99,102,241,.2),transparent)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="CopyVault" className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Hempy Fan Token
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/auth")}>Buy HFT</Button>
            {!isLoading && (
              isAuthenticated ? (
                <Button onClick={() => navigate("/dashboard")}>
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Ticker */}
      <div className="border-y bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-[100vw] overflow-hidden">
          <div className="flex whitespace-nowrap animate-[marquee_24s_linear_infinite] py-3">
            {[...ticker, ...ticker].map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-6">
                <span className="text-xs font-semibold text-gray-500">{t.label}</span>
                <span className="text-sm font-bold">{t.value}</span>
                <span className={`text-xs ${t.delta.includes("+") ? "text-green-600" : "text-amber-500"}`}>
                  {t.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-white/70 dark:bg-gray-800/70">
                <Rocket className="h-4 w-4 text-indigo-600" />
                Launched • 24,000+ holders
              </div>
              <h1 className="mt-4 text-4xl sm:text-6xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                The Meme Token with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Real Community Power
                </span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                Meet Hempy—your fan-fueled rocket to the moon. Community-first, liquidity locked,
                and built for fun, rewards, and long-term vibes.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="text-base" onClick={() => navigate("/auth")}>
                  Buy on DEX <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-base" onClick={() => navigate("/auth")}>
                  View Chart
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Liquidity Locked
                </div>
                <div className="flex items-center gap-2">
                  <Stars className="h-4 w-4" /> Fair Launch
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Hyper Deflationary
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated Mascots */}
          <div className="relative">
            <motion.div
              className="relative mx-auto aspect-square w-full max-w-md rounded-3xl border bg-white/60 dark:bg-gray-900/60 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              {/* Coin */}
              <motion.div
                className="absolute -top-6 -left-4"
                animate={{ y: [0, -12, 0], rotate: [0, -6, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border-4 border-amber-200 shadow-inner grid place-items-center text-3xl">
                  🪙
                </div>
              </motion.div>

              {/* Hempy character */}
              <motion.div
                className="absolute inset-0 grid place-items-center"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
              >
                <div className="text-[110px] sm:text-[140px] select-none">🌿</div>
              </motion.div>

              {/* Side sticker */}
              <motion.div
                className="absolute -right-6 top-8"
                animate={{ y: [0, 8, 0], rotate: [0, 4, -2, 0] }}
                transition={{ duration: 3.6, repeat: Infinity }}
              >
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white grid place-items-center text-3xl">
                  😼
                </div>
              </motion.div>

              {/* Sparkles */}
              <motion.div
                className="absolute bottom-6 left-8 text-2xl"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute bottom-10 right-10 text-2xl"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.6, repeat: Infinity }}
              >
                ✨
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-white/50 dark:bg-gray-800/50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Locked Liquidity",
              desc: "Security-first design keeps the floor steady.",
            },
            {
              icon: <Stars className="h-6 w-6" />,
              title: "Community Rewards",
              desc: "Win airdrops, contests, and weekly giveaways.",
            },
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "Deflationary Mechanics",
              desc: "Periodic burns and buybacks for scarcity.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 grid place-items-center text-blue-700 dark:text-blue-200">
                    {f.icon}
                  </div>
                  <CardTitle className="mt-2 text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{f.desc}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tokenomics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Tokenomics</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Transparent distribution designed for long-term sustainability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {tokenomics.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 grid place-items-center text-indigo-700 dark:text-indigo-200">
                      {t.icon}
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t.title}</CardTitle>
                      <span className="text-indigo-600 dark:text-indigo-300 font-bold">{t.percent}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{t.desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Buy */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How to Buy</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Three simple steps to join the Hempy fam.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howToBuy.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900 grid place-items-center text-emerald-700 dark:text-emerald-200">
                      {s.icon}
                    </div>
                    <CardTitle className="text-xl">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{s.desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Buy HFT Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Roadmap</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Milestones to orbit and beyond.</p>
          </div>
          <div className="space-y-6">
            {roadmap.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 grid place-items-center text-purple-700 dark:text-purple-200">
                        <Rocket className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-xl">{r.phase} • {r.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {r.items.map((it, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Check className="h-4 w-4 text-green-600" /> {it}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="rounded-3xl border bg-white/60 dark:bg-gray-900/60 backdrop-blur-md p-8 text-center"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white">
              <Rocket className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight">Join the Hempy Movement</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Get in early. Get rewarded. Let's take this rocket together.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              {!isLoading && !isAuthenticated && (
                <Button size="lg" onClick={() => navigate("/auth")}>
                  Start Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
                View Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="CopyVault" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight">Hempy Fan Token</span>
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>© 2024 Hempy Fan Token. All rights reserved.</p>
            <p className="mt-1">
              Built with ❤️ by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                vly.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Keyframes */}
      <style>
        {`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}
      </style>
    </div>
  );
}