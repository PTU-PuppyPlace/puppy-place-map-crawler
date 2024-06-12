package kr.puppyplace.crawler.crawl.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import kr.puppyplace.crawler.crawl.converter.NaverMapDataOpenScheduleConverter;
import kr.puppyplace.crawler.crawl.dto.NaverMapDataOpenSchedule;
import kr.puppyplace.crawler.crawl.enums.NaverMapCategoryType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "NAVER_MAP_DATA")
public class NaverMapData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @NotNull
    @Comment("매장명")
    @Column(name = "NAME")
    private String name;

    @NotNull
    @Comment("매장 주소")
    @Column(name = "ADDRESS")
    private String address;

    @Comment("매장 전화번호")
    @Column(name = "PHONE")
    private String phone;

    @NotNull
    @Comment("매장 위도")
    @Column(name = "LATITUDE")
    private Double latitude;

    @NotNull
    @Comment("매장 경도")
    @Column(name = "LONGITUDE")
    private Double longitude;

    @NotNull
    @Comment("매장 ID")
    @Column(name = "SID")
    private String sid;

    @NotNull
    @Comment("매장 카테고리")
    @Column(name = "CATEGORY")
    @Enumerated(EnumType.STRING)
    private NaverMapCategoryType category;

    @NotNull
    @Default
    @Convert(converter = NaverMapDataOpenScheduleConverter.class)
    @Comment("매장 영업시간")
    @Column(name = "OPEN_TIME")
    private List<NaverMapDataOpenSchedule> openScheduleList = List.of();

    @NotNull
    @Comment("매장 영업여부")
    @Column(name = "IS_ACTIVE")
    private Boolean isActive;
}
