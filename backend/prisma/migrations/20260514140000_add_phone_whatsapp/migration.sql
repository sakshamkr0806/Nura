-- AlterTable: Add phoneNumber and whatsappNotifications to users
ALTER TABLE "users" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "users" ADD COLUMN "whatsappNotifications" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex: Unique constraint on phoneNumber (nulls are allowed to be non-unique in PostgreSQL)
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");
