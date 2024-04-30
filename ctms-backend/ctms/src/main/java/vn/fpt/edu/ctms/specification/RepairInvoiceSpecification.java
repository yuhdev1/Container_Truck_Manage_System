package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.RepairInvoice;
import vn.fpt.edu.ctms.model.User;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class RepairInvoiceSpecification {
    @Bean
    public static Specification<RepairInvoice> filterRepairInvoiceByAllFields(RepairInvoice repairInvoice, ContainerTruck containerTruck) {
        log.info("RepairInvoiceSpecification / filterRepairInvoiceByAllFields");
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            List<Predicate> predicateList = new ArrayList<>();
            if (repairInvoice.getRepairInvoiceId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("repairInvoiceId"), repairInvoice.getRepairInvoiceId()));
            }
            if (StringUtils.isNotEmpty(repairInvoice.getInvoiceNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("invoiceNumber"), "%" + repairInvoice.getInvoiceNumber() + "%"));
            }
            if (repairInvoice.getRepairDate() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("repairDate"), repairInvoice.getRepairDate()));
            }
            if (StringUtils.isNotEmpty(repairInvoice.getDescription())) {
                predicateList.add(criteriaBuilder.like(root.get("description"), "%" + repairInvoice.getDescription() + "%"));
            }
            if (repairInvoice.getRepairCost() != null) {
                predicateList.add(criteriaBuilder.like(root.get("repairCost").as(String.class), "%" + repairInvoice.getRepairCost().intValue() + "%"));
            }
            if (repairInvoice.getTax() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("tax"), repairInvoice.getTax()));
            }
            if (StringUtils.isNotEmpty(repairInvoice.getPaymentMethod())) {
                predicateList.add(criteriaBuilder.equal(root.get("paymentMethod"), repairInvoice.getPaymentMethod()));
            }
            if (StringUtils.isNotEmpty(repairInvoice.getServiceProvider())) {
                predicateList.add(criteriaBuilder.like(root.get("serviceProvider"), "%" + repairInvoice.getServiceProvider() + "%"));
            }
            if (StringUtils.isNotEmpty(repairInvoice.getServiceProviderContact())) {
                predicateList.add(criteriaBuilder.like(root.get("serviceProviderContact"), "%" + repairInvoice.getServiceProviderContact() + "%"));
            }
            if (StringUtils.isNotEmpty(repairInvoice.getAttach())) {
                predicateList.add(criteriaBuilder.equal(root.get("attach"), repairInvoice.getAttach()));
            }
            Join<RepairInvoice, ContainerTruck> truckJoin = root.join("truck", JoinType.INNER);
            if (StringUtils.isNotEmpty(containerTruck.getTruckId())) {
                predicateList.add(criteriaBuilder.equal(truckJoin.get("truckId"), containerTruck.getTruckId()));

            }
            if (StringUtils.isNotEmpty(containerTruck.getLicensePlate())) {
                predicateList.add(criteriaBuilder.like(truckJoin.get("licensePlate"), "%" + containerTruck.getLicensePlate() + "%"));
            }
            if (containerTruck.getRegistrationDate() != null) {
                predicateList.add(criteriaBuilder.equal(truckJoin.get("registrationDate"), containerTruck.getRegistrationDate()));
            }
            if (StringUtils.isNotEmpty(containerTruck.getManufacturer())) {
                predicateList.add(criteriaBuilder.like(truckJoin.get("manufacturer"), "%" + containerTruck.getManufacturer() + "%"));
            }
            if (containerTruck.getCapacity() != null) {
                predicateList.add(criteriaBuilder.equal(truckJoin.get("capacity"), containerTruck.getCapacity()));
            }
            if (containerTruck.getIsActive() != null) {
                predicateList.add(criteriaBuilder.equal(truckJoin.get("isActive"), containerTruck.getIsActive()));
            }
            if (containerTruck.getInUse() != null) {
                predicateList.add(criteriaBuilder.equal(truckJoin.get("inUse"), containerTruck.getInUse()));
            }

            // Combine all predicates
            predicate = criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
            return predicate;
        };
    }

}
