package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.DriverSchedule;
import vn.fpt.edu.ctms.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverScheduleRepository extends JpaRepository<DriverSchedule, String> {

    Page<DriverSchedule> findAll(Specification<DriverSchedule> spec, Pageable pageable);

    long count(Specification<DriverSchedule> spec);

    List<DriverSchedule> findAll();

    DriverSchedule findDriverScheduleById(String id);

    Optional<DriverSchedule> findByOrderOrderId(String orderId);

    Optional<List<DriverSchedule>> findByContainerTruckTruckId(String truckId);
    Optional<DriverSchedule> findByDriverUserId(String driverId);

}
