package com.flyweight.poker_dashboard.learningresource.dto;

import com.flyweight.poker_dashboard.learningresource.LearningResourceStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class LearningResourceResponse {

    private Long id;

    private String title;

    private String url;

    private String description;

    private String category;

    private LearningResourceStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
