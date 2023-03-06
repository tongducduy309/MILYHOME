import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProductComponent } from './change-product.component';

describe('ChangeProductComponent', () => {
  let component: ChangeProductComponent;
  let fixture: ComponentFixture<ChangeProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
