-- CreateTable
CREATE TABLE "Trending" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "backdrop" TEXT,
    "overview" TEXT,
    "firstReleased" TIMESTAMP(3),
    "poster" TEXT,
    "tmdbId" TEXT NOT NULL,

    CONSTRAINT "Trending_pkey" PRIMARY KEY ("id")
);
