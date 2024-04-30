package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.Account;
import vn.fpt.edu.ctms.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByUsername(String username);

    boolean existsByUsername(String username);

    Page<Account> findAll(Specification<Account> spec, Pageable pageable);

    List<Account> findAll(Specification<Account> spec);

    Account findByAccountId(String accountId);

    Optional<Account> findOneByUser_UserId(String id);
}
