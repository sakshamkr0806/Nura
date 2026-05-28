import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GetCurrentUserId } from '../../common/decorators';
import { CycleService } from './cycle.service';
import { CreateCycleDto } from './dto/create-cycle.dto';

@Controller('cycles')
export class CycleController {
  constructor(private cycleService: CycleService) {}

  @Post()
  create(@GetCurrentUserId() userId: string, @Body() dto: CreateCycleDto) {
    return this.cycleService.create(userId, dto);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.cycleService.findAll(userId);
  }

  @Get('active')
  findActive(@GetCurrentUserId() userId: string) {
    return this.cycleService.findActive(userId);
  }

  @Get('predictions')
  getPredictions(@GetCurrentUserId() userId: string) {
    return this.cycleService.getPredictions(userId);
  }

  @Get('seed-cycling')
  getSeedRecommendation(@GetCurrentUserId() userId: string) {
    return this.cycleService.getUserSeedRecommendation(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: Partial<CreateCycleDto>,
  ) {
    return this.cycleService.update(id, userId, dto);
  }
}
