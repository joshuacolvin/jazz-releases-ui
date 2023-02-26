import { ReleaseDetailsComponent } from './release/release-details/release-details.component';
import { HomeComponent } from './home/home.component';
import { LabelsComponent } from './labels/labels.component';
import { ReleaseFormComponent } from './admin/release-form/release-form.component';
import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LabelDetailsComponent } from './labels/label-details/label-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'release/:id',
    component: ReleaseDetailsComponent,
  },
  {
    path: 'add',
    component: ReleaseFormComponent,
  },
  {
    path: 'labels',
    component: LabelsComponent,
  },
  {
    path: 'labels/:id',
    component: LabelDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
