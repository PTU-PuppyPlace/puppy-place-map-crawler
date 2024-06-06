package kr.puppyplace.crawler.common.config;

import feign.Retryer;
import java.util.concurrent.TimeUnit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    public static final long RETRY_PERIOD_IN_MILLISECONDS = 100L; // 0.1초의 간격으로 시작해
    public static final long RETRY_MAX_PERIOD_IN_SECONDS =
            TimeUnit.SECONDS.toMillis(3L); // 최대 3초의 간격으로 점점 증가하며
    public static final int RETRY_MAX_ATTEMPTS = 5; // 최대 5번 재시도 한다.

    @Bean
    public Retryer retryer() {
        return new Retryer.Default(
                RETRY_PERIOD_IN_MILLISECONDS, RETRY_MAX_PERIOD_IN_SECONDS, RETRY_MAX_ATTEMPTS);
    }
}
