import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/login.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() loginDto: AdminLoginDto) {
    return this.adminService.verifySecretKey(loginDto.secretKey);
  }

  @Get('metrics')
  @UseGuards(AdminGuard)
  async getMetrics() {
    return this.adminService.getDashboardMetrics();
  }
}
