import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthGuardCustomerService } from './services/auth-guard-customer.service';
import { HomepageComponent } from './homepage/homepage.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { TransactionComponent } from './transaction/transaction.component';
import { StaffComponent } from './staff/staff.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { CustomerProductComponent } from './customer-product/customer-product.component';
import { CartComponent } from './cart/cart.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { RegisterComponent } from './register/register.component';



const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HomepageComponent,
    //canActivate: [AuthGuardService],
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'transaction',
    component: TransactionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'staff',
    component: StaffComponent,
    canActivate: [AuthGuardService],
  },
  // Customer paths
  {
    path: 'customer-product',
    component: CustomerProductComponent,
  },
  {
    path: 'profile',
    component: CustomerProfileComponent,
    canActivate: [AuthGuardCustomerService],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuardCustomerService],

  },
  {
    path: 'customer-login',
    component: CustomerLoginComponent,
  },
  {
    path: 'customer-register',
    component: RegisterComponent,
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
