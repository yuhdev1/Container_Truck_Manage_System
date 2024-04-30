package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.fpt.edu.ctms.model.VehicleHandoverContract;

import java.util.Optional;


public interface VehicleHandoverContractRepository extends JpaRepository<VehicleHandoverContract,String> {
    Page<VehicleHandoverContract> findAll(Specification<VehicleHandoverContract> spec, Pageable pageable);
    Boolean existsByContractNumber(String contractNumber);
    Optional<VehicleHandoverContract> findById(String Id);
}
