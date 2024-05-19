import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepensesModule } from './depenses/depenses.module';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING), DepensesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{

  onModuleInit() {
    const db = mongoose.connection;
    db.on('connected', () => {
      console.log('Mongoose connected');
    });

    db.on('error', (error) => {

      console.error('Mongoose connection error:', error);
    });
  }

}
