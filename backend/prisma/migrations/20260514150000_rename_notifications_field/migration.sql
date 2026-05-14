-- Rename whatsappNotifications to emailNotifications on users table
ALTER TABLE "users" RENAME COLUMN "whatsappNotifications" TO "emailNotifications";
