package vn.fpt.edu.ctms.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RefreshTokenRequest(@JsonProperty("refresh_token") String refreshToken) {
}
