import { ReleaseCardComponent } from './../release/release-card/release-card.component';
import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  GET_ALL_RELEASES_FOR_ARTIST,
  GET_RELEASES_BY_CATALOGUE_NUMBER,
  GET_RELEASES_BY_LABEL_NAME,
} from '../graphql';
import type { Observable } from 'rxjs';
import { map, Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';

export enum SearchCriteria {
  Artist = 'artist',
  CatalogueNumber = 'catalogue number',
  Label = 'label',
}

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

  public searchCriteria = ['Artist', 'Catalogue Number', 'Label'];
  public releases$!: Observable<any>;
  public form = this.fb.group({
    searchTerm: ['', Validators.required],
    criteria: [this.searchCriteria[0], Validators.required],
  });
  public searchHeader = '';

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  onSearch() {
    if (this.form.invalid) {
      return;
    }

    const { criteria, searchTerm } = this.form.value;

    if (!searchTerm || !criteria) {
      console.log(`Search term and criteria are required`);
      return;
    }

    const { query, queryName, variables } = this.buildQuery(
      criteria,
      searchTerm
    );

    this.releases$ = this.apollo
      .watchQuery<any>({ query, variables })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((result) => result.data[queryName])
      );

    this.searchHeader = `${this.getSearchMessagePrefix(
      criteria
    )} ${criteria.toLowerCase()} <span class="font-bold text-2xl">${searchTerm}</span>`;
  }

  buildQuery(
    criteria: string,
    searchTerm: string
  ): {
    query: any;
    queryName: string;
    variables: any;
  } {
    switch (criteria.toLowerCase()) {
      case SearchCriteria.CatalogueNumber:
        return {
          query: GET_RELEASES_BY_CATALOGUE_NUMBER,
          queryName: 'getReleasesByCatalogueNumber',
          variables: {
            catalogueNumber: searchTerm.trim(),
          },
        };
      case SearchCriteria.Label:
        return {
          query: GET_RELEASES_BY_LABEL_NAME,
          queryName: 'getReleasesByLabelName',
          variables: {
            labelName: searchTerm.trim(),
          },
        };
      case SearchCriteria.Artist:
      default:
        return {
          query: GET_ALL_RELEASES_FOR_ARTIST,
          queryName: 'getAllReleasesForArtist',
          variables: {
            name: searchTerm.trim(),
          },
        };
    }
  }

  getSearchMessagePrefix(criteria: string) {
    switch (criteria.toLowerCase()) {
      case SearchCriteria.Artist:
        return 'featuring';
      case SearchCriteria.CatalogueNumber:
        return 'matching';
      default:
        return 'for';
    }
  }
}
