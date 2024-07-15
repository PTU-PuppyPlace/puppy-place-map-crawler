import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TargetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByIsActiveTrue() {
    return this.prisma.target.findMany({
      where: {
        isActive: true,
      },
    });
  }
}
