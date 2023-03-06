import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { CrudService } from './service/crud.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WelcomeComponent } from './pages/welcome/welcome.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isCollapsed = false;
  placement: NzDrawerPlacement = 'right';
  isVisibleBill=false;
  isModify=false;

  infoModify={
    length:''||0,
    qty:''||0,
    price:'',
    index:-1,
    style:''
  }
  detailBill=false;
  currentTitle='';
  // dataSet=[
  //   {
  //     id:'tm',
  //     name:'Tôn màu',
  //     tm:'Đông Á',
  //     length:4100,
  //     count:2,
  //     price:200000
  //   }
  // ]
  products:any;
  productsInBill:any=[];
  billTemp:any;
  temp:any;
  isReloadButton=false;
  valueBill:any=0;
  constructor(private router: Router,public crud:CrudService,private message: NzMessageService) {
    // ...
  }

  currentRoute: any;
  ngOnInit(): void {
    this.getAllData();


  }
  navigate(component:string){
    this.router.navigate(['/', 'page',component]);
    this.isCollapsed=true;

  }

  // removeSelected(id:any){
  //   this.dataSet = this.dataSet.filter((d: { id: any; }) => d.id !== id);
  // }
  handleOk(): void {
    let index=this.infoModify.index;
    let product=this.productsInBill[index];
    let imp=this.crud.importProductBackTo(this.products,this.productsInBill[index].product);
    if (imp!=null){
      let p=this.crud.findProduct(this.products,product.product.id);
      let exp=this.crud.exportProduct(p,this.infoModify.length,this.infoModify.qty);
      console.log(exp);
      if (exp!=null) {
        this.productsInBill[index].product.length=this.infoModify.length;
        this.productsInBill[index].product.qty=this.infoModify.qty;
        this.productsInBill[index].product.price=this.infoModify.price;
        this.valueBill=this.getProductsInBill();
        this.crud.updateData('bill_temp',this.productsInBill[index].id,{product:this.productsInBill[index].product});
      }
      else this.message.error("Cập nhật thất bại");
    }
    else this.message.error("Cập nhật thất bại");
    this.isModify=false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isModify = false;
  }
  openModify(data:any){
    this.isModify = true;
  }

  productToModify(index:any){
    this.infoModify.index=index;
    this.infoModify.length=this.productsInBill[index].product.length;
    this.infoModify.qty=this.productsInBill[index].product.qty;
    this.infoModify.price=this.productsInBill[index].product.price;
    this.infoModify.style=this.productsInBill[index].product.style;
    console.log(this.productsInBill[index].product.style);

  }
  deleteProductInBill(index:any){
    let product=this.productsInBill[index];
    console.log(product);
    let id = this.productsInBill[index].id;
    let importProduct=this.crud.importProductBackTo(this.products,product.product);
      if (importProduct){
        product.product.length=importProduct.length;
        product.product.qty=importProduct.qty;
        product.product.status=importProduct.status;
        this.crud.updateData('products',product.product.id,product.product);
        this.crud.deleteData('bill_temp',product.id);


      }

    this.productsInBill = this.productsInBill.filter((d: { id: any; }) => d.id !== id);
    this.crud.deleteData('bill_temp',id);
    this.isReloadButton=true;
    this.getBillTemp();
    this.valueBill=this.getValueBill();
    this.message.warning("Đã xóa một sản phẩm trong đơn hàng");
  }

  deleteAllProductInBill(){
    for (let p of this.productsInBill){
      console.log(p.id);
      this.crud.deleteData('bill_temp',p.id);
    }
    this.productsInBill=[];
    this.isVisibleBill=false;
  }



  // updateDataForProduct(id:any,length:any,qty:any){
  //   for (let p of this.products){
  //     if (p.id==id){
  //       p.length-=length;
  //       if (p.length<=0){p.qty-=qty;if (p.qty<=0) {p.status=0;p.qty=0;return false;}p.length=0;}

  //       this.crud.updateData('products',id,p);
  //       break;
  //     }
  //   }
  //   return true;
  // }

  getValueBill(){

    let value=0;
    for (let p of this.productsInBill){
      if (p.product.style=='length')
      value+=(1*p.product.qty*p.product.length/1000*p.product.price);
      else if (p.product.style=='qty')
      value+=(1*p.product.qty*p.product.price);
      //this.updateDataForProduct(p.id,p.product.length,p.product.qty);
    }
    return value;
  }

  submitBill(){
    let products=[],value=this.getValueBill();
    for (let p of this.productsInBill)
      products.push(p.product);




    let time=this.crud.getTimeNow();
    this.crud.addData('histories_bill',{time:time,products:products,status:'Chưa xử lý',value:value});
    this.message.success('Đã ghi hóa đơn với giá trị '+this.crud.formatNumberToPrice(value));
    this.deleteAllProductInBill();
    this.isVisibleBill=false;
  }



  // getProductsInBill(){
  //   for (let p of this.billTemp[])
  // }

  getAllData(){
    this.getBillTemp();
    this.getProducts();
  }

  getProductsInBill(){
    this.productsInBill=[];
    this.valueBill=0;
    for (let p of this.billTemp)
    {
      this.productsInBill.push({product:p.product,id:p.id});
      if (p.product.style=='length')
        this.valueBill+=(1*p.product.length/1000*p.product.qty*p.product.price);
      else if (p.product.style=='qty') this.valueBill+=(1*p.product.qty*p.product.price);
      //console.log(p.product.category.style);
    }
    this.valueBill=this.crud.formatNumberToPrice(this.valueBill);


  }

  async getBillTemp(){
    this.billTemp = await this.crud.getAllData('bill_temp');
    this.getProductsInBill();

  }

  async getProducts(){
    this.products = await this.crud.getAllData('products');
  }

  cancelBill(){
    for (let product of this.productsInBill){
      console.log(product);
      let importProduct=this.crud.importProductBackTo(this.products,product.product);
      if (importProduct){
        product.product.length=importProduct.length;
        product.product.qty=importProduct.qty;
        product.product.status=importProduct.status;
        this.crud.updateData('products',product.product.id,product.product);


      }
      this.crud.deleteData('bill_temp',product.id);
    }
    this.message.success("Đã hủy đơn hàng");
    this.productsInBill=[];
    this.isVisibleBill=false;
    this.isReloadButton=true;
    //if (this.productsInBill.length<=0) window.location.reload();


  }
  cancel(){

  }

  reloadPage(){
    this.isReloadButton=false;
    window.location.reload();

  }




}
