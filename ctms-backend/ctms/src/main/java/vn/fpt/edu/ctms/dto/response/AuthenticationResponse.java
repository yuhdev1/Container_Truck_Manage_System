package vn.fpt.edu.ctms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String email;
    private String image;
    private String username;
    private boolean isActive;
    private String role;
    private boolean userExisted;
    private String token;
    private String refreshToken;
    private String userId;
    private String userNumber;
}
