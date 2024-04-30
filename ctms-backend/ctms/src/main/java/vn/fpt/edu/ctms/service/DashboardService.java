package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import vn.fpt.edu.ctms.dto.response.DashboardInfoResponse;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.*;
import vn.fpt.edu.ctms.util.DateUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderInvoiceRepository orderInvoiceRepository;
    private final IncidentInvoiceRepository incidentInvoiceRepository;
    private final RepairInvoiceRepository repairInvoiceRepository;
    private final DriverScheduleRepository driverScheduleRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final DateUtils dateUtils;

    public DashboardInfoResponse getGeneralInfo() {
        var orderInvoices = orderInvoiceRepository.findAll();
        var incidentInvoices = incidentInvoiceRepository.findAll();
        var repairInvoices = repairInvoiceRepository.findAll();
        var orders = orderRepository.findAll();
//        double revenue = orderInvoices.stream().mapToDouble(OrderInvoice::getShippingCost).sum();
        double revenue = orders.stream()
                .filter(Order::getPaid)
                .filter(order -> order.getRealityDeliveryDate() != null)
                .mapToDouble(Order::getPrice).sum();
        double incidentExpense = incidentInvoices.stream().mapToDouble(IncidentInvoice::getCost).sum();
        double repairExpense = repairInvoices.stream().mapToDouble(RepairInvoice::getRepairCost).sum();
        int totalOrder = orderRepository.findAll().size();
        int totalUser = userRepository.findByRole(Role.CUSTOMER).size();

        return DashboardInfoResponse.builder()
                .revenue(revenue)
                .expense(incidentExpense + repairExpense)
                .profit((revenue - incidentExpense - repairExpense))
                .totalOrder(totalOrder)
                .totalUser(totalUser)
                .build();
    }

    public HashMap<String, Object> getChartOneStatistic(String truckId) {
        String format = "dd-MMM-yyyy";
        var orders = orderRepository.findAll();
        HashMap<String, Object> resp = new HashMap<>();
        List<String> allDates = getLastTwelvesMonths();
        var months = allDates.stream().map(date -> dateUtils.getMonth(date, format)).toList();
        resp.put("months", months);
        List<Double> rs = new ArrayList<>();

        if (StringUtils.isNotEmpty(truckId)) {
            var ordersOpt = orderRepository.findByContainerTruck_TruckId(truckId);
            if (ordersOpt.isPresent()) {

                rs = allDates.stream().map(date -> ordersOpt.get().stream()
                        .filter(x -> {
                            if (x.getRealityDeliveryDate() == null) return false;
                            return x.getRealityDeliveryDate().toLocalDate()
                                    .format(DateTimeFormatter.ofPattern("MMM"))
                                    .equalsIgnoreCase(dateUtils.getMonth(date, format));
                        })
                        .mapToDouble(Order::getPrice).sum()).toList();
            }
        } else {
            rs = allDates.stream().map(date -> orders.stream()
                    .filter(Order::getPaid)
                    .filter(order -> {
                        if (order.getRealityDeliveryDate() == null) return false;
                        return order.getRealityDeliveryDate().toLocalDate()
                                .format(DateTimeFormatter.ofPattern("MMM"))
                                .equalsIgnoreCase(dateUtils.getMonth(date, format));
                    })
                    .mapToDouble(Order::getPrice).sum()).toList();
        }
        double max = 0;
        if (!rs.isEmpty()) {
            max = rs.stream().max(Double::compareTo).orElseThrow();
        }
        resp.put("max", max);
        resp.put("data", rs);
        return resp;
    }


    public List<String> getLastTwelvesMonths() {
        List<String> allDates = new ArrayList<>();
        String maxDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy"));
        SimpleDateFormat monthDate = new SimpleDateFormat("dd-MMM-yyyy");
        Calendar cal = Calendar.getInstance();
        try {
            cal.setTime(monthDate.parse(maxDate));
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        for (int i = 1; i <= 12; i++) {
            String month_name1 = monthDate.format(cal.getTime());
            allDates.add(month_name1);
            cal.add(Calendar.MONTH, -1);
        }
        System.out.println(allDates);
        return allDates;
    }

    public HashMap<String, Object> getChartTwoStatistic() {
        String format = "dd-MMM-yyyy";
        HashMap<String, Object> resp = new HashMap<>();
        List<String> allDates = getLastTwelvesMonths();
        var incidentInvoices = incidentInvoiceRepository.findAll();
        var repairInvoices = repairInvoiceRepository.findAll();

        var incidentInvoiceFiltered = allDates.stream().map(date -> incidentInvoices.stream()
                .filter(invoice -> invoice.getPaymentDate()
                        .format(DateTimeFormatter.ofPattern("yyyy"))
                        .equalsIgnoreCase(dateUtils.getYear(date, format)))
                .filter(invoice -> invoice.getPaymentDate()
                        .format(DateTimeFormatter.ofPattern("MMM"))
                        .equalsIgnoreCase(dateUtils.getMonth(date, format)))
                .mapToDouble(IncidentInvoice::getCost).sum()).toList();

        var repairInvoiceFiltered = allDates.stream().map(date -> repairInvoices.stream()
                .filter(invoice -> invoice.getRepairDate()
                        .format(DateTimeFormatter.ofPattern("yyyy"))
                        .equalsIgnoreCase(dateUtils.getYear(date, format)))
                .filter(invoice -> invoice.getRepairDate()
                        .format(DateTimeFormatter.ofPattern("MMM"))
                        .equalsIgnoreCase(dateUtils.getMonth(date, format)))
                .mapToDouble(RepairInvoice::getRepairCost).sum()).toList();

        var incidentExpense = incidentInvoiceFiltered.stream().mapToDouble(f -> f).sum();
        var repairExpense = repairInvoiceFiltered.stream().mapToDouble(f -> f).sum();

        resp.put("incidentExpense", incidentExpense);
        resp.put("repairExpense", repairExpense);
        return resp;
    }
}
