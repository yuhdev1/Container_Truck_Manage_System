package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.model.VehicleHandoverContract;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class VehicleHandoverContractSpecification {
    @Bean
    public static Specification<VehicleHandoverContract> filterVehicalHandoverContractByAllFields(VehicleHandoverContract vehicleHandoverContract, ContainerTruck containerTruck, User user) {

        log.info("VehicalHandoverContractSpecification / filterVehicalHandoverContractByAllFields");
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            List<Predicate> predicateList = new ArrayList<>();
            if (vehicleHandoverContract.getHandingContractId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("handingContractId"), vehicleHandoverContract.getHandingContractId()));
            }
            if (StringUtils.isNotEmpty(vehicleHandoverContract.getContractNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("contractNumber"), "%" + vehicleHandoverContract.getContractNumber() + "%"));
            }
            if (vehicleHandoverContract.getStartDate() != null && vehicleHandoverContract.getEndDate() != null) {
                // Add a condition for range between start date and end date
                Predicate startDatePredicate = criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), vehicleHandoverContract.getStartDate());
                Predicate endDatePredicate = criteriaBuilder.lessThanOrEqualTo(root.get("endDate"), vehicleHandoverContract.getEndDate());
                predicateList.add(criteriaBuilder.and(startDatePredicate, endDatePredicate));
            } else {
                if (vehicleHandoverContract.getStartDate() != null) {
                    predicateList.add(criteriaBuilder.equal(root.get("startDate"), vehicleHandoverContract.getStartDate()));
                }
                if (vehicleHandoverContract.getEndDate() != null) {
                    predicateList.add(criteriaBuilder.equal(root.get("endDate"), vehicleHandoverContract.getEndDate()));
                }
            }

            if (vehicleHandoverContract.getSalary() != null) {
                predicateList.add(criteriaBuilder.like(root.get("salary").as(String.class), "%" + vehicleHandoverContract.getSalary().intValue() + "%"));
            }
            if (StringUtils.isNotEmpty(vehicleHandoverContract.getAttach())) {
                predicateList.add(criteriaBuilder.equal(root.get("attach"), vehicleHandoverContract.getAttach()));
            }
            Join<VehicleHandoverContract, User> driverJoin = root.join("driver", JoinType.INNER);
            if (StringUtils.isNotEmpty(user.getUserId())) {
                predicateList.add(criteriaBuilder.equal(driverJoin.get("userId"), user.getUserId()));
            }
            if (StringUtils.isNotEmpty(user.getUserNumber())) {
                predicateList.add(criteriaBuilder.like(driverJoin.get("userNumber"), "%" + user.getUserNumber() + "%"));
            }
            Join<VehicleHandoverContract, ContainerTruck> truckJoin = root.join("truck", JoinType.INNER);
            if (StringUtils.isNotEmpty(containerTruck.getTruckId())) {
                predicateList.add(criteriaBuilder.equal(truckJoin.get("truckId"), containerTruck.getTruckId()));
            }
            if (StringUtils.isNotEmpty(containerTruck.getLicensePlate())) {
                predicateList.add(criteriaBuilder.like(truckJoin.get("licensePlate"), "%" + containerTruck.getLicensePlate() + "%"));
            }
            if (containerTruck.getRegistrationDate() != null) {
                predicateList.add(criteriaBuilder.equal(truckJoin.get("registrationDate"), containerTruck.getRegistrationDate()));
            }
            // Combine all predicates
            predicate = criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
            return predicate;
        };
    }
}
