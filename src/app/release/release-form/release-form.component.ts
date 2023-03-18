import type { PersonnelInput, TrackInput } from './../../types/mutation-types';
import {
  CREATE_RELEASE,
  DELETE_PERSONNEL_BY_ID,
  DELETE_TRACK_BY_ID,
  UPDATE_RELEASE,
} from './../../graphql';
import { Apollo } from 'apollo-angular';
import type {
  AfterViewInit,
  ElementRef,
  OnInit,
  QueryList,
} from '@angular/core';
import { Input } from '@angular/core';
import { inject, ViewChildren } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FormArray, FormGroup, FormControl } from '@angular/forms';
import { NonNullableFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import type { ReleaseInput } from 'src/app/types/mutation-types';
import { Router, ActivatedRoute } from '@angular/router';
import type { Personnel, Release, Track } from 'src/app/types/query-types';

interface ArtistFormGroup {
  name: FormControl<string>;
}

interface LabelFormGroup {
  name: FormControl<string>;
}

interface PersonnelFormGroup {
  id: FormControl<string | undefined>;
  name: FormControl<string>;
  instruments: FormControl<string>;
  leader: FormControl<boolean>;
  appearsOn: FormControl<string>;
}

interface TrackFormGroup {
  id: FormControl<string>;
  title: FormControl<string>;
  composedBy: FormControl<string>;
  length: FormControl<string>;
  number: FormControl<string>;
}

interface CreateReleaseForm {
  artist: FormGroup<ArtistFormGroup>;
  catalogueNumber: FormControl<string>;
  imageUrl: FormControl<string>;
  label: FormGroup<LabelFormGroup>;
  recorded: FormControl<string>;
  released: FormControl<string>;
  title: FormControl<string>;
  personnel: FormArray<FormGroup<PersonnelFormGroup>>;
  tracks: FormArray<FormGroup<TrackFormGroup>>;
}

@Component({
  selector: 'app-release-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './release-form.component.html',
  styleUrls: ['./release-form.component.css'],
})
export class ReleaseFormComponent implements AfterViewInit, OnInit {
  @ViewChildren('trackTitle') trackTitle!: QueryList<ElementRef>;
  @ViewChildren('personnelName') personnelName!: QueryList<ElementRef>;

  @Input() release?: Release;

  private apollo = inject(Apollo);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  route = inject(ActivatedRoute);

  public imagePreview = '';
  public labels: string[] = [
    'Blue Note Records',
    'Prestige',
    'Contemporary',
    'Columbia',
  ];
  public form: FormGroup<CreateReleaseForm> = this.fb.group({
    artist: this.fb.group({
      name: ['', Validators.required],
    }),
    catalogueNumber: ['', Validators.required],
    imageUrl: [''],
    label: this.fb.group({
      name: ['', Validators.required],
    }),
    recorded: [''],
    released: [''],
    title: ['', Validators.required],
    personnel: this.fb.array([this.createPersonnelGroup()]),
    tracks: this.fb.array([this.createTrackGroup()]),
  });

  get personnel() {
    return this.form.get('personnel') as FormArray;
  }

  get tracks() {
    return this.form.get('tracks') as FormArray;
  }

  ngAfterViewInit(): void {
    this.personnelName.changes.subscribe((controls) => {
      const lastName: HTMLInputElement = controls?.last?.nativeElement;
      lastName?.focus();
      lastName?.scrollIntoView();
    });

    this.trackTitle.changes.subscribe((controls) => {
      const lastTitle: HTMLInputElement = controls?.last?.nativeElement;
      lastTitle?.focus();
      lastTitle?.scrollIntoView();
    });

    this.form.get('imageUrl')?.valueChanges.subscribe((url: string) => {
      this.imagePreview = url;
    });
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
      personnel,
      recorded,
      released,
      title,
      tracks,
    } = release;

    this.form.patchValue({
      artist: { name: artist?.name },
      label: { name: label?.name },
      catalogueNumber,
      imageUrl,
      recorded,
      released,
      title,
    });

    if (personnel?.length) {
      this.patchPersonnel(personnel);
    }

    if (tracks?.length) {
      this.patchTracks(tracks);
    }

    if (imageUrl) {
      this.imagePreview = imageUrl;
    }
  }

  patchPersonnel(personnel: Personnel[]) {
    this.personnel.clear();

    personnel.forEach((personnel: Personnel) => {
      this.personnel.push(this.createPersonnelGroup(personnel));
    });
  }

  patchTracks(tracks: Track[]) {
    this.tracks.clear();

    tracks.forEach((track: Track) => {
      this.tracks.push(this.createTrackGroup(track));
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log(`Form is invalid`);
      return;
    }

    const release: ReleaseInput = {
      ...this.form.getRawValue(),
      personnel: this.normalizePersonnel(this.form.value.personnel),
      tracks: this.normalizeTracks(this.form.value.tracks),
    };

    if (this.release) {
      this.updateRelease(release);
    } else {
      this.createRelease(release);
    }
  }

  public deletePersonnel(index: number) {
    const { id } = this.personnel.controls.at(index)?.value;

    this.apollo
      .mutate({
        mutation: DELETE_PERSONNEL_BY_ID,
        variables: { personnelId: id },
      })
      .subscribe({
        next: ({ data }: any) => {
          console.log('Deleted!', data);
          this.personnel.removeAt(index);
        },
        error: (error) => {
          console.log('there was an error sending the query', error);
        },
      });
  }

  public deleteTrack(index: number) {
    const { id } = this.tracks.controls.at(index)?.value;

    this.apollo
      .mutate({
        mutation: DELETE_TRACK_BY_ID,
        variables: { trackId: id },
      })
      .subscribe({
        next: ({ data }: any) => {
          console.log('Deleted!', data);
          this.tracks.removeAt(index);
        },
        error: (error) => {
          console.log('there was an error sending the query', error);
        },
      });
  }

  public addPersonnel() {
    this.personnel.push(this.createPersonnelGroup());
  }

  public addTrack() {
    this.tracks.push(this.createTrackGroup());
  }

  private createPersonnelGroup(values?: {
    name: string;
    instruments: string[];
    leader: boolean;
    id: string;
    appearsOn: string[];
  }): FormGroup<PersonnelFormGroup> {
    return this.fb.group({
      name: [values?.name ?? ''],
      instruments: [values?.instruments?.join(',') ?? ''],
      leader: [values?.leader ?? false],
      id: [values?.id ?? undefined],
      appearsOn: [values?.appearsOn?.join(',') ?? ''],
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
      title: [values?.title ?? ''],
      composedBy: [values?.composedBy?.join(', ') ?? ''],
      length: [values?.['length'] ?? ''],
      number: [values?.['number'] ?? ''],
      id: [values?.id ?? ''],
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

          this.router.navigate(['/release', id]);
        },
        error: (error) => {
          console.log('there was an error sending the query', error);
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

          this.router.navigate(['/release', id]);
        },
        error: (error) => {
          console.log('there was an error sending the query', error);
        },
      });
  }

  private normalizePersonnel(personnel: any): PersonnelInput[] {
    return personnel
      ?.map((p: any) => ({
        ...p,
        instruments: this.toArray(p.instruments),
        id: p?.id ? p.id : '',
      }))
      .filter((p: any) => p.name)
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
        id: t?.id ? t.id : '',
      }))
      .filter((t: any) => t.title)
      .map((t: any) => {
        if (!t?.id) delete t.id;
        return t;
      });
  }

  private toArray(val: string): string[] {
    return val.split(',').map((v) => v.trim());
  }
}
