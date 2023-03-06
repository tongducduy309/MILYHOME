import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {
  @Input() titleSpan={
    btnSubmit:'Thêm sản phẩm'
  }
  @Input() parent=0;
  @Output() dataModify=new EventEmitter();
  //0: Hết hàng
  //1: Sắp hết hàng
  //2: Còn hàng
  @Input() dataOther:any=null;
  @Input() product={
    "_id":"",
    "name":"",
    "tm":null,
    "price":"",
    "qty":null||1,
    "unit":"",
    "length":"",
    "thickness":null,
    "category":{category:'',unit:'',index:-1,style:''},
    "status":2,
    "alert":""
  }
  categories:any=[];
  trademarks:any=[];
  isAddCategory=false;
  isAddTrademark=false;
  isEditCategory=false;
  isEditTrademark=false;
  categoryInput='';
  unitInput='';
  styleInput='length';
  trademarkInput='';
  products:any;

  importProduct: FormGroup | any;


  constructor(private crud:CrudService,private message: NzMessageService,private notification: NzNotificationService){

    this.importProduct = new FormGroup({
      _id:new FormControl(''),
      name:new FormControl('',[Validators.required]),
      thickness:new FormControl('',[Validators.required]),
      length:new FormControl('',[Validators.required]),
      qty:new FormControl(1,[Validators.required,Validators.min(1)]),
      alert:new FormControl('1',[Validators.required]),
      price:new FormControl('',[Validators.required]),
      category:new FormControl(''),
      trademark:new FormControl(''),
      unit:new FormControl('')
    });
  }

  ngOnInit() {
    this.getCategories();
    this.getTrademarks();
    this.getProducts();
    if (this.dataOther){
      this.product=this.dataOther;
      this.importProduct = new FormGroup({
        _id:new FormControl(this.product._id),
        name:new FormControl(this.product.name,[Validators.required]),
        thickness:new FormControl(this.product.thickness,[Validators.required]),
        length:new FormControl(this.product.length,[Validators.required]),
        qty:new FormControl(this.product.qty,[Validators.required,Validators.min(1)]),
        alert:new FormControl(this.product.alert,[Validators.required]),
        price:new FormControl(this.product.price,[Validators.required]),
        category:new FormControl(this.product.category.category),
        trademark:new FormControl(this.product.tm),
        unit:new FormControl(this.product.category.unit)
      });

    }
    //this.importProduct.alert=this.products.alert;

  }
  addCategory(category:string,unit:string,style:string): void {
    this.isAddCategory = false;
    this.crud.addData('categories',{category:category,unit:unit,style:style});
    this.categories.push({category:category,unit:unit,style:style});
    this.message.success('Đã thêm danh mục '+category);
    this.categoryInput='';
    this.unitInput='';

  }

  addTrademark(trademarkInput:any): void {
    this.isAddTrademark = false;
    this.crud.addData('trademarks',{name:trademarkInput});
    this.trademarks.push({name:trademarkInput});
    this.message.success('Đã thêm hãng '+trademarkInput);
    this.trademarkInput='';

  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isAddCategory = false;
  }

  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template,{nzDuration:10000});
  }

  async getProducts(){
    this.products= await this.crud.getAllData('products');

  }

  async getTrademarks(){
    this.trademarks= await this.crud.getAllData('trademarks');
  }


  addProduct(template: TemplateRef<{}>){
    let id=null;
    if (this.parent!=2){
      id=this.products.filter((p: { _id: string; })=>p._id==this.product._id);
      console.log(id);
      if (id.length>0) this.notification.template(template,{nzDuration:10000});
      else this.addProductToDB();
    }
    else this.addProductToDB();



  }

  addProductToDB(){
    this.product.category=this.categories[this.product.category.index];
    if (this.product.category.style=='length')
      {
        if (this.product.qty==null) this.product.qty=1;
      }
    else if (this.product.category.style=='qty')
    {
      if (this.product.length==null) this.product.length='6';
    }
    this.crud.addData('products',this.product);

    this.crud.addData('change',{time:this.crud.getTimeNow(),_id:this.product._id,name:this.product.name,title:'Thêm sản phẩm'});

    this.product={
      "_id":"",
      "name":"",
      "tm":null,
      "price":"",
      "qty":null||1,
      "unit":"",
      "length":"",
      "thickness":null,
      "category":{category:'',unit:'',index:-1,style:''},
      "status":2,
      "alert":""
    }
    this.message.success('Đã thêm 1 sản phẩm');
  }

  async getCategories() {
       this.categories = await this.crud.getAllData('categories');
       console.log(this.categories);
    }
  deleteCategory(_id:any,index:any){
    this.crud.deleteData('categories',_id);
    this.categories=this.categories.filter((c: { id: any; })=>c.id!=_id);
  }
  deleteTrademark(_id:any,index:any){
    this.crud.deleteData('trademarks',_id);
    this.trademarks=this.trademarks.filter((t: { id: any; })=>t.id!=_id);
  }
  selectCategory(){
    console.log(event);
  }
  saveDataModify(){
    this.dataModify.emit(this.product);
    this.message.success('Đã lưu chỉnh sửa');
  }

}
