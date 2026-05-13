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
          query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ]
          } : {}
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.article.findUnique({
      where: { slug }
    });
  }

  async seed() {
    const articles = [
      {
        title: 'Understanding Your Follicular Phase',
        slug: 'understanding-follicular-phase',
        excerpt: 'Learn about the first half of your cycle and how rising estrogen levels impact your energy.',
        content: `The follicular phase starts on the first day of your period and lasts until ovulation. During this time, the pituitary gland releases follicle-stimulating hormone (FSH). This hormone stimulates the ovaries to produce around 5 to 20 small sacs called follicles. Each follicle contains an immature egg.

Rising estrogen levels during this phase often lead to increased energy, better mood, and improved focus. It's a great time for starting new projects or engaging in high-intensity workouts.`,
        category: 'Cycles',
        tags: ['Follicular', 'Estrogen', 'Energy']
      },
      {
        title: 'Nutrition for Hormonal Balance',
        slug: 'nutrition-hormonal-balance',
        excerpt: 'Specific foods can support your hormones through different phases of your cycle.',
        content: `What you eat significantly impacts your hormonal health. During the luteal phase, focus on complex carbohydrates to stabilize blood sugar. In the follicular phase, fermented foods can support estrogen metabolism.

Key nutrients include Magnesium for muscle relaxation, Zinc for skin health, and Omega-3s for inflammation reduction.`,
        category: 'Nutrition',
        tags: ['Food', 'Health', 'Magnesium']
      },
      {
        title: 'Myth Busting: Period Pain',
        slug: 'myth-busting-period-pain',
        excerpt: 'Is "intense" pain normal? We debunk common misconceptions about menstrual discomfort.',
        content: `Myth: Extreme period pain is just part of being a woman.
Fact: While mild discomfort is common, debilitating pain that prevents daily activities is NOT normal and should be discussed with a doctor.

Many people are told to "just deal with it," but conditions like endometriosis or PCOS require clinical attention.`,
        category: 'Myth-Busting',
        tags: ['Pain', 'Safety', 'Health']
      }
    ];

    for (const article of articles) {
      await this.prisma.article.upsert({
        where: { slug: article.slug },
        update: {},
        create: article
      });
    }
  }
}
