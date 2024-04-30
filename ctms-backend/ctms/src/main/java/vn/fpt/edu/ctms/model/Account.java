package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "account")
@Entity
@Builder
public class Account implements UserDetails {
    @Id
    @Column(name = "account_id")
    private String accountId;
    @Column(name = "username")
    private String username;

    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column(name = "is_active")
    private Boolean isActive;
    @OneToOne
    @JoinColumn(name = "user", referencedColumnName = "user_id")
    private User user;

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    @PrePersist
    public void generateAccountId() {
        this.accountId = UUID.randomUUID().toString();
    }

}
