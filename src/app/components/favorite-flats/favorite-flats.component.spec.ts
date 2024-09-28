import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteFlatsComponent } from './favorite-flats.component';

describe('FavoriteFlatsComponent', () => {
  let component: FavoriteFlatsComponent;
  let fixture: ComponentFixture<FavoriteFlatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteFlatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteFlatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
