import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviaMailComponent } from './envia-mail.component';

describe('EnviaMailComponent', () => {
  let component: EnviaMailComponent;
  let fixture: ComponentFixture<EnviaMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviaMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviaMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
