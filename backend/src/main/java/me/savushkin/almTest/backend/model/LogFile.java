package me.savushkin.almTest.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogFile {
  private String name;
  private Long size;
  private Integer rows;
}
