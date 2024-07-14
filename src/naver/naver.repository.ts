import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateNaverDto } from "./dto/naver.dto";

@Injectable()
export class NaverRepository {
    constructor(private prisma: PrismaService) {}

    async create(createNaverDto: CreateNaverDto) {
        await this.prisma.naverMapData.create({
            data: createNaverDto,
        });
    }

    async findAll() {
        return this.prisma.naverMapData.findMany();
    }

    async deleteBySid(sid: string) {
        return this.prisma.naverMapData.delete({
            where: {
                sid: sid,
            },
        });
    }
}