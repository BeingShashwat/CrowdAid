import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@CurrentUser() user: any, @Body() data: any) {
    return this.usersService.updateProfile(user.id, data);
  }

  @Put('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  async uploadAvatar(@CurrentUser() user: any, @UploadedFile() file: any) {
    return this.usersService.uploadAvatar(user.id, file);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(@CurrentUser() user: any, @Body('password') password: string) {
    return this.usersService.deleteAccount(user.id, password);
  }
}

