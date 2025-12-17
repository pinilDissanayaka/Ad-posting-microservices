import { NestFactory } from '@nestjs/core'
import { ListingsModule } from './listings.module'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as morgan from 'morgan'
import { ValidationPipe } from '@nestjs/common'
import { RmqService } from '@lib/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(ListingsModule)

  const configService = app.get<ConfigService>(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)

  const PORT = configService.get('LISTINGS_PORT') || 8081

  // Increase payload size limit for file uploads (50MB)
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  // Configure helmet FIRST (before CORS)
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }))
  app.use(morgan('dev'))

  // Enable CORS for frontend and dashboard (AFTER helmet)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  app.connectMicroservice(rmqService.getOptions('LISTINGS'))
  app.useGlobalPipes(new ValidationPipe())

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Ad Posting Microservices API')
    .setDescription('API documentation for Ad Posting platform - Listings Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.startAllMicroservices()
  await app.listen(PORT, () => console.log(`Listings service listening on port: ${PORT}`))
}
bootstrap()
