import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseFormComponent } from '../release-form/release-form.component';

@Component({
  selector: 'app-release-add',
  standalone: true,
  imports: [CommonModule, ReleaseFormComponent],
  templateUrl: './release-add.component.html',
  styleUrls: ['./release-add.component.css'],
})
export class ReleaseAddComponent {}
