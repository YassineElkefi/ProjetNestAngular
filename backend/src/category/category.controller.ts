import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoriesService: CategoryService) {}

    @Post()
    async create(@Body() createCategoryDto: any) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    async findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.categoriesService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }
}
