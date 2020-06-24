import { TestBed } from '@angular/core/testing';

import { EstudiosService } from './estudios.service';

describe('EstudiosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstudiosService = TestBed.get(EstudiosService);
    expect(service).toBeTruthy();
  });
});
