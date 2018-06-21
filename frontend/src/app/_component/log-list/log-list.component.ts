import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LogStoreService} from '../../_service/log-store.service';

@Component({
  selector: 'lg-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
  public file: string = null;
  public content: string[] = [];

  @ViewChild('logList')
  private logList: ElementRef;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private logStoreService: LogStoreService) { }



  ngOnInit() {
    this.logStoreService.logContentStore.subscribe(content => this.content = content);

    this.route.queryParams.subscribe(
      queryParams => {
        if (queryParams['file']) {
          if (this.file !== queryParams['file']) {
            this.logList.nativeElement.scrollTop = 0;
            this.logList.nativeElement.scrollLeft = 0;
          }

          this.file = queryParams['file'];
          this.logStoreService.loadFileContent(this.file, 0, 250);
        }
      }
    )

    // this.logList.nativeElement.
  }

  public scrollList(event) {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        top: event.target.offsetTop,
        left: event.target.offsetLeft
      },
      queryParamsHandling: 'merge'
    });
  }

  public resizeList(event) {
    console.log(event)
  }

}
