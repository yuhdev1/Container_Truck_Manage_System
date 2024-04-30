package vn.fpt.edu.ctms.util;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class FileUtils {
    public Optional<String> getExtensionByStringHandling(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1));
    }
}
