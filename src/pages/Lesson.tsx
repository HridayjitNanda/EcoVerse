import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

type LessonInfo = {
  id: string;
  title: string;
  tag: "Beginner" | "Intermediate";
  duration: string;
  hero: string;
  summary: string;
  objectives: string[];
  sections: Array<{ heading: string; body: string }>;
};

const LESSONS: Record<string, LessonInfo> = {
  l1: {
    id: "l1",
    title: "Climate Change Basics",
    tag: "Beginner",
    duration: "18 min",
    hero: "https://images.unsplash.com/photo-1502301197179-65228ab57f78?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Understand what climate change is, why it's happening, and what it means for people and ecosystems. Learn the core concepts clearly so you can take meaningful action.",
    objectives: [
      "Explain the greenhouse effect with a simple analogy",
      "Identify major human drivers of climate change",
      "Differentiate weather from climate",
      "Recognize common impacts on people and nature",
      "List 5 practical actions to reduce emissions",
    ],
    sections: [
      {
        heading: "Weather vs Climate",
        body:
          "Weather describes short-term atmospheric conditions (like rain today), while climate is the long-term pattern of weather over decades. A single hot day doesn't prove climate change—but a consistent trend of rising average temperatures, changing rainfall, and more frequent extremes does.",
      },
      {
        heading: "The Greenhouse Effect (Simple Analogy)",
        body:
          "Think of Earth as wrapped in a comfortable blanket. Greenhouse gases—like CO2 and methane—trap some of the Sun's heat, keeping our planet warm enough for life. The problem? We've made the blanket too thick by burning fossil fuels, cutting forests, and industrial processes, trapping too much heat.",
      },
      {
        heading: "Human Drivers",
        body:
          "Key sources include electricity and heat from fossil fuels, transport (cars, trucks, ships, planes), industry (cement, steel), agriculture (methane from livestock, nitrous oxide from fertilizers), and deforestation (reducing carbon-absorbing trees). Each sector contributes differently across regions.",
      },
      {
        heading: "Impacts You Can See",
        body:
          "Rising sea levels threaten coastal communities; heatwaves strain health systems; shifting rainfall patterns affect crops; warming oceans bleach coral reefs and disrupt fisheries. Extreme events—floods, wildfires, storms—become more frequent or intense, affecting livelihoods globally.",
      },
      {
        heading: "Everyday Actions That Matter",
        body:
          "Cut energy waste (LED bulbs, efficient appliances), choose low-carbon transport (walk, cycle, public transit, carpool), reduce food waste, eat more plant-rich meals, and support clean energy. Small habits add up—especially when communities act together.",
      },
    ],
  },
  l2: {
    id: "l2",
    title: "Renewable Energy Sources",
    tag: "Intermediate",
    duration: "22 min",
    hero: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Learn how solar, wind, hydro, and other renewable sources generate clean power, and why grids and storage are essential for reliability.",
    objectives: [
      "Explain how solar, wind, and hydro work at a high level",
      "Compare strengths and trade-offs of major renewable sources",
      "Understand intermittency and why storage is needed",
      "Describe how modern grids balance supply and demand",
      "Identify ways households can adopt renewables",
    ],
    sections: [
      {
        heading: "Why Renewables?",
        body:
          "Renewables generate electricity without burning fossil fuels, reducing greenhouse gas emissions and air pollution. They also improve energy security by diversifying supply and reducing dependence on imported fuels.",
      },
      {
        heading: "Solar Energy Basics",
        body:
          "Solar photovoltaic (PV) panels convert sunlight directly into electricity using semiconductor materials. Rooftop solar empowers households and businesses, while utility-scale farms can power entire communities.",
      },
      {
        heading: "Wind and Hydropower",
        body:
          "Wind turbines capture kinetic energy from moving air; best performance occurs in consistently windy sites onshore or offshore. Hydropower harnesses flowing water—ranging from large dams to run-of-river systems—with predictable output but ecological trade-offs.",
      },
      {
        heading: "Intermittency and Storage",
        body:
          "Sunlight and wind vary, so output fluctuates. Batteries, pumped hydro, and thermal storage help smooth supply. Demand-side management (shifting consumption to off-peak times) also keeps grids stable and efficient.",
      },
      {
        heading: "How You Can Participate",
        body:
          "Consider rooftop solar or community solar subscriptions, choose green energy plans where available, and reduce peak-time usage. Support local policies and incentives that expand renewable adoption and grid upgrades.",
      },
    ],
  },
  l3: {
    id: "l3",
    title: "Ocean Conservation",
    tag: "Beginner",
    duration: "20 min",
    hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Discover why healthy oceans are essential to life on Earth and how to protect marine ecosystems from pollution and overuse.",
    objectives: [
      "Describe oceans' role in climate and oxygen production",
      "Identify key threats like plastics, overfishing, and warming",
      "Understand how acidification harms marine life",
      "Adopt daily habits that reduce ocean-bound pollution",
      "Support sustainable seafood and conservation efforts",
    ],
    sections: [
      {
        heading: "Why Oceans Matter",
        body:
          "Oceans produce over half of the world's oxygen, absorb significant heat and carbon dioxide, and support complex food webs. Billions depend on marine ecosystems for nutrition, jobs, and cultural identity.",
      },
      {
        heading: "Pollution and Plastics",
        body:
          "Single-use plastics break down into microplastics, entering food chains and harming wildlife. Chemical runoff and oil spills degrade habitats. Prevention—reducing waste at the source—is far more effective than cleanup alone.",
      },
      {
        heading: "Warming and Acidification",
        body:
          "Warmer waters disrupt species distribution and coral health. As oceans absorb CO2, they become more acidic, weakening shells and coral skeletons. These shifts ripple through ecosystems and coastal economies.",
      },
      {
        heading: "Overfishing and Bycatch",
        body:
          "Unsustainable fishing depletes stocks and damages habitats. Bycatch—non-target species caught unintentionally—adds further stress. Science-based quotas, protected areas, and selective gear reduce impacts.",
      },
      {
        heading: "Protecting Our Seas",
        body:
          "Choose reusable products, reduce microplastic sources (e.g., synthetic fabrics), support sustainable seafood certifications, and join local clean-ups. Advocate for policies that protect marine reserves and reduce pollution.",
      },
    ],
  },
  l4: {
    id: "l4",
    title: "Sustainable Transport",
    tag: "Beginner",
    duration: "18 min",
    hero: "https://images.unsplash.com/photo-1520975922219-b86e0b4b1a7b?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Explore low-carbon mobility options, compare emissions across modes, and learn how cities and individuals can move smarter.",
    objectives: [
      "Recognize sustainable transport modes and their benefits",
      "Compare emissions of car, transit, walking, and cycling",
      "Explain how e-bikes, EVs, and carpooling reduce footprints",
      "Plan trips to minimize time and emissions",
      "Adopt at least one greener commute habit",
    ],
    sections: [
      {
        heading: "Transport's Climate Impact",
        body:
          "Transport is a major emissions source globally. Reducing solo car trips and improving vehicle efficiency can significantly cut personal and community footprints.",
      },
      {
        heading: "Greener Mode Choices",
        body:
          "Walking and cycling have near-zero operational emissions and boost health. Public transit moves many people efficiently. Carpooling reduces per-person emissions and congestion.",
      },
      {
        heading: "Electric Mobility",
        body:
          "EVs and e-bikes lower emissions especially when powered by clean grids. They're efficient for daily commutes and short trips, reducing local air pollution and noise.",
      },
      {
        heading: "Smarter Trip Planning",
        body:
          "Combine errands, avoid peak traffic when possible, and use route planners to select low-emission routes. Remote work and flexible schedules can also cut travel demand.",
      },
      {
        heading: "City and Policy Solutions",
        body:
          "Bike lanes, safe sidewalks, reliable transit, and EV charging networks make sustainable choices easy. Support local initiatives that improve accessibility and safety.",
      },
    ],
  },
  l5: {
    id: "l5",
    title: "Water Conservation",
    tag: "Beginner",
    duration: "16 min",
    hero: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Learn where water is used most, how to detect waste, and simple ways to conserve at home and in your community.",
    objectives: [
      "Identify household water hotspots (bathroom, kitchen, laundry)",
      "Reduce daily use with easy habit changes",
      "Detect and fix leaks quickly and safely",
      "Choose efficient fixtures and appliances",
      "Promote community water stewardship",
    ],
    sections: [
      {
        heading: "Why Save Water?",
        body:
          "Freshwater is finite and unequally distributed. Conservation protects ecosystems, supports agriculture, and ensures resilience during droughts.",
      },
      {
        heading: "Daily Habits That Help",
        body:
          "Turn off taps while brushing, take shorter showers, run full loads in washers, and thaw food in the fridge instead of under running water.",
      },
      {
        heading: "Leak Detection 101",
        body:
          "Check for silent leaks by monitoring your meter, inspecting toilets for running water, and looking for damp spots. Small leaks waste surprising volumes over time.",
      },
      {
        heading: "Efficient Fixtures",
        body:
          "Install low-flow showerheads and faucet aerators, choose dual-flush or efficient toilets, and select water-efficient appliances with trusted labels.",
      },
      {
        heading: "Outdoor and Community",
        body:
          "Water plants in the early morning, use mulch to reduce evaporation, and choose native species. Support community programs that protect watersheds.",
      },
    ],
  },
  l6: {
    id: "l6",
    title: "Biodiversity Basics",
    tag: "Intermediate",
    duration: "24 min",
    hero: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Understand what biodiversity is, why it matters for people and ecosystems, and how to protect habitats locally and globally.",
    objectives: [
      "Define biodiversity and ecosystem services",
      "Identify key threats to species and habitats",
      "Explain why genetic diversity boosts resilience",
      "Support local habitat restoration and pollinators",
      "Make choices that protect nature every day",
    ],
    sections: [
      {
        heading: "What Is Biodiversity?",
        body:
          "Biodiversity includes the variety of species, ecosystems, and genetic differences within species. It underpins clean air and water, fertile soils, food, and climate resilience.",
      },
      {
        heading: "Major Threats",
        body:
          "Habitat loss, pollution, invasive species, overexploitation, and climate change erode biodiversity. These stressors often interact, magnifying overall impact.",
      },
      {
        heading: "Ecosystem Services",
        body:
          "Nature provides services like pollination, water purification, flood control, and disease regulation. When biodiversity declines, these benefits weaken or disappear.",
      },
      {
        heading: "Local Actions",
        body:
          "Create pollinator-friendly gardens, reduce pesticide use, preserve native plants, and support community conservation projects. Even balconies and small yards can help.",
      },
      {
        heading: "Protecting Habitats",
        body:
          "Back protected areas, sustainable forestry and fisheries, and responsible land-use planning. Advocate for policies that link conservation with community well-being.",
      },
    ],
  },
};

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = useMemo(() => (id ? LESSONS[id] : undefined), [id]);

  const [completedSections, setCompletedSections] = useState<Record<number, boolean>>({});

  if (!lesson) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#ffd139" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="outline"
            className="border-2 border-black bg-white text-black hover:bg-white/90"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="mt-6 rounded-lg border-4 border-black bg-white p-6">
            <h1 className="text-2xl font-extrabold">Lesson not found</h1>
            <p className="mt-2 font-semibold text-black/70">
              The lesson you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Derived progress from completed sections
  const completedCount = useMemo(() => Object.keys(completedSections).length, [completedSections]);
  const progress = Math.round((completedCount / lesson.sections.length) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffd139" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="border-2 border-black bg-white text-black hover:bg-white/90"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="border-2 border-black">{lesson.tag}</Badge>
            <div className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-sm font-bold">
              <Clock className="h-4 w-4" /> {lesson.duration}
            </div>
          </div>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 overflow-hidden rounded-xl border-4 border-black"
        >
          <div className="relative">
            <img
              src={lesson.hero}
              alt={lesson.title}
              className="h-64 w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-yellow-300/80 border-t-4 border-black">
              <div className="px-4 py-3 sm:px-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]">
                  {lesson.title}
                </h1>
                <p className="mt-1 text-sm sm:text-base font-semibold text-black/80">
                  {lesson.summary}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="mt-6">
          <Card className="border-4 border-black bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Lesson Progress
              </CardTitle>
              <CardDescription>Complete sections to earn EcoPoints</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-3 border-2 border-black" />
              <div className="mt-2 text-xs font-semibold">{progress}% complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Content grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Objectives */}
          <Card className="border-4 border-black bg-white lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" /> Objectives
              </CardTitle>
              <CardDescription>What you'll learn</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 font-semibold">
                {lesson.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="lg:col-span-2 space-y-4">
            {lesson.sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="border-4 border-black bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{s.heading}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-black/80">{s.body}</p>
                    <div className="mt-4 flex justify-end">
                      <Button
                        className="border-2 border-black"
                        disabled={!!completedSections[i]}
                        onClick={() => {
                          if (completedSections[i]) return;
                          setCompletedSections((prev) => ({ ...prev, [i]: true }));
                          toast.success("Marked as completed");
                        }}
                      >
                        {completedSections[i] ? "Completed" : "Mark Complete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm font-semibold text-black/70">
            Finish all sections to reach 100% and earn EcoPoints.
          </div>
          <Button
            className="border-2 border-black bg-[#35c163] text-black hover:bg-[#2cb25a] px-6"
            onClick={() => {
              const all: Record<number, boolean> = {};
              lesson.sections.forEach((_, idx) => {
                all[idx] = true;
              });
              setCompletedSections(all);
              navigate("/dashboard");
            }}
          >
            Finish Lesson
          </Button>
        </div>
      </div>
    </div>
  );
}