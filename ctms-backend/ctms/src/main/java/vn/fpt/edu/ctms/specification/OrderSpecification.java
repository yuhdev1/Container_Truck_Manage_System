package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.model.DriverSchedule;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.OrderDetail;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class OrderSpecification {

    public static Specification<Order> filterByAllFields(OrderDTO orderDTO) {
        return (root, query, criteriaBuilder) -> {

            Predicate predicate = criteriaBuilder.conjunction();

            List<Predicate> predicateList = new ArrayList<>();

            if (orderDTO.getOrderId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("orderId"), orderDTO.getOrderId()));
            }

            if(orderDTO.getOrderNumber() != null){
                predicateList.add(criteriaBuilder.like(root.get("orderNumber"), "%"+ orderDTO.getOrderNumber() + "%"));

            }

            if (orderDTO.getOrderId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("orderId"), orderDTO.getOrderId()));
            }

            if (orderDTO.getEtd() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("etd"), orderDTO.getEtd()));
            }

            if (orderDTO.getEta() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("eta"), orderDTO.getEta()));
            }

            if (orderDTO.getShippingDate() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("shippingDate"), orderDTO.getShippingDate()));
            }

            if (orderDTO.getRealityDeliveryDate() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("realityDeliveryDate"), orderDTO.getRealityDeliveryDate()));
            }

            if (orderDTO.getRequestedDeliveryDate() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("requestedDeliveryDate"), orderDTO.getRealityDeliveryDate()));
            }

            if (!StringUtils.isEmpty(orderDTO.getCustomerId())) {
                predicateList.add((criteriaBuilder.equal(root.get("customer").get("userId"), orderDTO.getCustomerId())));
            }

            if (!StringUtils.isEmpty(orderDTO.getUserNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("customer").get("userNumber"),"%" + orderDTO.getUserNumber()+"%"));
            }

            if (!StringUtils.isEmpty(orderDTO.getOrderNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("orderNumber"),"%" + orderDTO.getOrderNumber() + "%"));
            }

            if (Objects.nonNull(orderDTO.getFullName())) {
                Expression<String> fullNameExpression = criteriaBuilder.concat(root.get("customer").get("firstName"), " ");
                fullNameExpression = criteriaBuilder.concat(fullNameExpression, root.get("customer").get("lastName"));
                predicateList.add(criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(fullNameExpression), "%" + orderDTO.getFullName() + "%"))
                );
            }



            if(orderDTO.getShippingAddress() != null){
                predicateList.add(criteriaBuilder.like(root.get("shippingAddress"), "%"+ orderDTO.getShippingAddress() + "%"));
            }


            if(orderDTO.getDeliveryAddress() != null){
                predicateList.add(criteriaBuilder.like(root.get("deliveryAddress"), "%"+ orderDTO.getDeliveryAddress() + "%"));
            }

            if(orderDTO.getStatus() !=null){
                predicateList.add(criteriaBuilder.equal(root.get("status"), orderDTO.getStatus()));

            }

            if(orderDTO.getPaid() !=null){
                predicateList.add(criteriaBuilder.equal(root.get("paid"), orderDTO.getPaid()));
            }

            if(orderDTO.getPhone() !=null){
                predicateList.add(criteriaBuilder.equal(root.get("customer").get("phone"),"%"+  orderDTO.getPhone() + "%"));
            }

            if(orderDTO.getPrice() !=null){
                predicateList.add(criteriaBuilder.equal(root.get("price"),"%"+  orderDTO.getPrice() + "%"));
            }

            if (orderDTO.getHasSchedule() != null) {
                if (orderDTO.getHasSchedule()) {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<DriverSchedule> driverScheduleRoot = subquery.from(DriverSchedule.class);
                    subquery.select(criteriaBuilder.count(driverScheduleRoot));
                    subquery.where(criteriaBuilder.equal(driverScheduleRoot.get("order"), root));

                    predicateList.add(criteriaBuilder.gt(subquery, 0L));
                } else {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<DriverSchedule> driverScheduleRoot = subquery.from(DriverSchedule.class);
                    subquery.select(criteriaBuilder.count(driverScheduleRoot));
                    subquery.where(criteriaBuilder.equal(driverScheduleRoot.get("order"), root));
                    predicateList.add(criteriaBuilder.equal(subquery, 0L));
                }
            }

            Predicate[] predicates = predicateList.toArray(new Predicate[0]);


            return criteriaBuilder.and(predicates);


        };


    }

}
