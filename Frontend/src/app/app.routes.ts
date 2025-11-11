import { Routes } from '@angular/router';

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
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
];