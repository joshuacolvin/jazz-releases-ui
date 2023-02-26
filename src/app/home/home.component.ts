import { ReleaseCardComponent } from './../release/release-card/release-card.component';
import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { GET_ALL_RELEASES_FOR_ARTIST } from '../graphql';
import type { Observable } from 'rxjs';
import { map, Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReleaseCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private apollo = inject(Apollo);
  private destroy$: Subject<void> = new Subject<void>();

  public releases$!: Observable<any>;
  public form = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  onSearch() {
    if (this.form.invalid) {
      return;
    }

    const { name } = this.form.value;

    this.releases$ = this.apollo
      .watchQuery<any>({
        query: GET_ALL_RELEASES_FOR_ARTIST,
        variables: {
          name: name?.trim(),
        },
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((result) => result.data.getAllReleasesForArtist)
      );
  }
}
