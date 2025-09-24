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
    duration: "15 min",
    hero: "https://images.unsplash.com/photo-1502301197179-65228ab57f78?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Learn about the fundamentals of climate change and its impact on our planet. Understand causes, effects, and everyday actions you can take.",
    objectives: [
      "Explain the greenhouse effect in simple terms",
      "Recognize key human activities driving warming",
      "List 3 everyday actions to reduce emissions",
    ],
    sections: [
      {
        heading: "What is Climate Change?",
        body:
          "Climate change refers to long-term shifts in temperatures and weather patterns. While these shifts can be natural, human activities—primarily the burning of fossil fuels—have been the main driver since the 1800s.",
      },
      {
        heading: "Greenhouse Effect",
        body:
          "Certain gases trap heat in the atmosphere—like a blanket around Earth. This natural effect keeps our planet warm, but excess greenhouse gases cause too much warming.",
      },
      {
        heading: "What You Can Do",
        body:
          "Use public transit or cycle for short trips, reduce energy waste at home, and choose climate-friendly foods more often.",
      },
    ],
  },
  l2: {
    id: "l2",
    title: "Renewable Energy Sources",
    tag: "Intermediate",
    duration: "20 min",
    hero: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Explore solar, wind, hydro, and more. See how renewables power communities while cutting carbon emissions.",
    objectives: [
      "Differentiate common renewable sources",
      "Understand intermittency and storage basics",
      "Identify where renewables fit in daily life",
    ],
    sections: [
      {
        heading: "Why Renewables?",
        body:
          "Renewables produce electricity without burning fossil fuels, lowering greenhouse gas emissions and air pollution.",
      },
      {
        heading: "Common Sources",
        body:
          "Solar panels capture sunlight; wind turbines harvest moving air; hydropower taps flowing water. Each has pros, cons, and ideal locations.",
      },
      {
        heading: "Storage & Grids",
        body:
          "Batteries and smart grids help balance supply and demand, keeping reliable power even when the sun or wind is low.",
      },
    ],
  },
  l3: {
    id: "l3",
    title: "Ocean Conservation",
    tag: "Beginner",
    duration: "18 min",
    hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Understand the importance of protecting our oceans and marine life. Learn how pollution and overfishing threaten ecosystems.",
    objectives: [
      "Describe why healthy oceans matter",
      "Recognize key threats like plastics and overfishing",
      "Adopt habits that reduce ocean pollution",
    ],
    sections: [
      {
        heading: "Why Oceans Matter",
        body:
          "Oceans regulate climate, produce oxygen, and support billions of livelihoods. They're home to incredible biodiversity.",
      },
      {
        heading: "Main Threats",
        body:
          "Plastic pollution, warming waters, acidification, and overfishing harm marine life and coastal communities.",
      },
      {
        heading: "Protecting Our Seas",
        body:
          "Cut single-use plastics, support sustainable seafood, and join local clean-ups to keep waterways healthy.",
      },
    ],
  },
  l4: {
    id: "l4",
    title: "Sustainable Transport",
    tag: "Beginner",
    duration: "16 min",
    hero: "https://images.unsplash.com/photo-1520975922219-b86e0b4b1a7b?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Discover low-carbon travel choices and how cities and individuals can move smarter and greener.",
    objectives: [
      "Recognize sustainable transport modes",
      "Compare emissions across commute options",
      "Adopt at least one greener travel habit",
    ],
    sections: [
      {
        heading: "Why Transport Matters",
        body:
          "Transport is a major source of greenhouse gas emissions. Shifting to cleaner modes can greatly reduce your footprint.",
      },
      {
        heading: "Greener Commute Options",
        body:
          "Walking, cycling, public transit, and carpooling reduce emissions. E-bikes and e-scooters are great for short trips.",
      },
      {
        heading: "Plan Your Trip",
        body:
          "Use route planners to combine modes, avoid traffic, and pick the lowest-emission option that fits your time.",
      },
    ],
  },
  l5: {
    id: "l5",
    title: "Water Conservation",
    tag: "Beginner",
    duration: "14 min",
    hero: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Learn practical ways to save water at home and in your community to protect this essential resource.",
    objectives: [
      "Understand household water hotspots",
      "Apply quick-saving habits daily",
      "Spot and fix leaks efficiently",
    ],
    sections: [
      {
        heading: "The Value of Water",
        body:
          "Freshwater is limited. Conserving it supports ecosystems, agriculture, and future generations.",
      },
      {
        heading: "Easy Savings at Home",
        body:
          "Turn off taps when not in use, run full loads in washers, and take shorter showers to cut daily use.",
      },
      {
        heading: "Detect Leaks",
        body:
          "Small leaks waste huge volumes over time. Check faucets, toilets, and outdoor hoses regularly.",
      },
    ],
  },
  l6: {
    id: "l6",
    title: "Biodiversity Basics",
    tag: "Intermediate",
    duration: "22 min",
    hero: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    summary:
      "Explore why biodiversity matters and how we can protect habitats for a thriving planet.",
    objectives: [
      "Define biodiversity and ecosystem services",
      "Identify major threats to species",
      "Support local biodiversity actions",
    ],
    sections: [
      {
        heading: "What is Biodiversity?",
        body:
          "Biodiversity is the variety of life on Earth. It supports clean air, water, food, and resilience.",
      },
      {
        heading: "Key Threats",
        body:
          "Habitat loss, pollution, invasive species, and climate change all reduce biodiversity worldwide.",
      },
      {
        heading: "Protecting Habitats",
        body:
          "Create pollinator-friendly spaces, reduce chemical use, and support conservation efforts locally.",
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