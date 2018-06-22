import {Component, OnInit} from '@angular/core';
import {LogStoreService} from '../../_service/log-store.service';

@Component({
  selector: 'lg-file-nav-menu',
  templateUrl: './file-nav-menu.component.html',
  styleUrls: ['./file-nav-menu.component.scss']
})
export class FileNavMenuComponent implements OnInit {
  public files = [];


  constructor(private logStoreService: LogStoreService) { }

  ngOnInit() {
    this.logStoreService.filesStore.subscribe(fileNames => this.files = fileNames);
    this.logStoreService.loadFileNames();
  }

  searchFileNames(event) {
    this.logStoreService.loadFileNames(event.target.value);
  }

}
