import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GithubService } from 'src/app/services/github.service';

import { User } from 'src/app/interfaces/user.model';

import { UserComponent } from './user.component';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { delay, of } from 'rxjs';

describe('UserComponent', () => {
  const mockUserData = [
    {
      id: 1,
      login: 'mojombo',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      url: 'https://api.github.com/users/mojombo',
    },
    {
      id: 2,
      login: 'defunkt',
      avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
      url: 'https://api.github.com/users/defunkt',
    },
    {
      id: 3,
      login: 'pjhyett',
      avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
      url: 'https://api.github.com/users/pjhyett',
    },
    {
      id: 4,
      login: 'wycats',
      avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4',
      url: 'https://api.github.com/users/wycats',
    },
  ];
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let user: User[] = [];
  let githubService: GithubService;

  let githubServiceSpy: jasmine.SpyObj<GithubService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GithubService', ['getAllUsers']);
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatListModule,
        MatGridListModule,
        MatButtonModule,
      ],
      providers: [{ provide: GithubService, useValue: spy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    githubServiceSpy = TestBed.inject(
      GithubService
    ) as jasmine.SpyObj<GithubService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnit should be loaded', fakeAsync(() => {
    githubServiceSpy.getAllUsers.and.returnValue(of(user).pipe(delay(1)));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.toggleDidStart).toBeTruthy();
      expect(component.userData).toBeUndefined();
      expect(githubServiceSpy.getAllUsers).toHaveBeenCalledWith();
    });

    tick(1000);
    expect(component.timerRunning).toBeFalsy();
    expect(component.userData).toEqual(user);
  }));

  it('it should have toggleStatus true(===true) ', () => {
    const didStart = component.toggleDidStart;
    expect(didStart).toEqual(true);
  });

  it('it should have maxUserId a value', fakeAsync(() => {
    spyOn(component, 'goForward');
    component.goForward();
    expect(component.goForward).toHaveBeenCalled();
    tick(1000);
    fixture.detectChanges();
    expect(component.maxUserId).toBe(0);
  }));

  it('it should have timerLabel counter at 0 when starting', fakeAsync(() => {
    expect(component.labelTimerElapsed).toBe('0');
    const elapsedTimer =
      fixture.debugElement.nativeElement.querySelector('#timerLabel');
    tick(1000);
    expect(elapsedTimer.innerHTML).toBe('0');
  }));

  it('it should have timerLabel counter at 0 when stopped', fakeAsync(() => {
    expect(component.labelTimerElapsed).toBe('0');
    const elapsedTimer =
      fixture.debugElement.nativeElement.querySelector('#timerLabel');
    let buttonStop =
      fixture.debugElement.nativeElement.querySelector('#toggleButton');
    buttonStop.click();
    tick(1000);
    expect(elapsedTimer.innerHTML).toBe('0');
  }));

  it('it should contain a userName', fakeAsync(() => {
    component.userData = mockUserData;
    tick(1000);
    fixture.detectChanges();
    const userTitle =
      fixture.debugElement.nativeElement.querySelector('#userTitle');
    expect(userTitle.innerHTML).toBe(mockUserData[0].login);
  }));

  it('it should have an image for the first user', fakeAsync(() => {
    component.userData = mockUserData;
    tick(1000);
    fixture.detectChanges();
    const userImg =
      fixture.debugElement.nativeElement.querySelector('#userImg');

    expect(userImg.src).toBe(mockUserData[1].avatar_url);
  }));

  it('it should start the timer', fakeAsync(() => {
    spyOn(component, 'initTimer');
    component.initTimer();
    expect(component.initTimer).toHaveBeenCalled();
    tick(1000);
    fixture.detectChanges();
    expect(component.labelTimerElapsed).toEqual('0');
    component.timerSubscription.unsubscribe();
  }));

  it('it should stop running timer', fakeAsync(() => {
    spyOn(component, 'destroyTimer');
    component.destroyTimer();
    expect(component.destroyTimer).toHaveBeenCalled();
    tick(1000);
    fixture.detectChanges();
    expect(component.labelTimerElapsed).toEqual('0');
    component.timerSubscription.unsubscribe();
  }));
});
