package com.flyweight.poker_dashboard.monthlyobjective.mapper;

import com.flyweight.poker_dashboard.monthlyobjective.MonthlyObjectiveTargets;
import com.flyweight.poker_dashboard.monthlyobjective.dto.MonthlyObjectiveTargetsResponse;
import com.flyweight.poker_dashboard.monthlyobjective.dto.UpdateMonthlyObjectiveTargetsRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MonthlyObjectiveTargetsMapper {

    MonthlyObjectiveTargetsResponse toResponse(MonthlyObjectiveTargets monthlyObjectiveTargets);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "targetMonth", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UpdateMonthlyObjectiveTargetsRequest request
            , @MappingTarget MonthlyObjectiveTargets monthlyObjectiveTargets);
}
