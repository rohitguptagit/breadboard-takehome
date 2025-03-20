import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Middleware to pretty-print JSON
    app.use((req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        const originalSend = res.send;
        res.send = function (body) {
            if (typeof body === 'object') {
                body = JSON.stringify(body, null, 2);  // ✅ Pretty-print globally
            }
            return originalSend.call(this, body);
        };
        next();
    });

    await app.listen(3000);
}
bootstrap();