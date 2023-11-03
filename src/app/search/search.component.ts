import {
  GET_RELEASES_FOR_LEADER,
  GET_RELEASES_FOR_SIDEMAN,
} from "./../graphql";
import { SearchResultsComponent } from "./search-results/search-results.component";
import { ReleaseCardComponent } from "../release/release-card/release-card.component";
import { CommonModule } from "@angular/common";
import type { OnDestroy, OnInit } from "@angular/core";
import { Component, inject } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import {
  GET_ALL_RELEASES_FOR_ARTIST,
  GET_RELEASES_BY_CATALOGUE_NUMBER,
  GET_RELEASES_BY_LABEL_NAME,
  GET_RELEASES_BY_SERIES,
  GET_RELEASE_BY_TITLE,
} from "../graphql";
import type { Observable } from "rxjs";
import { map, Subject, takeUntil } from "rxjs";
import { Apollo } from "apollo-angular";
import { Router, ActivatedRoute } from "@angular/router";
import type { Release } from "../types/query-types";

export enum SearchCriteria {
  Artist = "artist",
  CatalogueNumber = "catalogue number",
  Label = "label",
  Title = "title",
  Series = "series",
}

export type FilterBy = "all" | "leader" | "sideman";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReleaseCardComponent,
    SearchResultsComponent,
  ],
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private apollo = inject(Apollo);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$: Subject<void> = new Subject<void>();

  public searchCriteria = [
    "Artist",
    "Title",
    "Catalogue Number",
    "Label",
    "Series",
  ];
  public filterOptions: FilterBy[] = ["all", "leader", "sideman"];
  public releases$!: Observable<Release[]>;
  public form = this.fb.group({
    searchTerm: ["", Validators.required],
    criteria: [this.searchCriteria[0], Validators.required],
    filterBy: ["all"],
  });
  public searchHeader = "";

  get searchTerm() {
    return this.form.get("searchTerm")?.value;
  }

  get filterBy() {
    return this.form.get("filterBy")?.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      Object.entries(params).forEach(([key, value]) => {
        if (key && value) {
          this.search(key, value, this.filterBy ?? "all");
          this.form.patchValue({
            criteria: key,
            searchTerm: value,
          });
          return;
        }
      });
    });
  }

  handleSearch() {
    const { criteria, searchTerm, filterBy } = this.form.value;

    if (criteria && searchTerm && filterBy) {
      this.search(criteria, searchTerm, filterBy);
    }
  }

  search(criteria: string, searchTerm: string, filterBy: string) {
    if (!searchTerm || !criteria) {
      console.log(`Search term and criteria are required`);
      return;
    }

    const { query, queryName, variables } = this.buildQuery(
      criteria,
      searchTerm,
      filterBy
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

    let params: any = {};
    params[criteria] = searchTerm;
    this.navigateTo(params);
  }

  buildQuery(
    criteria: string,
    searchTerm: string,
    filterBy: string
  ): {
    query: any;
    queryName: string;
    variables: any;
  } {
    switch (criteria.toLowerCase()) {
      case SearchCriteria.CatalogueNumber:
        return {
          query: GET_RELEASES_BY_CATALOGUE_NUMBER,
          queryName: "getReleasesByCatalogueNumber",
          variables: {
            catalogueNumber: searchTerm.trim(),
          },
        };
      case SearchCriteria.Title:
        return {
          query: GET_RELEASE_BY_TITLE,
          queryName: "getReleaseByTitle",
          variables: {
            title: searchTerm.trim(),
          },
        };
      case SearchCriteria.Label:
        return {
          query: GET_RELEASES_BY_LABEL_NAME,
          queryName: "getReleasesByLabelName",
          variables: {
            labelName: searchTerm.trim(),
          },
        };
      case SearchCriteria.Series:
        const [last, first] = searchTerm.trim().split(",");
        return {
          query: GET_RELEASES_BY_SERIES,
          queryName: "getReleasesBySeries",
          variables: {
            last: last.trim(),
            first: first.trim(),
          },
        };
      case SearchCriteria.Artist:
        if (filterBy === "leader") {
          return {
            query: GET_RELEASES_FOR_LEADER,
            queryName: "getReleasesForLeader",
            variables: {
              name: searchTerm.trim(),
            },
          };
        }
        if (filterBy === "sideman") {
          return {
            query: GET_RELEASES_FOR_SIDEMAN,
            queryName: "getReleasesForSideman",
            variables: {
              name: searchTerm.trim(),
            },
          };
        }
        return {
          query: GET_ALL_RELEASES_FOR_ARTIST,
          queryName: "getAllReleasesForArtist",
          variables: {
            name: searchTerm.trim(),
          },
        };
      default:
        return {
          query: GET_ALL_RELEASES_FOR_ARTIST,
          queryName: "getAllReleasesForArtist",
          variables: {
            name: searchTerm.trim(),
          },
        };
    }
  }

  onCriteriaChange() {
    this.form.get("searchTerm")?.patchValue("");
  }

  getSearchMessagePrefix(criteria: string) {
    switch (criteria.toLowerCase()) {
      case SearchCriteria.Artist:
        return "featuring";
      case SearchCriteria.CatalogueNumber:
        return "matching";
      default:
        return "for";
    }
  }

  navigateTo(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }
}
