package me.savushkin.almTest.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
@Scope(value = "singleton")
public class LogService {

  @Value("${backend.log.path}")
  private String backendLogPath;

  public List<File> getAllFiles(String fileNameFilter) throws FileNotFoundException {
    List<File> files;

    File logDirectory = new File(backendLogPath);

    if (!logDirectory.exists() && !logDirectory.isDirectory()) {
      throw new FileNotFoundException("File not found or is not a directory");
    }

    files = Arrays.asList(Objects.requireNonNull(logDirectory.listFiles((directory, fileName) -> {
      boolean result = fileName.endsWith(".log") || fileName.endsWith(".out") || fileName.endsWith(".txt");

      if (result && fileNameFilter != null) {
        result = fileName.contains(fileNameFilter);
      }

      return result;
    })));

    files.sort((file1, file2) -> Long.compare(file2.lastModified(), file1.lastModified()));

    return files;
  }

  public List<File> getAllFiles() throws FileNotFoundException {
    return getAllFiles(null);
  }

  public List<String> getFileContent(String fileName, Long page, Long size) throws IOException {
    File file = new File(backendLogPath + "/" + fileName);

    if ( !file.exists() && !file.isFile() ) {
      throw new FileNotFoundException("File not found or is not a directory");
    }

    List<String> rows = new LinkedList<>();
    Long count, from = page * size, to = page * size + size;
    try (BufferedReader br = new BufferedReader(new FileReader(file))) {

      String sCurrentLine;

      for (count = 0L; (sCurrentLine = br.readLine()) != null; count++) {
        if (count >= from && count < to) {
          ((LinkedList<String>) rows).addLast(sCurrentLine);
        }
      }

    }

    return rows;
  }
}
