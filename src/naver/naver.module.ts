import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NaverService } from './naver.service';
import { NaverRepository } from './naver.repository';
import { HttpModule } from '@nestjs/axios';
import { TargetModule } from 'src/target/target.module';

@Module({
  imports: [
    PrismaModule,
    TargetModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [NaverService, NaverRepository],
})
export class NaverModule {}
