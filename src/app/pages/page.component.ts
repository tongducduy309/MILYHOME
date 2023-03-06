import { Component } from '@angular/core';
import { WelcomeComponent } from './welcome/welcome.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  constructor (private welcome:WelcomeComponent){

  }

  updateProductsWelcome(){
    this.welcome.getProducts();
  }
}
