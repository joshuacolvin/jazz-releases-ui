import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Apollo } from "apollo-angular";
import type { OnDestroy, OnInit } from "@angular/core";
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { Observable } from "rxjs";
import { map, takeUntil, Subject } from "rxjs";
import { GET_RELEASE_BY_ID } from "src/app/graphql";
import type { Personnel, Release, Track } from "src/app/types/query-types";

export type TrackWithSession = Track & { session: string };

@Component({
  selector: "app-release-details",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./release-details.component.html",
  styleUrls: ["./release-details.component.css"],
})
export class ReleaseDetailsComponent implements OnInit, OnDestroy {
  apollo = inject(Apollo);
  route = inject(ActivatedRoute);
  router = inject(Router);
  release$!: Observable<Release>;
  destroy$ = new Subject<void>();
  releaseId = this.route.snapshot.paramMap.get("id");
  tracks: TrackWithSession[] = [];
  selectedTab: string = "details";
  personnel: Personnel[] = [];

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

      this.release$.subscribe((release) => {
        this.tracks = this.getTracks(release);
        this.personnel = this.getPersonnel(release);
        console.log("**** ", this.personnel);
      });
    }
  }

  getPersonnel(release: Release): Personnel[] {
    const personnel: Personnel[] = [];
    release?.sessions?.forEach((session) => {
      session?.personnel?.forEach((person) => {
        personnel.push(person);
      });
    });
    return this.mergePersonnel(personnel);
  }

  mergePersonnel(personnel: Personnel[]): Personnel[] {
    const mergedPersonnel: Personnel[] = [];
    personnel.forEach((person) => {
      const index = mergedPersonnel.findIndex((p) => p.name === person.name);
      if (index === -1) {
        mergedPersonnel.push(person);
      } else {
        const instruments = [
          ...mergedPersonnel[index].instruments,
          ...person.instruments,
        ];
        mergedPersonnel[index].instruments = [...new Set(instruments)];
      }
    });
    return mergedPersonnel.sort((a: any, b: any) => b.leader - a.leader);
  }

  getTracks(release: Release): TrackWithSession[] {
    const tracks: TrackWithSession[] = [];
    release?.sessions?.forEach((session) => {
      session?.tracks?.forEach((track) => {
        tracks.push({ ...track, session: session.date });
      });
    });
    return tracks.sort((a: any, b: any) => a.number.localeCompare(b.number));
  }

  sortReleaseData(release: Release) {
    return {
      ...release,
      session: release?.sessions?.sort((a: any, b: any) => b.date - a.date),
    };
  }

  onEdit() {
    this.router.navigate(["/release", this.releaseId, "edit"]);
  }
}
