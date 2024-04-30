package vn.fpt.edu.ctms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.Salary;
@Repository
public interface SalaryRepository extends JpaRepository<Salary,String> {
}
