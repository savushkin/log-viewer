import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PageLogComponent} from './page-log.component';

describe('PageLogComponent', () => {
  let component: PageLogComponent;
  let fixture: ComponentFixture<PageLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
