package vn.fpt.edu.ctms.constant;

public class Constants {
    public interface AuthenticationType {
        String GOOGLE = "Google";
        String GITHUB = "Github";
        String LOCAL = "Local";
    }

    public interface StatusCode {
        Integer SUCCESS = 200;
        Integer DUPLICATE = 499;
        Integer NOT_EXIST = 496;
        Integer INPUT_DATE_ERROR = 498;
        Integer DELETE_FILE_FAILED = 480;
        Integer DOWNLOAD_FILE_FAILED = 481;
    }

    public interface Invoice {
        String REPAIR = "Repair";
        String ORDER = "Order";
        String INCIDENT = "Incident";

    }
    public interface Contract{
        String VEHICLE_HANDOVER ="Vehicle Handover";
        String TRANSPORTATION ="Transportation";
    }

}
