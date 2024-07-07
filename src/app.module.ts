import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NaverModule } from './naver/naver.module';
import { TargetModule } from './target/target.module';

@Module({
  imports: [PrismaModule, NaverModule, TargetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
