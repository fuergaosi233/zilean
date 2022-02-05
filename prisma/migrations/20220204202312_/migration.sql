-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "bookId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "cover" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookMark" (
    "id" SERIAL NOT NULL,
    "bookVersion" INTEGER NOT NULL,
    "style" INTEGER NOT NULL,
    "range" TEXT NOT NULL,
    "markText" TEXT NOT NULL,
    "bookmarkId" TEXT NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL,
    "chapterUid" TEXT NOT NULL,
    "userVid" INTEGER NOT NULL,

    CONSTRAINT "BookMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WxUser" (
    "id" SERIAL NOT NULL,
    "userVid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "cookies" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WxUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WxUsersOnBooks" (
    "bookId" TEXT NOT NULL,
    "userVid" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WxUsersOnBooks_pkey" PRIMARY KEY ("bookId","userVid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_bookId_key" ON "Book"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "WxUser_userVid_key" ON "WxUser"("userVid");

-- AddForeignKey
ALTER TABLE "BookMark" ADD CONSTRAINT "BookMark_userVid_fkey" FOREIGN KEY ("userVid") REFERENCES "WxUser"("userVid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WxUsersOnBooks" ADD CONSTRAINT "WxUsersOnBooks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("bookId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WxUsersOnBooks" ADD CONSTRAINT "WxUsersOnBooks_userVid_fkey" FOREIGN KEY ("userVid") REFERENCES "WxUser"("userVid") ON DELETE RESTRICT ON UPDATE CASCADE;
