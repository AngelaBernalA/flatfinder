import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatInfoComponent } from './flat-info.component';

describe('FlatInfoComponent', () => {
  let component: FlatInfoComponent;
  let fixture: ComponentFixture<FlatInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlatInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
