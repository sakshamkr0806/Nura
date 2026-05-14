import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Public } from '../../common/decorators';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Public()
  @Get()
  findAll(@Query('q') query?: string, @Query('category') category?: string) {
    return this.articleService.findAll(query, category);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }
}
