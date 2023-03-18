import { HomeComponent } from './home/home.component';
import { ReleaseDetailsComponent } from './release/release-details/release-details.component';
import { LabelsComponent } from './labels/labels.component';
import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LabelDetailsComponent } from './labels/label-details/label-details.component';
import { ReleaseAddComponent } from './release/release-add/release-add.component';
import { ReleaseEditComponent } from './release/release-edit/release-edit.component';
import { ArtistComponent } from './artist/artist.component';

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
    path: 'release/:id/edit',
    component: ReleaseEditComponent,
  },
  {
    path: 'add',
    component: ReleaseAddComponent,
  },
  {
    path: 'artist/:id',
    component: ArtistComponent,
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
