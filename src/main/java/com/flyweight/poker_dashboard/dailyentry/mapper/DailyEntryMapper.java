package com.flyweight.poker_dashboard.dailyentry.mapper;

import com.flyweight.poker_dashboard.dailyentry.DailyEntry;
import com.flyweight.poker_dashboard.dailyentry.dto.CreateDailyEntryRequest;
import com.flyweight.poker_dashboard.dailyentry.dto.DailyEntryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DailyEntryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    DailyEntry toEntity(CreateDailyEntryRequest request);

    DailyEntryResponse toResponse(DailyEntry dailyEntry);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(CreateDailyEntryRequest request, @MappingTarget DailyEntry dailyEntry);

}
