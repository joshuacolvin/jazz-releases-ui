import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseAddComponent } from './release-add.component';

describe('ReleaseAddComponent', () => {
  let component: ReleaseAddComponent;
  let fixture: ComponentFixture<ReleaseAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReleaseAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
