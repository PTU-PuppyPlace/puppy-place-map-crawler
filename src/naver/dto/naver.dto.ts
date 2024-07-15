import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

type ReadOnlyRecord<K extends string, V> = Readonly<Record<K, V>>;

export type MapType = 'CAFE' | 'SHOPPING' | 'LIFE_CULTURE' | 'DINING' | 'BAR';

export const NaverMapCategoryType: ReadOnlyRecord<MapType, MapType> = {
    CAFE: 'CAFE',
    SHOPPING: 'SHOPPING',
    LIFE_CULTURE: 'LIFE_CULTURE',
    DINING: 'DINING',
    BAR: 'BAR',
}

export class CreateNaverDto {
    @IsString()
    @IsNotEmpty()
    sid: string

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    longitude: number;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    information: string;

    @IsString()
    etc: string;

    @IsString()
    schedule: string;

    @IsNotEmpty()
    @IsEnum(NaverMapCategoryType)
    category: MapType;

    @IsBoolean()
    @IsNotEmpty()
    available: boolean;
}