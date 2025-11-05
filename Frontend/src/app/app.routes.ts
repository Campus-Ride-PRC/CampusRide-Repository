import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./pages/authentication/welcome/welcome.page').then((m) => m.WelcomePage),
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
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
];