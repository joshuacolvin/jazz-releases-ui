import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-release-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './release-details.component.html',
  styleUrls: ['./release-details.component.css'],
})
export class ReleaseDetailsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
