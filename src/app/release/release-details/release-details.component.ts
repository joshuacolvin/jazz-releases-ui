import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Apollo } from "apollo-angular";
import type { OnDestroy, OnInit } from "@angular/core";
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { Observable } from "rxjs";
import { map, takeUntil, Subject, merge } from "rxjs";
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
  release!: Release;
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
      this.apollo
        .watchQuery<any>({
          query: GET_RELEASE_BY_ID,
          variables: {
            releaseId: this.releaseId,
          },
        })
        .valueChanges.pipe(
          takeUntil(this.destroy$),
          map((result) => result.data.getReleaseById)
        )
        .subscribe((release) => {
          this.release = release;
          this.tracks = this.getTracks(release);
          this.personnel = this.getPersonnel(release);
        });
    }
  }

  getPersonnel(release: Release): Personnel[] {
    const result: Personnel[] = [];
    release?.sessions?.map((session) => {
      session?.personnel?.map((person) => {
        result.push(person);
      });
    });
    return this.mergePersonnel(result);
  }

  mergePersonnel(personnel: Personnel[]): Personnel[] {
    const mergedPersonnel: Personnel[] = [];
    personnel.map((person) => {
      const index = mergedPersonnel.findIndex(
        (p) => p.artist.name === person.artist.name
      );
      if (index === -1) {
        mergedPersonnel.push(person);
      } else {
        const instruments = [
          ...mergedPersonnel[index].instruments,
          ...person.instruments,
        ];
        const appearsOn = [
          ...mergedPersonnel[index].appearsOn?.[0]
            ?.split(",")
            .map((a) => a.trim()),
          ...person.appearsOn?.[0]?.split(",").map((a) => a.trim()),
        ];
        mergedPersonnel[index] = {
          ...mergedPersonnel[index],
          instruments: [...new Set(instruments)],
          appearsOn: [...new Set(appearsOn)].sort((a, b) => a.localeCompare(b)),
        };
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
