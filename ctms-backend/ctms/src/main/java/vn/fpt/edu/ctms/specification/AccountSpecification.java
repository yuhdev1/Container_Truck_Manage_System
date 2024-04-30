package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.model.Account;
import vn.fpt.edu.ctms.model.User;

import java.util.ArrayList;
import java.util.List;

public class AccountSpecification {
    public static Specification<Account> filterByAllFields(Account account, String userId) {
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicateList = new ArrayList<>();

            if (account.getAccountId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("accountId"), account.getAccountId()));
            }

            if (account.getUsername() != null) {
                predicateList.add(criteriaBuilder.like(root.get("username"),"%" + account.getUsername()+ "%"));
            }

            if (account.getRole() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("role"), account.getRole()));
            }

            if (account.getIsActive() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("isActive"), account.getIsActive()));
            }

            if (!StringUtils.isEmpty(userId)) {
                predicateList.add((criteriaBuilder.equal(root.get("user").get("userId"), userId)));
            }

            Predicate[] predicates = predicateList.toArray(new Predicate[0]);


            return criteriaBuilder.and(predicates);


        };


    }

    public static Specification<Account> filterByUser(String userId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicateList = new ArrayList<>();
            if (!StringUtils.isEmpty(userId)) {
                predicateList.add((criteriaBuilder.equal(root.get("user").get("userId"), userId)));
            }
            Predicate[] predicates = predicateList.toArray(new Predicate[0]);
            return criteriaBuilder.and(predicates);
        };
    }

}
