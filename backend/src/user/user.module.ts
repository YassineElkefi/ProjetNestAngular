import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserDocument, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), Model<UserDocument>],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
