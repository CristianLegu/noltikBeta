import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmarUserComponent } from './confirmar-user.component';

describe('ConfirmarUserComponent', () => {
  let component: ConfirmarUserComponent;
  let fixture: ComponentFixture<ConfirmarUserComponent>;

  beforeEach(waitForAsync(() => {
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
