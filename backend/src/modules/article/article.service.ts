import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticleService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.article.count();
    if (count === 0) {
      await this.seed();
    }
  }

  async findAll(query?: string, category?: string) {
    return this.prisma.article.findMany({
      where: {
        AND: [
          category && category !== 'All' ? { category } : {},
          query
            ? {
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { content: { contains: query, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.article.findUnique({
      where: { slug },
    });
  }

  async seed() {
    const articles = [
      {
        title: 'Understanding Your Menstrual Phase',
        slug: 'understanding-menstrual-phase',
        excerpt: 'Your period begins. Learn what’s happening in your body and how to support yourself during this phase.',
        content: `
<h2>What happens</h2>
<p class="mb-6">Uterine lining sheds, estrogen & progesterone are at their lowest.</p>
<img src="/education/uterus_illustration.png" alt="Uterus" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />
<h2>Symptoms to expect</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Cramps</li>
  <li>Fatigue</li>
  <li>Bloating</li>
  <li>Mood dips</li>
</ul>
<img src="/education/period_cramps.png" alt="Cramps" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />
<h2>How to support yourself</h2>
<p class="mb-6">Rest, warm foods, light movement like yoga or walks.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/warm_food_menstrual.png" alt="Warm Food" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
  <img src="/education/yoga_pose.png" alt="Yoga" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
</div>
<h2>Nutrition tips</h2>
<p class="mb-6">Iron-rich foods (spinach, lentils), warm ginger tea, flax + pumpkin seeds.</p>
        `,
        category: 'Cycles',
        tags: ['Menstrual', 'Cramps', 'Rest'],
      },
      {
        title: 'Understanding Your Follicular Phase',
        slug: 'understanding-follicular-phase',
        excerpt: 'Energy rises and estrogen builds. Discover how to make the most of this high-energy phase.',
        content: `
<h2>What happens</h2>
<p class="mb-6">FSH stimulates follicle growth, estrogen rises, uterine lining rebuilds.</p>
<img src="/education/follicle_growth.png" alt="Follicle" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF6F0]" />
<h2>Symptoms to expect</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>More energy</li>
  <li>Better mood</li>
  <li>Clearer skin</li>
  <li>Increased focus</li>
</ul>
<img src="/education/woman_exercising.png" alt="Exercise" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF6F0]" />
<h2>How to support yourself</h2>
<p class="mb-6">Start new projects, exercise more, socialise.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/fresh_salad.png" alt="Salad" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
  <img src="/education/seeds_follicular.png" alt="Seeds" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
</div>
<h2>Nutrition tips</h2>
<p class="mb-6">Fermented foods, leafy greens, flax + pumpkin seeds.</p>
        `,
        category: 'Cycles',
        tags: ['Follicular', 'Energy', 'Estrogen'],
      },
      {
        title: 'Understanding Your Ovulatory Phase',
        slug: 'understanding-ovulatory-phase',
        excerpt: 'Your most fertile window. Learn what ovulation means for your body, energy, and mood.',
        content: `
<h2>What happens</h2>
<p class="mb-6">LH surge triggers egg release, estrogen peaks, progesterone begins to rise.</p>
<img src="/education/ovulation_illustration.png" alt="Ovulation" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#F5E6D3]" />
<h2>Symptoms to expect</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Peak energy</li>
  <li>High confidence</li>
  <li>Increased libido</li>
  <li>Mild cramping (mittelschmerz)</li>
</ul>
<img src="/education/confident_woman.png" alt="Confidence" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#F5E6D3]" />
<h2>How to support yourself</h2>
<p class="mb-6">High-intensity workouts, social activities, creative work.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/colourful_foods.png" alt="Foods" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
  <img src="/education/sunflower_seeds.png" alt="Seeds" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
</div>
<h2>Nutrition tips</h2>
<p class="mb-6">Zinc-rich foods (pumpkin seeds), antioxidants, sesame + sunflower seeds.</p>
        `,
        category: 'Cycles',
        tags: ['Ovulation', 'Fertility', 'Confidence'],
      },
      {
        title: 'Understanding Your Luteal Phase',
        slug: 'understanding-luteal-phase',
        excerpt: 'Progesterone rises and PMS may set in. Here’s how to navigate the second half of your cycle with ease.',
        content: `
<h2>What happens</h2>
<p class="mb-6">Progesterone peaks then drops if no pregnancy, body prepares to shed lining.</p>
<img src="/education/progesterone_chart.png" alt="Chart" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF2F4]" />
<h2>Symptoms to expect</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Bloating</li>
  <li>Mood swings</li>
  <li>Food cravings</li>
  <li>Breast tenderness</li>
  <li>Fatigue</li>
</ul>
<img src="/education/cozy_self_care.png" alt="Self Care" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF2F4]" />
<h2>How to support yourself</h2>
<p class="mb-6">Slow down, prioritise sleep, reduce caffeine, practice self-care.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/dark_chocolate.png" alt="Chocolate" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
  <img src="/education/turmeric_milk.png" alt="Turmeric Milk" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
</div>
<h2>Nutrition tips</h2>
<p class="mb-6">Magnesium-rich foods (dark chocolate, nuts), complex carbs, sesame + sunflower seeds, turmeric milk.</p>
        `,
        category: 'Cycles',
        tags: ['Luteal', 'PMS', 'Self-care'],
      },
      {
        title: 'What to Eat During Your Period',
        slug: 'nutrition-menstrual-phase',
        excerpt: 'Ease cramps and replenish lost iron with the right foods during your menstrual phase.',
        content: `
<h2>Nutrition for Your Menstrual Phase (Day 1–5)</h2>
<p class="mb-6"><strong>Focus:</strong> Replenish iron, reduce inflammation, ease cramps.</p>
<h3><span class="text-green-700">🥦</span> Veg options</h3>
<p class="mb-4">Spinach, lentils (dal), beetroot, dark chocolate, sesame seeds (til), banana, warm ginger-turmeric tea, jaggery.</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/spinach_dal.png" alt="Spinach Dal" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
  <img src="/education/ginger_tea.png" alt="Ginger Tea" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
</div>
<h3><span class="text-red-700">🍗</span> Non-Veg options</h3>
<p class="mb-4">Chicken liver, eggs, salmon (anti-inflammatory omega-3s), bone broth.</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/eggs_breakfast.png" alt="Eggs" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
  <img src="/education/dark_chocolate.png" alt="Dark Chocolate" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
</div>
<h3>What to avoid</h3>
<p class="mb-6">Caffeine, salty/processed foods, cold foods & drinks.</p>
<div class="bg-[#FFF0ED] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Eat warm, cooked meals — avoid raw salads during this phase.
</div>
        `,
        category: 'Nutrition',
        tags: ['Nutrition', 'Menstrual', 'Iron'],
      },
      {
        title: 'Fuel Your Rise: Eating for the Follicular Phase',
        slug: 'nutrition-follicular-phase',
        excerpt: 'Your energy is climbing — here’s what to eat to support estrogen and feel your best.',
        content: `
<h2>Nutrition for Your Follicular Phase (Day 6–13)</h2>
<p class="mb-6"><strong>Focus:</strong> Support estrogen production, boost energy, gut health.</p>
<h3><span class="text-green-700">🥦</span> Veg options</h3>
<p class="mb-4">Flax seeds, pumpkin seeds, fermented foods (curd/idli/dosa), broccoli, avocado, fresh fruits, quinoa.</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/seeds_follicular.png" alt="Seeds" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
  <img src="/education/fresh_salad.png" alt="Fresh Fruits/Salad" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
</div>
<h3><span class="text-red-700">🍗</span> Non-Veg options</h3>
<p class="mb-4">Eggs (especially egg whites), light fish like rohu or pomfret, lean chicken.</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/eggs_breakfast.png" alt="Eggs" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
  <img src="/education/colourful_foods.png" alt="Fresh Foods" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
</div>
<h3>What to avoid</h3>
<p class="mb-6">Heavy fried foods, excess dairy.</p>
<div class="bg-[#FDF6F0] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Great time to try new healthy recipes — your digestion is strong!
</div>
        `,
        category: 'Nutrition',
        tags: ['Nutrition', 'Follicular', 'Energy'],
      },
      {
        title: 'Eat to Ovulate: Nutrition for Your Peak Phase',
        slug: 'nutrition-ovulatory-phase',
        excerpt: 'Support ovulation and keep energy high with anti-inflammatory, hormone-friendly foods.',
        content: `
<h2>Nutrition for Your Ovulatory Phase (Day 14–16)</h2>
<p class="mb-6"><strong>Focus:</strong> Support progesterone rise, antioxidants, reduce estrogen dominance.</p>
<h3><span class="text-green-700">🥦</span> Veg options</h3>
<p class="mb-4">Sesame seeds, sunflower seeds, berries, tomatoes, leafy greens, almonds, coconut water.</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/sunflower_seeds.png" alt="Seeds" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
  <img src="/education/colourful_foods.png" alt="Colourful Foods" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
</div>
<h3><span class="text-red-700">🍗</span> Non-Veg options</h3>
<p class="mb-4">Grilled salmon, tuna, eggs, prawns (zinc-rich).</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/fresh_salad.png" alt="Fresh Veggies" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
  <img src="/education/seeds_follicular.png" alt="Seeds & Grains" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
</div>
<h3>What to avoid</h3>
<p class="mb-6">Alcohol, excess sugar, processed soy.</p>
<div class="bg-[#F5E6D3] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Eat colourful — antioxidant-rich foods protect the egg!
</div>
        `,
        category: 'Nutrition',
        tags: ['Nutrition', 'Ovulation', 'Antioxidants'],
      },
      {
        title: 'Beat PMS with Food: Luteal Phase Nutrition',
        slug: 'nutrition-luteal-phase',
        excerpt: 'Manage bloating, mood swings and cravings with magnesium-rich, comforting foods.',
        content: `
<h2>Nutrition for Your Luteal Phase (Day 17–28)</h2>
<p class="mb-6"><strong>Focus:</strong> Stabilise mood, reduce bloating, manage cravings, support progesterone.</p>
<h3><span class="text-green-700">🥦</span> Veg options</h3>
<p class="mb-4">Dark chocolate, sweet potato, banana, pumpkin, walnuts, chamomile or ashwagandha tea, turmeric milk (haldi doodh), sesame + sunflower seeds.</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/dark_chocolate.png" alt="Dark Chocolate" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
  <img src="/education/turmeric_milk.png" alt="Turmeric Milk" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
</div>
<h3><span class="text-red-700">🍗</span> Non-Veg options</h3>
<p class="mb-4">Turkey (tryptophan for mood), salmon, eggs, chicken soup.</p>
<div class="grid grid-cols-2 gap-4 my-6">
  <img src="/education/warm_food_menstrual.png" alt="Warm Meals" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
  <img src="/education/cozy_self_care.png" alt="Self Care" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
</div>
<h3>What to avoid</h3>
<p class="mb-6">Excess salt (worsens bloating), caffeine (worsens anxiety), refined sugar.</p>
<div class="bg-[#FDF2F4] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Craving chocolate? Dark chocolate (70%+) is actually beneficial — magnesium helps with cramps!
</div>
        `,
        category: 'Nutrition',
        tags: ['Nutrition', 'Luteal', 'PMS'],
      }
    ];

    for (const article of articles) {
      await this.prisma.article.upsert({
        where: { slug: article.slug },
        update: { 
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          tags: article.tags
        },
        create: article,
      });
    }
  }
}
