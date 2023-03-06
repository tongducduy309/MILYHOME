import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isVisible=false;
  us='';pw='';
  view=0;
  value='';

  admin:any;
  dataAdmin:any;

  collection=[
    {
      value:'products',
      label:'Danh sách sản phẩm'
    },
    {
      value:'histories_stock_out',
      label:'Danh sách bán nhanh'
    },
    {
      value:'change',
      label:'Danh sách dữ liệu thay đổi (Change)'
    },
    {
      value:'histories_bill',
      label:'Danh sách hóa đơn'
    }
  ]

  selectedCollection='Chọn collection';

  constructor(private message: NzMessageService, private crud:CrudService){

  }

  ngOnInit(): void {
    this.getAdmin();
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.us==this.admin.us&&this.pw==this.admin.pw){
      this.message.success('Chế độ cài đặt của admin');
      this.view=1;
    }
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  deleteAllData(){

  }

  deleteData(){

    if (this.value!=''&&this.selectedCollection!='Chọn collection')
    try{
      this.crud.deleteData(this.selectedCollection,this.value);
      this.message.success('Xóa thành công');
    }
    catch{this.message.error('Xóa thất bại');}
    else this.message.warning('Nhập đầy đủ thông tin');
    this.value='';
  }





  async getAdmin(){
    this.dataAdmin=await this.crud.getAllData('admin');
    this.admin=this.dataAdmin[0].adminLogin;
  }
}
