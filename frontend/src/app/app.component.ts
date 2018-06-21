import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'lg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class.menu-active')
  isShownMenu: boolean = true;

  ngOnInit(): void {

  }

  toggleMenu() {
    this.isShownMenu = !this.isShownMenu;
  }
}
