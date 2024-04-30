package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.Status;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Page<Order> findAll(Specification<Order> spec, Pageable pageable);

    Optional<Order> findByOrderId(String orderID);

    Boolean existsByOrderNumber(String orderNumber);

    Order findOrderByOrderNumber(String orderNumber);

    Optional<Order> findByContainerTruck_TruckIdAndStatus(String truckId, Status status);

    Optional<List<Order>> findByContainerTruck_TruckId(String truckId);


}
