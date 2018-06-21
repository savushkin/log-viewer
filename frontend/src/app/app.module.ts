import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FileNavMenuComponent} from './_component/file-nav-menu/file-nav-menu.component';
import {PageLogComponent} from './_component/page/page-log/page-log.component';
import {LogListComponent} from './_component/log-list/log-list.component';
import {FileNamePipe} from './_pipe/file-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FileNavMenuComponent,
    PageLogComponent,
    LogListComponent,
    FileNamePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }