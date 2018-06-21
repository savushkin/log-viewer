import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LogStoreService} from '../../_service/log-store.service';

@Component({
  selector: 'lg-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private logStoreService: LogStoreService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      queryParams => {
        console.log(queryParams);
      }
    )
  }

}
