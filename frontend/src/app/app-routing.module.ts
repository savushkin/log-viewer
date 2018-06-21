import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageLogComponent} from './_component/page/page-log/page-log.component';

const routes: Routes = [
  {
    path: 'log',
    component: PageLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
