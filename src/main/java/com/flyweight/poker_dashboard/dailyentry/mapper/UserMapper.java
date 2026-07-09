package com.flyweight.poker_dashboard.dailyentry.mapper;

import com.flyweight.poker_dashboard.user.User;
import com.flyweight.poker_dashboard.user.dto.LoginUserResponse;
import com.flyweight.poker_dashboard.user.dto.RegisterUserRequest;
import com.flyweight.poker_dashboard.user.dto.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(RegisterUserRequest request);

    UserResponse toResponse(User user);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "token", source = "token")
    LoginUserResponse toLoginUserResponse(User user, String token);
}
