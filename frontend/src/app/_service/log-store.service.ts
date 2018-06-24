import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LogService} from './log.service';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class LogStoreService {
  public filesStore: Subject<any[]> = new Subject<any[]>();
  public logContentStore: Subject<any> = new Subject<any>();

  private subscriptions = {
    requestFileNames: null,
    requestFileContent: null,
  };

  constructor(private logService: LogService,
              private errorService: ErrorService) { }

  public loadFileNames(fileNameFilter?: string): void {
    if (this.subscriptions['requestFilesStore']) {
      this.subscriptions['requestFilesStore'].unsubscribe();
    }

    this.subscriptions['requestFilesStore'] = this.logService.getFiles(fileNameFilter).subscribe(
      files => this.filesStore.next(files),
      error => this.errorService.handle(error)
    )
  }

  public loadFileContent(fileName: string, from: number, to: number, lineStart: number, lineEnd: number, callback?): void {
    if (this.subscriptions['requestFileContent']) {
      this.subscriptions['requestFileContent'].unsubscribe();
    }

    this.subscriptions['requestFileContent'] = this.logService.getFileContent(fileName, from, to, lineStart, lineEnd).subscribe(
      content => {
        this.logContentStore.next(content);
        if (callback) {
          callback();
        }
      },
      error => {
        this.logContentStore.next([]);
        this.errorService.handle(error);
      }
    )
  }
}
