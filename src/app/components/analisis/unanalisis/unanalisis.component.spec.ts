import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnanalisisComponent } from './unanalisis.component';

describe('UnanalisisComponent', () => {
  let component: UnanalisisComponent;
  let fixture: ComponentFixture<UnanalisisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnanalisisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnanalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
