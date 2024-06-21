import { Injectable } from '@nestjs/common';
import { CreateEventRequest } from './request/create-event.request';
import { UpdateEventRequest } from './request/update-event.request';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { ReserveSpotRequest } from './request/reserve-spot.request';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(CreateEventRequest: CreateEventRequest) {
    return this.prismaService.event.create({ data: CreateEventRequest });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findFirst({ where: { id: id } });
  }

  update(id: string, UpdateEventRequest: UpdateEventRequest) {
    return this.prismaService.event.update({
      data: UpdateEventRequest,
      where: { id: id },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id: id },
    });
  }
  async reserveSpot(eventId: string, dto: ReserveSpotRequest) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: eventId,
        name: {
          in: dto.spots,
        },
      },
    });

    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsName = dto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new Error(`Spots  ${notFoundSpotsName.join(', ')}not found`);
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => {
              const spotTicketKindIndex = dto.spots.indexOf(spot.name);
              return {
                spotId: spot.id,
                ticketKind: dto.ticket_kind[spotTicketKindIndex],
                email: dto.email,
                status: TicketStatus.reserved,
              };
            }),
          });
          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) => {
              const spotTicketKindIndex = dto.spots.indexOf(spot.name);
              return prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind[spotTicketKindIndex],
                  email: dto.email,
                },
              });
            }),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );

      return tickets;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002':
          case 'P2034':
            throw new Error('Some spots are already reserved');
          default:
            throw e;
        }
      }
    }
  }
}
