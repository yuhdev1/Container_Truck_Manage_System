package vn.fpt.edu.ctms.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.TimeZone;

@Component
@Slf4j
public class DateUtils {
    public Date formatTimeZone(String date) {
        Date formattedDate = null;
        if (StringUtils.isNotEmpty(date)) {
            log.info("Date: {}", date);
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            try {
                formattedDate = sdf.parse(date);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }
        return formattedDate;
    }

    public String getYear(String date, String format) {
        LocalDate parsedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern(format));
        return parsedDate.format(DateTimeFormatter.ofPattern("yyyy"));
    }

    public String getMonth(String date, String format) {
        LocalDate parsedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern(format));
        return parsedDate.format(DateTimeFormatter.ofPattern("MMM"));
    }

}
