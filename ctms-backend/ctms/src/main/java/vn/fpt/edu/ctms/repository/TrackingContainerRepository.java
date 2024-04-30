package vn.fpt.edu.ctms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.TrackingContainer;

import java.util.Optional;

@Repository
public interface TrackingContainerRepository extends JpaRepository<TrackingContainer,String> {

    Optional<TrackingContainer> findTrackingContainerByOrder_OrderId(String orderId);
}
