import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redireciona para o login
  // { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  // { path: 'admin', loadChildren: () => import('./pages/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule) },
  // { path: 'manager', loadChildren: () => import('./pages/manager-dashboard/manager-dashboard.module').then(m => m.ManagerDashboardModule) },
  // { path: 'user', loadChildren: () => import('./pages/user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule) },
  // { path: '**', redirectTo: '/login' } // Redireciona rotas inválidas para login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
