import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FileNavMenuComponent} from './file-nav-menu.component';

describe('FileNavMenuComponent', () => {
  let component: FileNavMenuComponent;
  let fixture: ComponentFixture<FileNavMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileNavMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
