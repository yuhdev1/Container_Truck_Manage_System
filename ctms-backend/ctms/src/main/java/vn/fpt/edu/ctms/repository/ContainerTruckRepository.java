package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.ContainerTruck;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContainerTruckRepository extends JpaRepository<ContainerTruck, String> {
    Page<ContainerTruck> findAll(Specification<ContainerTruck> truck, Pageable page);
    List<ContainerTruck> findAll(Specification<ContainerTruck> truck);

    List<ContainerTruck> findAllByInUse(Boolean inUse);
    Boolean existsByLicensePlate(String licensePlate);
    ContainerTruck findContainerTruckByLicensePlate(String licensePlate);
    Optional<ContainerTruck> findContainerTruckByTruckId(String truckId);
    Optional<ContainerTruck> findByDriver_UserId(String driverId);
}
