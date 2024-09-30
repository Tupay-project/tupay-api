import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/pipes/all-exceptions.filter';
import { envs } from './shared/config';
// import { WebhookService } from './shared/services/webhook.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    rawBody:true
  });

  // Establecer prefijo global para las rutas de la API
  app.setGlobalPrefix('api/v1');

  // Usar un pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Usar un filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar CORS
  app.enableCors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

    // Configurar la documentación Swagger en un módulo aparte
    // await DocumentationModule.setup(app);


  // const webhookService = app.get(WebhookService);
  // webhookService.setServer(io);

  // io.on('connection', (socket) => {
  //   console.log(`Cliente conectado: ${socket.id}`);
  //   socket.on('disconnect', () => {
  //     console.log(`Cliente desconectado: ${socket.id}`);
  //   });
  // });

  // Iniciar la aplicación y escuchar en el puerto especificado
  await app.listen(envs.PORT);
  console.log(`Server running on port: ${envs.PORT}`);
}

bootstrap();
