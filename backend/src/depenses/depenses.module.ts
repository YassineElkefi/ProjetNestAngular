import { Module } from '@nestjs/common';
import { DepensesService } from './depenses.service';
import { DepensesController } from './depenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Depense, DepenseSchema } from './schema/depenses.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Depense.name, schema: DepenseSchema}])],
  controllers: [DepensesController],
  providers: [DepensesService],
})
export class DepensesModule {}
