import { Module } from '@nestjs/common';
import { TargetRepository } from './target.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TargetRepository],
  exports: [TargetRepository],
})
export class TargetModule {}
