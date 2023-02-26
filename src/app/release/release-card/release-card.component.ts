import { RouterModule } from '@angular/router';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-release-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './release-card.component.html',
  styleUrls: ['./release-card.component.css'],
})
export class ReleaseCardComponent {
  @Input() release!: any;

  get artist() {
    return this.release.artist.name;
  }

  get catalogueNumber() {
    return this.release.catalogueNumber;
  }

  get imageUrl() {
    return this.release.imageUrl;
  }

  get label() {
    return this.release.label.name;
  }

  get personnel() {
    return this.release.personnel.map((p: any) => p.name).join(', ');
  }

  get releaseId() {
    return this.release.id;
  }

  get released() {
    return this.release.released;
  }

  get title() {
    return this.release.title;
  }
}
