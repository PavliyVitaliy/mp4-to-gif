import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'upload', pathMatch: 'full' },
    { path: 'upload', loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent) },
    { path: '**', redirectTo: 'upload' }
];