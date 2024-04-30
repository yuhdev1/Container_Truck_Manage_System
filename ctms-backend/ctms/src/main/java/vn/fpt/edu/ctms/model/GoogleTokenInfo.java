package vn.fpt.edu.ctms.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleTokenInfo {
    @JsonProperty("name")
    private String name;
    @JsonProperty("sub")
    private String sub;
    @JsonProperty("family_name")
    private String familyName;
    @JsonProperty("given_name")
    private String givenName;
    @JsonProperty("picture")
    private String picture;
    @JsonProperty("email")
    private String email;
    @JsonProperty("email_verified")
    private boolean isVerifiedEmail;
    @JsonProperty("locale")
    private String locale;
}
