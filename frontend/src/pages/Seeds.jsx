import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Leaf,
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Trash2,
} from "lucide-react";
import api from "@/api/axios";

const phases = [
  {
    id: 1,
    name: "Menstrual Phase",
    days: "Day 1–5",
    color: "bg-[#FFF0ED]",
    seeds: [
      { name: "Flax seeds", image: "/seeds/flax_seeds.png" },
      { name: "Pumpkin seeds", image: "/seeds/pumpkin_seeds.png" },
    ],
    benefits: [
      "Reduce inflammation",
      "Ease cramps",
      "Support estrogen balance",
    ],
    remedy: {
      name: "Ajwain (Carom Seed) Kadha",
      ingredients: [
        { name: "Ajwain", image: "/seeds/ajwain_seeds.png" },
        { name: "Ginger", image: "/seeds/ginger_root.png" },
        { name: "Jaggery", image: "/seeds/jaggery.png" },
      ],
      recipe:
        "Boil 1 tsp ajwain + 1 inch ginger in 2 cups water for 10 mins. Strain, add jaggery. Drink warm.",
      helpsWith: ["Cramps", "Bloating", "Heavy flow"],
    },
  },
  {
    id: 2,
    name: "Follicular Phase",
    days: "Day 6–13",
    color: "bg-[#FDF6F0]",
    seeds: [
      { name: "Sesame seeds", image: "/seeds/sesame_seeds.png" },
      { name: "Sunflower seeds", image: "/seeds/sunflower_seeds.png" },
    ],
    benefits: [
      "Boost estrogen naturally",
      "Support egg development",
      "Improve energy",
    ],
    remedy: {
      name: "Methi (Fenugreek) Seed Water",
      ingredients: [
        { name: "Methi Seeds", image: "/seeds/methi_seeds.png" },
        { name: "Lemon", image: "/seeds/lemon_slice.png" },
      ],
      recipe:
        "Soak 1 tsp methi seeds overnight in a glass of water. Drink on empty stomach in the morning.",
      helpsWith: ["Hormonal balance", "Irregular cycles", "Energy"],
    },
  },
  {
    id: 3,
    name: "Ovulation Phase",
    days: "Day 14–16",
    color: "bg-[#F5E6D3]",
    seeds: [
      { name: "Pumpkin seeds", image: "/seeds/pumpkin_seeds.png" },
      { name: "Sunflower seeds", image: "/seeds/sunflower_seeds.png" },
    ],
    benefits: [
      "Support progesterone rise",
      "Reduce estrogen dominance",
      "Boost fertility",
    ],
    remedy: {
      name: "Til (Sesame) Ladoo",
      ingredients: [
        { name: "Sesame", image: "/seeds/sesame_seeds.png" },
        { name: "Jaggery", image: "/seeds/jaggery.png" },
        { name: "Ghee", image: "/seeds/ghee.png" },
        { name: "Cardamom", image: "/seeds/cardamom.png" },
      ],
      recipe:
        "Dry roast til, melt jaggery with ghee, mix together with cardamom, shape into small balls. Eat 1–2 daily.",
      helpsWith: ["Hormonal balance", "Energy", "Uterine health"],
    },
  },
  {
    id: 4,
    name: "Luteal Phase",
    days: "Day 17–28",
    color: "bg-[#FDF2F4]",
    seeds: [
      { name: "Flax seeds", image: "/seeds/flax_seeds.png" },
      { name: "Sesame seeds", image: "/seeds/sesame_seeds.png" },
    ],
    benefits: ["Ease PMS", "Reduce bloating", "Stabilise mood swings"],
    remedy: {
      name: "Haldi Doodh (Turmeric Milk)",
      ingredients: [
        { name: "Turmeric", image: "/seeds/turmeric_powder.png" },
        { name: "Milk", image: "/seeds/glass_of_milk.png" },
        { name: "Black Pepper", image: "/seeds/black_pepper.png" },
        { name: "Honey", image: "/seeds/honey_jar.png" },
      ],
      recipe:
        "Heat 1 cup milk, add ½ tsp turmeric + pinch of black pepper + 1 tsp honey. Stir and drink warm before bed.",
      helpsWith: ["Inflammation", "Mood", "Cramps", "Sleep"],
    },
  },
];

