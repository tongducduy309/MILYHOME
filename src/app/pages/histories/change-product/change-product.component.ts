import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-change-product',
  templateUrl: './change-product.component.html',
  styleUrls: ['./change-product.component.scss']
})
export class ChangeProductComponent implements OnInit{
  dataSet:any;
  constructor(private crud:CrudService){}

  ngOnInit(): void {
    this.getChangeProduct();
  }
  async getChangeProduct(){
    this.dataSet=await this.crud.getAllData('change');
  }
}
