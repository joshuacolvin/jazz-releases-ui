import { RouterModule } from "@angular/router";
import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { Release } from "src/app/types/query-types";

@Component({
  selector: "app-release-card",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./release-card.component.html",
  styleUrls: ["./release-card.component.css"],
})
export class ReleaseCardComponent {
  @Input() release!: Release;

  get artist() {
    return this.release.artist.name;
  }

  get imageUrl() {
    if (this.release?.imageUrl !== "") {
      return this.release.imageUrl;
    } else {
      return "https://placehold.jp/100x100.png";
    }
  }

  get releaseId() {
    return this.release.id;
  }

  get title() {
    return this.release.title;
  }
}
