package vn.fpt.edu.ctms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.OrderInvoice;

import java.util.Optional;

@Repository
public interface OrderInvoiceRepository extends JpaRepository<OrderInvoice,String> {
    Page<OrderInvoice> findAll(Specification<OrderInvoice> incidentInvoice, Pageable page);
    Boolean existsByInvoiceNumber(String invoiceNumber);
    Optional<OrderInvoice> findOrderInvoiceByOrderInvoiceId(String orderInvoiceId);
}
