package com.flyweight.poker_dashboard.customgoal.mapper;

import com.flyweight.poker_dashboard.customgoal.CustomMonthlyGoal;
import com.flyweight.poker_dashboard.customgoal.dto.CreateCustomMonthlyGoalRequest;
import com.flyweight.poker_dashboard.customgoal.dto.CustomMonthlyGoalResponse;
import com.flyweight.poker_dashboard.customgoal.dto.UpdateCustomMonthlyGoalRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomMonthlyGoalMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "targetMonth", ignore = true)
    @Mapping(target = "completed", constant = "false")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    CustomMonthlyGoal toEntity(CreateCustomMonthlyGoalRequest request);

    CustomMonthlyGoalResponse toResponse(CustomMonthlyGoal customMonthlyGoal);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "targetMonth", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UpdateCustomMonthlyGoalRequest request
            , @MappingTarget CustomMonthlyGoal customMonthlyGoal);
}
