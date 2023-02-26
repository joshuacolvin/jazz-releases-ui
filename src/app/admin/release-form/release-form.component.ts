import type { PersonnelInput, TrackInput } from './../../types/mutation-types';
import { CREATE_RELEASE } from './../../graphql';
import { Apollo } from 'apollo-angular';
import type { AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { inject, ViewChildren } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NonNullableFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import type { ReleaseInput } from 'src/app/types/mutation-types';
import { Router } from '@angular/router';

interface ArtistFormGroup {
  name: FormControl<string>;
}

interface LabelFormGroup {
  name: FormControl<string>;
}

interface PersonnelFormGroup {
  name: FormControl<string>;
  instruments: FormControl<string>;
  leader: FormControl<boolean>;
}

interface TrackFormGroup {
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
export class ReleaseFormComponent implements AfterViewInit {
  @ViewChildren('trackTitle') trackTitle!: QueryList<ElementRef>;
  @ViewChildren('personnelName') personnelName!: QueryList<ElementRef>;

  private apollo = inject(Apollo);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);

  public labels: string[] = ['Blue Note Records', 'Prestige', 'Contemporary'];
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
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const release: ReleaseInput = {
      ...this.form.getRawValue(),
      personnel: this.normalizePersonnel(this.form.value.personnel),
      tracks: this.normalizeTracks(this.form.value.tracks),
    };

    this.createRelease(release);
  }

  public addPersonnel() {
    this.personnel.push(this.createPersonnelGroup());
  }

  public addTrack() {
    this.tracks.push(this.createTrackGroup());
  }

  private createPersonnelGroup(): FormGroup<PersonnelFormGroup> {
    return this.fb.group({
      name: [''],
      instruments: [''],
      leader: [false],
    });
  }

  private createTrackGroup(): FormGroup<TrackFormGroup> {
    return this.fb.group({
      title: [''],
      composedBy: [''],
      length: [''],
      number: [''],
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

  private normalizePersonnel(personnel: any): PersonnelInput[] {
    return personnel
      ?.map((p: any) => ({
        ...p,
        instruments: this.toArray(p.instruments),
      }))
      .filter((p: any) => p.name);
  }

  private normalizeTracks(tracks: any): TrackInput[] {
    return tracks
      ?.map((t: any) => ({
        ...t,
        composedBy: this.toArray(t.composedBy),
      }))
      .filter((t: any) => t.title);
  }

  private toArray(val: string): string[] {
    return val.split(',').map((v) => v.trim());
  }
}
