import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
