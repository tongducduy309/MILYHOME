import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { PageComponent } from './page.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { HistoriesBillComponent } from './histories/histories-bill/histories-bill.component';
import { BillComponent } from './bill/bill.component';
import { StorageComponent } from './storage/storage.component';
import { HistoriesComponent } from './histories/histories.component';
import { StockOutComponent } from './histories/stock-out/stock-out.component';
import { ChangeProductComponent } from './histories/change-product/change-product.component';
// let componentMap={
//   'welcom':WelcomeComponent,
//   'storage':StorageComponent,
//   'settings':SettingsComponent,
//   'warehouse':WarehouseComponent
// }
export let component = [
  WelcomeComponent,
  SettingsComponent,
  WarehouseComponent,
  HistoriesBillComponent,
  BillComponent,
  StorageComponent,
  HistoriesComponent,
  StockOutComponent,
  ChangeProductComponent

]
const routes: Routes = [
  {
    path:'',
    component:WelcomeComponent
  },
  {
    path:'welcome',
    component:WelcomeComponent
  },
  {
    path:'settings',
    component:SettingsComponent
  },
  {
    path:'warehouse',
    component:WarehouseComponent
  },
  {
    path:'historiesbill',
    component:HistoriesBillComponent
  }
  ,
  {
    path:'bill',
    component:BillComponent
  },
  {
    path:'storage',
    component:StorageComponent
  }
  ,
  {
    path:'histories',
    component:HistoriesComponent
  },
  {
    path:'stockout',
    component:StockOutComponent
  },
  {
    path:'changeproduct',
    component:ChangeProductComponent
  }
]
@NgModule({
  declarations: component,
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: component,
  exports:component,
  providers:component
})
export class PageModule {

}
