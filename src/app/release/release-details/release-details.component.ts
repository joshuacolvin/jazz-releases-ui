import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Observable } from 'rxjs';
import { map, takeUntil, Subject } from 'rxjs';
import { GET_RELEASE_BY_ID } from 'src/app/graphql';
import type { Release } from 'src/app/types/query-types';

@Component({
  selector: 'app-release-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './release-details.component.html',
  styleUrls: ['./release-details.component.css'],
})
export class ReleaseDetailsComponent implements OnInit, OnDestroy {
  apollo = inject(Apollo);
  route = inject(ActivatedRoute);
  router = inject(Router);
  release$!: Observable<Release>;
  destroy$ = new Subject<void>();
  releaseId = this.route.snapshot.paramMap.get('id');

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if (this.releaseId) {
      this.release$ = this.apollo
        .watchQuery<any>({
          query: GET_RELEASE_BY_ID,
          variables: {
            releaseId: this.releaseId,
          },
        })
        .valueChanges.pipe(
          takeUntil(this.destroy$),
          map((result) => this.sortReleaseData(result.data.getReleaseById))
        );
    }
  }

  sortReleaseData(release: Release) {
    return {
      ...release,
      personnel: release?.personnel?.sort(
        (a: any, b: any) => b.leader - a.leader
      ),
      tracks: release?.tracks?.sort((a: any, b: any) =>
        a.number.localeCompare(b.number)
      ),
    };
  }

  onEdit() {
    this.router.navigate(['/release', this.releaseId, 'edit']);
  }
}
