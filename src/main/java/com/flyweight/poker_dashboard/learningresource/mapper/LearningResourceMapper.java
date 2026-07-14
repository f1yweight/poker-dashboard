package com.flyweight.poker_dashboard.learningresource.mapper;

import com.flyweight.poker_dashboard.learningresource.LearningResource;
import com.flyweight.poker_dashboard.learningresource.dto.CreateLearningResourceRequest;
import com.flyweight.poker_dashboard.learningresource.dto.LearningResourceResponse;
import com.flyweight.poker_dashboard.learningresource.dto.UpdateLearningResourceRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LearningResourceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LearningResource toEntity(CreateLearningResourceRequest request);

    LearningResourceResponse toResponse(LearningResource learningResource);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UpdateLearningResourceRequest request
            , @MappingTarget LearningResource learningResource);
}
