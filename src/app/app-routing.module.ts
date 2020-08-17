import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AllServiceComponent } from './all-service/all-service.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
  {path:'', component: AllServiceComponent},
  {path:'all-service', component: AllServiceComponent},
  {path:'all-service/:id', component: AddServiceComponent},
  {path:'add-service', component: AddServiceComponent},
  {path:'not-found', component: NotFoundComponent},
  {path:'**', redirectTo: '/not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
