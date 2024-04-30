package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
public class ContainerTruckSpecification {
    @Bean
    public static Specification<ContainerTruck> filterContainerTruckByAllFields
            (String truckId, String licensePlate,
             String manufacturer, Float capacity,
             Boolean isActive, String fullName, LocalDate registrationDate, Boolean inUse, String userNumber, String containerStatus) {
        log.info("ContainerTruckSpecification / filterContainerTruckByAllFields");
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            List<Predicate> predicateList = new ArrayList<>();
            if (truckId != null) {
                predicateList.add(criteriaBuilder.equal(root.get("truckId"), truckId));
            }
            if (licensePlate != null) {
                predicateList.add(criteriaBuilder.like(root.get("licensePlate"), "%" + licensePlate + "%"));
            }
            if (manufacturer != null) {
                predicateList.add(criteriaBuilder.like(root.get("manufacturer"), "%" + manufacturer + "%"));
            }
            if (capacity != null) {
                predicateList.add(criteriaBuilder.like(root.get("capacity").as(String.class), "%" + capacity.intValue() + "%"));
            }
            if (isActive != null) {
                predicateList.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }
            if (inUse != null) {
                predicateList.add(criteriaBuilder.equal(root.get("inUse"), inUse));
            }
            if (registrationDate != null) {
                predicateList.add(criteriaBuilder.equal(root.get("registrationDate"), registrationDate));
            }
            if (StringUtils.isNotEmpty(containerStatus)) {
                predicateList.add(criteriaBuilder.like(root.get("containerStatus").as(String.class), containerStatus));
            }
            if (StringUtils.isNotEmpty(userNumber)) {
                Join<ContainerTruck, User> driverJoin = root.join("driver", JoinType.INNER);
                predicateList.add(criteriaBuilder.like(driverJoin.get("userNumber"), "%" + userNumber + "%"));
            }
            if (!predicateList.isEmpty()) {
                Predicate[] predicates = predicateList.toArray(new Predicate[0]);
                predicate = criteriaBuilder.and(predicates);
            }

            if (fullName != null && !fullName.isEmpty()) {
                Join<ContainerTruck, User> driverJoin = root.join("driver", JoinType.INNER);
                Expression<String> fullNameExpression = criteriaBuilder.concat(driverJoin.get("firstName"), " ");
                fullNameExpression = criteriaBuilder.concat(fullNameExpression, driverJoin.get("lastName"));
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(fullNameExpression), "%" + fullName.toLowerCase() + "%")
                );
            }

            return predicate;
        };
    }

    @Bean
    public static Specification<ContainerTruck> filterWithOrder
            (String licensePlate,
             String userNumber,
             String fullName, Boolean inUse) {
        log.info("ContainerTruckSpecification / filterWithOrder");
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            List<Predicate> predicateList = new ArrayList<>();
            if (licensePlate != null) {
                predicateList.add(criteriaBuilder.like(root.get("licensePlate"), "%" + licensePlate + "%"));
            }
            if (userNumber != null) {
                predicateList.add(criteriaBuilder.like(root.get("driver").get("userNumber").as(String.class), "%" + userNumber + "%"));
            }
            if (inUse != null) {
                predicateList.add(criteriaBuilder.equal(root.get("inUse"), inUse));
            }
            if (!predicateList.isEmpty()) {
                Predicate[] predicates = predicateList.toArray(new Predicate[0]);
                predicate = criteriaBuilder.and(predicates);
            }
            if (fullName != null && !fullName.isEmpty()) {
                Join<ContainerTruck, User> driverJoin = root.join("driver", JoinType.INNER);
                Expression<String> fullNameExpression = criteriaBuilder.concat(driverJoin.get("firstName"), " ");
                fullNameExpression = criteriaBuilder.concat(fullNameExpression, driverJoin.get("lastName"));
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(fullNameExpression), "%" + fullName.toLowerCase() + "%")
                );
            }

            return predicate;
        };
    }


}
