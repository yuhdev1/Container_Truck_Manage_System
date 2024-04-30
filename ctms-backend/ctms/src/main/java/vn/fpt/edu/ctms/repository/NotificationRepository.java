package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.Notification;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,String> {

    Page<Notification> findAll(Specification<Notification> spec, Pageable pageable);


    Optional<Notification> findById(String id);

    Optional<List<Notification>> findByOrder_OrderId(String orderId);


}
