import { NaverMapCategoryType } from "@prisma/client";

export interface NaverBookmarkData {
    address: string;
    name: string;
    latitude: number;
    longitude: number;
    sid: string;
    category: NaverMapCategoryType;
    available: boolean;
}