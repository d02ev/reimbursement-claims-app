-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fullname" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" VARCHAR NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_details" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "refresh_token" VARCHAR,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "password_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_details" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ifsc" VARCHAR NOT NULL,
    "bank_acc_num" VARCHAR NOT NULL,
    "pan" VARCHAR NOT NULL,
    "user_id" TEXT NOT NULL,
    "bank_name_id" TEXT NOT NULL,

    CONSTRAINT "bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_names" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "bank_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "date" DATE NOT NULL,
    "requested_amt" DECIMAL(7,2) NOT NULL,
    "approved_amt" DECIMAL(7,2),
    "is_approved" BOOLEAN,
    "is_declined" BOOLEAN,
    "approved_by" VARCHAR,
    "declined_by" VARCHAR,
    "notes" TEXT,
    "claim_type_id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "request_phase_id" TEXT NOT NULL,
    "receipt_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_types" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR NOT NULL DEFAULT 'Misc',

    CONSTRAINT "claim_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "currency" VARCHAR NOT NULL DEFAULT 'INR',

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_phases" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "phase" VARCHAR NOT NULL DEFAULT 'In Process',

    CONSTRAINT "request_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "image_name" VARCHAR,
    "receipt" VARCHAR NOT NULL DEFAULT 'Not Attached',

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_role_id_idx" ON "users"("email", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- CreateIndex
CREATE INDEX "roles_role_idx" ON "roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_password_hash_key" ON "password_details"("password_hash");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_refresh_token_key" ON "password_details"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_user_id_key" ON "password_details"("user_id");

-- CreateIndex
CREATE INDEX "password_details_user_id_idx" ON "password_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_bank_acc_num_key" ON "bank_details"("bank_acc_num");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_pan_key" ON "bank_details"("pan");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_user_id_key" ON "bank_details"("user_id");

-- CreateIndex
CREATE INDEX "bank_details_bank_acc_num_pan_user_id_ifsc_bank_name_id_idx" ON "bank_details"("bank_acc_num", "pan", "user_id", "ifsc", "bank_name_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_names_name_key" ON "bank_names"("name");

-- CreateIndex
CREATE INDEX "bank_names_name_idx" ON "bank_names"("name");

-- CreateIndex
CREATE UNIQUE INDEX "claims_receipt_id_key" ON "claims"("receipt_id");

-- CreateIndex
CREATE INDEX "claims_is_approved_is_declined_approved_by_declined_by_user_idx" ON "claims"("is_approved", "is_declined", "approved_by", "declined_by", "user_id", "claim_type_id", "currency_id", "request_phase_id", "receipt_id");

-- CreateIndex
CREATE UNIQUE INDEX "claim_types_type_key" ON "claim_types"("type");

-- CreateIndex
CREATE INDEX "claim_types_type_idx" ON "claim_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_currency_key" ON "currencies"("currency");

-- CreateIndex
CREATE INDEX "currencies_currency_idx" ON "currencies"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "request_phases_phase_key" ON "request_phases"("phase");

-- CreateIndex
CREATE INDEX "request_phases_phase_idx" ON "request_phases"("phase");

-- CreateIndex
CREATE INDEX "receipts_image_name_idx" ON "receipts"("image_name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_details" ADD CONSTRAINT "password_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_details" ADD CONSTRAINT "bank_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_details" ADD CONSTRAINT "bank_details_bank_name_id_fkey" FOREIGN KEY ("bank_name_id") REFERENCES "bank_names"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_claim_type_id_fkey" FOREIGN KEY ("claim_type_id") REFERENCES "claim_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_request_phase_id_fkey" FOREIGN KEY ("request_phase_id") REFERENCES "request_phases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
