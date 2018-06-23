package me.savushkin.almTest.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.SeekableByteChannel;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

@Service
@Scope(value = "singleton")
public class LogFilesIndex {
  private final static int BUFFER_SIZE = 1024;

  private final Logger logger = LoggerFactory.getLogger(LogFilesIndex.class);
  private final ThreadPoolExecutor executor = (ThreadPoolExecutor) Executors
    .newFixedThreadPool(Runtime.getRuntime().availableProcessors());

  @Value("${backend.log.path}")
  private String backendLogPath;

  private HashMap<String, List<Long>> linesIndex = new HashMap();
  private HashMap<String, Long> maxColumn = new HashMap();

  @PostConstruct
  void init() throws FileNotFoundException {
    buildIndex();
  }

  public void buildIndex() throws FileNotFoundException {
    this.getLogFiles().forEach(file -> {
      if ( !this.getLinesIndex().containsKey(file.getName()) ) {

        linesIndex.put(file.getName(), null);
        maxColumn.put(file.getName(), null);
        executor.submit(() -> {
          try {
            linesIndex.replace(file.getName(), buildIndexForFile(file));
          } catch (IOException e) {
            logger.error(e.getMessage(), e);
          }
        });
      }
    });
  }

  private List<Long> buildIndexForFile(File file) throws IOException {
    logger.info("build index for " + file.getName() + " in thread " + Thread.currentThread().getName());
    byte[] buffer;
    ByteBuffer byteBuffer;
    List<Long> offsetsList = new ArrayList<>();
    long length = 0, maxLength = 0;
    try (SeekableByteChannel byteChannel = Files.newByteChannel(file.toPath())) {
      buffer = new byte[BUFFER_SIZE];
      long offset = 0;
      offsetsList.add(0L);
      while (byteChannel.position() < byteChannel.size()) {
        byteBuffer = ByteBuffer.wrap(buffer);
        byteChannel.read(byteBuffer);
        InputStreamReader reader = new InputStreamReader(new ByteArrayInputStream(buffer));
        int processedOffset = 0;
        while (reader.ready()) {
          Character character = (char) reader.read();
          offset++;
          length++;
          processedOffset++;
          if (character == '\n') {
            offsetsList.add(offset);
            if (maxLength < length) {
              maxLength = length;
            }
            length = 0;
          }

          if (processedOffset > BUFFER_SIZE - 10) {
            byteChannel.position(offset);
            break;
          }
        }
      }

      maxColumn.replace(file.getName(), maxLength);
    }
    logger.info("index building completed for " + file.getName());
    return offsetsList;
  }

  private List<File> getLogFiles() throws FileNotFoundException {
    List<File> files;

    File logDirectory = new File(backendLogPath);

    if (!logDirectory.exists() && !logDirectory.isDirectory()) {
      throw new FileNotFoundException("File not found");
    }

    files = Arrays.asList(Objects.requireNonNull(logDirectory.listFiles((directory, fileName) ->
      fileName.endsWith(".log") || fileName.endsWith(".out") || fileName.endsWith(".txt"))));

    return files;
  }

  public Map<String, List<Long>> getLinesIndex() {
    return linesIndex;
  }

  public HashMap<String, Long> getMaxColumn() {
    return maxColumn;
  }
}
