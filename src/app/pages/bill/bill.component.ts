import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent {
  @Input() isVisibleBill=false;
  placement: NzDrawerPlacement = 'right';
  @Output() closedetailBill=new EventEmitter();
  @Output() deleteBill_evt=new EventEmitter();
  @Input() bill:any;
  dataSet=[
    {
      id:'tm',
      name:'Tôn màu',
      tm:'Đông Á',
      length:4100,
      count:2,
      price:200000
    }
  ]

  constructor(public crud:CrudService){}
  close(): void {
    this.closedetailBill.emit(this.isVisibleBill);
  }
  deleteBill(){
    this.deleteBill_evt.emit(this.bill.id);
  }
}
