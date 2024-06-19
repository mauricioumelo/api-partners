-- CreateEnum
CREATE TYPE "TicketKind" AS ENUM ('full', 'half');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('reserved', 'canceled');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ticketKind" "TicketKind" NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationHistory" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ticketKind" "TicketKind" NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "ReservationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_spotId_key" ON "Ticket"("spotId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationHistory" ADD CONSTRAINT "ReservationHistory_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
