import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExerciseComponent } from './pages/exercise/exercise.component';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
  { path: 'exercise', component: ExerciseComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
