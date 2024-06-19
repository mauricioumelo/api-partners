-- CreateEnum
CREATE TYPE "SpotStatus" AS ENUM ('available', 'reserved');

-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "SpotStatus" NOT NULL DEFAULT 'available',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
