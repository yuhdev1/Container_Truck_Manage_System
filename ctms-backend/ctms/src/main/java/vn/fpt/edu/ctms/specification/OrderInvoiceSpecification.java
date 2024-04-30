package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.OrderInvoice;
import vn.fpt.edu.ctms.model.User;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class OrderInvoiceSpecification {
    @Bean
    public static Specification<OrderInvoice> filterOrderInvoiceByAllFields(OrderInvoice orderInvoice,
                                                                            Order order, User customer) {
        log.info("OrderInvoiceSpecification / filterOrderInvoiceByAllFields");
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            List<Predicate> predicateList = new ArrayList<>();
            if (orderInvoice.getOrderInvoiceId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("orderInvoiceId"), orderInvoice.getOrderInvoiceId()));
            }
            if (StringUtils.isNotEmpty(orderInvoice.getInvoiceNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("invoiceNumber"), "%" + orderInvoice.getInvoiceNumber() + "%"));
            }
            if (orderInvoice.getShippingCost() != null) {
                predicateList.add(criteriaBuilder.like(root.get("shippingCost").as(String.class), "%" + orderInvoice.getShippingCost().intValue() + "%"));
            }
            if (orderInvoice.getTax() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("tax"), orderInvoice.getTax()));
            }
            if (StringUtils.isNotEmpty(orderInvoice.getPaymentMethod())) {
                predicateList.add(criteriaBuilder.equal(root.get("paymentMethod"), orderInvoice.getPaymentMethod()));
            }
            if (orderInvoice.getPaymentDate() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("paymentDate"), orderInvoice.getPaymentDate()));
            }
            if (StringUtils.isNotEmpty(orderInvoice.getNote())) {
                predicateList.add(criteriaBuilder.like(root.get("note"), "%" + orderInvoice.getNote() + "%"));
            }
            if (StringUtils.isNotEmpty(orderInvoice.getAttach())) {
                predicateList.add(criteriaBuilder.like(root.get("attach"), "%" + orderInvoice.getAttach() + "%"));
            }
            Join<OrderInvoice, Order> orderJoin = root.join("order", JoinType.INNER);
            if (StringUtils.isNotEmpty(order.getOrderId())) {
                predicateList.add(criteriaBuilder.equal(orderJoin.get("orderId"), order.getOrderId()));
            }

            if (order.getRealityDeliveryDate() != null) {
                predicateList.add(criteriaBuilder.equal(orderJoin.get("realityDeliveryDate"), order.getRealityDeliveryDate()));
            }
            Join<OrderInvoice, User> customerJoin = root.join("customer", JoinType.INNER);
            if (StringUtils.isNotEmpty(customer.getUserId())) {
                predicateList.add(criteriaBuilder.equal(customerJoin.get("userId"), customer.getUserId()));
            }
            if (StringUtils.isNotEmpty(customer.getUserNumber())) {
                predicateList.add(criteriaBuilder.like(customerJoin.get("userNumber"), "%" + customer.getUserNumber() + "%"));
            }

            // Combine all predicates
            predicate = criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
            return predicate;
        };
    }
}
