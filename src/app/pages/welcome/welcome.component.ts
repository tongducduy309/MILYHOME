import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppComponent } from 'src/app/app.component';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  modeCreBill=false;
  isVisibleAddCraftBill=false;
  search={
    id:'',
    trademark:'',
    category:''
  }
  isWrite=false;
  lengthInput='';
  qtyInput=null;
  selectProduct:any;

  products:any;
  trademarks:any;
  categories:any;
  dataSet:any;

  constructor(public crud:CrudService,private app:AppComponent,private message: NzMessageService) {

  }

  ngOnInit() {
    this.getProducts();
    this.getTrademarks();
    this.getCategories();

  }

  async getProducts() {
      this.products = await this.crud.getAllData('products');
      //console.log(this.products.category[1].style,this.products[1].qty);
      this.products=this.products.filter((p: { category: { style: string; }; length: number; qty: number; })=>(p.category.style=='length'&&p.length*1>0)||(p.category.style=='qty'&&p.qty*1>0))
      this.dataSet=this.products;
    }

  async getTrademarks(){
    this.trademarks=await this.crud.getAllData('trademarks');
  }

  async getCategories(){
    this.categories=await this.crud.getAllData('categories');
  }

  selected(){
    let selected=[];
    if (this.search.id==null)this.search.id='';
    if (this.search.category==null)this.search.category='';
    if (this.search.trademark==null)this.search.trademark='';
    if (this.search.trademark!=''&&this,this.search.id!=''&&this.search.category!='')
      selected=this.products.filter((p: { _id: any, tm:any,category:any,name:any})=>(p._id.toLowerCase().indexOf(this.search.id.toLowerCase())>-1||p.name.toLowerCase().indexOf(this.search.id.toLowerCase())>-1)&&p.tm==this.search.trademark&&p.category.category==this.search.category);
    else {
      if (this.search.id!='')
        selected=this.products.filter((p: { _id: any,name:any})=>p._id.toLowerCase().indexOf(this.search.id.toLowerCase())>-1||p.name.toLowerCase().indexOf(this.search.id.toLowerCase())>-1);
      if(this.search.trademark!='')
        selected=this.products.filter((p: { tm: any})=>p.tm==this.search.trademark);
      if(this.search.category!='')
        selected=this.products.filter((p: { category: any})=>p.category.category==this.search.category);
      if (this.search.trademark==''&&this.search.id==''&&this.search.category=='') selected=this.products;

    }


    this.dataSet=[];
    if (selected.length>0)this.dataSet = [ ...selected];
  }

  removeSelected(id:any){
    this.dataSet = this.dataSet.filter((d: { id: any; }) => d.id !== id);
  }

  checkTime(i:any)
  {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }

  handleOk(length:any,qty:any,product:any): void {
    if (!length) length=0;
    if (!qty) qty=0;
    if (this.modeCreBill){
      let exportProduct=this.crud.exportProduct(product,length,qty);

      if (exportProduct!=null){
        // product.length=exportProduct.length;
        // product.qty=exportProduct.qty;
        // product.status=exportProduct.status;


        this.crud.addData('bill_temp',{product:{id:product.id,_id:product._id,length:exportProduct.expLength,qty:exportProduct.expQty,name:product.name,price:product.price,tm:product.tm,thickness:product.thickness,style:product.category.style}});
        this.isWrite = false;
        this.message.success('Đã thêm sản phẩm vào đơn hàng');
        this.app.getAllData();
      }
      else
        this.message.warning('Hàng trong kho không đủ');


    }
    else {
      let exportProduct=this.crud.exportProduct(product,length,qty);
      console.log(exportProduct);
      if (exportProduct!=null){

        // product.length=exportProduct.length;
        // product.qty=exportProduct.qty;
        // product.status=exportProduct.status;
        //this.crud.updateData('products',product.id,product);
        this.crud.addData('histories_stock_out',{time:this.crud.getTimeNow(),product:{id:product.id,_id:product._id,length:exportProduct.expLength,qty:exportProduct.expQty,style:product.category.style,name:product.name}});
        this.message.success('Đã xuất sản phẩm');

        this.isWrite = false;
      }
      else
        this.message.warning('Hàng trong kho không đủ');


    }

    this.lengthInput='';
    this.qtyInput=null;
  }



  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isWrite = false;
  }



}
