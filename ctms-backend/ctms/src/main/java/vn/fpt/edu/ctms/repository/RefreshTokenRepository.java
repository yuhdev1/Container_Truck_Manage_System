package vn.fpt.edu.ctms.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.Account;
import vn.fpt.edu.ctms.model.RefreshToken;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findRefreshTokenByRefreshToken(String token);

    Optional<RefreshToken> findFirstTokenByAccount(Account accountId);
}
