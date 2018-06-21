import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LogService} from './log.service';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class LogStoreService {
  public fileNamesStore: Subject<string[]> = new Subject<string[]>();
  // public logStore: Subject<any> = new Subject<any>();

  constructor(private logService: LogService,
              private errorService: ErrorService) { }

  public loadFileNames(fileNameFilter?: string): void {
    this.logService.getFiles(fileNameFilter).subscribe(
      fileNames => this.fileNamesStore.next(fileNames),
      error => this.errorService.handle(error)
    )
  }
}
