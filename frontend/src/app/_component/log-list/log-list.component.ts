import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LogStoreService} from '../../_service/log-store.service';

@Component({
  selector: 'lg-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit, OnDestroy {
  private timeout = null;
  private storage: Storage = sessionStorage;

  public name = null;
  public rows = null;
  public maxColumns = null;
  public size = null;

  public content = [];

  public lineHeight: number = 19;
  public symbolWidth: number = 7.8;

  public linesPerPage: number = 1;
  public symbolPerLine: number = 200;

  public from: number = 0;
  public to: number = 25;

  public lineStart: number = 0;
  public lineEnd: number = 200;

  public top: number = 0;
  public left: number = 0;

  private subscriptions = {
    queryParams: null,
    logContentStore: null,
  };

  @ViewChild('logList')
  private logList: ElementRef;
  @ViewChild('logListContainer')
  private logListContainer: ElementRef;

  @HostListener('window:resize')
  public resizeList() {
    this.linesPerPage = Math.ceil((this.logListContainer.nativeElement.offsetHeight) / this.lineHeight);
    this.symbolPerLine = Math.ceil((this.logListContainer.nativeElement.offsetWidth) / this.symbolWidth);
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private logStoreService: LogStoreService) { }

  public scrollList() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      if (this.name) {
        this.storage.setItem(`${this.name}-top`, this.logListContainer.nativeElement.scrollTop);
        this.storage.setItem(`${this.name}-left`, this.logListContainer.nativeElement.scrollLeft);
      }

      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: {
          top: this.logListContainer.nativeElement.scrollTop,
          left: this.logListContainer.nativeElement.scrollLeft
        },
        queryParamsHandling: 'merge'
      });
    }, 75);
  }

  loadContent(name, rows, maxColumns, size, top, left) {
    this.name = name;
    this.rows = rows;
    this.maxColumns = maxColumns;
    this.size = size;

    this.top = parseInt(top || this.storage.getItem(`${this.name}-top`) || 0);
    this.left = parseInt(left || this.storage.getItem(`${this.name}-left`) || 0);

    if (name) {
      this.from = Math.floor(this.top / this.lineHeight) - this.linesPerPage * 4;
      this.to = Math.floor(this.top / this.lineHeight) + this.linesPerPage * 5;

      if (this.name && this.rows && this.to > this.rows) {
        this.to = this.rows - 1;
      }

      if (this.from > this.to) {
        this.from = this.to - this.linesPerPage * 9;
      }

      if (this.from < 0) {
        this.from = 0;
      }

      this.lineStart = Math.floor(this.left / this.symbolWidth) - this.symbolPerLine * 4;
      this.lineEnd = Math.floor(this.left / this.symbolWidth) + this.symbolPerLine * 5;

      if (this.name && this.maxColumns && this.lineEnd > this.maxColumns) {
        this.lineEnd = this.maxColumns - 1;
      }

      if (this.lineStart > this.lineEnd) {
        this.lineStart = this.lineEnd - this.symbolPerLine * 9;
      }

      if (this.lineStart < 0) {
        this.lineStart = 0;
      }

      this.logStoreService.loadFileContent(this.name, this.from, this.to, this.lineStart, this.lineEnd, () => {
        this.logListContainer.nativeElement.scrollTop = this.top;
        this.logListContainer.nativeElement.scrollLeft = this.left;
      });
    }
  }

  ngOnInit() {
    this.linesPerPage = Math.ceil((this.logListContainer.nativeElement.offsetHeight) / this.lineHeight);
    this.symbolPerLine = Math.ceil((this.logListContainer.nativeElement.offsetWidth) / this.symbolWidth);

    this.loadContent(
      this.route.snapshot.queryParams['name'],
      this.route.snapshot.queryParams['rows'],
      this.route.snapshot.queryParams['maxColumns'],
      this.route.snapshot.queryParams['size'],
      this.route.snapshot.queryParams['top'],
      this.route.snapshot.queryParams['left']);

    this.subscriptions['logContentStore'] = this.logStoreService.logContentStore.subscribe(content => this.content = content);

    this.subscriptions['queryParams'] = this.route.queryParams.subscribe(
      queryParams => this.loadContent(
        queryParams['name'],
        queryParams['rows'],
        queryParams['maxColumns'],
        queryParams['size'],
        queryParams['top'],
        queryParams['left'])
    )
  }

  ngOnDestroy(): void {
    for (let key in this.subscriptions) {
      if (this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();
      }
    }
  }
}
