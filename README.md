# LogViewer

---------

Your task is to create a single-page web application for inspecting log files. The user should be able to view multiple log files in the browser.

## Requirements:

1. There’s a special directory on the server that contains zero or more log files (“data directory”). Log files always have “.log” or “.txt” or “.out” extension. Other files are ignored.
2. The web application is a single web page in the browser. When loaded, it shows a list of log files, sorted by their modification timestamp. The user can pick any of the available files and see its content.
3. Log file content is scrollable vertically and horizontally (the lines are not wrapped). The user is able to scroll to the beginning and to the end of the log file, and to any position in the middle with the mouse. The user should be able to use Page Up and Page Down keys.
4. The user is able to switch between files without leaving the page. When switching to a file that has been shown before, the previous vertical scrolling position for the file is restored. (So, when inspecting a log file, the user can switch to viewing another file, then easily go back to the file/position he was looking at previously.)
5. There will be multiple users accessing the application at the same time.
6. Maximum log file size: 100GB. Maximum number of log files: 1024. There’s ample free space on the hard drive. The server-side application is allowed to take up to 1GB of heap memory. The client-side application in the browser should consume reasonable amount of memory.
    1. If you need it, the application may set a limit on how long a line it can support. In that case, the limit should be at least 50000 characters, and any line that is longer may be replaced with a line “<unsupported line length: N>”, where N is the number of characters in that line.
7. The server-side part should be written in Java, and the client-side part should be written in JavaScript. Other than that, you’re free to use any technology stack and libraries. We suggest those that you’re most familiar with.
8. The log files don’t change during the web application run time. However, new log files may appear in the data/ directory. When the web page is reloaded, the new file should appear in the list.
Please note that there are no precise requirements for the user interface. It is left to be designed by you. Think of yourself as a customer and build the interface that is good for analyzing log files.

## Bonus track (optional requirements - work on these only if you have time left):

1. Make the URL of the page reflect the current state - which file is open and the scroll position. So when the user opens a file or changes scroll position, the URL is updated. It can then be copied and sent to another user, who would see the same log file at the same position when the URL is opened.
2. Filtering: let the user specify a regular expression for the lines that should not be shown.
3. Search: let the user search for a regular expression and jump to the first match. Add buttons to jump to the next/previous match.