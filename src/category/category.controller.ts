import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryIdDto } from './dto/category-id.dto';
// import { GetCategoryProductsDto } from './dto/get-category-products.dto';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get main categories' })
  @ApiResponse({
    status: 200,
    description: 'Main categories retrieved successfully',
  })
  findMainCategories() {
    return this.categoryService.findMainCategories();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get subcategories of a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Subcategories retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findSubCategories(@Param() params: CategoryIdDto) {
    const { id } = params;
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
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(
    @Param() categoryId: CategoryIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const { id } = categoryId;
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param() categoryId: CategoryIdDto) {
    const { id } = categoryId;
    return this.categoryService.remove(id);
  }
}
