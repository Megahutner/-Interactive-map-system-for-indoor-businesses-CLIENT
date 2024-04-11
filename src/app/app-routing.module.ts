import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ZoneComponent } from './zone/zone.component';
import { DrawzoneComponent } from './drawzone/drawzone.component';



const routes: Routes = [
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: 'zone',
    component: ZoneComponent,
  },
  {
    path: "zone/draw",
    component: DrawzoneComponent,
  },
  // {
  //   path: 'customer',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'customer/receipt',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'accessories',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'outerwear',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'top',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'bottom',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'shoes',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'cart',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'product',
  //   //component: UpdateUserPassComponent,
  // },
  // {
  //   path: 'Admin',
  //   // canActivate: [AuthGuardService],
  //   data: {
  //     title: 'Dashboard'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       canActivate: [AuthGuardService],
  //       //component: HomeComponent,
  //     }, 
  //     {
  //       path: 'staff',
  //       canActivate: [AuthGuardService],
  //       //component: HomeComponent,
  //     }, 
  //     {
  //       path: 'product',
  //       canActivate: [AuthGuardService],
  //       //component: HomeComponent,
  //     }, 
  //     {
  //       path: 'category',
  //       canActivate: [AuthGuardService],
  //       //component: HomeComponent,
  //     }, 
  //     {
  //       path: 'transaction',
  //       canActivate: [AuthGuardService],
  //       //component: HomeComponent,
  //     }, 
  //     {
  //       path: 'transaction/detail',
  //       canActivate: [AuthGuardService],
  //       //component: HomeComponent,
  //     }, 
  //   ]  
  // },
  
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
