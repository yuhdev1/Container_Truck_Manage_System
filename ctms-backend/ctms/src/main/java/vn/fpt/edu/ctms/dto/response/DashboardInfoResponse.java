package vn.fpt.edu.ctms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardInfoResponse {
    private double revenue;
    private double profit;
    private int totalOrder;
    private int totalUser;
    private double expense;
}
