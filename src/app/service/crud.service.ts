import { Injectable, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from 'firebase/firestore';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class CrudService{
  constructor(public fireService:AngularFirestore,private message: NzMessageService) {

  }
  //
  addData(collection:any,value:any){
    this.fireService.collection(collection).add(value);
  }

  deleteAllData(collection:any){
    this.fireService.doc(collection).delete();
  }

  deleteData(collection:any,_id:any) {
    this.fireService.doc(collection+`/${_id}`).delete();
  }

  getAllData(collection:any) {
    return new Promise<any>((resolve)=> {
    this.fireService.collection(collection).valueChanges({ idField: 'id' }).subscribe(data => resolve(data));
    })
  }
  updateData(collection:any,_id:any,value:any) {
    this.fireService.doc(collection+`/${_id}`).update(value);
  }

  formatNumberToPrice(n:any){
    var s=n+"",rs="";
    while (s.length>3){
        rs="."+s.substr(s.length-3,3)+rs;
        s=s.substring(0,s.length-3);
    }
    return s+rs;
  }

  exportProduct(product:any,length:any,qty:any){
    //product.length,product.qty,product.category.style,product.alert
    let status=2;
    let lengthP=product.length*1;
    let qtyP=product.qty*1;
    let alert=product.alert*1;
    length=length*1;
    qty=qty*1;
    if (product.category.style=='length'){

      if (lengthP<length) return null;
      if (qty==0||qty==null) {qty=1;}
      lengthP-=(length*qty);
      if (lengthP<=alert) status=1;
      if(lengthP<=0) status=0;

    }
    else {
      if (qtyP<qty) return null;
      qtyP-=qty;
      if (qtyP<=alert) status=1;
      if(qtyP<=0) status=0;
      if (length==0)length=6;
    }
    product.length=lengthP;
    product.qty=qtyP;
    product.status=status;
    console.log(status);
    this.updateData('products',product.id,{length:product.length,qty:product.qty,status:product.status});
    return {length:lengthP,qty:qtyP,status:status,expLength:length,expQty:qty};
  }

  importProductBackTo(products:any,data:any){
    let product=this.findProduct(products,data.id);
    console.log(product);
    if (product!=null){
      let length=0,qty=0,status=2,alert=product.alert*1;
      if (data.style=='length')
        {length=1*data.length*data.qty+product.length;
          if (length<=alert) status=1;
          if(length<=0) status=0;}
      else if(data.style=='qty') {qty=data.qty*1+product.qty*1;
        if (qty<=alert) status=1;
        if(qty<=0) status=0;}


      this.updateData('products',data.id,{length:length,qty:qty,status:status});
      return {length:length,qty:qty,status:status}
    } else this.message.info("Sản phẩm ["+data.id+"] không còn tồn tại");
    return null;

  }

  findProduct(products:any,id:any){
    let product=null;
    for (let p of products){
      if (p.id==id){
        return p;
      }
    }
    return product;
  }

  checkTime(i:any)
  {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }

  getTimeNow(){
    var today = new Date();

    var d = this.checkTime(today.getDate());
    var mth = this.checkTime(today.getMonth()+1);
    var y = this.checkTime(today.getFullYear());
    // Giờ, phút, giây hiện tại
    var h = this.checkTime(today.getHours());
    var m = this.checkTime(today.getMinutes());
    var s = this.checkTime(today.getSeconds());
    return d+'/'+mth+'/'+y+'  '+h+':'+m+':'+s;
  }

}
