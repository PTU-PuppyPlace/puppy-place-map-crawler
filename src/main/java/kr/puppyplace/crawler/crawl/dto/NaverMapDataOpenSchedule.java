package kr.puppyplace.crawler.crawl.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode
public class NaverMapDataOpenSchedule {

    @JsonFormat(pattern = "HH:mm")
    private LocalTime openAt;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeAt;

    private DayOfWeek dayOfWeek;
}
