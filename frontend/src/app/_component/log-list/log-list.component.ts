import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LogStoreService} from '../../_service/log-store.service';

@Component({
  selector: 'lg-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
  public file = null;
  public content = [];

  public from: number = 0;
  public to: number = 25;
  public top: number = 0;
  public left: number = 0;

  @ViewChild('logList')
  private logList: ElementRef;
  @ViewChild('logListContainer')
  private logListContainer: ElementRef;

  private timeout;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private logStoreService: LogStoreService) { }



  ngOnInit() {
    let linePerPage = Math.ceil((this.logListContainer.nativeElement.offsetHeight - 16) / 19);
    if (this.route.snapshot.queryParams['top']) {
      // this.logList.nativeElement.scrollTop = this.route.snapshot.queryParams['top'];
    }
    if (this.route.snapshot.queryParams['left']) {
      // this.logList.nativeElement.scrollLeft = this.route.snapshot.queryParams['left'];
    }

    this.logStoreService.logContentStore.subscribe(content => this.content = content);

    this.route.queryParams.subscribe(
      queryParams => {

        this.from = parseInt(queryParams['from'] || 0);
        this.to = parseInt(queryParams['to'] || linePerPage);
        this.top = parseInt(queryParams['top'] || 0);
        this.left = parseInt(queryParams['left'] || 0);

        if (queryParams['file']) {
          let file = JSON.parse(queryParams['file']);

          if (this.file && this.file.name === file.name) {

          } else {
            this.file = file;
            this.logStoreService.loadFileContent(this.file.name, this.from, this.to);
          }
        } else {
          this.file = { name: 'Select file' };
        }
      }
    )
  }

  public scrollList() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      // this.from += this.onePageSize;
      // this.to += this.onePageSize;
      if (this.top != this.logList.nativeElement.scrollTop) {
        // this.logStoreService.loadFileContent(this.file, this.from, this.to);
      }

      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: {
          top: this.logList.nativeElement.scrollTop,
          left: this.logList.nativeElement.scrollLeft,
          from: this.from,
          to: this.to
        },
        queryParamsHandling: 'merge'
      });
    }, 1000);
  }

  public resizeList(event) {
    console.log(event)
  }

}