const calculateSeedCycling = (startDate, cycleLength = 28) => {
  if (!startDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  let cycleDay = ((diffDays - 1) % cycleLength) + 1;
  if (cycleDay < 1) cycleDay = 1;

  let phase;
  let recommendedSeeds;
  let nextPhase;

  if (cycleDay <= 5) {
    phase = "Menstrual";
    recommendedSeeds = ["Flax seeds", "Pumpkin seeds"];
    nextPhase = {
      phase: "Follicular",
      daysUntil: 6 - cycleDay,
      recommendedSeeds: ["Sesame seeds", "Sunflower seeds"],
    };
  } else if (cycleDay <= 13) {
    phase = "Follicular";
    recommendedSeeds = ["Sesame seeds", "Sunflower seeds"];
    nextPhase = {
      phase: "Ovulation",
      daysUntil: 14 - cycleDay,
      recommendedSeeds: ["Pumpkin seeds", "Sunflower seeds"],
    };
  } else if (cycleDay <= 16) {
    phase = "Ovulation";
    recommendedSeeds = ["Pumpkin seeds", "Sunflower seeds"];
    nextPhase = {
      phase: "Luteal",
      daysUntil: 17 - cycleDay,
      recommendedSeeds: ["Flax seeds", "Sesame seeds"],
    };
  } else {
    phase = "Luteal";
    recommendedSeeds = ["Flax seeds", "Sesame seeds"];
    nextPhase = {
      phase: "Menstrual",
      daysUntil: cycleLength - cycleDay + 1,
      recommendedSeeds: ["Flax seeds", "Pumpkin seeds"],
    };
  }

  return {
    phase,
    day: cycleDay,
    recommendedSeeds,
    nextPhase,
  };
};

export default function Seeds() {
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [isLocalData, setIsLocalData] = useState(false);
  const [formStartDate, setFormStartDate] = useState("");
  const [formCycleLength, setFormCycleLength] = useState("28");

  const loadRecommendation = async () => {
    setLoading(true);
    try {
      const localStart = localStorage.getItem("nura_local_cycle_start");
      const localLength = localStorage.getItem("nura_local_cycle_length");

      if (localStart) {
        const lengthNum = localLength ? parseInt(localLength, 10) : 28;
        const rec = calculateSeedCycling(localStart, lengthNum);
        setRecommendation(rec);
        setIsLocalData(true);
        setFormStartDate(localStart);
        setFormCycleLength(String(lengthNum));
        setLoading(false);
        return;
      }

      const res = await api.get("/cycles/seed-cycling");
      if (res.data && res.data.phase) {
        setRecommendation(res.data);
        setIsLocalData(false);
      } else {
        setRecommendation(null);
      }
    } catch (err) {
      console.error("Failed to load seed cycling data", err);
      setRecommendation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendation();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formStartDate) return;
    const lengthNum = parseInt(formCycleLength, 10) || 28;
    localStorage.setItem("nura_local_cycle_start", formStartDate);
    localStorage.setItem("nura_local_cycle_length", String(lengthNum));

    const rec = calculateSeedCycling(formStartDate, lengthNum);
    setRecommendation(rec);
    setIsLocalData(true);
  };

  const handleClearLocal = () => {
    localStorage.removeItem("nura_local_cycle_start");
    localStorage.removeItem("nura_local_cycle_length");
    setFormStartDate("");
    setFormCycleLength("28");
    loadRecommendation();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20 fade-in">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <h1 className="text-4xl font-serif text-[#2D1F1A]">Seed Cycling Hub</h1>
        <p className="text-lg text-[#8C7B74]">
          Track your daily seed ritual and explore traditional Indian remedies
          to naturally harmonise your hormones through every phase of your
          cycle.
        </p>
      </div>

      {/* Dynamic Recommendation Section */}
      {loading ? (
        <div className="bg-white rounded-3xl p-8 border border-[#FFF0ED] flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <div className="w-6 h-6 border-2 border-t-transparent border-[#F6A58E] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#8C7B74] font-medium">
              Loading recommendations...
            </p>
          </div>
        </div>
      ) : recommendation ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#FFF0ED] relative overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Soft glassmorphic background accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFF0ED] rounded-bl-full -z-10 opacity-40" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A68A6C] bg-[#FAF7F2] border border-[#E8DCC8] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={12} className="text-[#F6A58E]" />
                  Daily Seed Recommendation
                </span>
                {isLocalData && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                    Custom Dates
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-serif text-[#2D1F1A]">
                  {recommendation.phase} Phase
                </h2>
                <p className="text-sm font-semibold text-[#8C7B74] flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#F6A58E]" />
                  Day {recommendation.day} of cycle
                </p>
              </div>

              {recommendation.nextPhase && (
                <p className="text-xs text-[#5C4D47] font-semibold bg-[#FAF7F2] border border-[#E8DCC8]/40 p-2.5 rounded-xl inline-flex items-center gap-1.5">
                  <Clock size={12} className="text-[#8C7B74]" />
                  Next Phase:{" "}
                  <strong className="text-[#2D1F1A]">
                    {recommendation.nextPhase.phase}
                  </strong>{" "}
                  in {recommendation.nextPhase.daysUntil} day
                  {recommendation.nextPhase.daysUntil > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Seeds Display */}
            <div className="bg-[#FFFAF8] border border-[#FFF0ED] p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:w-auto w-full">
              <div className="text-center sm:text-left">
                <p className="text-xs font-extrabold text-[#2D1F1A] uppercase tracking-wider mb-1">
                  Seeds to eat today:
                </p>
                <p className="text-[11px] text-[#8C7B74] font-medium leading-relaxed max-w-[180px]">
                  Eat 1 tablespoon of each daily to naturally balance hormones.
                </p>
              </div>

              <div className="flex gap-3">
                {recommendation.recommendedSeeds.map((seedName, idx) => {
                  const seedImg = seedName.toLowerCase().includes("flax")
                    ? "/seeds/flax_seeds.png"
                    : seedName.toLowerCase().includes("pumpkin")
                      ? "/seeds/pumpkin_seeds.png"
                      : seedName.toLowerCase().includes("sesame")
                        ? "/seeds/sesame_seeds.png"
                        : "/seeds/sunflower_seeds.png";

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-[#FFF0ED] shadow-sm w-20 hover:scale-105 transition-transform"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 mb-1.5 border border-gray-100 flex items-center justify-center">
                        <img
                          src={seedImg}
                          alt={seedName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#2D1F1A] text-center line-clamp-1">
                        {seedName.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {isLocalData && (
            <div className="mt-4 pt-3 border-t border-dashed border-[#FFF0ED] flex justify-end">
              <button
                onClick={handleClearLocal}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 bg-rose-50/50 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-all"
              >
                <Trash2 size={13} />
                Reset to Stored Cycle
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#FAF7F2] rounded-3xl p-6 md:p-8 shadow-sm border border-[#E8DCC8] relative overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Earthy accent pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F3E8D8] rounded-bl-full -z-10 opacity-30" />

          <div className="max-w-xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-serif text-[#4A3B32] flex items-center gap-2">
                <Calendar className="text-[#D4A373] w-5 h-5" />
                Activate Seed Cycling Recommendations
              </h2>
              <p className="text-xs text-[#8C7B74] font-medium leading-relaxed">
                We couldn't find an active cycle. Please log your period on the
                Dashboard, or enter your details below to calculate today's
                recommended seeds.
              </p>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="startDate"
                  className="text-[10px] font-extrabold text-[#4A3B32] uppercase tracking-wider block"
                >
                  Last Period Start
                </label>
                <input
                  type="date"
                  id="startDate"
                  required
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="w-full text-xs font-semibold text-[#2D1F1A] border border-[#E8DCC8] rounded-xl px-3 py-2 bg-white outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="cycleLength"
                  className="text-[10px] font-extrabold text-[#4A3B32] uppercase tracking-wider block"
                >
                  Avg Cycle Length (days)
                </label>
                <input
                  type="number"
                  id="cycleLength"
                  min="15"
                  max="45"
                  required
                  value={formCycleLength}
                  onChange={(e) => setFormCycleLength(e.target.value)}
                  className="w-full text-xs font-semibold text-[#2D1F1A] border border-[#E8DCC8] rounded-xl px-3 py-2 bg-white outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="bg-[#D4A373] hover:bg-[#C29362] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all w-full flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                Calculate Today's Seeds
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Section 1: Seed Cycling by Phase */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-[#F6A58E]" />
          <h2 className="text-2xl font-serif text-[#2D1F1A]">
            Seed Cycling by Phase
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {phases.map((phase) => {
            const isCurrent =
              recommendation &&
              recommendation.phase
                .toLowerCase()
                .includes(phase.name.toLowerCase().split(" ")[0]);

            return (
              <div
                key={`seed-${phase.id}`}
                className={`bg-white rounded-3xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md relative overflow-hidden ${
                  isCurrent
                    ? "ring-2 ring-[#F6A58E] border-transparent"
                    : "border-[#FFF0ED]"
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-[#F6A58E] text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Sparkles size={10} /> Active Phase
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-medium text-[#2D1F1A]">
                      {phase.name}
                    </h3>
                    <span className="text-sm font-medium text-[#8C7B74]">
                      {phase.days}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium text-[#2D1F1A] ${phase.color}`}
                  >
                    Phase {phase.id}
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  {phase.seeds.map((seed, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div className="aspect-square rounded-2xl overflow-hidden mb-2 bg-gray-50 border border-gray-100 flex items-center justify-center p-2 hover:scale-105 transition-transform">
                        <img
                          src={seed.image}
                          alt={seed.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-[#2D1F1A]">
                        {seed.name}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-[#8C7B74] uppercase tracking-wider">
                    Benefits
                  </p>
                  <ul className="space-y-2">
                    {phase.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-[#5C4D47]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#CDB4F6] mt-0.5 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Indian Home Remedies */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-[#D4A373]" />
          <h2 className="text-2xl font-serif text-[#2D1F1A]">
            Indian Home Remedies
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {phases.map((phase) => (
            <div
              key={`remedy-${phase.id}`}
              className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-[#E8DCC8] hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Earthy accent pattern/blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3E8D8] rounded-bl-full -z-10 opacity-50" />

              <div className="mb-6">
                <span className="text-xs font-bold text-[#A68A6C] uppercase tracking-wider block mb-1">
                  {phase.name} ({phase.days})
                </span>
                <h3 className="text-xl font-serif text-[#4A3B32]">
                  {phase.remedy.name}
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {phase.remedy.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#F3E8D8]"
                  >
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="w-6 h-6 rounded-full object-cover border border-gray-100"
                    />
                    <span className="text-xs font-medium text-[#4A3B32]">
                      {ing.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-[#A68A6C] uppercase tracking-wider mb-2">
                    Recipe
                  </p>
                  <p className="text-sm text-[#5C4D47] leading-relaxed bg-white/60 p-4 rounded-xl">
                    {phase.remedy.recipe}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#A68A6C] uppercase tracking-wider mb-2">
                    Helps With
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {phase.remedy.helpsWith.map((help, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 bg-[#E8DCC8]/50 text-[#4A3B32] rounded-md font-medium"
                      >
                        {help}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
