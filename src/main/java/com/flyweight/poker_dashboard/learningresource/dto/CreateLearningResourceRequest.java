package com.flyweight.poker_dashboard.learningresource.dto;

import com.flyweight.poker_dashboard.learningresource.LearningResourceStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateLearningResourceRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String url;

    private String description;

    private String category;

    private LearningResourceStatus status;
}
