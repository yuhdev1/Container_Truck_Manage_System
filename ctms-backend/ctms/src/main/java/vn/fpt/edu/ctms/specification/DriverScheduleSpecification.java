package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Predicate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.dto.DriverScheduleDTO;
import vn.fpt.edu.ctms.model.DriverSchedule;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class DriverScheduleSpecification {

    public static Specification<DriverSchedule> filterByAllFields(DriverScheduleDTO driverSchedule) {
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicateList = new ArrayList<>();

            if (driverSchedule.getId()!= null) {
                predicateList.add(criteriaBuilder.equal(root.get("id"), driverSchedule.getId()));
            }

            if (!StringUtils.isEmpty(driverSchedule.getDriverId())) {
                predicateList.add((criteriaBuilder.equal(root.get("containerTruck").get("driver").get("userId"), driverSchedule.getDriverId())));
            }

//            if (!StringUtils.isEmpty(driverSchedule.getOrderId())) {
//                predicateList.add((criteriaBuilder.equal(root.get("order").get("userId"), driverSchedule.getOrderId())));
//            }

            if (!StringUtils.isEmpty(driverSchedule.getLicensePlate())) {
                predicateList.add((criteriaBuilder.like(root.get("containerTruck").get("licensePlate"),"%" + driverSchedule.getLicensePlate() + "%" )));
            }


            if (!StringUtils.isEmpty(driverSchedule.getCustomerNumber())) {
                predicateList.add((criteriaBuilder.like(root.get("order").get("customer").get("userNumber"),"%" + driverSchedule.getCustomerNumber() +"%")));
            }

            if (!StringUtils.isEmpty(driverSchedule.getOrderNumber())) {
                predicateList.add((criteriaBuilder.like(root.get("order").get("orderNumber"),"%" + driverSchedule.getOrderNumber() + "%")));
            }

            if (!StringUtils.isEmpty(driverSchedule.getDriverNumber())) {
                predicateList.add((criteriaBuilder.like(root.get("driver").get("userNumber"),"%" + driverSchedule.getDriverNumber() + "%")));
            }

            if (Objects.nonNull(driverSchedule.getFrom())) {
                predicateList.add((criteriaBuilder.equal(root.get("from"), driverSchedule.getFrom() )));
            }

            if (Objects.nonNull(driverSchedule.getTo())) {
                predicateList.add((criteriaBuilder.equal(root.get("to"),driverSchedule.getTo() )));
            }

            if (!StringUtils.isEmpty(driverSchedule.getTimeStamp())) {
                predicateList.add((criteriaBuilder.like(root.get("time_stamp"),"%" + driverSchedule.getTimeStamp() + "%")));
            }


            Predicate[] predicates = predicateList.toArray(new Predicate[0]);

            query.orderBy(criteriaBuilder.desc(root.get("time_stamp")));


            return criteriaBuilder.and(predicates);


        };


    }

    public static Specification<DriverSchedule> overlapWith(Date from, Date to, String truckId) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("containerTruck").get("truckId"), truckId),
                    criteriaBuilder.or(
                            criteriaBuilder.and(
                                    criteriaBuilder.lessThanOrEqualTo(root.get("from"), from),
                                    criteriaBuilder.greaterThanOrEqualTo(root.get("to"), from)
                            ),
                            criteriaBuilder.and(
                                    criteriaBuilder.lessThanOrEqualTo(root.get("from"), to),
                                    criteriaBuilder.greaterThanOrEqualTo(root.get("to"), to)
                            )
                    )
            );
        };
    }


}


