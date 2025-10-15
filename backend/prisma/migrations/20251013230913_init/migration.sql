-- CreateTable
CREATE TABLE "links" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "long_url" TEXT NOT NULL,
    "hit_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_slug_key" ON "links"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "links_long_url_key" ON "links"("long_url");
