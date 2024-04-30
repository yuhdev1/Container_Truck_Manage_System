package vn.fpt.edu.ctms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialSignUpResponse {
    private String email;
    private String image;
    private String name;

    private boolean isExisted;

    private String accessToken;
    private String refreshToken;
}
