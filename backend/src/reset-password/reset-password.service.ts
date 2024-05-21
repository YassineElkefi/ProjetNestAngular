import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { PasswordResetToken,PasswordResetTokenDocument } from './schema/password-reset-token.schema';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PasswordResetToken.name) private passwordResetTokenModel: Model<PasswordResetToken>,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = new this.passwordResetTokenModel({
      userId: user._id,
      token,
    });

    await passwordResetToken.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.APP_PASS,
      },
    });

    const resetLink = `http://localhost:3000/password-reset/reset?token=${token}`;
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested for a password reset. Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.passwordResetTokenModel.findOne({ token }).exec();
    if (!resetToken) {
      throw new Error('Invalid or expired password reset token');
    }

    const user = await this.userModel.findById(resetToken.userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await resetToken.deleteOne();
  }
}