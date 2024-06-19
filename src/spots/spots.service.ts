import { Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReserveSpotDto } from './dto/reserve-spot.dto';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  create(eventId: string, createSpotDto: CreateSpotDto) {
    return this.prismaService.spot.create({
      data: { ...createSpotDto, eventId: eventId },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: { eventId: eventId },
    });
  }

  findOne(eventId: string, id: string) {
    return this.prismaService.spot.findMany({
      where: { eventId: eventId, id: id },
    });
  }

  update(eventId: string, id: string, updateSpotDto: UpdateSpotDto) {
    return this.prismaService.spot.update({
      data: updateSpotDto,
      where: { eventId: eventId, id: id },
    });
  }

  remove(eventId: string, id: string) {
    return this.prismaService.spot.delete({
      where: { eventId: eventId, id: id },
    });
  }

  reserveSpot(eventId: string, id: string, dto: ReserveSpotDto) {
    return this.prismaService.spot.findMany({
      where: {
        name: {
          in: dto.spots,
        },
      },
    });
  }
}
