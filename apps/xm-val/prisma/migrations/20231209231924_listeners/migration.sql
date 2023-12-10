/*
  Warnings:

  - You are about to drop the `Subscriber` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Subscriber";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Listener" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "valueId" TEXT NOT NULL,
    CONSTRAINT "Listener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listener_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
