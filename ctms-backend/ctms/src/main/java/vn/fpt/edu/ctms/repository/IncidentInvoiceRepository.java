package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.IncidentInvoice;

import java.util.Optional;


@Repository
public interface IncidentInvoiceRepository extends JpaRepository<IncidentInvoice, String> {
    Page<IncidentInvoice> findAll(Specification<IncidentInvoice> incidentInvoice, Pageable page);
    Boolean existsByInvoiceNumber(String invoiceNumber);
    Optional<IncidentInvoice> findIncidentInvoiceByIncidentInvoiceId(String incidentInvoiceId);
}
