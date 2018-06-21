import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LogService} from './log.service';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class LogStoreService {
  public fileNamesStore: Subject<string[]> = new Subject<string[]>();
  public logContentStore: Subject<any> = new Subject<any>();

  constructor(private logService: LogService,
              private errorService: ErrorService) { }

  public loadFileNames(fileNameFilter?: string): void {
    this.logService.getFiles(fileNameFilter).subscribe(
      fileNames => this.fileNamesStore.next(fileNames),
      error => this.errorService.handle(error)
    )
  }

  public loadFileContent(fileName: string, page: number, size: number): void {
    this.logService.getFileContent(fileName, page, size).subscribe(
      content => this.logContentStore.next(content),
      error => this.errorService.handle(error)
    )
  }
}
