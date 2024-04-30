package vn.fpt.edu.ctms.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.fpt.edu.ctms.dto.response.DashboardInfoResponse;
import vn.fpt.edu.ctms.service.DashboardService;

import java.util.HashMap;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/general")
    public ResponseEntity<DashboardInfoResponse> getGeneralInfo() {
        return ResponseEntity.ok(dashboardService.getGeneralInfo());
    }

    @GetMapping("/chart/one")
    public ResponseEntity<HashMap<String, Object>> getChartOneStatistic(@RequestParam(required = false) String truckId) {
        return ResponseEntity.ok(dashboardService.getChartOneStatistic(truckId));
    }

    @GetMapping("/chart/two")
    public ResponseEntity<HashMap<String, Object>> getChartTwoStatistic() {
        return ResponseEntity.ok(dashboardService.getChartTwoStatistic());
    }

}
