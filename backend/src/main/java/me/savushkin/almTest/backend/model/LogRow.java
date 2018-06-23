package me.savushkin.almTest.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LogRow {
  private Integer index;
  private String row;
}
