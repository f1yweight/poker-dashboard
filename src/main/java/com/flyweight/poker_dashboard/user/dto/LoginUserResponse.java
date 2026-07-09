package com.flyweight.poker_dashboard.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginUserResponse {

    private String token;

    private UserResponse user;
}
