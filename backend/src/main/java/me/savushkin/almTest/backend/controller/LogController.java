package me.savushkin.almTest.backend.controller;

import me.savushkin.almTest.backend.model.LogFile;
import me.savushkin.almTest.backend.model.LogRow;
import me.savushkin.almTest.backend.service.LogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
@RequestMapping("/api/log")
public class LogController {
  private final Logger logger = LoggerFactory.getLogger(LogController.class);

  private final LogService logService;

  @Autowired
  public LogController(LogService logService) {
    this.logService = logService;
  }

  @RequestMapping(value = "/files", method = GET)
  public ResponseEntity<?> getFiles(@RequestParam(name = "fileNameFilter", required = false) String fileNameFilter) {
    try {
      List<LogFile> files;
      if (fileNameFilter != null) {
        files = logService.getAllFiles(fileNameFilter);
      } else {
        files = logService.getAllFiles();
      }

      return new ResponseEntity<>(files, HttpStatus.OK);
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @RequestMapping(value = "/files/{fileName:.+}", method = GET)
  public ResponseEntity<?> getFileContent(@PathVariable(name = "fileName") String fileName,
                                          @RequestParam(name = "from") Integer from,
                                          @RequestParam(name = "to") Integer to,
                                          @RequestParam(name = "lineStart") Integer lineStart,
                                          @RequestParam(name = "lineEnd") Integer lineEnd) {
    try {
      List<LogRow> rows = logService.getFileContent(fileName, from, to, lineStart, lineEnd);
      return new ResponseEntity<>(rows, HttpStatus.OK);
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }
}
