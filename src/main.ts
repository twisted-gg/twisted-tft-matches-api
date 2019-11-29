import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AppSwaggerEnum } from './enums/app.enum'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  const options = new DocumentBuilder()
    .setTitle(AppSwaggerEnum.TITLE)
    .setDescription(AppSwaggerEnum.DESCRIPTION)
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(AppSwaggerEnum.PATH, app, document)
  await app.listen(AppSwaggerEnum.PORT)
}

bootstrap()

process.on('uncaughtException', function (exception) {
  console.error(exception)
})
