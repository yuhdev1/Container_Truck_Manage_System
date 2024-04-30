package vn.fpt.edu.ctms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationExc extends RuntimeException {
    public ValidationExc(String message) {
        super(message);
    }
}
