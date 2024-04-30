package vn.fpt.edu.ctms.specification;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.Role;
import vn.fpt.edu.ctms.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class UserSpecification {


    public static Specification<User> filterByAllFields(UserDTO criteria) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            List<Predicate> predicateList = new ArrayList<>();

            if (criteria.getUserId() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("userId"), criteria.getUserId()));
            }
            if (criteria.getUserNumber() != null) {
                predicateList.add(criteriaBuilder.like(root.get("userNumber"), "%" + criteria.getUserNumber() + "%"));
            }

            if (Objects.nonNull(criteria.getFullName())) {
                Expression<String> fullNameExpression = criteriaBuilder.concat(root.get("firstName"), " ");
                fullNameExpression = criteriaBuilder.concat(fullNameExpression, root.get("lastName"));
                predicateList.add(criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(fullNameExpression), "%" + criteria.getFullName().toLowerCase() + "%"))
                );
            }


            if (criteria.getAddress() != null) {
                predicateList.add(criteriaBuilder.like(root.get("address"), "%" + criteria.getAddress() + "%"));
            }
            if (criteria.getPhone() != null) {
                predicateList.add(criteriaBuilder.like(root.get("phone"), "%" + criteria.getPhone() + "%"));
            }
            if (criteria.getEmail() != null) {
                predicateList.add(criteriaBuilder.like(root.get("email"),"%" + criteria.getEmail() + "%"));
            }
            if (criteria.getRole() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("role"), criteria.getRole()));
            }
            if (criteria.getPersonalId() != null) {
                predicateList.add(criteriaBuilder.like(root.get("personalId"),"%" + criteria.getPersonalId() + "%"));
            }

            if (criteria.getBirthDate() != null) {
                predicateList.add(criteriaBuilder.like(root.get("birthDate"), criteria.getBirthDate()));
            }

            if (criteria.getIsEmployee() != null && criteria.getIsEmployee()) {
                predicateList.add(criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("role"), Role.STAFF),
                        criteriaBuilder.equal(root.get("role"), Role.DRIVER)
                ));
            }


            if (criteria.getIsActive() != null) {
                predicateList.add(criteriaBuilder.equal(root.get("isActive"), criteria.getIsActive()));
            }

            if(criteria.getHasAccount() != null){
                predicateList.add(criteriaBuilder.equal(root.get("hasAccount"), criteria.getHasAccount()));

            }




            Predicate[] predicates = predicateList.toArray(new Predicate[0]);


            return criteriaBuilder.and(predicates);


        };


    }

}






