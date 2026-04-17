import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent, HeaderComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AngularFireAuth, useValue: { authState: of({ uid: '123' }), currentUser: Promise.resolve({ uid: '123' }) } },
        { provide: UserService, useValue: { getUser: jasmine.createSpy('getUser').and.returnValue(of({})) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});