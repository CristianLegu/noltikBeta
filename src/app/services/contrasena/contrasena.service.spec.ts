import { TestBed } from '@angular/core/testing';

import { ContrasenaService } from './contrasena.service';

describe('ContrasenaService', () => {
  let service: ContrasenaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContrasenaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
