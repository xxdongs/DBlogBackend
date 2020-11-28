import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./util/exception.filter";
import { DocumentBuilder } from "@nestjs/swagger/dist/document-builder";
import { SwaggerModule } from "@nestjs/swagger/dist/swagger-module";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            // logger: true,
        }),
    );
    // api document
    const options = new DocumentBuilder()
        .setTitle("doc")
        .setDescription("The blog API document")
        .setVersion("1.0")
        .addTag("blog")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${process.env.API_PREFIX}/doc`, app, document);

    app.enableCors();
    app.setGlobalPrefix(process.env.API_PREFIX);

    app.useGlobalPipes(new ValidationPipe());
    // app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(parseInt(process.env.API_PORT, 10) || 3000);
}
bootstrap();
