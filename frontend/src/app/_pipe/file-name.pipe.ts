import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(path: string, args?: any): any {
    let files = path.split('/');

    if (files.length > 0) {
      return files[files.length - 1];
    } else {
      return '';
    }

  }

}
