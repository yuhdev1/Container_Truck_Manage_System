package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.model.IncidentInvoice;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.User;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class IncidentInvoiceSpecification {
    @Bean
    public static Specification<IncidentInvoice> filterIncidentInvoiceByAllFields(IncidentInvoice incidentInvoice,
                                                                                  Order order, User driver) {
        log.info("IncidentInvoiceSpecification / filterIncidentInvoiceByAllFields");
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            List<Predicate> predicateList = new ArrayList<>();
            if (incidentInvoice.getIncidentInvoiceId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("incidentInvoiceId"), incidentInvoice.getIncidentInvoiceId()));
            }
            if (StringUtils.isNotEmpty(incidentInvoice.getDescription())) {
                predicateList.add(criteriaBuilder.like(root.get("description"), "%" + incidentInvoice.getDescription() + "%"));
            }
            if (StringUtils.isNotEmpty(incidentInvoice.getInvoiceNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("invoiceNumber"), "%" + incidentInvoice.getInvoiceNumber() + "%"));
            }
            if (StringUtils.isNotEmpty(incidentInvoice.getPaymentMethod())) {
                predicateList.add(criteriaBuilder.equal(root.get("paymentMethod"), incidentInvoice.getPaymentMethod()));
            }
            if (incidentInvoice.getPaymentDate() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("paymentDate"), incidentInvoice.getPaymentDate()));
            }
            if (incidentInvoice.getCost() != null) {
                predicateList.add(criteriaBuilder.like(root.get("cost").as(String.class), "%" + incidentInvoice.getCost().intValue() + "%"));
            }
            if (incidentInvoice.getTax() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("tax"), incidentInvoice.getTax()));
            }
            if (StringUtils.isNotEmpty(incidentInvoice.getAttach())) {
                predicateList.add(criteriaBuilder.like(root.get("attach"), "%" + incidentInvoice.getAttach() + "%"));
            }
            Join<IncidentInvoice, Order> orderJoin = root.join("order", JoinType.INNER);
            if (StringUtils.isNotEmpty(order.getOrderId())) {
                predicateList.add(criteriaBuilder.equal(orderJoin.get("orderId"), order.getOrderId()));
            }
//            if (order.getOrderDate() != null) {
//                predicateList.add(criteriaBuilder.equal(orderJoin.get("orderDate"), order.getOrderDate()));
//            }
//            if (order.getExpectedDeliveryDate() != null) {
//                predicateList.add(criteriaBuilder.equal(orderJoin.get("expectedDeliveryDate"), order.getExpectedDeliveryDate()));
//            }
            if (order.getRealityDeliveryDate() != null) {
                predicateList.add(criteriaBuilder.equal(orderJoin.get("realityDeliveryDate"), order.getRealityDeliveryDate()));
            }
            Join<IncidentInvoice, User> driverJoin = root.join("driver", JoinType.INNER);
            if (StringUtils.isNotEmpty(driver.getUserId())) {
                predicateList.add(criteriaBuilder.equal(driverJoin.get("userId"), driver.getUserId()));
            }
            if (StringUtils.isNotEmpty(driver.getUserNumber())) {
                predicateList.add(criteriaBuilder.like(driverJoin.get("userNumber"),"%"+ driver.getUserNumber()+"%"));
            }

            // Combine all predicates
            predicate = criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
            return predicate;
        };
    }
}
