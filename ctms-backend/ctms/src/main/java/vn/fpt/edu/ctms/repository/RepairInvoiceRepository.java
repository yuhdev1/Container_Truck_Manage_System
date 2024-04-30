package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.RepairInvoice;

import java.util.Optional;

@Repository
public interface RepairInvoiceRepository extends JpaRepository<RepairInvoice, String> {
    Page<RepairInvoice> findAll(Specification<RepairInvoice> repairInvoice, Pageable page);
    Boolean existsByInvoiceNumber(String invoiceNumber);
    Optional<RepairInvoice> findRepairInvoiceByRepairInvoiceId(String repairInvoiceId);
}
