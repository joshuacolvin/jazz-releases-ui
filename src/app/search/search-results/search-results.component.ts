import { ReleaseCardComponent } from './../../release/release-card/release-card.component';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Observable } from 'rxjs';
import type { Release } from 'src/app/types/query-types';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, ReleaseCardComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent {
  @Input() releases$!: Observable<Release[]>;
  @Input() header!: string;
}
