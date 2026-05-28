import { Test, TestingModule } from '@nestjs/testing';
import { CycleComputationService } from './cycle-computation.service';
import { PredictionService } from './prediction.service';
import { PrismaService } from '../../prisma/prisma.service';
import { addDays, subDays } from 'date-fns';

describe('Cycle Tracking Logic', () => {
  let computationService: CycleComputationService;
  let predictionService: PredictionService;
  let prismaService: PrismaService;

  const mockPrisma = {
    periodLog: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    cycleStats: {
      upsert: jest.fn(),
    },
    cyclePrediction: {
      create: jest.fn(),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CycleComputationService,
        PredictionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    computationService = module.get<CycleComputationService>(CycleComputationService);
    predictionService = module.get<PredictionService>(PredictionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Average cycle calculation & Irregular cycle detection', () => {
    it('should compute average cycle length and detect regular cycles', async () => {
      // 3 cycles, 28 days apart, 5 days long
      const today = new Date();
      const logs = [
        { startDate: today, endDate: addDays(today, 5) },
        { startDate: subDays(today, 28), endDate: addDays(subDays(today, 28), 5) },
        { startDate: subDays(today, 56), endDate: addDays(subDays(today, 56), 5) },
      ];
      mockPrisma.periodLog.findMany.mockResolvedValue(logs);
      mockPrisma.cycleStats.upsert.mockImplementation((args) => args.update);

      const stats = await computationService.calculateCycleStats('user1');
      expect(stats.avgCycleLength).toBe(28);
      expect(stats.avgPeriodLength).toBe(5);
      expect(stats.isIrregular).toBe(false);
    });

    it('should detect irregular cycles (std dev > 7)', async () => {
      const today = new Date();
      const logs = [
        { startDate: today, endDate: addDays(today, 5) },
        { startDate: subDays(today, 45), endDate: addDays(subDays(today, 45), 5) },
        { startDate: subDays(today, 60), endDate: addDays(subDays(today, 60), 5) },
      ];
      mockPrisma.periodLog.findMany.mockResolvedValue(logs);
      mockPrisma.cycleStats.upsert.mockImplementation((args) => args.update);

      const stats = await computationService.calculateCycleStats('user1');
      expect(stats.isIrregular).toBe(true);
    });
  });

  describe('Ovulation prediction & Late period detection', () => {
    it('should correctly predict ovulation date (next period - 14 days)', async () => {
      const stats = { avgCycleLength: 28, avgPeriodLength: 5, isIrregular: false };
      jest.spyOn(computationService, 'calculateCycleStats').mockResolvedValue(stats as any);
      
      const lastPeriodStart = new Date('2026-05-01');
      mockPrisma.periodLog.findFirst.mockResolvedValue({ startDate: lastPeriodStart });
      mockPrisma.periodLog.count.mockResolvedValue(6);
      
      let createdPrediction: any;
      mockPrisma.cyclePrediction.create.mockImplementation((args) => {
        createdPrediction = args.data;
        return args.data;
      });

      await predictionService.generatePrediction('user1');

      // Next period = May 1 + 28 days = May 29
      const expectedNext = new Date('2026-05-29');
      // Ovulation = May 29 - 14 = May 15
      const expectedOvulation = new Date('2026-05-15');

      expect(createdPrediction.predictedPeriodStart.getTime()).toEqual(expectedNext.getTime());
      expect(createdPrediction.predictedOvulationDate.getTime()).toEqual(expectedOvulation.getTime());
      expect(createdPrediction.confidenceScore).toBe('High');
    });

    it('should detect late period (> 3 days past predicted)', async () => {
      const stats = { avgCycleLength: 28, avgPeriodLength: 5, isIrregular: false };
      jest.spyOn(computationService, 'calculateCycleStats').mockResolvedValue(stats as any);
      
      // Last period was 40 days ago, making the next period predicted 12 days ago (which is > 3)
      const lastPeriodStart = subDays(new Date(), 40);
      mockPrisma.periodLog.findFirst.mockResolvedValue({ startDate: lastPeriodStart });
      mockPrisma.periodLog.count.mockResolvedValue(3);
      
      let createdPrediction: any;
      mockPrisma.cyclePrediction.create.mockImplementation((args) => {
        createdPrediction = args.data;
        return args.data;
      });

      await predictionService.generatePrediction('user1');

      expect(createdPrediction.isLate).toBe(true);
    });
  });
});
