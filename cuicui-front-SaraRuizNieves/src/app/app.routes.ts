import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { PetComponent } from './pet/pet.component';
import { MedComponent } from './med/med.component';
import { VisitComponent } from './visit/visit.component';
import { PetDetailComponent } from './pet/pet-detail/pet-detail.component';
import { VisitDetailComponent } from './visit/visit-detail/visit-detail.component';
import { MedDetailComponent } from './med/med-detail/med-detail.component';
import { GuideComponent } from './guide/guide.component';
import { InfoComponent } from './info/info.component';
import { TestComponent } from './test/test.component';
import { TestDetailComponent } from './test/test-detail/test-detail.component';




export const routes: Routes = [
  // Ruta raíz
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Home
  { path: 'home', component: HomeComponent },

  // Perfil Usuario
  { path: 'user', component: UserComponent },

  // Perfil Mascota
  { path: 'pet', component: PetComponent },

  // Perfil Mascota detalle
   { path: 'pet/pet-detail/:id', component: PetDetailComponent },

  // Medicación
  { path: 'med', component: MedComponent },

  // Medicación detalle
   { path: 'med/med-detail/:id', component: MedDetailComponent },

  // Visitas
  { path: 'visit', component: VisitComponent },

  // Perfil Visita detalle
   { path: 'visit/visit-detail/:id', component: VisitDetailComponent },

  // Guías
  { path: 'guide', component: GuideComponent },
  
  // Información sitio
  { path: 'info', component: InfoComponent },

  // Pruebas
  { path: 'test', component: TestComponent },

  // Detalle Pruebas
  { path: 'test/test-detail/:id', component: TestDetailComponent },

  // Ruta para redirigir a login si la ruta no existe
  { path: '**', redirectTo: 'login' },
];