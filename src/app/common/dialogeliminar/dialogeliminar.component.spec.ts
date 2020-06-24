import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogeliminarComponent } from './dialogeliminar.component';

describe('DialogeliminarComponent', () => {
  let component: DialogeliminarComponent;
  let fixture: ComponentFixture<DialogeliminarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogeliminarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogeliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
