-- AlterTable
ALTER TABLE "claims" ALTER COLUMN "currency" DROP NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'INR',
ALTER COLUMN "receipt" DROP NOT NULL,
ALTER COLUMN "internalNotes" SET DEFAULT '';
