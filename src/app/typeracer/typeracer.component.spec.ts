import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyperacerComponent } from './typeracer.component';

describe('TyperacerComponent', () => {
  let component: TyperacerComponent;
  let fixture: ComponentFixture<TyperacerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyperacerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyperacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
