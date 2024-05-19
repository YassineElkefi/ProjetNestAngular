import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DepensesService } from './depenses.service';
import { CreateDepenseDto } from './dto/create-depense.dto';
import { UpdateDepenseDto } from './dto/update-depense.dto';

@Controller('depenses')
export class DepensesController {
  constructor(private readonly depensesService: DepensesService) {}

  @Post()
  create(@Body() createDepenseDto: CreateDepenseDto) {
    return this.depensesService.create(createDepenseDto);
  }

  @Get()
  findAll(@Query('sortBy') sortBy?: string) {
    return this.depensesService.findAll(sortBy);
  }

  @Get('filter')
  async filterByPeriod(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.depensesService.filterByPeriod(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depensesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepenseDto: UpdateDepenseDto) {
    return this.depensesService.update(id, updateDepenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depensesService.remove(id);
  }
  @Get('by-category/:period')
  async getExpensesByCategory(@Param('period') period: string): Promise<any> {
    const depenses = await this.depensesService.getExpensesByCategory(new Date(period));
    return depenses;
  }
}
