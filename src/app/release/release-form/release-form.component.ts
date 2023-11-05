import type { PersonnelInput, TrackInput } from "./../../types/mutation-types";
import {
  CREATE_RELEASE,
  DELETE_PERSONNEL_BY_ID,
  DELETE_TRACK_BY_ID,
  GET_ALL_ARTISTS,
  GET_ALL_LABELS,
  UPDATE_RELEASE,
} from "./../../graphql";
import { Apollo } from "apollo-angular";
import type {
  AfterViewInit,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
} from "@angular/core";
import { ChangeDetectorRef, Input } from "@angular/core";
import { inject, ViewChildren } from "@angular/core";
import { Component } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormArray, FormGroup } from "@angular/forms";
import { NonNullableFormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import type { ReleaseInput } from "src/app/types/mutation-types";
import { Router } from "@angular/router";
import type {
  Personnel,
  Release,
  Session,
  Track,
} from "src/app/types/query-types";
import {
  CreateReleaseForm,
  PersonnelFormGroup,
  SessionFormGroup,
  TrackFormGroup,
} from "../types/release.types";
import { Subject, debounceTime, delay, map, takeUntil } from "rxjs";

type DisplayArtistOptions = {
  sessionIndex: number | undefined;
  personnelIndex: number | undefined;
};

@Component({
  selector: "app-release-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./release-form.component.html",
  styleUrls: ["./release-form.component.css"],
})
export class ReleaseFormComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren("trackTitle") trackTitle!: QueryList<ElementRef>;
  @ViewChildren("personnelName") personnelName!: QueryList<ElementRef>;
  @ViewChildren("sessionDate") sessionDate!: QueryList<ElementRef>;

  @Input() release?: Release;

  private apollo = inject(Apollo);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private destroy$: Subject<void> = new Subject<void>();
  public displayArtistOptions: DisplayArtistOptions = {
    sessionIndex: undefined,
    personnelIndex: undefined,
  };
  public imagePreview = "";
  public openSession: number = 0;
  public artists$ = this.apollo
    .watchQuery<any>({
      query: GET_ALL_ARTISTS,
    })
    .valueChanges.pipe(
      map((result) => result.data.getAllArtists),
      takeUntil(this.destroy$)
    );
  public labels$ = this.apollo
    .watchQuery<any>({
      query: GET_ALL_LABELS,
    })
    .valueChanges.pipe(
      map((result) => result.data.getAllLabels),
      takeUntil(this.destroy$)
    );

  public form: FormGroup<CreateReleaseForm> = this.fb.group({
    artist: this.fb.group({
      name: ["", Validators.required],
    }),
    photographer: this.fb.group({
      name: [""],
    }),
    producer: this.fb.group({
      name: [""],
    }),
    designer: this.fb.group({
      name: [""],
    }),
    catalogueNumber: ["", Validators.required],
    imageUrl: [""],
    label: this.fb.group({
      name: ["", Validators.required],
    }),
    released: [""],
    title: ["", Validators.required],
    sessions: this.fb.array([this.createSessionGroup()]),
  });

  get sessions() {
    return this.form.get("sessions") as FormArray;
  }

  personnel(index: number): FormArray {
    return this.sessions?.at(index)?.get("personnel") as unknown as FormArray;
  }

  tracks(index: number) {
    return this.sessions?.at(index)?.get("tracks") as unknown as FormArray;
  }

  ngAfterViewInit(): void {
    this.form.get("imageUrl")?.valueChanges.subscribe((url: string) => {
      this.imagePreview = url;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.release) {
      this.setupEditMode(this.release);
    }
  }

  setupEditMode(release: Release) {
    const {
      artist,
      catalogueNumber,
      imageUrl,
      label,
      producer,
      designer,
      photographer,
      sessions,
      released,
      title,
    } = release;

    this.form.patchValue({
      artist: { name: artist?.name },
      photographer: { name: photographer?.name },
      producer: { name: producer?.name },
      designer: { name: designer?.name },
      label: { name: label?.name },
      catalogueNumber,
      imageUrl,
      released,
      title,
    });

    if (sessions?.length) {
      this.patchSessions(sessions);
    }

    if (imageUrl) {
      this.imagePreview = imageUrl;
    }
  }

  patchSessions(sessions: Session[]) {
    this.sessions.clear();

    sessions.forEach((session: Session, sessionIndex: number) => {
      this.sessions.push(this.createSessionGroup(session));
      this.patchPersonnel(session, sessionIndex);
      this.patchTrack(session, sessionIndex);
    });
  }

  patchPersonnel(session: Session, sessionIndex: number) {
    this.personnel(sessionIndex).clear();

    session.personnel?.forEach((personnel: Personnel) => {
      this.personnel(sessionIndex).push(this.createPersonnelGroup(personnel));
    });
  }

  patchTrack(session: Session, sessionIndex: number) {
    this.tracks(sessionIndex).clear();

    session.tracks?.forEach((track: Track) => {
      this.tracks(sessionIndex).push(this.createTrackGroup(track));
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const release: ReleaseInput = {
      ...this.form.getRawValue(),
      sessions: this.form.getRawValue().sessions.map((s: any) => ({
        ...s,
        date: new Date(s.date)?.getTime()?.toString(),
        personnel: this.normalizePersonnel(s.personnel),
        tracks: this.normalizeTracks(s.tracks),
      })),
    };

    if (this.release) {
      this.updateRelease(release);
    } else {
      this.createRelease(release);
    }
  }

  public deletePersonnel(sessionIndex: number, personnelIndex: number) {
    const { id } =
      this.personnel(sessionIndex).controls.at(personnelIndex)?.value;

    this.apollo
      .mutate({
        mutation: DELETE_PERSONNEL_BY_ID,
        variables: { personnelId: id },
      })
      .subscribe({
        next: ({ data }: any) => {
          this.personnel(sessionIndex).removeAt(personnelIndex);
        },
        error: (error) => {
          console.log("there was an error sending the query", error);
        },
      });
  }

  public deleteTrack(sessionIndex: number, trackIndex: number) {
    const { id } = this.tracks(sessionIndex).at(trackIndex)?.value;

    this.apollo
      .mutate({
        mutation: DELETE_TRACK_BY_ID,
        variables: { trackId: id },
      })
      .subscribe({
        next: ({ data }: any) => {
          this.tracks(sessionIndex).removeAt(trackIndex);
        },
        error: (error) => {
          console.log("there was an error sending the query", error);
        },
      });
  }

  public addPersonnel(sessionIndex: number) {
    this.personnel(sessionIndex).push(this.createPersonnelGroup());
  }

  public addSession() {
    this.sessions.push(this.createSessionGroup());
    this.openSession = this.sessions.length - 1;
  }

  public addTrack(sessionIndex: number) {
    this.tracks(sessionIndex).push(this.createTrackGroup());
  }

  public onPersonnelNameFocus(
    event: any,
    sessionIndex?: number,
    personnelIndex?: number
  ) {
    event.preventDefault();
    this.displayArtistOptions = {
      sessionIndex,
      personnelIndex,
    };
    this.cdr.detectChanges();
  }

  public onPersonnelNameBlur(event: any): void {
    setTimeout(() => {
      if (this.displayArtistOptions.sessionIndex !== undefined) {
        this.onPersonnelNameFocus(event);
      }
    }, 300);
  }

  public onPersonnelSelect(
    event: any,
    name: string,
    sessionIndex: number,
    personnelIndex: number
  ) {
    event.preventDefault();
    this.personnel(sessionIndex)?.at(personnelIndex)?.patchValue({
      artist: { name },
    });

    this.onPersonnelNameFocus(event);
  }

  private createPersonnelGroup(values?: {
    artist: { name: string };
    instruments: string[];
    leader: boolean;
    id: string;
    appearsOn: string[];
  }): FormGroup<PersonnelFormGroup> {
    return this.fb.group({
      artist: this.fb.group({
        name: [values?.artist?.name ?? ""],
      }),
      instruments: [values?.instruments?.join(",") ?? ""],
      leader: [values?.leader ?? false],
      id: [values?.id ?? undefined],
      appearsOn: [values?.appearsOn?.join(",") ?? ""],
    });
  }

  private createSessionGroup(values?: {
    date: string;
    engineer: { name: string };
    studio: { name: string; location: string };
    id: string;
    personnel?: Personnel[];
    tracks?: Track[];
  }): FormGroup<SessionFormGroup> {
    const datePipe = new DatePipe("en-US");
    return this.fb.group({
      date: [
        values?.date ? datePipe.transform(values.date, "shortDate") ?? "" : "",
      ],
      id: [values?.id ?? undefined],
      engineer: this.fb.group({
        name: [values?.engineer?.name ?? ""],
      }),
      studio: this.fb.group({
        name: [values?.studio?.name ?? ""],
        location: [values?.studio?.location ?? ""],
      }),
      personnel: this.fb.array([this.createPersonnelGroup()]),
      tracks: this.fb.array([this.createTrackGroup()]),
    });
  }

  private createTrackGroup(values?: {
    title: string;
    composedBy: string[];
    length: string;
    number: string;
    id: string;
  }): FormGroup<TrackFormGroup> {
    return this.fb.group({
      title: [values?.title ?? ""],
      composedBy: [values?.composedBy?.join(", ") ?? ""],
      length: [values?.["length"] ?? ""],
      number: [values?.["number"] ?? ""],
      id: [values?.id ?? ""],
    });
  }

  createRelease(input: ReleaseInput) {
    this.apollo
      .mutate({
        mutation: CREATE_RELEASE,
        variables: { input },
      })
      .subscribe({
        next: ({ data }: any) => {
          const { id } = data.createRelease;

          this.router.navigate(["/release", id]);
        },
        error: (error) => {
          console.log("there was an error sending the query", error);
        },
      });
  }

  updateRelease(input: ReleaseInput) {
    this.apollo
      .mutate({
        mutation: UPDATE_RELEASE,
        variables: { input: { ...input, id: this.release?.id } },
      })
      .subscribe({
        next: ({ data }: any) => {
          const { id } = data.updateRelease;

          this.router.navigate(["/release", id]);
        },
        error: (error) => {
          console.log("there was an error sending the query", error);
        },
      });
  }

  private normalizePersonnel(personnel: any): PersonnelInput[] {
    return personnel
      ?.map((p: any) => ({
        ...p,
        instruments: this.toArray(p.instruments),
        id: p?.id ? p.id : "",
      }))
      .filter((p: any) => p.artist.name)
      .map((p: any) => {
        if (!p?.id) delete p.id;
        return p;
      });
  }

  private normalizeTracks(tracks: any): TrackInput[] {
    return tracks
      ?.map((t: any) => ({
        ...t,
        composedBy: this.toArray(t.composedBy),
        id: t?.id ? t.id : "",
      }))
      .filter((t: any) => t.title)
      .map((t: any) => {
        if (!t?.id) delete t.id;
        return t;
      });
  }

  private toArray(val: string): string[] {
    return val.split(",").map((v) => v.trim());
  }
}
