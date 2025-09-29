import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryIdDto } from './dto/category-id.dto';
// import { GetCategoryProductsDto } from './dto/get-category-products.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findMainCategories() {
    return this.categoryService.findMainCategories();
  }

  @Get('/:id')
  findSubCategories(@Param('id') parentId: CategoryIdDto) {
    const { id } = parentId;
    return this.categoryService.findSubCategories(id);
  }

  // @Get(':id/products')
  // async getCategoryProducts(
  //   @Param('id') id: string,
  //   @Query() query: GetCategoryProductsDto,
  // ) {
  //   // Normalize filters
  //   let normalizedFilters: Record<number, string[]> | undefined = undefined;
  //   if (query.filters) {
  //     normalizedFilters = {};
  //     for (const [attrId, values] of Object.entries(query.filters)) {
  //       normalizedFilters[Number(attrId)] = Array.isArray(values)
  //         ? values
  //         : [values];
  //     }
  //   }

  //   return this.categoryService.getCategoryProducts(
  //     id,
  //     query.page,
  //     query.limit,
  //     query.sortBy,
  //     query.order,
  //     normalizedFilters,
  //   );
  // }

  // @Get(':id/:page')
  // getCategoryProductsAndFilters(
  //   @Param('id') id: string,
  //   @Param('page') page: string,
  // ) {
  //   return this.categoryService.getCategoryProductsAndFilters(id, +page);
  // }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
