import { RouterModule } from '@angular/router';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Label } from 'src/app/types/query-types';

@Component({
  selector: 'app-label-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './label-card.component.html',
  styleUrls: ['./label-card.component.css'],
})
export class LabelCardComponent {
  @Input() label!: Label;

  get labelId() {
    return this.label.id;
  }

  get imageUrl() {
    return this.label.imageUrl;
  }

  get name() {
    return this.label.name;
  }
}
