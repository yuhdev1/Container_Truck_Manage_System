package vn.fpt.edu.ctms.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GeneralExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GeneralExceptionHandler.class);

    @ExceptionHandler(value = {NotFoundExc.class})
    public ResponseEntity<Object> handleNotFoundException(NotFoundExc ex) {

        logger.error("NotFoundException : ", ex.getMessage());

        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(value = {ValidationExc.class})
    public ResponseEntity<Object> handleValidateException(ValidationExc ex) {

        logger.error("NotFoundException : ", ex.getMessage());

        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(value = {NullPointerExc.class})
    public ResponseEntity<Object> handleNullPointerException(NullPointerExc ex) {

        logger.error("NullPointerException : ", ex.getMessage());

        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(value = {SQLExc.class})
    public ResponseEntity<Object> handleSQLException(SQLExc ex) {

        logger.error("SQLException : ", ex.getMessage());

        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(value = {ExpiredJwtExc.class})
    public ResponseEntity<Object> handleExpiredJwtException(ExpiredJwtExc ex) {

        logger.error("ExpiredJwtExc : ", ex.getMessage());

        return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.UNAUTHORIZED);

    }

}