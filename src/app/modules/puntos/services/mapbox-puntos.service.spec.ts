import { TestBed } from '@angular/core/testing';

import { MapboxPuntosService } from './mapbox-puntos.service';

describe('MapboxPuntosService', () => {
  let service: MapboxPuntosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxPuntosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
