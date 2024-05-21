import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DepensesModule } from './depenses/depenses.module';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
<<<<<<< HEAD
import { CategoryModule } from './category/category.module';
=======
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PasswordResetService } from './reset-password/reset-password.service';
import { PasswordResetController } from './reset-password/reset-password.controller';
import { ResetPasswordModule } from './reset-password/reset-password.module';
>>>>>>> d26290f5308fdbe643f3b7c1751fcd3eb874d03d

dotenv.config();

@Module({
<<<<<<< HEAD
  imports: [MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING), AuthModule, UserModule, DepensesModule, CategoryModule],
=======
  imports: [MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING), AuthModule, UserModule, DepensesModule, ResetPasswordModule],
>>>>>>> d26290f5308fdbe643f3b7c1751fcd3eb874d03d
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
