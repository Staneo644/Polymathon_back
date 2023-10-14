"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
const AppDataSource = require('./database/database.module');
console.log(`Application created, connecting to database ${process.env.DATABASEIP}`);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.get(core_1.Reflector);
    app.use(express.json({ limit: '5mb' }));
    const corsOptions = {
        origin: '*',
    };
    const cors = require('cors');
    app.enableCors(corsOptions);
    app.use(cors(corsOptions));
    if (AppDataSource.isInitialized === false)
        await AppDataSource.initialize();
    await app.init();
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map