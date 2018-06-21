import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  public getFiles(fileNameFilter?: string): Observable<string[]> {
    let params: HttpParams = new HttpParams();

    if (fileNameFilter) {
      params = params.append('fileNameFilter', fileNameFilter);
    }

    return this.http.get<string[]>(`/${environment.context}/${environment.api.log}/${environment.api.files}`, {
      params
    });
  }

  public getFileContent(fileName: string, page: number, size: number): Observable<string[]> {
    let params: HttpParams = new HttpParams().append('page', page + '')
      .append('size', size + '');

    return this.http.get<string[]>(`/${environment.context}/${environment.api.log}/${environment.api.files}/${fileName}`, {
      params
    });
  }
}
