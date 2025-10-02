import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { AuthService } from './core/auth/auth';

describe('AuthGuard (class)', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'hasAnyRole']);
    const rSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should redirect to login if not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate({ data: {} } as any, {} as any);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(routerSpy.createUrlTree(['/login']));
  });
});
