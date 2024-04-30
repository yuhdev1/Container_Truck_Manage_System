package vn.fpt.edu.ctms.specification;


import jakarta.persistence.criteria.Predicate;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.dto.NotificationDTO;
import vn.fpt.edu.ctms.model.Notification;


import java.util.ArrayList;
import java.util.List;

public class NotificationSpecification {

    @Bean
    public static Specification<Notification> filterNotificationByCriteria(NotificationDTO notificationDTO) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicateList = new ArrayList<>();

            if (notificationDTO.getCustomerId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("customer").get("userId"),notificationDTO.getCustomerId()));
            }

            if (notificationDTO.getCustomerId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("order").get("orderId"),notificationDTO.getOrderId()));
            }

            if (notificationDTO.getReceiver() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("receiver"),notificationDTO.getReceiver()));
            }

            if (notificationDTO.getSeen() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("isActive"), notificationDTO.getSeen()));
            }


            Predicate[] predicates = predicateList.toArray(new Predicate[0]);

            query.orderBy(criteriaBuilder.desc(root.get("timestamp")));


            return criteriaBuilder.and(predicates);

        };
    }

}
