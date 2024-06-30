package kr.puppyplace.crawler.naver.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NaverMapCategoryType {
    CAFE("카페"),
    SHOPPING("쇼핑"),
    LIFE_CULTURE("생활문화"),
    DINING("음식점"),
    BAR("BAR");

    private String value;
}
