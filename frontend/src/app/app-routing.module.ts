import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageLogComponent} from './_component/page/page-log/page-log.component';

const routes: Routes = [
  {
    path: 'log',
    component: PageLogComponent
  },
  { path: '', redirectTo: '/log', pathMatch: 'full' },
  { path: '**', redirectTo: '/log' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
