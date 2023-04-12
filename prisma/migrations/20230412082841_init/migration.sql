-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "PAN" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "role" INTEGER NOT NULL DEFAULT 0,
    "isApprover" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "requestedAmt" DOUBLE PRECISION NOT NULL,
    "approvedAmt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL,
    "receipt" TEXT NOT NULL DEFAULT 'Not Attached',
    "requestPhase" TEXT NOT NULL DEFAULT 'In Process',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT NOT NULL DEFAULT '',
    "internalNotes" TEXT,
    "requestedBy" TEXT NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_PAN_key" ON "users"("PAN");

-- CreateIndex
CREATE UNIQUE INDEX "users_bankAccountNumber_key" ON "users"("bankAccountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordHash_key" ON "users"("passwordHash");

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
