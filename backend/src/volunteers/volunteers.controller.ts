import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { VolunteersService } from './volunteers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('volunteers')
@Controller('volunteers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VolunteersController {
  constructor(private volunteersService: VolunteersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get volunteer profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.volunteersService.getVolunteerProfile(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update volunteer profile' })
  async updateProfile(@CurrentUser() user: any, @Body() data: any) {
    return this.volunteersService.createOrUpdateVolunteerProfile(user.id, data);
  }

  @Put('me/verification-doc')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload verification document' })
  @ApiConsumes('multipart/form-data')
  async uploadVerificationDoc(
    @CurrentUser() user: any,
    @UploadedFile() file: any,
  ) {
    return this.volunteersService.uploadVerificationDoc(user.id, file);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby volunteers' })
  async getNearbyVolunteers(@Query('location') location: any) {
    return this.volunteersService.getNearbyVolunteers(
      location ? JSON.parse(location) : null,
    );
  }
}

