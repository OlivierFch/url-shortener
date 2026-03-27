-- AlterTable
ALTER TABLE "links" ADD COLUMN     "category" TEXT;

-- CreateTable
CREATE TABLE "visits" (
    "id" UUID NOT NULL,
    "link_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visits_link_id_idx" ON "visits"("link_id");

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
