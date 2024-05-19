import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepenseDto } from './dto/create-depense.dto';
import { UpdateDepenseDto } from './dto/update-depense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Depense } from './schema/depenses.schema';
import { Model } from 'mongoose';

@Injectable()
export class DepensesService {

  constructor(@InjectModel(Depense.name) private depenseModel: Model<Depense>){}

  async create(createDepenseDto: CreateDepenseDto) {
    const createdDepense = new this.depenseModel(createDepenseDto);
    return await createdDepense.save();
  }

  async findAll(sortBy?:string){
    const sortCriteria = {};
    if(sortBy){
      sortCriteria[sortBy] = 1;
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
    return await this.depenseModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
  }

  async getExpensesByCategory(period: Date): Promise<any> {
    const depensesByCategory = await this.depenseModel.aggregate([
      {
        $match: {
          date: { $gte: new Date(period) }
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