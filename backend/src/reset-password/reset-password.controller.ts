import { Controller, Post, Body, Get, Render, Query, Res } from '@nestjs/common';
import { PasswordResetService } from './reset-password.service';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('request')
  async requestPasswordReset(@Body('email') email: string) {
    await this.passwordResetService.requestPasswordReset(email);
  }

  @Get('reset')
  @Render('reset-password') // Render the reset password page
  async renderResetPasswordPage(@Query('token') token: string, @Res() res) {
    // You can validate the token here if needed
    return { token };
  }

  @Post('reset')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    await this.passwordResetService.resetPassword(token, newPassword);
  }
}