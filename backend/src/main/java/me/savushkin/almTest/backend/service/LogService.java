package me.savushkin.almTest.backend.service;

import me.savushkin.almTest.backend.model.LogFile;
import me.savushkin.almTest.backend.model.LogRow;
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

    files = Arrays.asList(
      Objects.requireNonNull(
        logDirectory.listFiles((file) -> {
          boolean result = file.canRead() &&
            (file.getName().endsWith(".log") || file.getName().endsWith(".out") || file.getName().endsWith(".txt"));

          if (result && fileNameFilter != null) {
            result = file.getName().contains(fileNameFilter);
          }

          return result;
        })));

    files.sort((file1, file2) -> Long.compare(file2.lastModified(), file1.lastModified()));
    List<LogFile> logFiles = new ArrayList<>();
    files.forEach(file -> {
      LogFile logFile = new LogFile(file.getName(), file.length(), null, null);
      if (logFilesIndex.getLinesIndex().get(logFile.getName()) != null)
        logFile.setRows(logFilesIndex.getLinesIndex().get(logFile.getName()).size());
      if (logFilesIndex.getMaxColumn().get(logFile.getName()) != null)
        logFile.setMaxColumns(logFilesIndex.getMaxColumn().get(logFile.getName()));
      logFiles.add(logFile);
    });
    return logFiles;
  }

  public List<LogFile> getAllFiles() throws FileNotFoundException {
    return getAllFiles(null);
  }

  public List<LogRow> getFileContent(
    String fileName, Integer from, Integer to, Integer lineStart, Integer lineEnd) throws IOException {

    File file = new File(backendLogPath + "/" + fileName);

    if ( !file.exists() && !file.isFile() ) {
      throw new FileNotFoundException("File not found");
    }

    List<LogRow> rows = new ArrayList<>(to - from);
    List<Long> lineIndexList = logFilesIndex.getLinesIndex().get(fileName);

    if (lineIndexList.size() != 0) {
      try (SeekableByteChannel byteChannel = Files.newByteChannel(file.toPath())) {
        for (int line = from; line < to; line++) {
          String row = getLineFromChannel(line, byteChannel, lineIndexList);
          int rowLength = row.length();
          if (rowLength < lineStart) {
            row = null;
          } else if (rowLength < lineEnd) {
            row = row.substring(lineStart, rowLength);
          } else {
            row = row.substring(lineStart, lineEnd);
          }
          rows.add(new LogRow(line, row));
        }
      }
    } else {
      rows.add(new LogRow(0, "The file in the indexing process"));
    }
    return rows;
  }

  private String getLineFromChannel(Integer line,
                                    SeekableByteChannel byteChannel,
                                    List<Long> lineIndexList) throws IOException {
    long expectedSize = (line < lineIndexList.size() - 1 ? lineIndexList.get(line + 1) : byteChannel.size()) - lineIndexList.get(line);
    byte buffer[] = new byte[(int) expectedSize];
    ByteBuffer byteBuffer = ByteBuffer.wrap(buffer);
    byteChannel.position(lineIndexList.get(line));
    byteChannel.read(byteBuffer);
    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new ByteArrayInputStream(buffer)));
    return bufferedReader.readLine();
  }

}
