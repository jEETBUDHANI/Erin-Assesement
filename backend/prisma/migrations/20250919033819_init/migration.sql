-- CreateEnum
CREATE TYPE "public"."Source" AS ENUM ('website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('new', 'contacted', 'qualified', 'lost', 'won');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "city" TEXT,
    "state" TEXT,
    "source" "public"."Source" NOT NULL,
    "status" "public"."Status" NOT NULL,
    "score" INTEGER,
    "lead_value" DOUBLE PRECISION,
    "last_activity_at" TIMESTAMP(3),
    "is_qualified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "public"."Lead"("email");
