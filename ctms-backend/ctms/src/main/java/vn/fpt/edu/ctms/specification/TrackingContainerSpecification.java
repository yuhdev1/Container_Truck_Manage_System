//package vn.fpt.edu.ctms.specification;
//
//import jakarta.persistence.criteria.Predicate;
//import jakarta.persistence.criteria.Root;
//import jakarta.persistence.criteria.Subquery;
//import org.apache.commons.lang3.StringUtils;
//import org.springframework.data.jpa.domain.Specification;
//import vn.fpt.edu.ctms.dto.OrderDTO;
//import vn.fpt.edu.ctms.dto.TrackingContainerDTO;
//import vn.fpt.edu.ctms.model.DriverSchedule;
//import vn.fpt.edu.ctms.model.Order;
//import vn.fpt.edu.ctms.model.OrderDetail;
//import vn.fpt.edu.ctms.model.TrackingContainer;
//
//import java.util.ArrayList;
//import java.util.List;
//
//public class TrackingContainerSpecification {
//
//
//    public static Specification<TrackingContainer> filterByAllFields(TrackingContainerDTO trackingContainerDTO) {
//        return (root, query, criteriaBuilder) -> {
//
//            List<Predicate> predicateList = new ArrayList<>();
//
//            if (orderDTO.getOrderId() != null) {
//                predicateList.add(criteriaBuilder.equal(root.get("orderId"), orderDTO.getOrderId()));
//            }
//
//
//
//            Predicate[] predicates = predicateList.toArray(new Predicate[0]);
//
//
//            return criteriaBuilder.and(predicates);
//
//
//        };
//
//    }
