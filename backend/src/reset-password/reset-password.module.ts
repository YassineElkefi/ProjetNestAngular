import { Module } from '@nestjs/common';
import { PasswordResetController } from './reset-password.controller';
import { PasswordResetService } from './reset-password.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordResetToken, PasswordResetTokenSchema } from './schema/password-reset-token.schema';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
    imports:[MongooseModule.forFeature([{ name: PasswordResetToken.name, schema: PasswordResetTokenSchema }]), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UserModule],
    controllers: [PasswordResetController],
    providers: [PasswordResetService],
    exports: [PasswordResetService]
})
export class ResetPasswordModule {}