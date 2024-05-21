import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DepensesModule } from './depenses/depenses.module';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING), AuthModule, UserModule, DepensesModule, CategoryModule , ResetPasswordModule],
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
