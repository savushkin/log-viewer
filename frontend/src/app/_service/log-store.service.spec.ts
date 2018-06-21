import {inject, TestBed} from '@angular/core/testing';

import {LogStoreService} from './log-store.service';

describe('LogStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogStoreService]
    });
  });

  it('should be created', inject([LogStoreService], (service: LogStoreService) => {
    expect(service).toBeTruthy();
  }));
});
