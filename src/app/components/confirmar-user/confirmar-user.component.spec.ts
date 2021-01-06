import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarUserComponent } from './confirmar-user.component';

describe('ConfirmarUserComponent', () => {
  let component: ConfirmarUserComponent;
  let fixture: ComponentFixture<ConfirmarUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
