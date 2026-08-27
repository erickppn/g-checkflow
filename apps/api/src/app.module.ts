import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './modules/providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import { OperationsModule } from './modules/operations/operation.module';
import { IssuersModule } from './modules/issuers/issuers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    ProvidersModule,
    OperationsModule,
    IssuersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
