"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        const originalSend = res.send;
        res.send = function (body) {
            if (typeof body === 'object') {
                body = JSON.stringify(body, null, 2);
            }
            return originalSend.call(this, body);
        };
        next();
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map