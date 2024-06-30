package kr.puppyplace.crawler.naver.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;
import kr.puppyplace.crawler.naver.dto.NaverMapDataOpenSchedule;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Converter
public class NaverMapDataOpenScheduleConverter implements
        AttributeConverter<List<NaverMapDataOpenSchedule>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper().registerModule(
            new JavaTimeModule()).configure(
            SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

    @Override
    public String convertToDatabaseColumn(
            List<NaverMapDataOpenSchedule> attribute) {
        try {
            if (attribute == null) {
                return null;
            }
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            log.error("NaverMapDataOpenSchedule to Json 변환 중 오류 발생! 원본 데이터: {}, 오류: {}", attribute,
                    e.getMessage());
            return null;

        }
    }

    @Override
    public List<NaverMapDataOpenSchedule> convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null || dbData.isEmpty()) {
                return List.of();
            }
            return List.of(objectMapper.readValue(dbData, NaverMapDataOpenSchedule[].class));
        } catch (Exception e) {
            log.error("String to NaverMapDataOpenSchedule 변환 중 오류 발생! 원본 데이터: {}, 오류: {}", dbData,
                    e.getMessage());
            return List.of();
        }
    }
}
