package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.Role;
import vn.fpt.edu.ctms.model.User;

import java.util.List;
import java.util.Optional;


@Repository

public interface UserRepository extends JpaRepository<User, String> {

    Page<User> findAll(Specification<User> spec, Pageable pageable);

    Boolean existsByEmail(String email);

    Optional<User> findByUserId(String userId);

    List<User> findByRole(Role role);

    Optional<User> findByEmail(String email);


}
