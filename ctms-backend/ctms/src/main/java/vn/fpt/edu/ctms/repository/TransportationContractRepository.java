package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.TransportationContract;
import vn.fpt.edu.ctms.model.User;

import java.util.Optional;

@Repository
public interface TransportationContractRepository extends JpaRepository<TransportationContract,String> {

    Page<TransportationContract> findAll(Specification<TransportationContract> spec, Pageable pageable);

    Optional<TransportationContract> findById(String Id);


}
