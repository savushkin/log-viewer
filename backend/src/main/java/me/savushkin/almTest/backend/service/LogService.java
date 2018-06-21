package me.savushkin.almTest.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@Scope(value = "singleton")
public class LogService {

    @Value("${backend.log.path}")
    private String backendLogPath;

    public List<File> getAllFiles(String fileNameFilter) throws FileNotFoundException {
        List<File> files;

        File logDirectory = new File(backendLogPath);

        if (!logDirectory.exists() && !logDirectory.isDirectory()) {
            throw new FileNotFoundException("File not found or is not directory");
        }

        files = Arrays.asList(Objects.requireNonNull(logDirectory.listFiles((directory, fileName) -> {
            boolean result = fileName.endsWith(".log") || fileName.endsWith(".out") || fileName.endsWith(".txt");

            if (result && fileNameFilter != null) {
                result = fileName.contains(fileNameFilter);
            }

            return result;
        })));

        files.sort(Comparator.comparingLong(File::lastModified));

        return  files;
    }

    public List<File> getAllFiles() throws FileNotFoundException {
        return getAllFiles(null);
    }
}
