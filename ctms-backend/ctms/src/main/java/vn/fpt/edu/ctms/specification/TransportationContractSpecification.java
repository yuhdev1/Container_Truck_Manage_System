package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.Predicate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.dto.TransportationContractDTO;
import vn.fpt.edu.ctms.model.TransportationContract;

import java.util.ArrayList;
import java.util.List;

public class TransportationContractSpecification {

    public static Specification<TransportationContract> filterByAllFields(TransportationContractDTO purchaseContractCriteria) {
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicateList = new ArrayList<>();


            if (purchaseContractCriteria.getContractId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("id"), purchaseContractCriteria.getContractId()));

            }

            if (!StringUtils.isEmpty(purchaseContractCriteria.getCustomerId())) {
                predicateList.add((criteriaBuilder.equal(root.get("customer").get("userId"), purchaseContractCriteria.getCustomerId())));
            }


            if (!StringUtils.isEmpty(purchaseContractCriteria.getContractNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("contractNumber"), "%" + purchaseContractCriteria.getContractNumber() + "%"));
            }

            if (!StringUtils.isEmpty(purchaseContractCriteria.getUserNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("customer").get("userNumber"), "%" + purchaseContractCriteria.getUserNumber() + "%"));
            }

            if (purchaseContractCriteria.getDeposit() != null) {
                predicateList.add(criteriaBuilder.like(root.get("deposit").as(String.class), "%" + purchaseContractCriteria.getDeposit() + "%"));
            }

            if (purchaseContractCriteria.getTotalPrice() != null) {
                predicateList.add(criteriaBuilder.like(root.get("totalPrice").as(String.class), "%" + purchaseContractCriteria.getTotalPrice() + "%"));
            }

            if (!StringUtils.isEmpty(purchaseContractCriteria.getOrderNumber())) {
                predicateList.add(criteriaBuilder.like(root.get("order").get("orderNumber"), "%" + purchaseContractCriteria.getOrderNumber() + "%"));
            }


            Predicate[] predicates = predicateList.toArray(new Predicate[0]);


            return criteriaBuilder.and(predicates);


        };


    }
}
