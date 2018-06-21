import {Component, OnInit} from '@angular/core';
import {LogStoreService} from '../../_service/log-store.service';

@Component({
  selector: 'lg-file-nav-menu',
  templateUrl: './file-nav-menu.component.html',
  styleUrls: ['./file-nav-menu.component.scss']
})
export class FileNavMenuComponent implements OnInit {
  public fileNames: string[] = [];


  constructor(private logStoreService: LogStoreService) { }

  ngOnInit() {
    this.logStoreService.fileNamesStore.subscribe(fileNames => this.fileNames = fileNames);
    this.logStoreService.loadFileNames();
  }

  searchFileNames(event) {
    this.logStoreService.loadFileNames(event.target.value);
  }

}
