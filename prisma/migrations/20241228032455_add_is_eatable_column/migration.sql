-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleMenu" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "RoleMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCoop" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coopId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UserCoop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "avatar" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Coop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cashflow" (
    "id" SERIAL NOT NULL,
    "periode" DATE NOT NULL,
    "userId" INTEGER NOT NULL,
    "trans_date" TIMESTAMPTZ(3) NOT NULL,
    "tipe" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Cashflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOP" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "isReduceStock" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SOP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressSOP" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coopId" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ProgressSOP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedsMedicines" (
    "id" SERIAL NOT NULL,
    "SKU" TEXT NOT NULL,
    "coopId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "uom" TEXT,
    "price" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "isEatable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FeedsMedicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryFeedsMedicines" (
    "id" SERIAL NOT NULL,
    "feedId" INTEGER NOT NULL,
    "coopDiagnosticsId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL,
    "transDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "HistoryFeedsMedicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EggProduction" (
    "id" SERIAL NOT NULL,
    "coopId" INTEGER NOT NULL,
    "transDate" TIMESTAMPTZ(3) NOT NULL,
    "ageInDay" INTEGER,
    "ageInWeek" INTEGER,
    "pop" INTEGER,
    "m" INTEGER,
    "afk" INTEGER,
    "sell" INTEGER,
    "finalPop" INTEGER,
    "feedType" TEXT,
    "feedWeight" INTEGER,
    "feedFIT" DECIMAL(65,30),
    "prodPieceN" INTEGER,
    "prodPieceP" INTEGER,
    "prodPieceBS" INTEGER,
    "prodTotalPiece" INTEGER,
    "prodWeightN" DECIMAL(65,30),
    "prodWeightP" DECIMAL(65,30),
    "prodWeightBS" DECIMAL(65,30),
    "prodTotalWeight" DECIMAL(65,30),
    "HD" DECIMAL(65,30),
    "FCR" DECIMAL(65,30),
    "EggWeight" DECIMAL(65,30),
    "EggMass" DECIMAL(65,30),
    "OVK" DECIMAL(65,30),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "EggProduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EggProductionTemp" (
    "id" SERIAL NOT NULL,
    "isDuplicate" BOOLEAN NOT NULL,
    "code" TEXT NOT NULL,
    "coopId" INTEGER NOT NULL,
    "transDate" TIMESTAMPTZ(3) NOT NULL,
    "ageInDay" INTEGER,
    "ageInWeek" INTEGER,
    "pop" INTEGER,
    "m" INTEGER,
    "afk" INTEGER,
    "sell" INTEGER,
    "finalPop" INTEGER,
    "feedType" TEXT,
    "feedWeight" INTEGER,
    "feedFIT" DECIMAL(65,30),
    "prodPieceN" INTEGER,
    "prodPieceP" INTEGER,
    "prodPieceBS" INTEGER,
    "prodTotalPiece" INTEGER,
    "prodWeightN" DECIMAL(65,30),
    "prodWeightP" DECIMAL(65,30),
    "prodWeightBS" DECIMAL(65,30),
    "prodTotalWeight" DECIMAL(65,30),
    "HD" DECIMAL(65,30),
    "FCR" DECIMAL(65,30),
    "EggWeight" DECIMAL(65,30),
    "EggMass" DECIMAL(65,30),
    "OVK" DECIMAL(65,30),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "EggProductionTemp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoopDiagnostics" (
    "id" SERIAL NOT NULL,
    "coopId" INTEGER NOT NULL,
    "transDate" TIMESTAMPTZ(3) NOT NULL,
    "disease" TEXT NOT NULL,
    "medicineId" INTEGER,
    "dose" INTEGER,
    "status" TEXT,
    "reporterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CoopDiagnostics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "reporter" TEXT NOT NULL,
    "listenerId" INTEGER NOT NULL,
    "diagnosticId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "coopId" INTEGER NOT NULL,
    "transDate" TIMESTAMPTZ(3) NOT NULL,
    "jenis" TEXT,
    "qty" INTEGER,
    "indexs" INTEGER,
    "totalIncome" INTEGER,
    "eggNotes" INTEGER,
    "kilo" INTEGER,
    "price" INTEGER,
    "totalExpenses" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTemp" (
    "id" SERIAL NOT NULL,
    "isDuplicate" BOOLEAN NOT NULL,
    "coopId" INTEGER NOT NULL,
    "transDate" TIMESTAMPTZ(3) NOT NULL,
    "jenis" TEXT,
    "qty" INTEGER,
    "indexs" INTEGER,
    "totalIncome" INTEGER,
    "eggNotes" INTEGER,
    "kilo" INTEGER,
    "price" INTEGER,
    "totalExpenses" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ReportTemp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_title_key" ON "Menu"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Users_nik_key" ON "Users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Coop_nik_key" ON "Coop"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "FeedsMedicines_SKU_key" ON "FeedsMedicines"("SKU");

-- AddForeignKey
ALTER TABLE "RoleMenu" ADD CONSTRAINT "RoleMenu_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleMenu" ADD CONSTRAINT "RoleMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoop" ADD CONSTRAINT "UserCoop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoop" ADD CONSTRAINT "UserCoop_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashflow" ADD CONSTRAINT "Cashflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOP" ADD CONSTRAINT "SOP_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressSOP" ADD CONSTRAINT "ProgressSOP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressSOP" ADD CONSTRAINT "ProgressSOP_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedsMedicines" ADD CONSTRAINT "FeedsMedicines_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedsMedicines" ADD CONSTRAINT "FeedsMedicines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryFeedsMedicines" ADD CONSTRAINT "HistoryFeedsMedicines_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "FeedsMedicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryFeedsMedicines" ADD CONSTRAINT "HistoryFeedsMedicines_coopDiagnosticsId_fkey" FOREIGN KEY ("coopDiagnosticsId") REFERENCES "CoopDiagnostics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EggProduction" ADD CONSTRAINT "EggProduction_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopDiagnostics" ADD CONSTRAINT "CoopDiagnostics_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopDiagnostics" ADD CONSTRAINT "CoopDiagnostics_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_listenerId_fkey" FOREIGN KEY ("listenerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_diagnosticId_fkey" FOREIGN KEY ("diagnosticId") REFERENCES "CoopDiagnostics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTemp" ADD CONSTRAINT "ReportTemp_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
