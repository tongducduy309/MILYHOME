import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-histories-bill',
  templateUrl: './histories-bill.component.html',
  styleUrls: ['./histories-bill.component.scss']
})
export class HistoriesBillComponent implements OnInit {
  detailBill=false;
  bills:any=[];
  selectBill:any;
  products:any;

  constructor(public crud:CrudService, private message: NzMessageService){}

  ngOnInit(): void {
    this.getProducts();
    this.getHistoriesBill();
  }

  openDetailBill(bill:any){
    this.selectBill=bill;
    this.detailBill=true;
  }

  async getHistoriesBill(){
    this.bills = await this.crud.getAllData('histories_bill');
    console.log(this.bills);
  }



  deleteBill(id:any){
    this.crud.deleteData('histories_bill',id);
    this.detailBill=false;
    this.bills = this.bills.filter((d: { id: any; }) => d.id !== id);
  }

  async getProducts(){
    this.products=await this.crud.getAllData('products');
  }

  confirm(data:any){
    this.bills=this.bills.filter((p: { id: any; })=>p.id!=data.id);
    for (let product of data.products){
      this.crud.importProductBackTo(this.products,product);
    }
    this.message.success("Đã khôi phục hàng về kho");
    this.crud.deleteData('histories_bill',data.id);
  }

}
