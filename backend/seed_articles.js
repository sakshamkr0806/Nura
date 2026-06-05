const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const articles = [
  {
    title: '🌱 Understanding Your Menstrual Phase (Day 1–5)',
    slug: 'understanding-menstrual-phase',
    excerpt:
      'Your period begins. Learn what’s happening in your body and how to support yourself during this phase.',
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
    title: '🌸 Understanding Your Follicular Phase (Day 6–13)',
    slug: 'understanding-follicular-phase',
    excerpt:
      'Energy rises and estrogen builds. Discover how to make the most of this high-energy phase.',
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
    title: '🌕 Understanding Your Ovulatory Phase (Day 14–16)',
    slug: 'understanding-ovulatory-phase',
    excerpt:
      'Your most fertile window. Learn what ovulation means for your body, energy, and mood.',
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
    title: '🍂 Understanding Your Luteal Phase (Day 17–28)',
    slug: 'understanding-luteal-phase',
    excerpt:
      'Progesterone rises and PMS may set in. Here’s how to navigate the second half of your cycle with ease.',
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
    excerpt:
      'Ease cramps and replenish lost iron with the right foods during your menstrual phase.',
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
    excerpt:
      'Your energy is climbing — here’s what to eat to support estrogen and feel your best.',
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
    excerpt:
      'Support ovulation and keep energy high with anti-inflammatory, hormone-friendly foods.',
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
    excerpt:
      'Manage bloating, mood swings and cravings with magnesium-rich, comforting foods.',
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
  },
  {
    title: 'Nutrition for Hormonal Balance',
    slug: 'nutrition-hormonal-balance',
    excerpt:
      'Learn how stabilizing blood sugar, eating healthy fats, and supporting your liver can promote overall endocrine health.',
    content: `
<h2>Why General Nutrition Matters</h2>
<p class="mb-6">While cycle syncing is powerful, foundational nutrition is key for your hormones. Consistent blood sugar levels, healthy fat intake, and liver health lay the groundwork for optimal estrogen and progesterone production.</p>
<img src="/education/indian_healthy_foods.png" alt="Indian Healthy Foods" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#F5E6D3]" />

<h2>1. Stabilizing Blood Sugar</h2>
<p class="mb-4">Insulin spikes trigger cortisol release, which can disrupt ovulation and lead to irregular cycles. Eating balanced meals helps prevent these hormonal crashes:</p>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Combine complex carbs (oats, brown rice) with a quality protein (paneer, lentils, chicken).</li>
  <li>Ensure high fiber intake to slow down sugar absorption.</li>
</ul>

<h2>2. Healthy Fats are Hormone Builders</h2>
<p class="mb-4">Steroid hormones (estrogen, progesterone, testosterone) are synthesized from cholesterol. Eating clean, healthy fats is essential for hormone synthesis:</p>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Incorporate ghee, avocados, nuts (almonds, walnuts), and seeds (flax, chia).</li>
  <li>Use cold-pressed oils like coconut oil or olive oil for cooking.</li>
</ul>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/healthy_meal_prepping.png" alt="Meal Prepping" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
  <img src="/education/herbal_teas.png" alt="Herbal Teas" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF6F0]" />
</div>

<h2>3. Supporting Estrogen Detoxification</h2>
<p class="mb-6">The liver is responsible for filtering out excess or "dirty" estrogen. Support your liver by drinking plenty of water, eating cruciferous vegetables (cabbage, cauliflower, broccoli), and incorporating herbal infusions like dandelion root or tulsi tea.</p>

<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Start your morning with a savory, protein-rich breakfast instead of sweet cereal or fruit to prevent a morning blood sugar spike.
</div>
    `,
    category: 'Nutrition',
    tags: ['Nutrition', 'Hormones', 'Balance'],
  },
  // 🧠 Mental Health Category
  {
    title: 'Mood & Your Menstrual Cycle',
    slug: 'mood-menstrual-cycle',
    excerpt:
      'Learn how estrogen and progesterone affect your mood, anxiety, and emotions across the different phases of your cycle.',
    content: `
<h2>The Hormonal Emotional Rollercoaster</h2>
<p class="mb-6">Hormones are powerful chemical messengers. Throughout your 28-day cycle, estrogen and progesterone fluctuate significantly, impacting neurotransmitters in the brain like serotonin and dopamine, which regulate mood, sleep, and emotional stability.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/calm_woman_journaling.png" alt="Journaling" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
  <img src="/education/hormone_chart_illustration.png" alt="Hormone Chart" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
</div>

<h2>What to Expect in Each Phase</h2>
<h3 class="font-bold text-base mt-4 mb-2 text-[#C87B7B]">🌱 Menstrual Phase (Low Mood, Introspective)</h3>
<p class="mb-4">With both estrogen and progesterone at their lowest, you may feel tired, quiet, and introspective. Serotonin levels can dip, leading to mild sadness or a desire for solitude. Embrace this time for reflection and rest.</p>

<h3 class="font-bold text-base mt-4 mb-2 text-[#5A8A4E]">🌸 Follicular Phase (Happy, Focused, Confident)</h3>
<p class="mb-4">As estrogen begins to rise, it boosts serotonin and dopamine. You will likely feel a sense of optimism, increased mental clarity, social energy, and emotional resilience.</p>

<h3 class="font-bold text-base mt-4 mb-2 text-[#C86A4E]">🌕 Ovulatory Phase (Peak Social & Libido)</h3>
<p class="mb-4">Estrogen peaks, creating high confidence and low anxiety. You are naturally more communicative, collaborative, and biologically driven to connect with others.</p>
<img src="/education/confident_woman.png" alt="Confident Woman" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#F5E6D3]" />

<h3 class="font-bold text-base mt-4 mb-2 text-[#7B5EA7]">🍂 Luteal Phase (Anxiety, Irritability, Cravings)</h3>
<p class="mb-4">Progesterone rules the first half of this phase, acting as a natural sedative. However, as it drops off in the second half, it can trigger PMS symptoms: irritability, mood swings, crying spells, and heightened anxiety.</p>

<h2>Tips for Emotional Regulation</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li><strong>Journal daily:</strong> Track your moods to recognize cyclic patterns and separate your feelings from temporary hormonal dips.</li>
  <li><strong>Adjust your schedule:</strong> Plan high-intensity meetings or social outings during your follicular/ovulatory phases, and schedule quiet downtime during your menstrual phase.</li>
  <li><strong>Mindful breathing:</strong> Practice 5 minutes of deep belly breathing to calm cortisol spikes during the luteal phase.</li>
</ul>
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Create a "Phase Plan" in your journal, listing self-care tasks tailored to your energy levels so you can review it when feeling low.
</div>

<h2>When to Seek Professional Support</h2>
<p class="mb-6">If your mood swings feel unmanageable, cause severe disruption to your relationships or work, or lead to feelings of hopelessness, seek support from a healthcare professional. You could be experiencing PMDD, a severe and treatable form of premenstrual distress.</p>
    `,
    category: 'Mental Health',
    tags: ['Mood', 'Mental Health', 'Hormones'],
  },
  {
    title: 'Managing PMS & PMDD',
    slug: 'managing-pms-pmdd',
    excerpt:
      'Understand the difference between PMS and PMDD, recognize the symptoms, and explore natural remedies vs medical options.',
    content: `
<h2>PMS vs. PMDD: Knowing the Difference</h2>
<p class="mb-6">Premenstrual Syndrome (PMS) affects up to 80% of women with mild to moderate physical and emotional symptoms. Premenstrual Dysphoric Disorder (PMDD) is a severe, chronic medical condition affecting 3-8% of women, characterized by debilitating emotional distress that disrupts daily functioning.</p>
<img src="/education/woman_stressed_calm.png" alt="Stress to Calm" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF2F4]" />

<h2>Recognizing the Symptoms</h2>
<p class="mb-4">Symptoms range from physical changes to severe psychological disturbances. Recognizing where you fall can help guide clinical treatment:</p>
<img src="/education/period_pain_myth.png" alt="Doctor Consultation" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF2F4]" />
<h3>Standard PMS Symptoms:</h3>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Mild irritability, fatigue, and bloating</li>
  <li>Minor sleep disturbances</li>
  <li>Temporary breast tenderness</li>
</ul>

<h3>Severe PMDD Red Flags:</h3>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Severe clinical depression or extreme hopelessness</li>
  <li>Intense anger, conflict, or panic attacks</li>
  <li>Inability to concentrate or complete basic daily tasks</li>
</ul>

<h2>Natural Remedies and Self-Care</h2>
<p class="mb-6">Many cycle symptoms can be managed naturally through lifestyle changes:</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/cozy_self_care.png" alt="Cozy Self Care" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
  <img src="/education/dark_chocolate.png" alt="Dark Chocolate" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
</div>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li><strong>Supplementation:</strong> Calcium, Vitamin B6, and Magnesium are clinically shown to reduce premenstrual anxiety and cramping.</li>
  <li><strong>Dietary tweaks:</strong> Reducing sodium, caffeine, and alcohol in the luteal phase helps regulate mood swings and bloating.</li>
  <li><strong>Consistent exercise:</strong> Aerobic exercise releases endorphins that counteract progesterone crashes.</li>
</ul>

<h2>Medical Treatment Paths</h2>
<p class="mb-6">If natural treatments aren't enough, doctors may recommend targeted options like selective serotonin reuptake inhibitors (SSRIs) taken during the luteal phase, or specific hormonal therapies to suppress ovulation. Talk to your gynecologist or therapist to find your path.</p>

<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Keep a symptom diary for at least two full cycles. Accurate tracking is the most powerful tool for diagnosing PMDD.
</div>
    `,
    category: 'Mental Health',
    tags: ['PMDD', 'PMS', 'Therapy'],
  },
  {
    title: 'Cycle & Sleep Connection',
    slug: 'cycle-sleep-connection',
    excerpt:
      'How hormonal shifts disrupt sleep in your luteal phase, and evidence-based tips to rest peacefully.',
    content: `
<h2>Why Hormones Rule Your Sleep</h2>
<p class="mb-6">Does your sleep quality drop right before your period? You are not alone. Progesterone levels rise rapidly after ovulation and then plummet right before menstruation, directly impacting your body temperature regulation, REM cycles, and melatonin production.</p>
<img src="/education/woman_sleeping_peacefully.png" alt="Sleeping Peacefully" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF2F4]" />

<h2>Sleep Quality Across Your Cycle</h2>
<h3 class="font-bold text-base mt-4 mb-2 text-[#5A8A4E]">🌱 Follicular Phase (Deep Sleep)</h3>
<p class="mb-4">With estrogen rising, your sleep is generally deeper, and you awaken feeling more refreshed. Your resting body temperature is lower, promoting better sleep hygiene.</p>

<h3 class="font-bold text-base mt-4 mb-2 text-[#7B5EA7]">🍂 Luteal Phase (Disrupted Sleep & Insomnia)</h3>
<p class="mb-4">Progesterone raises your basal body temperature by up to 0.5°C, making you feel hot at night. The sudden premenstrual drop in hormones can trigger vivid dreams, nighttime awakenings, and insomnia.</p>

<h2>Evidence-Based Sleep Hygiene Tips</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li><strong>Cool your room:</strong> Keep your thermostat slightly cooler (around 18°C / 65°F) during the luteal phase to counteract your elevated body temperature.</li>
  <li><strong>Golden Milk:</strong> Enjoy a warm cup of turmeric-infused milk before bed to ease inflammation and relax muscle tension.</li>
  <li><strong>Limit screens:</strong> Avoid blue light for 1 hour before bed to help your brain produce natural melatonin.</li>
</ul>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/bedtime_routine.png" alt="Bedtime Routine" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
  <img src="/education/ovulation_illustration.png" alt="Moon Illustration" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
</div>
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Keep your room temperature at 18°C (65°F) during your luteal phase to counteract the progesterone-induced temperature rise.
</div>
    `,
    category: 'Mental Health',
    tags: ['Sleep', 'Melatonin', 'Luteal'],
  },
  // 🚫 Myth-Busting Category
  {
    title: 'Myth: Period Pain is Normal & You Should Just Bear It',
    slug: 'myth-period-pain-normal',
    excerpt:
      'Debunking the age-old myth that severe period pain is normal. Learn when cramping is a red flag for conditions like endometriosis or PCOS.',
    content: `
<h2>The Truth About Menstrual Cramping</h2>
<p class="mb-6">While mild pelvic discomfort or a dull ache is a common response to uterine contractions, severe, debilitating pain that leaves you bedridden, missing school, or dependent on heavy painkillers is <strong>not normal</strong>.</p>
<img src="/education/period_pain_myth.png" alt="Patient and Doctor" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />

<h2>When Cramps Are Red Flags</h2>
<p class="mb-4">Severe pain is often a sign of secondary discomfort caused by underlying reproductive conditions:</p>
<img src="/education/woman_in_pain.png" alt="Woman in Pain" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li><strong>Endometriosis:</strong> A painful condition where tissue similar to the lining of the uterus grows outside the uterus (on ovaries, fallopian tubes, or bladder).</li>
  <li><strong>Adenomyosis:</strong> When the lining tissue grows directly into the muscular wall of the uterus.</li>
  <li><strong>PCOS (Polycystic Ovary Syndrome):</strong> Can cause irregular, heavy, and unusually painful periods due to cystic follicles.</li>
</ul>

<h2>When to Consult a Doctor</h2>
<p class="mb-6">If your menstrual pain is accompanied by heavy bleeding, pain during intercourse, chronic lower back pain, or digestive issues, schedule a comprehensive consultation with a gynecologist. Advocating for your health starts with realizing you do not have to live in pain.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/period_pain_myth.png" alt="Doctor Consultation" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
  <img src="/education/uterus_illustration.png" alt="Uterus Illustration" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
</div>
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Keep a log of your pain scale (1-10) and whether it affects your ability to perform daily tasks. This is highly useful context for your doctor.
</div>
    `,
    category: 'Myth-Busting',
    tags: ['Myth-Busting', 'Pain', 'Endometriosis'],
  },
  {
    title: 'Myth: You Can’t Get Pregnant During Your Period',
    slug: 'myth-pregnant-during-period',
    excerpt:
      'Can you conceive on your period? We explain the science of sperm survival, early ovulation, and why you should stay protected.',
    content: `
<h2>The Biology of Conception</h2>
<p class="mb-6">Many believe that active menstrual bleeding guarantees a safe, non-fertile window. While the probability is lower, it is biologically possible to get pregnant from intercourse that occurs during your period.</p>
<img src="/education/calendar_cycle_days.png" alt="Cycle Days" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />

<h2>How Conception Happens During Bleeding</h2>
<h3>1. Sperm Longevity</h3>
<p class="mb-4">Once inside the female reproductive tract, healthy sperm can survive and remain fertile for up to <strong>5 days</strong>, waiting for an egg to be released.</p>

<h3>2. Short Cycles and Early Ovulation</h3>
<p class="mb-4">If you have a shorter-than-average cycle (e.g., 21-24 days), ovulation can happen as early as day 7 or 8 of your cycle. If you have intercourse on day 3 of your period, sperm can easily survive until ovulation occurs, leading to fertilization.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/calendar_cycle_days.png" alt="Calendar Days" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
  <img src="/education/sperm_illustration.png" alt="Sperm Illustration" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
</div>

<h2>Summary Advice</h2>
<p class="mb-6">Unless you are actively tracking your biological biomarkers (like basal body temperature and cervical mucus) and have a highly regular cycle, always use protection if you want to avoid pregnancy. Do not rely solely on the calendar or active bleeding as a contraceptive method.</p>
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Real-time ovulation tracking using LH strips or basal body temperature is much safer than relying on standard 28-day calendar math.
</div>
    `,
    category: 'Myth-Busting',
    tags: ['Myth-Busting', 'Fertility', 'Contraception'],
  },
  {
    title: 'Myth: Irregular Periods are Always Normal',
    slug: 'myth-irregular-periods-normal',
    excerpt:
      'What defines an irregular cycle, what causes it, and when should you seek a professional medical opinion?',
    content: `
<h2>What is an Irregular Period?</h2>
<p class="mb-6">Your cycle is considered irregular if it is consistently shorter than 21 days, longer than 35 days, or varies dramatically in length from month to month. While occasional irregularity due to stress or travel is normal, chronic irregularity points to systemic issues.</p>
<img src="/education/period_tracker_app.png" alt="Tracker App" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />

<h2>Common Causes of Irregular Cycles</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li><strong>PCOS:</strong> Hormonal imbalance leading to enlarged ovaries with small cysts on the outer edges.</li>
  <li><strong>Thyroid dysfunction:</strong> Hypothyroidism or hyperthyroidism affects metabolism and cycle regulation.</li>
  <li><strong>Nutritional deficiency:</strong> Extreme dieting, low body weight, or intense overtraining can suppress ovulation (hypothalamic amenorrhea).</li>
</ul>

<h2>When to Speak with a Gynecologist</h2>
<p class="mb-6">If your period is consistently missing for over 3 months, if your cycles are highly unpredictable, or if irregularity is paired with acne, hair loss, or sudden weight gain, request a blood panel and pelvic ultrasound. Tracking your cycle with Nura provides your doctor with invaluable diagnostic history.</p>
<img src="/education/period_pain_myth.png" alt="Woman with Doctor" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> If your cycle is consistently shorter than 21 days or longer than 35 days, log these dates and schedule a routine blood panel test.
</div>
    `,
    category: 'Myth-Busting',
    tags: ['Myth-Busting', 'Irregular', 'PCOS'],
  },
  // 🌿 Lifestyle Category
  {
    title: 'Exercise & Your Cycle: Train Smarter',
    slug: 'exercise-cycle-train-smarter',
    excerpt:
      'Optimize your fitness by aligning workouts with your cycle phases — from restorative rest to high-intensity training.',
    content: `
<h2>Why Work Out with Your Cycle?</h2>
<p class="mb-6">Your cardiovascular capacity, muscle recovery, and energy levels shift in response to estrogen and progesterone. By syncing your exercises with your biology, you can build lean muscle, recover faster, and avoid hormonal exhaustion.</p>
<img src="/education/running.png" alt="Running" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FDF6F0]" />

<h2>How to Train in Each Phase</h2>
<h3 class="font-bold text-base mt-4 mb-2 text-[#C87B7B]">🌱 Menstrual Phase (Rest & Restore)</h3>
<p class="mb-4"><strong>Best:</strong> Yoga, walking, gentle stretching.<br />Focus on resting your joints and lower back. Heavy lifting or high-intensity cardio should be avoided as your body requires energy for uterine contractions.</p>

<h3 class="font-bold text-base mt-4 mb-2 text-[#5A8A4E]">🌸 Follicular Phase (Build & Lift)</h3>
<p class="mb-4"><strong>Best:</strong> Strength training, running, power yoga.<br />As estrogen rises, your tolerance for pain and stamina increases. Great time to focus on progressive overload and lifting heavier weights.</p>

<h3 class="font-bold text-base mt-4 mb-2 text-[#C86A4E]">🌕 Ovulatory Phase (High Intensity)</h3>
<p class="mb-4"><strong>Best:</strong> HIIT, spin class, competitive sports.<br />With peak estrogen and a surge in testosterone, your energy is at its maximum. This is the optimal window to push for personal records and explosive movements.</p>

<h3 class="font-bold text-base mt-4 mb-2 text-[#7B5EA7]">🍂 Luteal Phase (Moderate Cardio & Strength)</h3>
<p class="mb-4"><strong>Best:</strong> Pilates, steady-state jog, light resistance training.<br />Progesterone raises body temperature and makes recovery slower. Shift to moderate effort and prioritize flexibility and recovery.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/woman_exercising.png" alt="HIIT Workouts" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
  <img src="/education/yoga_pose.png" alt="Yoga Pose" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FFF0ED]" />
</div>
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Never force high-intensity workouts during your period. Rest is active cycle-syncing, too!
</div>
    `,
    category: 'Lifestyle',
    tags: ['Exercise', 'Fitness', 'Biohacking'],
  },
  {
    title: 'Cycle Syncing Your Diet',
    slug: 'cycle-syncing-your-diet',
    excerpt:
      'How to nourish your body through all four phases of your cycle. Learn to coordinate foods with hormonal fluctuations.',
    content: `
<h2>The Power of Nutritional Alignment</h2>
<p class="mb-6">Your caloric needs and metabolic rate are not static. During your cycle, the body requires different micronutrients to metabolize hormones, replenish iron, and stabilize insulin levels. Syncing your diet supports ovulatory health and eases PMS.</p>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/colourful_foods.png" alt="Colourful Foods" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
  <img src="/education/indian_healthy_foods.png" alt="Indian Healthy Foods" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#F5E6D3]" />
</div>

<h2>Your Phase-by-Phase Plate</h2>
<h3>🌱 Menstrual: Warming & Iron-Rich</h3>
<p class="mb-4">Eat cooked, warming meals. Focus on iron-rich foods (spinach, lentils, red meat) and anti-inflammatory teas like ginger or chamomile.</p>

<h3>🌸 Follicular: Light & Fermented</h3>
<p class="mb-4">Digestion is strong, and estrogen requires liver clearance. Focus on cruciferous veggies (broccoli, cauliflower), fresh salads, and fermented foods (yogurt, kimchi).</p>

<h3>🌕 Ovulatory: Antioxidants & Fiber</h3>
<p class="mb-4">Egg health requires glutathione and zinc. Eat colorful berries, pumpkin seeds, raw carrots, and plenty of hydrating fruits.</p>

<h3>🍂 Luteal: Complex Carbs & Magnesium</h3>
<p class="mb-4">Your metabolism increases by 100-300 calories. Avoid blood sugar crashes by eating complex carbs (sweet potatoes, oats) and magnesium-rich dark chocolate to calm cramps.</p>
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Coordinate your seed cycling along with your diet: flax and pumpkin seeds in the first half of your cycle, and sesame and sunflower seeds in the second half.
</div>
    `,
    category: 'Lifestyle',
    tags: ['Diet', 'Nutrition', 'Lifestyle'],
  },
  {
    title: 'Stress & Hormonal Balance',
    slug: 'stress-hormonal-balance',
    excerpt:
      'Cortisol can make or break your menstrual health. Explore how stress affects your cycle, and daily tips like meditation and breathwork.',
    content: `
<h2>The Cortisol-Progesterone Connection</h2>
<p class="mb-6">When you experience chronic physical or psychological stress, your adrenal glands prioritize the production of cortisol (the stress hormone) over progesterone. This hormonal imbalance is a common trigger for painful cramps, severe PMS, and missed periods.</p>
<img src="/education/woman_meditating_flowers.png" alt="Meditating" class="w-full h-auto rounded-3xl my-8 object-cover border border-[#FFF0ED]" />

<h2>How Stress Disrupts Your Cycle</h2>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li><strong>Delayed Ovulation:</strong> High stress signals the brain that it is unsafe to support a pregnancy, postponing or preventing ovulation.</li>
  <li><strong>Shortened Luteal Phase:</strong> Insufficient progesterone production leads to early spotting and mood swings.</li>
  <li><strong>Painful Menstruation:</strong> Stress triggers the release of prostaglandins, causing stronger uterine contractions and cramping.</li>
</ul>

<h2>Daily Stress Management Rituals</h2>
<div class="grid grid-cols-2 gap-4 my-8">
  <img src="/education/herbal_teas.png" alt="Herbal Teas" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
  <img src="/education/turmeric_milk.png" alt="Hot Drink" class="w-full h-auto aspect-square rounded-3xl object-cover border border-[#FDF2F4]" />
</div>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li><strong>Breathwork (Box Breathing):</strong> Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. This immediately triggers the parasympathetic nervous system to lower cortisol.</li>
  <li><strong>Hormone-Soothing Teas:</strong> Incorporate chamomile, ashwagandha, or hot turmeric milk to calm the nervous system in the evening.</li>
  <li><strong>Nature Walks:</strong> Spending 20 minutes outside in greenery is clinically proven to reduce stress biomarkers.</li>
</ul>
<div class="bg-[#FFF9F6] p-4 rounded-xl border border-[#F6A58E] my-6">
  <strong>💡 Tip:</strong> Try drinking warm Tulsi or Brahmi tea in the late afternoon to support your adrenals and naturally lower cortisol levels.
</div>
    `,
    category: 'Lifestyle',
    tags: ['Stress', 'Cortisol', 'Self-Care'],
  },
];

async function main() {
  console.log('Seeding articles in database...');
  try {
    for (const article of articles) {
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          tags: article.tags,
        },
        create: article,
      });
    }
    console.log('Articles seeded successfully!');
  } catch (e) {
    console.error('Failed to seed articles:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
