import { Apollo } from "apollo-angular";
import { ActivatedRoute } from "@angular/router";
import type { OnDestroy, OnInit } from "@angular/core";
import { inject } from "@angular/core";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReleaseFormComponent } from "../release-form/release-form.component";
import type { Observable } from "rxjs";
import { map, Subject, takeUntil } from "rxjs";
import { GET_RELEASE_BY_ID } from "src/app/graphql";

@Component({
  selector: "app-release-edit",
  standalone: true,
  imports: [CommonModule, ReleaseFormComponent],
  templateUrl: "./release-edit.component.html",
  styleUrls: ["./release-edit.component.css"],
})
export class ReleaseEditComponent implements OnInit, OnDestroy {
  apollo = inject(Apollo);
  route = inject(ActivatedRoute);
  destroy$ = new Subject<void>();
  release$!: Observable<any>;
  releaseId = this.route.snapshot.paramMap.get("id");

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
          map((result) => result.data.getReleaseById)
        );
    }
  }
}
