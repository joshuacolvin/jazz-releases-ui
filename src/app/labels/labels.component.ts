import { LabelCardComponent } from './label-card/label-card.component';
import { RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GET_ALL_LABELS } from './../graphql';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-labels',
  standalone: true,
  imports: [CommonModule, RouterModule, LabelCardComponent],
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css'],
})
export class LabelsComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroy$: Subject<void> = new Subject<void>();
  public labels$!: Observable<any>;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.labels$ = this.apollo
      .watchQuery<any>({
        query: GET_ALL_LABELS,
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((result) => result.data.getAllLabels)
      );
  }
}
