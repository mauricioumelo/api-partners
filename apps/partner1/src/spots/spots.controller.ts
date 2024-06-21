import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';

import { CreateSpotRequest } from './dto/create-spot.request';
import { UpdateSpotRequest } from './dto/update-spot.request';
import { SpotsService } from '@app/core/spots/spots.service';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createSpotRequest: CreateSpotRequest,
  ) {
    return this.spotsService.create(eventId, createSpotRequest);
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.spotsService.findOne(eventId, id);
  }

  @Patch(':id')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateSpotRequest: UpdateSpotRequest,
  ) {
    return this.spotsService.update(eventId, id, updateSpotRequest);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.spotsService.remove(eventId, id);
  }
}
