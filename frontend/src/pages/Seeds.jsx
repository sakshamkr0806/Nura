import React from "react";
import { CheckCircle2, Leaf, Heart } from "lucide-react";

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
      { name: "Flax seeds", image: "/seeds/flax_seeds.png" },
      { name: "Pumpkin seeds", image: "/seeds/pumpkin_seeds.png" },
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
    name: "Ovulatory Phase",
    days: "Day 14–16",
    color: "bg-[#F5E6D3]",
    seeds: [
      { name: "Sesame seeds", image: "/seeds/sesame_seeds.png" },
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
      { name: "Sesame seeds", image: "/seeds/sesame_seeds.png" },
      { name: "Sunflower seeds", image: "/seeds/sunflower_seeds.png" },
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

export default function Seeds() {
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

      {/* Section 1: Seed Cycling by Phase */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-[#F6A58E]" />
          <h2 className="text-2xl font-serif text-[#2D1F1A]">
            Seed Cycling by Phase
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {phases.map((phase) => (
            <div
              key={`seed-${phase.id}`}
              className="bg-white rounded-3xl p-6 shadow-sm border border-[#FFF0ED] hover:shadow-md transition-shadow"
            >
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
                    <div className="aspect-square rounded-2xl overflow-hidden mb-2 bg-gray-50 border border-gray-100">
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
          ))}
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
