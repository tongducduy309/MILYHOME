import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CrudService } from 'src/app/service/crud.service';
import { StorageComponent } from '../storage/storage.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  products:any;
  isVisibleEdit=false;
  selectProduct:any;
  listOfColumns:any={
    listOfFilter:[
      { text: 'Hết hàng', value: 0 },
        { text: 'Sắp hết hàng', value: 1 },
        { text: 'Còn hàng', value: 2 }
    ],
    filterFn:[]
  };
  search={
    id:'',
    trademark:'',
    category:''
  };
  dataSet:any;
  trademarks:any;
  categories:any;




  constructor(public crud:CrudService,private nzMessageService: NzMessageService,private router: Router){}

  ngOnInit(): void {
    this.getProducts();
    this.getTrademerks();
    this.getCategories();

  }

  async getProducts() {
    this.products = await this.crud.getAllData('products');
    this.listOfColumns={
      listOfFilter: [
        { text: 'Hết hàng', value: 0 },
        { text: 'Sắp hết hàng', value: 1 },
        { text: 'Còn hàng', value: 2 }
      ],
      filterFn:(num:Number[],product:any):boolean=>num.some(status=>status==product.status)
    }
    this.dataSet=this.products;
  }

  async getTrademerks(){
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

  deleteProduct(id:any,name:any,_id:any){
    this.products = this.products.filter((d: { id: any; }) => d.id != id);
    this.crud.addData('change',{time:this.crud.getTimeNow(),_id:_id,name:name,title:'Xóa sản phẩm'});
    this.crud.deleteData('products',id);

  }


  confirm(id:any,name:any,_id:any): void {
    this.products=this.products.filter((p: { id: any; })=>p.id!=id);
    this.deleteProduct(id,name,_id);
    this.dataSet=this.products;
    this.selected();

  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisibleEdit = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisibleEdit = false;
  }

  updateDataProduct(data:any){
    this.crud.updateData('products',data.id,data);
    this.crud.addData('change',{time:this.crud.getTimeNow(),_id:data._id,name:data.name,title:'Cập nhật sản phẩm'});
    this.isVisibleEdit=false;
  }




}
