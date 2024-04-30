package vn.fpt.edu.ctms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
public class ContainerTruckManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ContainerTruckManagementSystemApplication.class, args);
    }

}
