package kr.puppyplace.crawler.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "TARGET")
public class Target extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TARGET_ID")
    private Long id;

    @NotNull
    @Column(name = "NAME")
    @Comment("사이트의 이름")
    private String name;

    @NotNull
    @Column(name = "URL")
    @Comment("사이트의 URL")
    private String url;

    @NotNull
    @Default
    @Column(name = "IS_ACTIVE")
    @Comment("활성 여부")
    private Boolean isActive = true;

    @NotNull
    @Comment("사이트의 제공자명")
    @JoinColumn(name = "TARGET_PROVIDER_ID")
    @ManyToOne(fetch = FetchType.LAZY)
    private TargetProvider targetProvider;

    public void updateIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
