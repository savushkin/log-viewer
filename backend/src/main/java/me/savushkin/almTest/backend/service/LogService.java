package me.savushkin.almTest.backend.service;

import me.savushkin.almTest.backend.model.LogFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.SeekableByteChannel;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@Scope(value = "singleton")
public class LogService {
  private final LogFilesIndex logFilesIndex;

  @Value("${backend.log.path}")
  private String backendLogPath;


  @Autowired
  public LogService(LogFilesIndex logFilesIndex) {
    this.logFilesIndex = logFilesIndex;
  }

  public List<LogFile> getAllFiles(String fileNameFilter) throws FileNotFoundException {
    logFilesIndex.buildIndex();

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
    List<LogFile> logFiles = new ArrayList<>();
    files.forEach(file -> {
      LogFile logFile = new LogFile(file.getName(), file.length(), null);
      if (logFilesIndex.getLinesIndex().get(logFile.getName()) != null)
        logFile.setRows(logFilesIndex.getLinesIndex().get(logFile.getName()).size());
      logFiles.add(logFile);
    });
    return logFiles;
  }

  public List<LogFile> getAllFiles() throws FileNotFoundException {
    return getAllFiles(null);
  }

  public List<String> getFileContent(String fileName, Integer from, Integer to) throws IOException {
    File file = new File(backendLogPath + "/" + fileName);

    if ( !file.exists() && !file.isFile() ) {
      throw new FileNotFoundException("File not found");
    }

    List<String> rows = new ArrayList<>(to - from);
    byte[] buffer;
    ByteBuffer byteBuffer;
    List<Long> lineIndexList = logFilesIndex.getLinesIndex().get(fileName);

    if (lineIndexList != null) {
      try (SeekableByteChannel byteChannel = Files.newByteChannel(file.toPath())) {
        for (int line = from; line < to; line++) {
          long expectedSize = (line < lineIndexList.size() - 1 ? lineIndexList.get(line + 1) : byteChannel.size()) - lineIndexList.get(line);
          buffer = new byte[(int) expectedSize];
          byteBuffer = ByteBuffer.wrap(buffer);
          byteChannel.position(lineIndexList.get(line));
          byteChannel.read(byteBuffer);
          BufferedReader br = new BufferedReader(new InputStreamReader(new ByteArrayInputStream(buffer)));
          rows.add(br.readLine());
        }
      }
    } else {
      rows.add("The file in the indexing process");
    }

    buffer = null;
    byteBuffer = null;
    return rows;
  }

}
