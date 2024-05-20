import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING), AuthModule, UserModule],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService],
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
