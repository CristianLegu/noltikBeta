import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogmembreteComponent } from './dialogmembrete.component';

describe('DialogmembreteComponent', () => {
  let component: DialogmembreteComponent;
  let fixture: ComponentFixture<DialogmembreteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogmembreteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogmembreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
