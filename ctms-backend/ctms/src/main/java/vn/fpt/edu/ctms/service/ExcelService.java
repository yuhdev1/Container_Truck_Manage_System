package vn.fpt.edu.ctms.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.*;
import vn.fpt.edu.ctms.util.helper.ExcelHelper;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelService {
    private final ContainerTruckRepository containerTruckRepository;
    private final RepairInvoiceRepository repairInvoiceRepository;
    private final IncidentInvoiceRepository incidentInvoiceRepository;
    private final OrderInvoiceRepository orderInvoiceRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public HashMap<Integer, List<String>> saveExcel(MultipartFile file, String fileRole) {
        try {
            return switch (fileRole) {
                case "Repair" -> importRepairInvoiceFromExcel(file.getInputStream());
                case "Incident" -> importIncidentInvoiceFromExcel(file.getInputStream());
                case "Order" -> importOrderInvoiceFromExcel(file.getInputStream());
                default -> null;
            };
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    public ByteArrayOutputStream exportToFile(String fileRole) {
        return switch (fileRole) {
            case "Repair" -> {
                var repairInvoices = repairInvoiceRepository.findAll();
                yield exportRepairInvoiceToExcel(repairInvoices);
            }
            case "Incident" -> {
                var incidentInvoices = incidentInvoiceRepository.findAll();
                yield exportIncidentInvoiceToExcel(incidentInvoices);
            }
            case "Order" -> {
                var orderInvoices = orderInvoiceRepository.findAll();
                yield exportOrderInvoiceToExcel(orderInvoices);
            }
            default -> null;
        };

    }

    public HashMap<Integer, List<String>> importRepairInvoiceFromExcel(InputStream is) {
        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet(ExcelHelper.SHEET_FOR_REPAIR);
            Iterator<Row> rows = sheet.iterator();
            List<RepairInvoice> repairInvoices = new ArrayList<>();
            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }
                Iterator<Cell> cellsInRow = currentRow.iterator();
                RepairInvoice repairInvoice = new RepairInvoice();
                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();
                    switch (cellIdx) {
                        case 0:
                            // Assuming the truck_id is a String
                            if (!containerTruckRepository.existsByLicensePlate(currentCell.getStringCellValue().trim())) {
                                String message = "Biển số xe " + currentCell.getStringCellValue() + " không tồn tại !";
                                log.info("LicensePlate is not exsited");
                                status.put(Constants.StatusCode.NOT_EXIST, new ArrayList<>(List.of(message)));
                                return status;
                            } else {
                                var containerTruck = containerTruckRepository.findContainerTruckByLicensePlate(currentCell.getStringCellValue());
                                repairInvoice.setTruck(containerTruck);
                            }
                            break;
                        case 1:
                            LocalDate repairDate = currentCell.getLocalDateTimeCellValue().toLocalDate();
                            repairInvoice.setRepairDate(repairDate);
                            break;
                        case 2:
                            if (!repairInvoiceRepository.existsByInvoiceNumber(currentCell.getStringCellValue())) {
                                repairInvoice.setInvoiceNumber(currentCell.getStringCellValue());
                            } else {
                                String message = "Số hóa đơn " + currentCell.getStringCellValue() + " đã tồn tại !";
                                status.put(Constants.StatusCode.DUPLICATE, new ArrayList<>(List.of(message)));
                                return status;
                            }

                            break;
                        case 3:
                            repairInvoice.setDescription(currentCell.getStringCellValue());
                            break;
                        case 4:
                            repairInvoice.setRepairCost((float) currentCell.getNumericCellValue());
                            break;
                        case 5:
                            repairInvoice.setTax((float) currentCell.getNumericCellValue());
                            break;
                        case 6:
                            repairInvoice.setPaymentMethod(currentCell.getStringCellValue());
                            break;
                        case 7:
                            repairInvoice.setServiceProvider(currentCell.getStringCellValue());
                            break;
                        case 8:
                            repairInvoice.setServiceProviderContact(currentCell.getStringCellValue());
                            break;
                        case 9:
                            repairInvoice.setAttach(currentCell.getStringCellValue());
                            break;
                        default:
                            break;
                    }
                    cellIdx++;
                }
                repairInvoices.add(repairInvoice);
            }
            workbook.close();
            repairInvoiceRepository.saveAll(repairInvoices);
            status.put(Constants.StatusCode.SUCCESS, new ArrayList<>(List.of("Tạo danh sách hóa đơn sửa chữa thành công !")));
            return status;
        } catch (Exception ex) {
            log.info("Fail to parse Excel file: " + ex.getMessage());
            throw new RuntimeException(ex.getMessage());
        }
    }

    public HashMap<Integer, List<String>> importIncidentInvoiceFromExcel(InputStream is) {
        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet(ExcelHelper.SHEET_FOR_INCIDENT);
            Iterator<Row> rows = sheet.iterator();
            List<IncidentInvoice> incidentInvoices = new ArrayList<>();
            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }
                Iterator<Cell> cellsInRow = currentRow.iterator();
                IncidentInvoice incidentInvoice = new IncidentInvoice();
                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();
                    switch (cellIdx) {
                        case 0:
                            String fullNameWithUsername = currentCell.getStringCellValue();
                            String[] parts = fullNameWithUsername.split(" - ");
                            String fullName = parts[0];
                            String userNumber = parts[1];
                            UserDTO userDTO = new UserDTO();
                            userDTO.setRole("DRIVER");
                            userDTO.setFullName(fullName);
                            userDTO.setUserNumber(userNumber);
                            Pageable paging = PageRequest.of(0, 1000);
                            var userList = userService.getUsersByCriteria(userDTO, paging);
                            if (userList.isEmpty()) {
                                String message = "Tài xế tên " + fullName + " với mã tài xế " + userNumber + " không tồn tại !";
                                status.put(Constants.StatusCode.NOT_EXIST, new ArrayList<>(List.of(message)));
                                return status;
                            } else {
                                User u = userList.getContent().get(0);
                                incidentInvoice.setDriver(u);
                            }

                            break;
                        case 1:
                            if (!orderRepository.existsByOrderNumber(currentCell.getStringCellValue())) {
                                String message = "Mã đơn hàng " + currentCell.getStringCellValue() + " không tồn tại";
                                status.put(Constants.StatusCode.NOT_EXIST, new ArrayList<>(List.of(message)));
                                return status;
                            } else {
                                var order = orderRepository.findOrderByOrderNumber(currentCell.getStringCellValue());
                                incidentInvoice.setOrder(order);
                            }
                            break;
                        case 2:
                            if (!incidentInvoiceRepository.existsByInvoiceNumber(currentCell.getStringCellValue())) {
                                incidentInvoice.setInvoiceNumber(currentCell.getStringCellValue());
                            } else {
                                String message = "Số hóa đơn " + currentCell.getStringCellValue() + " đã tồn tại !";
                                status.put(Constants.StatusCode.DUPLICATE, new ArrayList<>(List.of(message)));
                                return status;
                            }
                            break;
                        case 3:
                            incidentInvoice.setPaymentMethod(currentCell.getStringCellValue());
                            break;
                        case 4:
                            incidentInvoice.setCost((float) currentCell.getNumericCellValue());
                            break;
                        case 5:
                            incidentInvoice.setTax((float) currentCell.getNumericCellValue());
                            break;
                        case 6:
                            LocalDate paymentDate = currentCell.getLocalDateTimeCellValue().toLocalDate();
                            incidentInvoice.setPaymentDate(paymentDate);
                            break;
                        case 7:

                            incidentInvoice.setDescription(currentCell.getStringCellValue());
                            break;
                        case 8:
                            incidentInvoice.setAttach(currentCell.getStringCellValue());
                            break;
                        default:
                            break;
                    }
                    cellIdx++;
                }
                incidentInvoices.add(incidentInvoice);
            }
            workbook.close();
            incidentInvoiceRepository.saveAll(incidentInvoices);
            status.put(Constants.StatusCode.SUCCESS, new ArrayList<>(List.of("Tạo danh sách hóa đơn sự cố thành công !")));
            return status;
        } catch (Exception ex) {
            log.info("Fail to parse Excel file: " + ex.getMessage());
            throw new RuntimeException(ex.getMessage());
        }
    }

    public HashMap<Integer, List<String>> importOrderInvoiceFromExcel(InputStream is) {
        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet(ExcelHelper.SHEET_FOR_ORDER);
            Iterator<Row> rows = sheet.iterator();
            List<OrderInvoice> orderInvoices = new ArrayList<>();
            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }
                Iterator<Cell> cellsInRow = currentRow.iterator();
                OrderInvoice orderInvoice = new OrderInvoice();
                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();
                    switch (cellIdx) {
                        case 0:
                            String fullNameWithUsername = currentCell.getStringCellValue();
                            String[] parts = fullNameWithUsername.split(" - ");
                            String fullName = parts[0];
                            String userNumber = parts[1];
                            UserDTO userDTO = new UserDTO();
                            userDTO.setRole("CUSTOMER");
                            userDTO.setFullName(fullName);
                            userDTO.setUserNumber(userNumber);
                            Pageable paging = PageRequest.of(0, 1000);
                            var userList = userService.getUsersByCriteria(userDTO, paging);
                            if (userList.isEmpty()) {
                                String message = "Khách hàng tên " + fullName + " với mã khách hàng " + userNumber + " không tồn tại !";
                                status.put(Constants.StatusCode.NOT_EXIST, new ArrayList<>(List.of(message)));
                                return status;
                            } else {
                                User u = userList.getContent().get(0);
                                orderInvoice.setCustomer(u);
                            }

                            break;
                        case 1:
                            if (!orderRepository.existsByOrderNumber(currentCell.getStringCellValue())) {
                                String message = "Mã đơn hàng " + currentCell.getStringCellValue() + " không tồn tại";
                                status.put(Constants.StatusCode.NOT_EXIST, new ArrayList<>(List.of(message)));
                                return status;
                            } else {
                                var order = orderRepository.findOrderByOrderNumber(currentCell.getStringCellValue());
                                orderInvoice.setOrder(order);
                            }
                            break;
                        case 2:
                            if (!orderInvoiceRepository.existsByInvoiceNumber(currentCell.getStringCellValue())) {
                                orderInvoice.setInvoiceNumber(currentCell.getStringCellValue());
                            } else {
                                String message = "Số hóa đơn " + currentCell.getStringCellValue() + " đã tồn tại !";
                                status.put(Constants.StatusCode.DUPLICATE, new ArrayList<>(List.of(message)));
                                return status;
                            }
                            break;
                        case 3:
                            orderInvoice.setPaymentMethod(currentCell.getStringCellValue());
                            break;
                        case 4:
                            orderInvoice.setShippingCost((float) currentCell.getNumericCellValue());
                            break;
                        case 5:
                            orderInvoice.setTax((float) currentCell.getNumericCellValue());
                            break;
                        case 6:
                            LocalDate paymentDate = currentCell.getLocalDateTimeCellValue().toLocalDate();
                            orderInvoice.setPaymentDate(paymentDate);
                            break;
                        case 7:

                            orderInvoice.setNote(currentCell.getStringCellValue());
                            break;
                        case 8:
                            orderInvoice.setAttach(currentCell.getStringCellValue());
                            break;
                        default:
                            break;
                    }
                    cellIdx++;
                }
                orderInvoices.add(orderInvoice);
            }
            workbook.close();
            orderInvoiceRepository.saveAll(orderInvoices);
            status.put(Constants.StatusCode.SUCCESS, new ArrayList<>(List.of("Tạo danh sách hóa đơn đơn hàng thành công !")));
            return status;
        } catch (Exception ex) {
            log.info("Fail to parse Excel file: " + ex.getMessage());
            throw new RuntimeException(ex.getMessage());
        }
    }

    public ByteArrayOutputStream exportRepairInvoiceToExcel(List<RepairInvoice> repairInvoices) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = createSheetRow(ExcelHelper.SHEET_FOR_REPAIR, ExcelHelper.HEADER_FOR_REPAIR, workbook);
            int rowIdx = 1;
            for (RepairInvoice repair : repairInvoices) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(repair.getTruck().getLicensePlate());
                row.createCell(1).setCellValue(repair.getRepairDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                row.createCell(2).setCellValue(repair.getInvoiceNumber());
                row.createCell(3).setCellValue(repair.getDescription());
                row.createCell(4).setCellValue(repair.getRepairCost());
                row.createCell(5).setCellValue(repair.getTax());
                row.createCell(6).setCellValue(repair.getPaymentMethod());
                row.createCell(7).setCellValue(repair.getServiceProvider());
                row.createCell(8).setCellValue(repair.getServiceProviderContact());
                row.createCell(9).setCellValue(repair.getAttach());
            }
            workbook.write(out);
            return out;
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    public ByteArrayOutputStream exportIncidentInvoiceToExcel(List<IncidentInvoice> incidentInvoices) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = createSheetRow(ExcelHelper.SHEET_FOR_INCIDENT, ExcelHelper.HEADER_FOR_INCIDENT, workbook);
            int rowIdx = 1;
            for (IncidentInvoice invoice : incidentInvoices) {
                Row row = sheet.createRow(rowIdx++);
                String userFull = invoice.getDriver().getFirstName() + " " + invoice.getDriver().getLastName() + " - " + invoice.getDriver().getUserNumber();
                row.createCell(0).setCellValue(userFull);
                row.createCell(1).setCellValue(invoice.getOrder().getOrderNumber());
                row.createCell(2).setCellValue(invoice.getInvoiceNumber());
                row.createCell(3).setCellValue(invoice.getPaymentMethod());
                row.createCell(4).setCellValue(invoice.getCost());
                row.createCell(5).setCellValue(invoice.getTax());
                row.createCell(6).setCellValue(invoice.getPaymentDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                row.createCell(7).setCellValue(invoice.getDescription());
                row.createCell(8).setCellValue(invoice.getAttach());
            }
            workbook.write(out);
            return out;
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    public ByteArrayOutputStream exportOrderInvoiceToExcel(List<OrderInvoice> orderInvoices) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = createSheetRow(ExcelHelper.SHEET_FOR_ORDER, ExcelHelper.HEADER_FOR_ORDER, workbook);

            int rowIdx = 1;
            for (OrderInvoice invoice : orderInvoices) {
                Row row = sheet.createRow(rowIdx++);
                String userFull = invoice.getCustomer().getFirstName() + " " + invoice.getCustomer().getLastName() + " - " + invoice.getCustomer().getUserNumber();
                row.createCell(0).setCellValue(userFull);
                row.createCell(1).setCellValue(invoice.getOrder().getOrderId());
                row.createCell(2).setCellValue(invoice.getInvoiceNumber());
                row.createCell(3).setCellValue(invoice.getPaymentMethod());
                row.createCell(4).setCellValue(invoice.getShippingCost());
                row.createCell(5).setCellValue(invoice.getTax());
                row.createCell(6).setCellValue(invoice.getPaymentDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                row.createCell(7).setCellValue(invoice.getNote());
                row.createCell(8).setCellValue(invoice.getAttach());
            }
            workbook.write(out);
            return out;
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    private Sheet createSheetRow(String sheetName, String[] sheetRows, Workbook workbook) {
        Sheet sheet = workbook.createSheet(sheetName);
        // Header
        Row headerRow = sheet.createRow(0);
        for (int col = 0; col < sheetRows.length; col++) {
            Cell cell = headerRow.createCell(col);
            cell.setCellValue(sheetRows[col]);
        }
        return sheet;
    }
}
