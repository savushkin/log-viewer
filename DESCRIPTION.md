# LogViewer
[Live Demo, 1 core, 512 RAM, 20 GB SSD](http://log-viewer.savushkin.me/)

## Restrictions
 - Maximum rows in log file is 2147483647 as a maximum size of `ArrayList` in java
 - Expected UTF-8 files

## Technology stack and libraries
### BACKEND
 - Spring Boot 2.0.3
### FRONTEND
 - Angular 6
 - Bootstrap 4 (CSS only)
### Development software requirements
 - Java 8
 - Maven 3.5.0
 - node.js 8
 - npm 5-6
 - nginx

## Architecture
### BACKEND
In view of the limit on the amount of allocated memory in the heap and the maximum size of the log file, it is necessary to generate an index containing the list of the positions of the beginning of all lines in the file.
When the application starts, it searches the directory whose path is specified in the `backend.log.path` property.
Files are filtered from which you can read and end which are .out, .txt, .log.
For each newly found file, a thread is created in this thread pool. 
The thread reads the byte buffer and sequentially compares the characters with the characters of the line break (`\n` or `\r`).
If a line break character is found, the position is added to the list.
The maximum length of the string is also calculated.
The finished list is saved in `HashMap<String, List<Long>>`, `String` - file name, `List<Long>` - list.
Search and add new files to the index is performed with each request to receive a list of files from the user interface.
Time to build index on 10GB file on Intel i7 3770k with 16GB RAM ~ 20 min.

### FRONTEND
The user interface is a simple one-page spa and a right-side menu containing a list of files with the ability to search by name.
The current state of the log page is based on the query parameters (`name` - file name, `rows` - rows count, `maxColumns` - maximum symbols count in file, `size` - file length in byte, `top` - vertical scroll position is optional parameter, `left` - horizontal scroll position is optional parameter).
On initialization, scroll, select file fire method witch calculate position of "view" window +-4 window size on vertical and horizontal.
Calculated sizes send to server with file name and receive list with object like `{"rowNumber", "rowContent"}`.
List draw in the svg element with monospace font. 
Svg element sizes are calculated based on the `rows` and `maxColumns` query parameters.
Position of the text elements are calculated based on the `"rowNumber"` and vertical offset parameter.
Among other things, the `top` and `left` parameters are stored in the `sessionStorage` and, if they are not present in the query parameters, are used to return to the previous position the scrolling of the log file.
