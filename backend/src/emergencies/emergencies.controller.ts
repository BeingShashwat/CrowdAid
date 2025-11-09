import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmergenciesService } from './emergencies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('emergencies')
@Controller('emergencies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmergenciesController {
  constructor(private emergenciesService: EmergenciesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create emergency request' })
  async createEmergency(@CurrentUser() user: any, @Body() data: any) {
    return this.emergenciesService.createEmergency(user.id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get emergencies' })
  async getEmergencies(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    const filters = { status, type };
    return this.emergenciesService.getEmergencies(user.id, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get emergency by ID' })
  async getEmergency(@Param('id') id: string, @CurrentUser() user: any) {
    return this.emergenciesService.getEmergency(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update emergency' })
  async updateEmergency(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.emergenciesService.updateEmergency(id, user.id, data);
  }

  @Post(':id/respond')
  @ApiOperation({ summary: 'Respond to emergency (volunteer)' })
  async respondToEmergency(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('message') message?: string,
  ) {
    return this.emergenciesService.respondToEmergency(id, user.id, message);
  }

  @Put(':id/resolve')
  @ApiOperation({ summary: 'Resolve emergency' })
  async resolveEmergency(@Param('id') id: string, @CurrentUser() user: any) {
    return this.emergenciesService.resolveEmergency(id, user.id);
  }
}

