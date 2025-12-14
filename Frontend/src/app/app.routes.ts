import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./pages/authentication/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login/auth',
    loadComponent: () => import('./pages/authentication/login/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'register/name',
    loadComponent: () => import('./pages/authentication/register/names/name.page').then((m) => m.NamePage),
  },
  {
    path: 'register/email',
    loadComponent: () => import('./pages/authentication/register/email/email.page').then((m) => m.EmailPage),
  },
  {
    path: 'register/password',
    loadComponent: () => import('./pages/authentication/register/password/password.page').then((m) => m.PasswordPage),
  },
  {
    path: 'register/phone',
    loadComponent: () => import('./pages/authentication/register/phoneAndFaculty/phone.page').then((m) => m.PhonePage),
  },
  {
    path: 'register/verify',
    loadComponent: () => import('./pages/authentication/register/code-validation/code-validation.page').then((m) => m.CodeValidationPage),
  },
  {
    path: 'register/result',
    loadComponent: () => import('./pages/authentication/register/result/result.page').then((m) => m.ResultPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'ride-details/:id',
    loadComponent: () => import('./pages/home/ride-details/ride-details.page').then((m) => m.RideDetailsPage),
    canActivate: [authGuard]
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings.page').then((m) => m.MyBookingsPage),
    canActivate: [authGuard]
  },
  {
    path: 'driver-requests',
    loadComponent: () => import('./pages/driver-requests/driver-requests.page').then((m) => m.DriverRequestsPage),
    canActivate: [authGuard]
  },
  {
    path: 'my-rides',
    loadComponent: () => import('./pages/my-rides/my-rides.page').then((m) => m.MyRidesPage),
    canActivate: [authGuard]
  },
  {
    path: 'add-drive',
    loadComponent: () => import('./pages/add-drive/add-drive.page').then((m) => m.AddDrivePage),
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then((m) => m.NotificationsPage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },


];
