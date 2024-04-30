package vn.fpt.edu.ctms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.OrderDetail;

import java.util.List;

@Repository

public interface OrderDetailRepository extends JpaRepository<OrderDetail,String> {

    List<OrderDetail> findAllByOrder_OrderId(String orderId);
}
