import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { MikroORM } from '@mikro-orm/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true,
    });

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    const config = new DocumentBuilder()
      .setTitle('Persona API Documentation')
      .setDescription('Persona API Documentation')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);

    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.use(helmet());
    app.use(compression());

    const orm = app.get(MikroORM);
    await orm.getSchemaGenerator().ensureDatabase();
    await orm.getSchemaGenerator().updateSchema();

    const port = process.env.PORT || 5050;
    await app.listen(port);

    console.log(`🚀 Server running on port ${port}`);
    console.log(`📄 API Docs: http://localhost:${port}/api-docs`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}
bootstrap();
