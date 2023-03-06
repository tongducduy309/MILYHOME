import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.scss']
})
export class StockOutComponent implements OnInit{
  stockout:any=[];
  products:any;


  constructor(private crud:CrudService,private message: NzMessageService){}

  ngOnInit(): void {
    this.getHistoriesStockOut();
    this.getProducts();
  }
  async getHistoriesStockOut(){
    this.stockout=await this.crud.getAllData('histories_stock_out');
    console.log(this.stockout);
  }

  async getProducts(){
    this.products= await this.crud.getAllData('products');
  }


  confirm(data:any){
    this.stockout=this.stockout.filter((p: { id: any; })=>p.id!=data.id);
    this.crud.importProductBackTo(this.products,data.product);
    this.crud.deleteData('histories_stock_out',data.id);
    this.crud.addData('change',{time:this.crud.getTimeNow(),_id:data.product._id,name:data.product.name,title:'Khôi phục sản phẩm - BN'});
    this.message.success("Đã khôi phục hàng về kho");
  }
  cancel(){

  }
}
