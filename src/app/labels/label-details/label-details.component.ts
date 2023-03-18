import { ReleaseCardComponent } from './../../release/release-card/release-card.component';
import type { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GET_RELEASES_BY_LABEL_ID, GET_LABEL_BY_ID } from 'src/app/graphql';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { Label, Release } from 'src/app/types/query-types';

@Component({
  selector: 'app-label-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReleaseCardComponent],
  templateUrl: './label-details.component.html',
  styleUrls: ['./label-details.component.css'],
})
export class LabelDetailsComponent implements OnInit, OnDestroy {
  public label$!: Observable<Label>;
  public releases$!: Observable<Release[]>;
  private apollo = inject(Apollo);
  private destroy$: Subject<void> = new Subject<void>();
  private route = inject(ActivatedRoute);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.label$ = this.apollo
        .watchQuery<any>({
          query: GET_LABEL_BY_ID,
          variables: {
            id: id,
          },
        })
        .valueChanges.pipe(
          takeUntil(this.destroy$),
          map((result) => result.data.getLabelById)
        );

      this.releases$ = this.apollo
        .watchQuery<any>({
          query: GET_RELEASES_BY_LABEL_ID,
          variables: {
            labelId: id,
          },
        })
        .valueChanges.pipe(
          takeUntil(this.destroy$),
          map((result) => result.data.getReleasesByLabelId)
        );
    }
  }
}
