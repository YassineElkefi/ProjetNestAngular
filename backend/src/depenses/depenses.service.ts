import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepenseDto } from './dto/create-depense.dto';
import { UpdateDepenseDto } from './dto/update-depense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Depense } from './schema/depenses.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class DepensesService {

  constructor(@InjectModel(Depense.name) private depenseModel: Model<Depense>){}

  async create(createDepenseDto: CreateDepenseDto, userId: string) {
    const createdDepense = new this.depenseModel({ ...createDepenseDto, userId });
    return await createdDepense.save();
}

  async findAll(sortBy?:string, sortOrder?: string){
    const sortCriteria = {};
    if(sortBy){
      sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    return await this.depenseModel.find().sort(sortCriteria).exec();
  }

  async findOne(id: string) {
      const depense = await this.depenseModel.findById(id).exec();

      if (!depense) throw new NotFoundException(`Depense #${id} not found`);
      
    return depense;
  }

  async update(id: string, updateDepenseDto: UpdateDepenseDto) {

    const existingDepense = await this.depenseModel.findByIdAndUpdate(id, updateDepenseDto, {new: true}).exec();
    if(!existingDepense) throw new NotFoundException(`Depense #${id} not found`);
    return existingDepense;
  }

  async remove(id: string) {
    const depense = await this.depenseModel.findByIdAndDelete(id).exec();
    if (!depense) throw new NotFoundException(`Depense #${id} not found`);
    return depense;
  }

  async filterByPeriod(startDate: Date, endDate: Date): Promise<Depense[]> {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    return await this.depenseModel.find({
      date: {
        $gte: startDate,
        $lte: adjustedEndDate
    }}
  ).exec();
  }

  async getExpensesByCategory(userId: string, period: Date): Promise<any> {
    const depensesByCategory = await this.depenseModel.aggregate([
      {
        $match: {
          userId: userId,
          date: { $lte: new Date(period) }
        }
      },
      {
        $group: {
          _id: "$categorie",
          totalAmount: { $sum: "$montant" }
        }
      }
    ]);
    return depensesByCategory;
  }

}